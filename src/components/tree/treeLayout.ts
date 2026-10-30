import { FamilyMember } from '../../types';
import { Node, Edge } from '@xyflow/react';

export interface LayoutOptions {
  orientation: 'vertical' | 'horizontal';
  branchFilter: string | null;
  focusedMemberId: string | null;
}

/**
 * Generates an automatic generational hierarchy layout for React Flow
 */
export function buildTreeLayout(
  allMembers: FamilyMember[],
  options: LayoutOptions
): { nodes: Node[]; edges: Edge[] } {
  const { orientation, branchFilter, focusedMemberId } = options;

  // Filter members if branch or focus specified
  let visibleMembers = [...allMembers];

  if (focusedMemberId) {
    const focused = allMembers.find((m) => m.id === focusedMemberId);
    if (focused) {
      const allowedIds = new Set<string>();
      allowedIds.add(focused.id);

      // Collect ancestors
      function addAncestors(m: FamilyMember) {
        m.parentIds.forEach((pid) => {
          allowedIds.add(pid);
          const parent = allMembers.find((x) => x.id === pid);
          if (parent) addAncestors(parent);
        });
      }
      addAncestors(focused);

      // Collect descendants
      function addDescendants(m: FamilyMember) {
        m.childrenIds.forEach((cid) => {
          allowedIds.add(cid);
          const child = allMembers.find((x) => x.id === cid);
          if (child) addDescendants(child);
        });
      }
      addDescendants(focused);

      // Add spouses of focused member
      focused.spouseIds.forEach((sid) => allowedIds.add(sid));

      visibleMembers = allMembers.filter((m) => allowedIds.has(m.id));
    }
  } else if (branchFilter) {
    visibleMembers = allMembers.filter((m) => m.branch === branchFilter || m.branch === 'Direct');
  }

  // Group members by generation
  const genMap = new Map<number, FamilyMember[]>();
  visibleMembers.forEach((m) => {
    const g = m.generation || 1;
    if (!genMap.has(g)) genMap.set(g, []);
    genMap.get(g)!.push(m);
  });

  const sortedGens = Array.from(genMap.keys()).sort((a, b) => a - b);

  const NODE_WIDTH = 240;
  const NODE_HEIGHT = 100;
  const X_GAP = 55;
  const Y_GAP = 140;

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const processedSpousePairs = new Set<string>();

  // Assign positions per generation
  sortedGens.forEach((gen, genIdx) => {
    const list = genMap.get(gen) || [];
    
    // Group spouses together so they sit adjacent to each other
    const placed = new Set<string>();
    const orderedList: FamilyMember[] = [];

    list.forEach((member) => {
      if (placed.has(member.id)) return;
      placed.add(member.id);
      orderedList.push(member);

      // Put spouse directly next to member
      member.spouseIds.forEach((spId) => {
        const spouse = list.find((m) => m.id === spId);
        if (spouse && !placed.has(spouse.id)) {
          placed.add(spouse.id);
          orderedList.push(spouse);
        }
      });
    });

    const totalWidth = orderedList.length * (NODE_WIDTH + X_GAP) - X_GAP;
    const startX = -totalWidth / 2;

    orderedList.forEach((member, idx) => {
      const x = orientation === 'vertical' ? startX + idx * (NODE_WIDTH + X_GAP) : genIdx * (NODE_WIDTH + Y_GAP);
      const y = orientation === 'vertical' ? genIdx * (NODE_HEIGHT + Y_GAP) : startX + idx * (NODE_HEIGHT + X_GAP);

      nodes.push({
        id: member.id,
        type: 'familyNode',
        position: { x, y },
        data: {
          member,
          isFocused: member.id === focusedMemberId,
        },
      });
    });
  });

  const visibleMemberIds = new Set(visibleMembers.map((m) => m.id));

  // Build Edges
  visibleMembers.forEach((member) => {
    // Parent-Child edges
    member.parentIds.forEach((parentId) => {
      if (visibleMemberIds.has(parentId)) {
        edges.push({
          id: `edge-pc-${parentId}-${member.id}`,
          source: parentId,
          target: member.id,
          type: 'smoothstep',
          animated: false,
          style: {
            stroke: '#C9A227',
            strokeWidth: 2,
            strokeOpacity: 0.75,
          },
        });
      }
    });

    // Spouse edges (dashed gold connector)
    member.spouseIds.forEach((spouseId) => {
      if (visibleMemberIds.has(spouseId)) {
        const pairKey = [member.id, spouseId].sort().join('-');
        if (!processedSpousePairs.has(pairKey)) {
          processedSpousePairs.add(pairKey);
          edges.push({
            id: `edge-sp-${pairKey}`,
            source: member.id,
            target: spouseId,
            type: 'straight',
            style: {
              stroke: '#E8D9B5',
              strokeWidth: 2.2,
              strokeDasharray: '4 4',
              strokeOpacity: 0.85,
            },
            label: '⚭',
            labelStyle: { fill: '#F3E3A1', fontSize: 14, fontWeight: 'bold' },
            labelBgStyle: { fill: '#142822', fillOpacity: 0.9 },
          });
        }
      }
    });
  });

  return { nodes, edges };
}
