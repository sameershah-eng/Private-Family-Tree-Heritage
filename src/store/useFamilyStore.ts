import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FamilyMember, PhotoItem, ActivityLogItem, UserProfile, UserRole, PresentationSettings } from '../types';
import { INITIAL_MEMBERS, INITIAL_PHOTOS, INITIAL_ACTIVITY_LOGS } from '../data/mockFamily';
import { assignGenerations, validateParentRelationship } from '../services/familyStorageService';

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  owner: {
    id: 'user-owner',
    name: 'Alexander Montgomery',
    email: 'alexander@heirloom-archive.family',
    role: 'owner',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
  },
  editor: {
    id: 'user-editor',
    name: 'Sophie Laurent',
    email: 'sophie@heirloom-archive.family',
    role: 'editor',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
  },
  viewer: {
    id: 'user-viewer',
    name: 'Julian Montgomery Jr.',
    email: 'julian.jr@heirloom-archive.family',
    role: 'viewer',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
  },
};

interface FamilyStoreState {
  members: FamilyMember[];
  photos: PhotoItem[];
  activityLogs: ActivityLogItem[];
  currentUser: UserProfile;
  selectedMemberId: string | null;
  activeBranchFilter: string | null;
  isCommandSearchOpen: boolean;
  presentationSettings: PresentationSettings;

  // Actions - Authentication
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  setCurrentUser: (user: UserProfile) => void;

  // Actions - Member Management
  setSelectedMemberId: (id: string | null) => void;
  setActiveBranchFilter: (branch: string | null) => void;
  setIsCommandSearchOpen: (open: boolean) => void;
  addMember: (memberData: Omit<FamilyMember, 'id'>) => { success: boolean; id?: string; error?: string };
  updateMember: (id: string, updates: Partial<FamilyMember>) => { success: boolean; error?: string };
  deleteMember: (id: string) => { success: boolean; error?: string };

  // Actions - Relationship Linking
  linkParentChild: (parentId: string, childId: string) => { success: boolean; error?: string };
  unlinkParentChild: (parentId: string, childId: string) => { success: boolean };
  linkSpouses: (id1: string, id2: string) => { success: boolean; error?: string };
  unlinkSpouses: (id1: string, id2: string) => { success: boolean };

  // Actions - Media / Photos
  addPhoto: (photo: Omit<PhotoItem, 'id'>) => void;
  deletePhoto: (id: string) => void;

  // Actions - Import & Reset
  importGedcomData: (newMembers: FamilyMember[], replaceAll: boolean) => void;
  importCsvData: (newMembers: FamilyMember[], replaceAll: boolean) => void;
  resetToMockData: () => void;

  // Actions - Presentation
  setPresentationSettings: (settings: Partial<PresentationSettings>) => void;
}

export const useFamilyStore = create<FamilyStoreState>()(
  persist(
    (set, get) => ({
      members: INITIAL_MEMBERS,
      photos: INITIAL_PHOTOS,
      activityLogs: INITIAL_ACTIVITY_LOGS,
      currentUser: DEMO_USERS.owner,
      selectedMemberId: null,
      activeBranchFilter: null,
      isCommandSearchOpen: false,
      presentationSettings: {
        scope: 'entire',
        generationsDepth: 4,
        theme: 'dark',
        slideDuration: 6,
        showPhotos: true,
        autoPlay: false,
      },

      loginAsRole: (role: UserRole) => {
        set({ currentUser: DEMO_USERS[role] });
      },

      logout: () => {
        set({ currentUser: DEMO_USERS.viewer });
      },

      setCurrentUser: (user: UserProfile) => {
        set({ currentUser: user });
      },

      setSelectedMemberId: (id: string | null) => {
        set({ selectedMemberId: id });
      },

      setActiveBranchFilter: (branch: string | null) => {
        set({ activeBranchFilter: branch });
      },

      setIsCommandSearchOpen: (open: boolean) => {
        set({ isCommandSearchOpen: open });
      },

      addMember: (memberData) => {
        const { currentUser, members, activityLogs } = get();
        if (currentUser.role === 'viewer') {
          return { success: false, error: 'Viewers have read-only access.' };
        }

        const newId = `m-${Date.now()}`;
        const newMember: FamilyMember = {
          ...memberData,
          id: newId,
          parentIds: memberData.parentIds || [],
          spouseIds: memberData.spouseIds || [],
          childrenIds: memberData.childrenIds || [],
        };

        const updatedMembers = [...members, newMember];
        assignGenerations(updatedMembers);

        // Update two-way relationships if any parents, spouses, or children specified
        newMember.parentIds.forEach(pId => {
          const p = updatedMembers.find(m => m.id === pId);
          if (p && !p.childrenIds.includes(newId)) p.childrenIds.push(newId);
        });

        newMember.spouseIds.forEach(sId => {
          const s = updatedMembers.find(m => m.id === sId);
          if (s && !s.spouseIds.includes(newId)) s.spouseIds.push(newId);
        });

        newMember.childrenIds.forEach(cId => {
          const c = updatedMembers.find(m => m.id === cId);
          if (c && !c.parentIds.includes(newId)) c.parentIds.push(newId);
        });

        const newLog: ActivityLogItem = {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          userRole: currentUser.role,
          action: `Added new family member ${newMember.firstName} ${newMember.lastName}`,
          timestamp: 'Just now',
          memberId: newId,
          memberName: `${newMember.firstName} ${newMember.lastName}`,
        };

        set({
          members: updatedMembers,
          activityLogs: [newLog, ...activityLogs],
        });

        return { success: true, id: newId };
      },

      updateMember: (id, updates) => {
        const { currentUser, members, activityLogs } = get();
        if (currentUser.role === 'viewer') {
          return { success: false, error: 'Viewers have read-only access.' };
        }

        const target = members.find(m => m.id === id);
        if (!target) return { success: false, error: 'Member not found.' };

        const updatedMembers = members.map(m => (m.id === id ? { ...m, ...updates } : m));
        assignGenerations(updatedMembers);

        const newLog: ActivityLogItem = {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          userRole: currentUser.role,
          action: `Updated records for ${target.firstName} ${target.lastName}`,
          timestamp: 'Just now',
          memberId: id,
          memberName: `${target.firstName} ${target.lastName}`,
        };

        set({
          members: updatedMembers,
          activityLogs: [newLog, ...activityLogs],
        });

        return { success: true };
      },

      deleteMember: (id) => {
        const { currentUser, members, activityLogs } = get();
        if (currentUser.role !== 'owner') {
          return { success: false, error: 'Only family owners can delete member records.' };
        }

        const target = members.find(m => m.id === id);
        if (!target) return { success: false, error: 'Member not found.' };

        // Clean up relationships
        const updatedMembers = members
          .filter(m => m.id !== id)
          .map(m => ({
            ...m,
            parentIds: m.parentIds.filter(pid => pid !== id),
            spouseIds: m.spouseIds.filter(sid => sid !== id),
            childrenIds: m.childrenIds.filter(cid => cid !== id),
          }));

        assignGenerations(updatedMembers);

        const newLog: ActivityLogItem = {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          userRole: currentUser.role,
          action: `Archived/removed record for ${target.firstName} ${target.lastName}`,
          timestamp: 'Just now',
        };

        set({
          members: updatedMembers,
          activityLogs: [newLog, ...activityLogs],
          selectedMemberId: null,
        });

        return { success: true };
      },

      linkParentChild: (parentId, childId) => {
        const { currentUser, members, activityLogs } = get();
        if (currentUser.role === 'viewer') {
          return { success: false, error: 'Insufficient permissions.' };
        }

        const validation = validateParentRelationship(members, childId, parentId);
        if (!validation.isValid) {
          return { success: false, error: validation.reason };
        }

        const updatedMembers = members.map(m => {
          if (m.id === childId && !m.parentIds.includes(parentId)) {
            return { ...m, parentIds: [...m.parentIds, parentId] };
          }
          if (m.id === parentId && !m.childrenIds.includes(childId)) {
            return { ...m, childrenIds: [...m.childrenIds, childId] };
          }
          return m;
        });

        assignGenerations(updatedMembers);

        const parent = members.find(m => m.id === parentId);
        const child = members.find(m => m.id === childId);

        const newLog: ActivityLogItem = {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          userRole: currentUser.role,
          action: `Linked parent-child bond: ${parent?.firstName} → ${child?.firstName}`,
          timestamp: 'Just now',
        };

        set({
          members: updatedMembers,
          activityLogs: [newLog, ...activityLogs],
        });

        return { success: true };
      },

      unlinkParentChild: (parentId, childId) => {
        const { currentUser, members, activityLogs } = get();
        if (currentUser.role === 'viewer') return { success: false };

        const updatedMembers = members.map(m => {
          if (m.id === childId) {
            return { ...m, parentIds: m.parentIds.filter(pid => pid !== parentId) };
          }
          if (m.id === parentId) {
            return { ...m, childrenIds: m.childrenIds.filter(cid => cid !== childId) };
          }
          return m;
        });

        assignGenerations(updatedMembers);

        const newLog: ActivityLogItem = {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          userRole: currentUser.role,
          action: `Unlinked parent-child connection`,
          timestamp: 'Just now',
        };

        set({
          members: updatedMembers,
          activityLogs: [newLog, ...activityLogs],
        });

        return { success: true };
      },

      linkSpouses: (id1, id2) => {
        const { currentUser, members, activityLogs } = get();
        if (currentUser.role === 'viewer') {
          return { success: false, error: 'Insufficient permissions.' };
        }

        if (id1 === id2) {
          return { success: false, error: 'Cannot link a member as spouse to themselves.' };
        }

        const updatedMembers = members.map(m => {
          if (m.id === id1 && !m.spouseIds.includes(id2)) {
            return { ...m, spouseIds: [...m.spouseIds, id2] };
          }
          if (m.id === id2 && !m.spouseIds.includes(id1)) {
            return { ...m, spouseIds: [...m.spouseIds, id1] };
          }
          return m;
        });

        assignGenerations(updatedMembers);

        const m1 = members.find(m => m.id === id1);
        const m2 = members.find(m => m.id === id2);

        const newLog: ActivityLogItem = {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          userRole: currentUser.role,
          action: `Connected marital partnership: ${m1?.firstName} & ${m2?.firstName}`,
          timestamp: 'Just now',
        };

        set({
          members: updatedMembers,
          activityLogs: [newLog, ...activityLogs],
        });

        return { success: true };
      },

      unlinkSpouses: (id1, id2) => {
        const { currentUser, members, activityLogs } = get();
        if (currentUser.role === 'viewer') return { success: false };

        const updatedMembers = members.map(m => {
          if (m.id === id1) {
            return { ...m, spouseIds: m.spouseIds.filter(sid => sid !== id2) };
          }
          if (m.id === id2) {
            return { ...m, spouseIds: m.spouseIds.filter(sid => sid !== id1) };
          }
          return m;
        });

        const newLog: ActivityLogItem = {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          userRole: currentUser.role,
          action: `Unlinked spouse bond`,
          timestamp: 'Just now',
        };

        set({
          members: updatedMembers,
          activityLogs: [newLog, ...activityLogs],
        });

        return { success: true };
      },

      addPhoto: (photoData) => {
        const { photos, currentUser, activityLogs } = get();
        const newPhoto: PhotoItem = {
          ...photoData,
          id: `photo-${Date.now()}`,
        };

        const newLog: ActivityLogItem = {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          userRole: currentUser.role,
          action: `Uploaded heritage photograph: "${newPhoto.caption.slice(0, 32)}..."`,
          timestamp: 'Just now',
        };

        set({
          photos: [newPhoto, ...photos],
          activityLogs: [newLog, ...activityLogs],
        });
      },

      deletePhoto: (id) => {
        const { photos, currentUser, activityLogs } = get();
        if (currentUser.role === 'viewer') return;

        const target = photos.find(p => p.id === id);
        const updated = photos.filter(p => p.id !== id);

        const newLog: ActivityLogItem = {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          userRole: currentUser.role,
          action: `Deleted photograph: "${target?.caption.slice(0, 30) || 'Archive photo'}"`,
          timestamp: 'Just now',
        };

        set({
          photos: updated,
          activityLogs: [newLog, ...activityLogs],
        });
      },

      importGedcomData: (newMembers, replaceAll) => {
        const { members, currentUser, activityLogs } = get();
        let combined: FamilyMember[];

        if (replaceAll) {
          combined = newMembers;
        } else {
          // Merge keeping unique IDs
          const existingIds = new Set(members.map(m => m.id));
          const filteredNew = newMembers.filter(m => !existingIds.has(m.id));
          combined = [...members, ...filteredNew];
        }

        assignGenerations(combined);

        const newLog: ActivityLogItem = {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          userRole: currentUser.role,
          action: `Imported GEDCOM file (${newMembers.length} records, ${replaceAll ? 'replaced tree' : 'merged'})`,
          timestamp: 'Just now',
        };

        set({
          members: combined,
          activityLogs: [newLog, ...activityLogs],
        });
      },

      importCsvData: (newMembers, replaceAll) => {
        const { members, currentUser, activityLogs } = get();
        const combined = replaceAll ? newMembers : [...members, ...newMembers];
        assignGenerations(combined);

        const newLog: ActivityLogItem = {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          userRole: currentUser.role,
          action: `Imported CSV ledger (${newMembers.length} records)`,
          timestamp: 'Just now',
        };

        set({
          members: combined,
          activityLogs: [newLog, ...activityLogs],
        });
      },

      resetToMockData: () => {
        set({
          members: INITIAL_MEMBERS,
          photos: INITIAL_PHOTOS,
          activityLogs: INITIAL_ACTIVITY_LOGS,
          currentUser: DEMO_USERS.owner,
        });
      },

      setPresentationSettings: (settings) => {
        set((state) => ({
          presentationSettings: {
            ...state.presentationSettings,
            ...settings,
          },
        }));
      },
    }),
    {
      name: 'heirloom_archive_storage_v1',
    }
  )
);
