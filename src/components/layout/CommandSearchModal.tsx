import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

export const CommandSearchModal: React.FC = () => {
  const { isCommandSearchOpen, setIsCommandSearchOpen, members, setSelectedMemberId } = useFamilyStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandSearchOpen(!isCommandSearchOpen);
      }
      if (e.key === 'Escape' && isCommandSearchOpen) {
        setIsCommandSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandSearchOpen, setIsCommandSearchOpen]);

  const filteredMembers = useMemo(() => {
    if (!query.trim()) return members.slice(0, 6);
    const q = query.toLowerCase();
    return members.filter((m) => {
      const fullName = `${m.firstName} ${m.lastName} ${m.maidenName || ''}`.toLowerCase();
      const place = (m.birthPlace || '').toLowerCase();
      const occupation = (m.occupation || '').toLowerCase();
      const year = (m.birthDate || '').toLowerCase();
      const branch = (m.branch || '').toLowerCase();
      return (
        fullName.includes(q) ||
        place.includes(q) ||
        occupation.includes(q) ||
        year.includes(q) ||
        branch.includes(q)
      );
    });
  }, [query, members]);

  const handleSelectMember = (id: string) => {
    setSelectedMemberId(id);
    setIsCommandSearchOpen(false);
    navigate(`/members/${id}`);
  };

  return (
    <AnimatePresence>
      {isCommandSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCommandSearchOpen(false)}
            className="fixed inset-0 bg-[#0F1F1A]/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-[#142822] border border-[#C9A227]/40 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col"
          >
            {/* Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-[#C9A227]/20 bg-[#0F1F1A]/60">
              <Search className="w-5 h-5 text-[#C9A227] shrink-0 mr-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ancestors, descendants, locations, or occupations..."
                autoFocus
                className="w-full bg-transparent text-[#FAF6EE] placeholder-[#E8D9B5]/40 text-base focus:outline-none font-sans"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-[#E8D9B5]/60 hover:text-[#FAF6EE]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block text-[11px] font-mono text-[#E8D9B5]/60 px-2 py-0.5 rounded bg-[#1F4D3F]/60 border border-[#C9A227]/20 ml-2">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#C9A227]/10">
              {filteredMembers.length === 0 ? (
                <div className="py-12 text-center text-[#E8D9B5]/60">
                  <User className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#C9A227]" />
                  <p className="font-serif text-lg text-[#FAF6EE]">No family records found</p>
                  <p className="text-xs text-[#E8D9B5]/60 mt-1">
                    Try searching for another surname, birth year, or place
                  </p>
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleSelectMember(member.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#1F4D3F]/40 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <Avatar
                        src={member.photoUrl}
                        name={`${member.firstName} ${member.lastName}`}
                        size="md"
                        isLiving={member.isLiving}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base font-medium text-[#FAF6EE] group-hover:text-[#F3E3A1] transition-colors">
                            {member.firstName} {member.lastName}
                          </span>
                          {member.maidenName && (
                            <span className="text-xs text-[#E8D9B5]/60 italic">
                              (née {member.maidenName})
                            </span>
                          )}
                          <Badge variant="gold" size="sm">
                            Gen {member.generation}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#E8D9B5]/70 mt-1 font-sans">
                          {member.birthDate && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 opacity-60 text-[#C9A227]" />
                              {member.birthDate.slice(0, 4)} –{' '}
                              {member.isLiving ? 'Present' : member.deathDate?.slice(0, 4) || 'Deceased'}
                            </span>
                          )}
                          {member.birthPlace && (
                            <span className="hidden sm:inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 opacity-60 text-[#C9A227]" />
                              {member.birthPlace}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#C9A227]/40 group-hover:text-[#F3E3A1] group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 bg-[#0F1F1A]/80 border-t border-[#C9A227]/15 flex items-center justify-between text-xs text-[#E8D9B5]/60 font-sans">
              <span>{members.length} archived individuals in repository</span>
              <span className="hidden sm:inline">Use ↑↓ keys to navigate, Enter to view</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
