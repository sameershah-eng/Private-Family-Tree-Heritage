import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Filter, UserPlus, MapPin, Calendar, Briefcase, ArrowUpDown, Sparkles } from 'lucide-react';
import { useFamilyStore } from '../store/useFamilyStore';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EditMemberModal } from '../components/manage/EditMemberModal';

export const MembersPage: React.FC = () => {
  const navigate = useNavigate();
  const { members, setSelectedMemberId, currentUser } = useFamilyStore();

  const [search, setSearch] = useState('');
  const [selectedGen, setSelectedGen] = useState<number | 'all'>('all');
  const [selectedBranch, setSelectedBranch] = useState<string | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'living' | 'deceased'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'birth-asc' | 'birth-desc'>('birth-asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredMembers = useMemo(() => {
    let result = members.filter((m) => {
      // Search text
      const fullName = `${m.firstName} ${m.lastName} ${m.maidenName || ''} ${m.birthPlace || ''} ${m.occupation || ''}`.toLowerCase();
      if (search && !fullName.includes(search.toLowerCase())) return false;

      // Generation
      if (selectedGen !== 'all' && m.generation !== selectedGen) return false;

      // Branch
      if (selectedBranch !== 'all' && m.branch !== selectedBranch) return false;

      // Status
      if (selectedStatus === 'living' && !m.isLiving) return false;
      if (selectedStatus === 'deceased' && m.isLiving) return false;

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
      }
      const yA = parseInt(a.birthDate?.slice(0, 4) || '9999', 10);
      const yB = parseInt(b.birthDate?.slice(0, 4) || '9999', 10);
      if (sortBy === 'birth-asc') return yA - yB;
      return yB - yA;
    });

    return result;
  }, [members, search, selectedGen, selectedBranch, selectedStatus, sortBy]);

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-[#0F1F1A] text-[#FAF6EE]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between pb-8 border-b border-[#C9A227]/20 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="gold">Genealogical Directory</Badge>
            <span className="text-xs text-[#E8D9B5]/70 font-sans">
              {filteredMembers.length} of {members.length} members cataloged
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF6EE]">
            Family Members & Kin
          </h1>
          <p className="text-sm text-[#E8D9B5]/80 font-sans mt-2 max-w-xl">
            Explore comprehensive life profiles, recorded memoirs, marriage unions, and generational lineages.
          </p>
        </div>

        {currentUser.role !== 'viewer' && (
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            icon={<UserPlus className="w-4 h-4" />}
          >
            Record Family Member
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="my-8 p-4 rounded-2xl bg-[#142822] border border-[#C9A227]/30 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Field */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#C9A227] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, birthplace, or vocation..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0F1F1A]/80 border border-[#C9A227]/25 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE] font-sans"
            />
          </div>

          {/* Generation Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedGen}
              onChange={(e) => setSelectedGen(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[#0F1F1A]/80 border border-[#C9A227]/25 focus:border-[#C9A227] focus:outline-none text-xs text-[#FAF6EE] font-sans"
            >
              <option value="all">All Generations</option>
              <option value={1}>Generation I (Great-Grandparents)</option>
              <option value={2}>Generation II (Grandparents)</option>
              <option value={3}>Generation III (Parents & Aunts)</option>
              <option value={4}>Generation IV (Heirs & Children)</option>
            </select>
          </div>

          {/* Branch Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0F1F1A]/80 border border-[#C9A227]/25 focus:border-[#C9A227] focus:outline-none text-xs text-[#FAF6EE] font-sans"
            >
              <option value="all">All Lineage Branches</option>
              <option value="Paternal">Paternal Branch</option>
              <option value="Maternal">Maternal Branch</option>
              <option value="Direct">Direct Ancestral Line</option>
              <option value="Alliance">Alliance / Marital</option>
            </select>
          </div>

          {/* Living / Deceased */}
          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-[#0F1F1A]/80 border border-[#C9A227]/25 focus:border-[#C9A227] focus:outline-none text-xs text-[#FAF6EE] font-sans"
            >
              <option value="all">All Life Statuses</option>
              <option value="living">Currently Living</option>
              <option value="deceased">In Memoriam</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-[#0F1F1A]/80 border border-[#C9A227]/25 focus:border-[#C9A227] focus:outline-none text-xs text-[#FAF6EE] font-sans"
            >
              <option value="birth-asc">Birth: Oldest First</option>
              <option value="birth-desc">Birth: Youngest First</option>
              <option value="name">Surname Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Member Cards Grid */}
      {filteredMembers.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#142822]/60 border border-[#C9A227]/20 p-8">
          <p className="font-serif text-2xl text-[#FAF6EE]">No family records found</p>
          <p className="text-sm text-[#E8D9B5]/60 mt-2 font-sans">
            Adjust your search keywords or clear filters to view archived lineage.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-5"
            onClick={() => {
              setSearch('');
              setSelectedGen('all');
              setSelectedBranch('all');
              setSelectedStatus('all');
            }}
          >
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -6 }}
              onClick={() => {
                setSelectedMemberId(member.id);
                navigate(`/members/${member.id}`);
              }}
              className="rounded-2xl bg-[#142822] border border-[#C9A227]/25 hover:border-[#C9A227] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <Avatar
                    src={member.photoUrl}
                    name={`${member.firstName} ${member.lastName}`}
                    size="xl"
                    isLiving={member.isLiving}
                  />
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge variant="gold" size="sm">
                      Gen {member.generation}
                    </Badge>
                    <span className="text-[10px] uppercase tracking-wider text-[#E8D9B5]/60 font-semibold font-sans">
                      {member.branch}
                    </span>
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#FAF6EE] group-hover:text-[#F3E3A1] transition-colors">
                  {member.firstName} {member.lastName}
                </h3>
                {member.maidenName && (
                  <p className="text-xs text-[#E8D9B5]/60 italic font-serif -mt-0.5">
                    née {member.maidenName}
                  </p>
                )}

                <div className="space-y-1 mt-3 text-xs text-[#E8D9B5]/75 font-sans">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                    <span>
                      {member.birthDate ? member.birthDate.slice(0, 4) : 'Unknown'} —{' '}
                      {member.isLiving ? 'Present' : member.deathDate ? member.deathDate.slice(0, 4) : 'Deceased'}
                    </span>
                  </div>

                  {member.birthPlace && (
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                      <span className="truncate">{member.birthPlace}</span>
                    </div>
                  )}

                  {member.occupation && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Briefcase className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                      <span className="truncate">{member.occupation}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#FAF6EE]/80 font-sans mt-4 line-clamp-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#C9A227]/15 flex items-center justify-between text-xs font-semibold text-[#C9A227] font-sans">
                <span>Explore Life Memoir</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      <EditMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        memberToEdit={null}
      />
    </div>
  );
};
