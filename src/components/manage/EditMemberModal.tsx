import React, { useState, useEffect } from 'react';
import { Upload, AlertCircle, Save, Sparkles, UserPlus } from 'lucide-react';
import { FamilyMember, Gender } from '../../types';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: FamilyMember | null;
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isOpen,
  onClose,
  memberToEdit,
}) => {
  const { members, addMember, updateMember, currentUser } = useFamilyStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [maidenName, setMaidenName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [deathPlace, setDeathPlace] = useState('');
  const [isLiving, setIsLiving] = useState(true);
  const [occupation, setOccupation] = useState('');
  const [branch, setBranch] = useState<'Paternal' | 'Maternal' | 'Direct' | 'Alliance'>('Direct');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [parentIds, setParentIds] = useState<string[]>([]);
  const [spouseIds, setSpouseIds] = useState<string[]>([]);
  const [childrenIds, setChildrenIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (memberToEdit) {
      setFirstName(memberToEdit.firstName || '');
      setLastName(memberToEdit.lastName || '');
      setMaidenName(memberToEdit.maidenName || '');
      setGender(memberToEdit.gender || 'male');
      setBirthDate(memberToEdit.birthDate || '');
      setBirthPlace(memberToEdit.birthPlace || '');
      setDeathDate(memberToEdit.deathDate || '');
      setDeathPlace(memberToEdit.deathPlace || '');
      setIsLiving(memberToEdit.isLiving);
      setOccupation(memberToEdit.occupation || '');
      setBranch(memberToEdit.branch || 'Direct');
      setBio(memberToEdit.bio || '');
      setPhotoUrl(memberToEdit.photoUrl || '');
      setParentIds(memberToEdit.parentIds || []);
      setSpouseIds(memberToEdit.spouseIds || []);
      setChildrenIds(memberToEdit.childrenIds || []);
    } else {
      // New member defaults
      setFirstName('');
      setLastName('');
      setMaidenName('');
      setGender('male');
      setBirthDate('');
      setBirthPlace('');
      setDeathDate('');
      setDeathPlace('');
      setIsLiving(true);
      setOccupation('');
      setBranch('Direct');
      setBio('');
      setPhotoUrl(`https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 80) + 1}.jpg`);
      setParentIds([]);
      setSpouseIds([]);
      setChildrenIds([]);
    }
    setError(null);
  }, [memberToEdit, isOpen]);

  // Handle local image file upload & base64 conversion
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('First and last name are required for archival records.');
      return;
    }

    if (currentUser.role === 'viewer') {
      setError('Viewers have read-only access. Switch role to Editor or Owner.');
      return;
    }

    if (memberToEdit) {
      const res = updateMember(memberToEdit.id, {
        firstName,
        lastName,
        maidenName: maidenName.trim() || undefined,
        gender,
        birthDate,
        birthPlace,
        deathDate: isLiving ? undefined : deathDate,
        deathPlace: isLiving ? undefined : deathPlace,
        isLiving,
        occupation: occupation.trim() || undefined,
        branch,
        bio,
        photoUrl,
        parentIds,
        spouseIds,
        childrenIds,
      });

      if (!res.success) {
        setError(res.error || 'Failed to update member.');
        return;
      }
    } else {
      const res = addMember({
        firstName,
        lastName,
        maidenName: maidenName.trim() || undefined,
        gender,
        birthDate,
        birthPlace,
        deathDate: isLiving ? undefined : deathDate,
        deathPlace: isLiving ? undefined : deathPlace,
        isLiving,
        occupation: occupation.trim() || undefined,
        branch,
        bio,
        photoUrl,
        generation: 2,
        parentIds,
        spouseIds,
        childrenIds,
        tags: ['New Record'],
      });

      if (!res.success) {
        setError(res.error || 'Failed to add member.');
        return;
      }
    }

    onClose();
  };

  const otherMembers = members.filter((m) => !memberToEdit || m.id !== memberToEdit.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={memberToEdit ? `Edit Profile: ${memberToEdit.firstName} ${memberToEdit.lastName}` : 'Add Family Member'}
      subtitle="Record names, vital life dates, biographical notes, and genealogical bonds."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-[#FAF6EE] text-sm font-sans">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#B5654A]/25 border border-[#B5654A] text-xs text-[#FAF6EE]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FAF6EE]" />
            <span>{error}</span>
          </div>
        )}

        {/* Photo & Basic Details Row */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-[#0F1F1A]/70 border border-[#C9A227]/20">
          <div className="flex flex-col items-center">
            <Avatar
              src={photoUrl}
              name={`${firstName || 'New'} ${lastName || 'Member'}`}
              size="xl"
              isLiving={isLiving}
            />
            <label className="mt-3 cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F4D3F] border border-[#C9A227]/40 text-xs text-[#E8D9B5] hover:bg-[#255C4C] transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#142822] border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
                placeholder="e.g. Arthur"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#142822] border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
                placeholder="e.g. Montgomery"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E8D9B5]/70 font-semibold mb-1">
                Maiden Name (optional)
              </label>
              <input
                type="text"
                value={maidenName}
                onChange={(e) => setMaidenName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#142822] border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
                placeholder="e.g. Vance"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2 rounded-xl bg-[#142822] border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Not Specified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vital Life Dates & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#0F1F1A]/70 border border-[#C9A227]/20">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
              Birth Date
            </label>
            <input
              type="text"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              placeholder="e.g. 1953-06-22 or 1953"
              className="w-full px-3 py-2 rounded-xl bg-[#142822] border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
              Birthplace
            </label>
            <input
              type="text"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder="e.g. Boston, Massachusetts"
              className="w-full px-3 py-2 rounded-xl bg-[#142822] border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="isLivingCheck"
              checked={isLiving}
              onChange={(e) => setIsLiving(e.target.checked)}
              className="w-4 h-4 rounded text-[#C9A227] focus:ring-[#C9A227] bg-[#142822] border-[#C9A227]/40"
            />
            <label htmlFor="isLivingCheck" className="text-sm font-medium text-[#FAF6EE] cursor-pointer">
              Currently Living
            </label>
          </div>

          {!isLiving && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#E8D9B5]/80 font-semibold mb-1">
                  Death Date
                </label>
                <input
                  type="text"
                  value={deathDate}
                  onChange={(e) => setDeathDate(e.target.value)}
                  placeholder="e.g. 2016-04-18 or 2016"
                  className="w-full px-3 py-2 rounded-xl bg-[#142822] border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#E8D9B5]/80 font-semibold mb-1">
                  Resting Place
                </label>
                <input
                  type="text"
                  value={deathPlace}
                  onChange={(e) => setDeathPlace(e.target.value)}
                  placeholder="e.g. Boston, MA"
                  className="w-full px-3 py-2 rounded-xl bg-[#142822] border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
              Occupation / Vocation
            </label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="e.g. Botanist & Author"
              className="w-full px-3 py-2 rounded-xl bg-[#142822] border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
              Lineage Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-[#142822] border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
            >
              <option value="Direct">Direct Ancestral Line</option>
              <option value="Paternal">Paternal Branch</option>
              <option value="Maternal">Maternal Branch</option>
              <option value="Alliance">Alliance / Marital Branch</option>
            </select>
          </div>
        </div>

        {/* Biographical Narrative */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
            Biographical Memoir & Story
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Record memories, personal anecdotes, accomplishments, and family heritage lore..."
            className="w-full px-3 py-2 rounded-xl bg-[#142822] border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE] leading-relaxed"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#C9A227]/20">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={<Save className="w-4 h-4" />}>
            {memberToEdit ? 'Save Changes' : 'Record Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
