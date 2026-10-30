/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * =========================================================================================
 * HEIRLOOM DATA & ARCHIVE SERVICE LAYER
 * =========================================================================================
 * ARCHITECTURAL NOTICE:
 * Currently, all family records, media attachments, auth sessions, and activity logs
 * are managed client-side using localStorage (persisted via Zustand).
 * This service encapsulates all data import/export, parsing (GEDCOM, CSV, JSON),
 * and relationship validation logic.
 * 
 * TO MIGRATE TO CLOUD STORAGE (Firebase Firestore or Supabase):
 * 1. Replace the localStorage persistence calls in /src/store/useFamilyStore.ts
 *    with asynchronous queries targeting Firestore collections ('members', 'photos', 'activity')
 *    or Supabase tables.
 * 2. Connect photo uploads to Cloud Storage / S3 buckets instead of base64 data URLs.
 * 3. Enforce Firestore security rules / Supabase RLS using the UserRole ('owner' | 'editor' | 'viewer').
 * =========================================================================================
 */

import { FamilyMember, PhotoItem, ActivityLogItem } from '../types';

export interface GedcomParseResult {
  members: FamilyMember[];
  stats: {
    individualsFound: number;
    familiesFound: number;
    relationshipsLinked: number;
  };
  warnings: string[];
}

/**
 * Custom GEDCOM 5.5 / 5.5.1 Parser
 * Handles line-based level tags: INDI, NAME, SEX, BIRT, DEAT, DATE, PLAC, FAM, FAMS, FAMC, HUSB, WIFE, CHIL.
 */
export function parseGedcom(rawText: string): GedcomParseResult {
  const lines = rawText.split(/\r?\n/);
  const warnings: string[] = [];
  
  interface RawIndi {
    id: string;
    name?: string;
    gender?: string;
    birthDate?: string;
    birthPlace?: string;
    deathDate?: string;
    deathPlace?: string;
    fams: string[];
    famc: string[];
  }

  interface RawFam {
    id: string;
    husb?: string;
    wife?: string;
    children: string[];
  }

  const rawIndis = new Map<string, RawIndi>();
  const rawFams = new Map<string, RawFam>();

  let currentIndi: RawIndi | null = null;
  let currentFam: RawFam | null = null;
  let currentEvent: 'BIRT' | 'DEAT' | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Pattern: LEVEL [ID] TAG [VALUE]
    const match = line.match(/^(\d+)\s+(@[^@]+@\s+)?([A-Za-z0-9_]+)(\s+(.*))?$/);
    if (!match) continue;

    const level = parseInt(match[1], 10);
    const pointer = match[2]?.trim();
    const tag = match[3];
    const value = match[5]?.trim() || '';

    if (level === 0) {
      currentEvent = null;
      if (value === 'INDI' || (pointer && tag === 'INDI')) {
        const id = pointer || `@I${rawIndis.size + 1}@`;
        currentIndi = { id, fams: [], famc: [] };
        rawIndis.set(id, currentIndi);
        currentFam = null;
      } else if (value === 'FAM' || (pointer && tag === 'FAM')) {
        const id = pointer || `@F${rawFams.size + 1}@`;
        currentFam = { id, children: [] };
        rawFams.set(id, currentFam);
        currentIndi = null;
      } else {
        currentIndi = null;
        currentFam = null;
      }
    } else if (level === 1) {
      currentEvent = null;
      if (currentIndi) {
        if (tag === 'NAME') {
          currentIndi.name = value.replace(/\//g, ' ').replace(/\s+/g, ' ').trim();
        } else if (tag === 'SEX') {
          currentIndi.gender = value.toUpperCase();
        } else if (tag === 'BIRT') {
          currentEvent = 'BIRT';
        } else if (tag === 'DEAT') {
          currentEvent = 'DEAT';
        } else if (tag === 'FAMS') {
          if (value) currentIndi.fams.push(value);
        } else if (tag === 'FAMC') {
          if (value) currentIndi.famc.push(value);
        }
      } else if (currentFam) {
        if (tag === 'HUSB') {
          currentFam.husb = value;
        } else if (tag === 'WIFE') {
          currentFam.wife = value;
        } else if (tag === 'CHIL') {
          if (value) currentFam.children.push(value);
        }
      }
    } else if (level === 2 && currentEvent && currentIndi) {
      if (tag === 'DATE') {
        if (currentEvent === 'BIRT') currentIndi.birthDate = value;
        if (currentEvent === 'DEAT') currentIndi.deathDate = value;
      } else if (tag === 'PLAC') {
        if (currentEvent === 'BIRT') currentIndi.birthPlace = value;
        if (currentEvent === 'DEAT') currentIndi.deathPlace = value;
      }
    }
  }

  // Convert raw individuals to FamilyMember objects
  const parsedMembers: FamilyMember[] = [];
  let relationsLinkedCount = 0;

  // Pre-seed default portraits pool
  const maleAvatars = [32, 45, 62, 78, 53, 82, 46, 51, 22, 36, 8, 12, 15];
  const femaleAvatars = [44, 65, 58, 71, 68, 33, 29, 42, 52, 17, 10, 14];

  let mIdx = 0;
  let fIdx = 0;

  for (const [id, raw] of rawIndis.entries()) {
    const rawName = raw.name || 'Unnamed Record';
    const nameParts = rawName.split(' ');
    const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0] || 'Unknown';
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'Ancestor';

    const isMale = raw.gender === 'M';
    const isFemale = raw.gender === 'F';
    const gender = isMale ? 'male' : isFemale ? 'female' : 'other';

    const photoUrl = isMale
      ? `https://randomuser.me/api/portraits/men/${maleAvatars[(mIdx++) % maleAvatars.length]}.jpg`
      : `https://randomuser.me/api/portraits/women/${femaleAvatars[(fIdx++) % femaleAvatars.length]}.jpg`;

    const isLiving = !raw.deathDate && !raw.deathPlace;

    parsedMembers.push({
      id: `ged-${id.replace(/[^a-zA-Z0-9]/g, '')}`,
      firstName,
      lastName,
      gender,
      birthDate: raw.birthDate || 'Unknown',
      birthPlace: raw.birthPlace || 'Location Not Recorded',
      deathDate: raw.deathDate,
      deathPlace: raw.deathPlace,
      isLiving,
      bio: `Heritage record imported from GEDCOM archive. Recorded as ${firstName} ${lastName}.`,
      photoUrl,
      generation: 2, // will be recomputed by generational algorithm
      branch: 'Direct',
      parentIds: [],
      spouseIds: [],
      childrenIds: [],
      tags: ['GEDCOM Import'],
    });
  }

  // Map original GEDCOM pointer ID to new member ID
  const idMap = new Map<string, string>();
  for (const [origId] of rawIndis.entries()) {
    idMap.set(origId, `ged-${origId.replace(/[^a-zA-Z0-9]/g, '')}`);
  }

  // Link family relationships via families
  for (const fam of rawFams.values()) {
    const husbId = fam.husb ? idMap.get(fam.husb) : undefined;
    const wifeId = fam.wife ? idMap.get(fam.wife) : undefined;
    const childrenIds = fam.children.map(cid => idMap.get(cid)).filter(Boolean) as string[];

    const husbMember = husbId ? parsedMembers.find(m => m.id === husbId) : null;
    const wifeMember = wifeId ? parsedMembers.find(m => m.id === wifeId) : null;

    if (husbMember && wifeMember) {
      if (!husbMember.spouseIds.includes(wifeMember.id)) {
        husbMember.spouseIds.push(wifeMember.id);
        relationsLinkedCount++;
      }
      if (!wifeMember.spouseIds.includes(husbMember.id)) {
        wifeMember.spouseIds.push(husbMember.id);
        relationsLinkedCount++;
      }
    }

    for (const childId of childrenIds) {
      const childMember = parsedMembers.find(m => m.id === childId);
      if (childMember) {
        if (husbMember && !childMember.parentIds.includes(husbMember.id)) {
          childMember.parentIds.push(husbMember.id);
          if (!husbMember.childrenIds.includes(childMember.id)) husbMember.childrenIds.push(childMember.id);
          relationsLinkedCount++;
        }
        if (wifeMember && !childMember.parentIds.includes(wifeMember.id)) {
          childMember.parentIds.push(wifeMember.id);
          if (!wifeMember.childrenIds.includes(childMember.id)) wifeMember.childrenIds.push(childMember.id);
          relationsLinkedCount++;
        }
      }
    }
  }

  // Compute Generations depth based on parent-child chains
  assignGenerations(parsedMembers);

  return {
    members: parsedMembers,
    stats: {
      individualsFound: rawIndis.size,
      familiesFound: rawFams.size,
      relationshipsLinked: relationsLinkedCount,
    },
    warnings,
  };
}

/**
 * Computes logical generational ranks (1 to N)
 */
export function assignGenerations(members: FamilyMember[]): void {
  // Find roots (members without parents)
  const memberMap = new Map<string, FamilyMember>();
  members.forEach(m => memberMap.set(m.id, m));

  const roots = members.filter(m => m.parentIds.length === 0);
  if (roots.length === 0 && members.length > 0) {
    roots.push(members[0]);
  }

  const visited = new Set<string>();

  function dfs(member: FamilyMember, gen: number) {
    if (visited.has(member.id)) {
      member.generation = Math.max(member.generation, gen);
      return;
    }
    visited.add(member.id);
    member.generation = gen;

    // Propagate to spouses as same generation
    member.spouseIds.forEach(spId => {
      const sp = memberMap.get(spId);
      if (sp) {
        sp.generation = gen;
      }
    });

    // Propagate to children as next generation
    member.childrenIds.forEach(cId => {
      const child = memberMap.get(cId);
      if (child) {
        dfs(child, gen + 1);
      }
    });
  }

  roots.forEach(r => dfs(r, 1));

  // Default fallback for any disconnected member
  members.forEach(m => {
    if (!m.generation || m.generation < 1) m.generation = 1;
  });
}

/**
 * GEDCOM 5.5.1 Exporter
 */
export function exportToGedcom(members: FamilyMember[]): string {
  let ged = '';
  ged += '0 HEAD\n';
  ged += '1 SOUR HEIRLOOM_ARCHIVE\n';
  ged += '2 VERS 1.0\n';
  ged += '1 GEDC\n';
  ged += '2 VERS 5.5.1\n';
  ged += '2 FORM LINEAGE-LINKED\n';
  ged += '1 CHAR UTF-8\n';

  // Export Individuals
  members.forEach((m) => {
    const gedId = `@I_${m.id}@`;
    ged += `0 ${gedId} INDI\n`;
    ged += `1 NAME ${m.firstName} /${m.lastName}/\n`;
    if (m.gender === 'male') ged += '1 SEX M\n';
    else if (m.gender === 'female') ged += '1 SEX F\n';
    else ged += '1 SEX U\n';

    if (m.birthDate || m.birthPlace) {
      ged += '1 BIRT\n';
      if (m.birthDate) ged += `2 DATE ${m.birthDate}\n`;
      if (m.birthPlace) ged += `2 PLAC ${m.birthPlace}\n`;
    }

    if (!m.isLiving && (m.deathDate || m.deathPlace)) {
      ged += '1 DEAT\n';
      if (m.deathDate) ged += `2 DATE ${m.deathDate}\n`;
      if (m.deathPlace) ged += `2 PLAC ${m.deathPlace}\n`;
    }

    if (m.occupation) {
      ged += `1 OCCU ${m.occupation}\n`;
    }

    if (m.bio) {
      ged += `1 NOTE ${m.bio.replace(/\n/g, ' ')}\n`;
    }
  });

  // Export Families
  const processedSpousePairs = new Set<string>();
  let famCounter = 1;

  members.forEach((m) => {
    m.spouseIds.forEach((sId) => {
      const key = [m.id, sId].sort().join('-');
      if (!processedSpousePairs.has(key)) {
        processedSpousePairs.add(key);
        const famId = `@F_${famCounter++}@`;
        const spouse = members.find(x => x.id === sId);

        ged += `0 ${famId} FAM\n`;
        if (m.gender === 'male') {
          ged += `1 HUSB @I_${m.id}@\n`;
          if (spouse) ged += `1 WIFE @I_${spouse.id}@\n`;
        } else {
          ged += `1 WIFE @I_${m.id}@\n`;
          if (spouse) ged += `1 HUSB @I_${spouse.id}@\n`;
        }

        // Shared children
        const commonChildren = m.childrenIds.filter(c => spouse?.childrenIds.includes(c));
        commonChildren.forEach((childId) => {
          ged += `1 CHIL @I_${childId}@\n`;
        });
      }
    });
  });

  ged += '0 TRLR\n';
  return ged;
}

/**
 * CSV Template & Parser
 */
export const SAMPLE_CSV_TEMPLATE = `firstName,lastName,gender,birthDate,birthPlace,deathDate,deathPlace,isLiving,occupation,bio
Arthur,Montgomery,male,1924-03-14,Edinburgh Scotland,2008-11-20,Boston MA,false,Architect,Renowned botanical architect
Eleanor,Vance,female,1928-09-02,Boston MA,2016-04-18,Boston MA,false,Pianist,Botanical conservator and pianist
Julian,Montgomery,male,1953-06-22,Boston MA,,,true,Engineer,Civil engineer and summer family storyteller`;

export function parseCsvMembers(csvText: string): FamilyMember[] {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const members: FamilyMember[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (!cols[0]) continue;

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = cols[idx] || '';
    });

    const isLiving = row.isliving ? row.isliving.toLowerCase() === 'true' : !row.deathdate;

    members.push({
      id: `csv-${Date.now()}-${i}`,
      firstName: row.firstname || 'Unknown',
      lastName: row.lastname || 'Ancestor',
      gender: (row.gender?.toLowerCase() === 'female' ? 'female' : 'male'),
      birthDate: row.birthdate || '',
      birthPlace: row.birthplace || '',
      deathDate: row.deathdate || undefined,
      deathPlace: row.deathplace || undefined,
      isLiving,
      bio: row.bio || 'Imported via CSV ledger.',
      photoUrl: row.gender?.toLowerCase() === 'female' 
        ? `https://randomuser.me/api/portraits/women/${(i * 7) % 80}.jpg`
        : `https://randomuser.me/api/portraits/men/${(i * 7) % 80}.jpg`,
      generation: 2,
      branch: 'Direct',
      parentIds: [],
      spouseIds: [],
      childrenIds: [],
      occupation: row.occupation,
      tags: ['CSV Import'],
    });
  }

  assignGenerations(members);
  return members;
}

/**
 * Validates whether relationship linking would create an impossible cyclical lineage
 * (i.e., a person cannot be their own ancestor).
 */
export function validateParentRelationship(
  members: FamilyMember[],
  childId: string,
  proposedParentId: string
): { isValid: boolean; reason?: string } {
  if (childId === proposedParentId) {
    return { isValid: false, reason: 'A member cannot be their own parent.' };
  }

  // Check if childId is already an ancestor of proposedParentId
  const memberMap = new Map<string, FamilyMember>();
  members.forEach(m => memberMap.set(m.id, m));

  const visited = new Set<string>();
  const queue = [proposedParentId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (currentId === childId) {
      return {
        isValid: false,
        reason: 'Impossible cyclical ancestor loop: this member is already an ancestor of the proposed parent.',
      };
    }

    if (!visited.has(currentId)) {
      visited.add(currentId);
      const curr = memberMap.get(currentId);
      if (curr) {
        curr.parentIds.forEach(pId => queue.push(pId));
      }
    }
  }

  return { isValid: true };
}
