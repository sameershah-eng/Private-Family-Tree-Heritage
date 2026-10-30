import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Briefcase,
  Edit3,
  Heart,
  Share2,
  Layers,
  Sparkles,
  Camera,
  BookOpen,
} from 'lucide-react';
import { useFamilyStore } from '../store/useFamilyStore';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EditMemberModal } from '../components/manage/EditMemberModal';

export const MemberDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { members, photos, currentUser, setSelectedMemberId, setActiveBranchFilter } = useFamilyStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const member = useMemo(() => {
    return members.find((m) => m.id === id) || null;
  }, [members, id]);

  const parents = useMemo(() => {
    if (!member) return [];
    return members.filter((m) => member.parentIds.includes(m.id));
  }, [members, member]);

  const spouses = useMemo(() => {
    if (!member) return [];
    return members.filter((m) => member.spouseIds.includes(m.id));
  }, [members, member]);

  const children = useMemo(() => {
    if (!member) return [];
    return members.filter((m) => member.childrenIds.includes(m.id));
  }, [members, member]);

  const memberPhotos = useMemo(() => {
    if (!member) return [];
    return photos.filter((p) => p.taggedMemberIds.includes(member.id));
  }, [photos, member]);

  if (!member) {
    return (
      <div className="pt-32 pb-20 px-4 text-center max-w-xl mx-auto min-h-screen">
        <h2 className="font-serif text-3xl font-bold text-[#FAF6EE]">Member Not Found</h2>
        <p className="text-sm text-[#E8D9B5]/70 mt-2 font-sans">
          This genealogical record may have been archived or removed.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => navigate('/members')}>
          Return to Member Directory
        </Button>
      </div>
    );
  }

  const birthYear = member.birthDate ? member.birthDate.slice(0, 4) : 'Unknown';
  const deathYear = member.isLiving
    ? 'Present'
    : member.deathDate
    ? member.deathDate.slice(0, 4)
    : 'Deceased';

  const handleFocusInTree = () => {
    setSelectedMemberId(member.id);
    navigate('/tree');
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen bg-[#0F1F1A] text-[#FAF6EE]">
      {/* Back Link */}
      <Link
        to="/members"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C9A227] hover:text-[#F3E3A1] mb-6 font-sans transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Member Directory</span>
      </Link>

      {/* Hero Profile Header */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#142822] to-[#0A1612] border border-[#C9A227]/35 p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C9A227]/10 blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <Avatar
            src={member.photoUrl}
            name={`${member.firstName} ${member.lastName}`}
            size="2xl"
            isLiving={member.isLiving}
          />

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant="gold">Generation {member.generation}</Badge>
              <Badge variant="emerald">{member.branch} Lineage</Badge>
              {!member.isLiving && <Badge variant="muted">In Memoriam</Badge>}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF6EE] leading-tight">
              {member.firstName} {member.lastName}
            </h1>
            {member.maidenName && (
              <p className="text-sm text-[#E8D9B5]/75 italic font-serif -mt-1">
                née {member.maidenName}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-[#E8D9B5]/85 font-sans pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#C9A227]" />
                {birthYear} – {deathYear}
              </span>
              {member.birthPlace && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C9A227]" />
                  Born in {member.birthPlace}
                </span>
              )}
              {member.occupation && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#C9A227]" />
                  {member.occupation}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-4">
              <Button
                variant="primary"
                size="sm"
                onClick={handleFocusInTree}
                icon={<Layers className="w-4 h-4" />}
              >
                Locate on Tree Canvas
              </Button>
              {currentUser.role !== 'viewer' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                  icon={<Edit3 className="w-4 h-4 text-[#C9A227]" />}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Memoir & Relations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Memoir & Life Timeline */}
        <div className="lg:col-span-8 space-y-8">
          {/* Biographical Memoir */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#142822] border border-[#C9A227]/25 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#C9A227]/15">
              <BookOpen className="w-4 h-4 text-[#C9A227]" />
              <h3 className="font-serif text-xl font-bold text-[#FAF6EE]">
                Biographical Memoir & Heritage
              </h3>
            </div>
            <p className="text-sm sm:text-base text-[#FAF6EE]/90 font-sans leading-relaxed whitespace-pre-line">
              {member.bio ||
                'No recorded anecdotes or memoirs exist yet for this individual. Family members with editor privileges can enrich this profile at any time.'}
            </p>
          </div>

          {/* Life Events Timeline */}
          {member.lifeEvents && member.lifeEvents.length > 0 && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#142822] border border-[#C9A227]/25 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-[#C9A227]/15">
                <Calendar className="w-4 h-4 text-[#C9A227]" />
                <h3 className="font-serif text-xl font-bold text-[#FAF6EE]">Chronological Milestones</h3>
              </div>

              <div className="relative pl-6 border-l-2 border-[#C9A227]/30 space-y-6">
                {member.lifeEvents.map((evt) => (
                  <div key={evt.id} className="relative">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#C9A227] border-2 border-[#0F1F1A]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A227] font-sans">
                      {evt.year}
                    </span>
                    <h4 className="font-serif text-base font-semibold text-[#FAF6EE] mt-0.5">
                      {evt.title}
                    </h4>
                    {evt.location && (
                      <p className="text-xs text-[#E8D9B5]/70 font-sans flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#C9A227]" />
                        {evt.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tagged Photos Section */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#142822] border border-[#C9A227]/25 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#C9A227]/15">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#C9A227]" />
                <h3 className="font-serif text-xl font-bold text-[#FAF6EE]">
                  Photographic Memories ({memberPhotos.length})
                </h3>
              </div>
              <Link to="/gallery" className="text-xs text-[#C9A227] hover:underline font-sans">
                Full Gallery →
              </Link>
            </div>

            {memberPhotos.length === 0 ? (
              <p className="text-xs text-[#E8D9B5]/60 italic font-sans py-4">
                No archived photographs tagged with {member.firstName} yet. Upload photos in the Gallery to connect them.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {memberPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => navigate('/gallery')}
                    className="group rounded-xl overflow-hidden border border-[#C9A227]/20 bg-[#0F1F1A] cursor-pointer hover:border-[#C9A227] transition-all"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-serif font-medium text-[#FAF6EE] line-clamp-1">
                        {photo.caption}
                      </p>
                      <p className="text-[10px] text-[#C9A227] mt-0.5 font-sans">
                        {photo.decade} • {photo.location || 'Family Archive'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Genealogical Bonds (Parents, Spouses, Children) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Parents */}
          <div className="p-6 rounded-2xl bg-[#142822] border border-[#C9A227]/25 space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#FAF6EE] pb-2 border-b border-[#C9A227]/15">
              Parents ({parents.length})
            </h4>
            {parents.length === 0 ? (
              <p className="text-xs text-[#E8D9B5]/60 italic font-sans">
                Ancestral parents not recorded in archive.
              </p>
            ) : (
              <div className="space-y-3">
                {parents.map((p) => (
                  <Link
                    key={p.id}
                    to={`/members/${p.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0F1F1A]/60 hover:bg-[#1F4D3F]/50 border border-white/5 hover:border-[#C9A227]/40 transition-all group"
                  >
                    <Avatar src={p.photoUrl} name={`${p.firstName} ${p.lastName}`} size="md" />
                    <div>
                      <p className="font-serif text-sm font-semibold text-[#FAF6EE] group-hover:text-[#F3E3A1]">
                        {p.firstName} {p.lastName}
                      </p>
                      <p className="text-[11px] text-[#E8D9B5]/70 font-sans">
                        {p.birthDate?.slice(0, 4)} –{' '}
                        {p.isLiving ? 'Present' : p.deathDate?.slice(0, 4) || 'Deceased'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Spouses */}
          <div className="p-6 rounded-2xl bg-[#142822] border border-[#C9A227]/25 space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#FAF6EE] pb-2 border-b border-[#C9A227]/15">
              Spouse / Partner ({spouses.length})
            </h4>
            {spouses.length === 0 ? (
              <p className="text-xs text-[#E8D9B5]/60 italic font-sans">No marital partners linked.</p>
            ) : (
              <div className="space-y-3">
                {spouses.map((s) => (
                  <Link
                    key={s.id}
                    to={`/members/${s.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0F1F1A]/60 hover:bg-[#1F4D3F]/50 border border-white/5 hover:border-[#C9A227]/40 transition-all group"
                  >
                    <Avatar src={s.photoUrl} name={`${s.firstName} ${s.lastName}`} size="md" />
                    <div>
                      <p className="font-serif text-sm font-semibold text-[#FAF6EE] group-hover:text-[#F3E3A1]">
                        {s.firstName} {s.lastName}
                      </p>
                      <p className="text-[11px] text-[#E8D9B5]/70 font-sans">
                        {s.birthDate?.slice(0, 4)} –{' '}
                        {s.isLiving ? 'Present' : s.deathDate?.slice(0, 4) || 'Deceased'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Children */}
          <div className="p-6 rounded-2xl bg-[#142822] border border-[#C9A227]/25 space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#FAF6EE] pb-2 border-b border-[#C9A227]/15">
              Children & Descendants ({children.length})
            </h4>
            {children.length === 0 ? (
              <p className="text-xs text-[#E8D9B5]/60 italic font-sans">No children recorded.</p>
            ) : (
              <div className="space-y-3">
                {children.map((c) => (
                  <Link
                    key={c.id}
                    to={`/members/${c.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0F1F1A]/60 hover:bg-[#1F4D3F]/50 border border-white/5 hover:border-[#C9A227]/40 transition-all group"
                  >
                    <Avatar src={c.photoUrl} name={`${c.firstName} ${c.lastName}`} size="md" />
                    <div>
                      <p className="font-serif text-sm font-semibold text-[#FAF6EE] group-hover:text-[#F3E3A1]">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="text-[11px] text-[#E8D9B5]/70 font-sans">
                        {c.birthDate?.slice(0, 4)} –{' '}
                        {c.isLiving ? 'Present' : c.deathDate?.slice(0, 4) || 'Deceased'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        memberToEdit={member}
      />
    </div>
  );
};
