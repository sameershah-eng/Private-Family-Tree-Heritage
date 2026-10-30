import React, { useState } from 'react';
import { Heart, Link as LinkIcon, Unlink, AlertCircle, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Avatar } from '../ui/Avatar';

interface RelationshipManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RelationshipManagerModal: React.FC<RelationshipManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    members,
    linkParentChild,
    unlinkParentChild,
    linkSpouses,
    unlinkSpouses,
  } = useFamilyStore();

  const [mode, setMode] = useState<'parent-child' | 'spouses'>('parent-child');
  const [personA, setPersonA] = useState<string>(members[0]?.id || '');
  const [personB, setPersonB] = useState<string>(members[1]?.id || '');
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handleLink = () => {
    setFeedback(null);
    if (!personA || !personB) return;

    if (mode === 'parent-child') {
      const res = linkParentChild(personA, personB);
      if (!res.success) {
        setFeedback({ message: res.error || 'Failed to link relationship', isError: true });
      } else {
        setFeedback({ message: 'Parent-child bond established successfully.', isError: false });
      }
    } else {
      const res = linkSpouses(personA, personB);
      if (!res.success) {
        setFeedback({ message: res.error || 'Failed to link marital bond', isError: true });
      } else {
        setFeedback({ message: 'Spousal partnership connected successfully.', isError: false });
      }
    }
  };

  const handleUnlink = (parentOrSpouseId: string, targetId: string, type: 'pc' | 'sp') => {
    setFeedback(null);
    if (type === 'pc') {
      unlinkParentChild(parentOrSpouseId, targetId);
      setFeedback({ message: 'Parent-child link removed.', isError: false });
    } else {
      unlinkSpouses(parentOrSpouseId, targetId);
      setFeedback({ message: 'Spouse link removed.', isError: false });
    }
  };

  const selectedMemberA = members.find((m) => m.id === personA);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Genealogical Relationship Manager"
      subtitle="Connect or adjust parents, children, and spousal bonds across generations."
      maxWidth="xl"
    >
      <div className="space-y-6 text-sm font-sans text-[#FAF6EE]">
        {/* Type Selector */}
        <div className="flex border-b border-[#C9A227]/20">
          <button
            onClick={() => {
              setMode('parent-child');
              setFeedback(null);
            }}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${
              mode === 'parent-child'
                ? 'border-[#C9A227] text-[#F3E3A1]'
                : 'border-transparent text-[#E8D9B5]/60 hover:text-[#FAF6EE]'
            }`}
          >
            Parent & Child Bonds
          </button>
          <button
            onClick={() => {
              setMode('spouses');
              setFeedback(null);
            }}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${
              mode === 'spouses'
                ? 'border-[#C9A227] text-[#F3E3A1]'
                : 'border-transparent text-[#E8D9B5]/60 hover:text-[#FAF6EE]'
            }`}
          >
            Spousal & Marital Partnerships
          </button>
        </div>

        {feedback && (
          <div
            className={`flex items-center gap-2 p-3 rounded-xl border text-xs ${
              feedback.isError
                ? 'bg-[#B5654A]/20 border-[#B5654A] text-[#FAF6EE]'
                : 'bg-[#1F4D3F]/60 border-[#C9A227] text-[#FAF6EE]'
            }`}
          >
            {feedback.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <Check className="w-4 h-4 shrink-0 text-[#C9A227]" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Create Link Form */}
        <div className="p-4 rounded-xl bg-[#0F1F1A]/70 border border-[#C9A227]/20 space-y-4">
          <h4 className="text-xs uppercase tracking-wider text-[#C9A227] font-semibold">
            {mode === 'parent-child' ? 'Create Parent → Child Connection' : 'Connect Spouses'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E8D9B5]/75 font-semibold mb-1">
                {mode === 'parent-child' ? 'Parent / Ancestor' : 'First Partner'}
              </label>
              <select
                value={personA}
                onChange={(e) => setPersonA(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#142822] border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} (Gen {m.generation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E8D9B5]/75 font-semibold mb-1">
                {mode === 'parent-child' ? 'Child / Descendant' : 'Second Partner'}
              </label>
              <select
                value={personB}
                onChange={(e) => setPersonB(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#142822] border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} (Gen {m.generation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={handleLink}
              icon={<LinkIcon className="w-3.5 h-3.5" />}
            >
              Establish Connection
            </Button>
          </div>
        </div>

        {/* Existing Connections for Member A */}
        {selectedMemberA && (
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#E8D9B5]/80 font-semibold">
              Current Bonds for {selectedMemberA.firstName} {selectedMemberA.lastName}
            </h4>

            {mode === 'parent-child' && (
              <div className="space-y-2">
                <p className="text-xs text-[#C9A227] font-serif">Children Linked:</p>
                {selectedMemberA.childrenIds.length === 0 ? (
                  <p className="text-xs text-[#E8D9B5]/50 italic">No registered children.</p>
                ) : (
                  <div className="divide-y divide-white/5">
                    {selectedMemberA.childrenIds.map((cId) => {
                      const child = members.find((m) => m.id === cId);
                      if (!child) return null;
                      return (
                        <div key={cId} className="flex items-center justify-between py-1.5">
                          <div className="flex items-center gap-2">
                            <Avatar src={child.photoUrl} name={`${child.firstName} ${child.lastName}`} size="xs" />
                            <span className="text-xs text-[#FAF6EE]">
                              {child.firstName} {child.lastName}
                            </span>
                          </div>
                          <button
                            onClick={() => handleUnlink(selectedMemberA.id, child.id, 'pc')}
                            className="p-1 rounded text-[#B5654A] hover:bg-[#B5654A]/20 text-xs flex items-center gap-1"
                          >
                            <Unlink className="w-3.5 h-3.5" />
                            <span>Unlink</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {mode === 'spouses' && (
              <div className="space-y-2">
                <p className="text-xs text-[#C9A227] font-serif">Spousal Partnerships:</p>
                {selectedMemberA.spouseIds.length === 0 ? (
                  <p className="text-xs text-[#E8D9B5]/50 italic">No registered spouse records.</p>
                ) : (
                  <div className="divide-y divide-white/5">
                    {selectedMemberA.spouseIds.map((sId) => {
                      const spouse = members.find((m) => m.id === sId);
                      if (!spouse) return null;
                      return (
                        <div key={sId} className="flex items-center justify-between py-1.5">
                          <div className="flex items-center gap-2">
                            <Avatar src={spouse.photoUrl} name={`${spouse.firstName} ${spouse.lastName}`} size="xs" />
                            <span className="text-xs text-[#FAF6EE]">
                              {spouse.firstName} {spouse.lastName}
                            </span>
                          </div>
                          <button
                            onClick={() => handleUnlink(selectedMemberA.id, spouse.id, 'sp')}
                            className="p-1 rounded text-[#B5654A] hover:bg-[#B5654A]/20 text-xs flex items-center gap-1"
                          >
                            <Unlink className="w-3.5 h-3.5" />
                            <span>Unlink</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
