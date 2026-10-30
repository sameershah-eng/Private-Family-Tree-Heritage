import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Briefcase, Eye, Target, ArrowRight } from 'lucide-react';
import { FamilyMember } from '../../types';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface MemberDrawerProps {
  member: FamilyMember | null;
  onClose: () => void;
  onFocusMember: (id: string) => void;
}

export const MemberDrawer: React.FC<MemberDrawerProps> = ({
  member,
  onClose,
  onFocusMember,
}) => {
  const navigate = useNavigate();
  const { members, setSelectedMemberId } = useFamilyStore();

  if (!member) return null;

  const parents = members.filter((m) => member.parentIds.includes(m.id));
  const spouses = members.filter((m) => member.spouseIds.includes(m.id));
  const children = members.filter((m) => member.childrenIds.includes(m.id));

  const handleSelectRelative = (id: string) => {
    setSelectedMemberId(id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 pointer-events-none">
        {/* Desktop Slide-over Drawer / Mobile Bottom Sheet */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-auto fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-[#142822] border-l border-[#C9A227]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col pt-20 pb-6 px-6 overflow-y-auto"
            >
              {/* Header with Close */}
              <div className="flex items-center justify-between pb-4 border-b border-[#C9A227]/20">
                <div className="flex items-center gap-2">
                  <Badge variant="gold" size="sm">
                    Generation {member.generation}
                  </Badge>
                  <span className="text-xs text-[#E8D9B5]/70 uppercase tracking-wider font-semibold">
                    {member.branch} Line
                  </span>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close panel"
                  className="p-1.5 rounded-full text-[#E8D9B5]/70 hover:text-[#FAF6EE] hover:bg-[#1F4D3F]/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Portrait & Hero Info */}
              <div className="flex flex-col items-center text-center mt-6">
                <Avatar
                  src={member.photoUrl}
                  name={`${member.firstName} ${member.lastName}`}
                  size="2xl"
                  isLiving={member.isLiving}
                />

                <h3 className="font-serif text-2xl font-bold text-[#FAF6EE] mt-4">
                  {member.firstName} {member.lastName}
                </h3>
                {member.maidenName && (
                  <p className="text-xs text-[#E8D9B5]/60 italic font-serif -mt-0.5">
                    née {member.maidenName}
                  </p>
                )}

                <p className="text-sm text-[#C9A227] font-sans mt-1">
                  {member.birthDate ? member.birthDate.slice(0, 4) : 'Unknown'} —{' '}
                  {member.isLiving ? 'Present' : member.deathDate ? member.deathDate.slice(0, 4) : 'Deceased'}
                </p>

                {member.occupation && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#E8D9B5]/80 mt-2 px-3 py-1 rounded-full bg-[#1F4D3F]/50 border border-[#C9A227]/20 font-sans">
                    <Briefcase className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>{member.occupation}</span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFocusMember(member.id)}
                  icon={<Target className="w-3.5 h-3.5 text-[#C9A227]" />}
                >
                  Focus Lineage
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/members/${member.id}`)}
                  icon={<Eye className="w-3.5 h-3.5" />}
                >
                  Full Profile
                </Button>
              </div>

              {/* Vital Details */}
              <div className="space-y-3 mt-6 p-4 rounded-xl bg-[#0F1F1A]/60 border border-[#C9A227]/15 text-xs font-sans">
                <div className="flex items-center gap-2 text-[#E8D9B5]">
                  <MapPin className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>
                    <strong>Birthplace:</strong> {member.birthPlace || 'Not recorded'}
                  </span>
                </div>
                {!member.isLiving && member.deathPlace && (
                  <div className="flex items-center gap-2 text-[#E8D9B5]">
                    <Calendar className="w-4 h-4 text-[#C9A227] shrink-0" />
                    <span>
                      <strong>Resting Place:</strong> {member.deathPlace}
                    </span>
                  </div>
                )}
              </div>

              {/* Bio snippet */}
              <div className="mt-5">
                <h4 className="text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-2">
                  Memoir & Record
                </h4>
                <p className="text-sm text-[#FAF6EE]/85 font-sans leading-relaxed">
                  {member.bio || 'No personal story recorded yet for this family member.'}
                </p>
              </div>

              {/* Relatives */}
              <div className="mt-6 space-y-4">
                {/* Parents */}
                {parents.length > 0 && (
                  <div>
                    <h5 className="text-[11px] uppercase tracking-wider text-[#E8D9B5]/60 font-semibold mb-2">
                      Parents ({parents.length})
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {parents.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleSelectRelative(p.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F4D3F]/40 border border-[#C9A227]/30 hover:border-[#C9A227] text-xs text-[#FAF6EE] transition-all"
                        >
                          <Avatar src={p.photoUrl} name={`${p.firstName} ${p.lastName}`} size="xs" />
                          <span>{p.firstName} {p.lastName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spouses */}
                {spouses.length > 0 && (
                  <div>
                    <h5 className="text-[11px] uppercase tracking-wider text-[#E8D9B5]/60 font-semibold mb-2">
                      Spouse / Partner ({spouses.length})
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {spouses.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleSelectRelative(s.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F4D3F]/40 border border-[#C9A227]/30 hover:border-[#C9A227] text-xs text-[#FAF6EE] transition-all"
                        >
                          <Avatar src={s.photoUrl} name={`${s.firstName} ${s.lastName}`} size="xs" />
                          <span>{s.firstName} {s.lastName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Children */}
                {children.length > 0 && (
                  <div>
                    <h5 className="text-[11px] uppercase tracking-wider text-[#E8D9B5]/60 font-semibold mb-2">
                      Children ({children.length})
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {children.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleSelectRelative(c.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F4D3F]/40 border border-[#C9A227]/30 hover:border-[#C9A227] text-xs text-[#FAF6EE] transition-all"
                        >
                          <Avatar src={c.photoUrl} name={`${c.firstName} ${c.lastName}`} size="xs" />
                          <span>{c.firstName} {c.lastName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
