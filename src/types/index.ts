export type Gender = 'male' | 'female' | 'other';

export type UserRole = 'owner' | 'editor' | 'viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface LifeEvent {
  id: string;
  year: number;
  dateStr?: string;
  title: string;
  description?: string;
  location?: string;
  type?: 'birth' | 'marriage' | 'military' | 'graduation' | 'residence' | 'death' | 'other';
}

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  gender: Gender;
  birthDate: string; // e.g. "1942-05-12" or "1942"
  birthPlace: string;
  deathDate?: string; // empty if living
  deathPlace?: string;
  isLiving: boolean;
  bio: string;
  photoUrl: string;
  generation: number; // 1 = oldest ancestors, 4 = youngest
  branch: 'Paternal' | 'Maternal' | 'Alliance' | 'Direct';
  parentIds: string[];
  spouseIds: string[];
  childrenIds: string[];
  occupation?: string;
  lifeEvents?: LifeEvent[];
  tags?: string[];
}

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  dateTaken: string; // "1968" or "1968-08-14"
  location?: string;
  decade: string; // "1940s", "1960s", etc.
  taggedMemberIds: string[];
}

export interface ActivityLogItem {
  id: string;
  user: string;
  userRole: UserRole;
  action: string;
  timestamp: string;
  memberId?: string;
  memberName?: string;
}

export interface PresentationSettings {
  scope: 'entire' | 'ancestors' | 'descendants' | 'branch';
  rootMemberId?: string;
  branchName?: string;
  generationsDepth: number;
  theme: 'dark' | 'parchment';
  slideDuration: number; // in seconds
  showPhotos: boolean;
  autoPlay: boolean;
}
