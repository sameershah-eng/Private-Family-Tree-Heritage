import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles,
  Play,
  Share2,
  Lock,
  UploadCloud,
  Layers,
  Image as ImageIcon,
  ArrowRight,
  Calendar,
  Gift,
  Heart,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useFamilyStore } from '../store/useFamilyStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { members, photos, setSelectedMemberId } = useFamilyStore();

  // Selected featured members for carousel
  const featuredMembers = members.slice(0, 8);

  // Gallery preview
  const previewPhotos = photos.slice(0, 8);

  // "On this day" anniversaries & upcoming events calculation
  const anniversaryEvents = [
    {
      date: 'June 16',
      title: 'Wedding Anniversary',
      people: 'Alexander & Sophie Montgomery',
      years: '12th Anniversary (Married 2012)',
      type: 'marriage',
    },
    {
      date: 'June 22',
      title: 'Upcoming Birthday',
      people: 'Julian Montgomery',
      years: 'Turning 73 years old',
      type: 'birthday',
    },
    {
      date: 'September 2',
      title: 'Centennial Birthday Remembrance',
      people: 'Eleanor Vance Montgomery',
      years: 'Born 1928 in Boston, MA',
      type: 'remembrance',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#0F1F1A] text-[#FAF6EE]">
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="relative min-h-screen flex items-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-grain">
        {/* Ambient radial glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-[#1F4D3F]/40 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#C9A227]/10 blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#142822] border border-[#C9A227]/40 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#E8D9B5] font-semibold">
                A Living Archive of Your Lineage
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[#FAF6EE] leading-[1.08]"
            >
              Every name. Every story.{' '}
              <span className="italic text-gold-shimmer block sm:inline">
                Beautifully connected.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-[#E8D9B5]/85 font-sans leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              A private, heirloom-grade digital repository crafted to preserve your family's oral
              histories, vintage portraits, and ancestral bonds across generations.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/tree')}
                icon={<Sparkles className="w-4 h-4" />}
              >
                Explore the Family Tree
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/present')}
                icon={<Play className="w-4 h-4 text-[#C9A227]" />}
              >
                Start Presentation
              </Button>
            </motion.div>

            {/* Trust Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex items-center justify-center lg:justify-start gap-4 pt-6 border-t border-[#C9A227]/15"
            >
              <div className="flex -space-x-2.5 overflow-hidden">
                {featuredMembers.slice(0, 4).map((m) => (
                  <Avatar
                    key={m.id}
                    src={m.photoUrl}
                    name={`${m.firstName} ${m.lastName}`}
                    size="sm"
                  />
                ))}
              </div>
              <div className="text-xs text-[#E8D9B5]/80 font-sans">
                <span className="text-[#FAF6EE] font-semibold">4 Generations</span> •{' '}
                <span>{members.length} Members</span> • <span>{photos.length * 12}+ Photos</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Animated Mini Family Tree Visual */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.2 }}
              className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-b from-[#142822]/90 to-[#0A1612]/95 border border-[#C9A227]/40 p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-col justify-between overflow-hidden"
            >
              {/* Background watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-80 h-80">
                  <circle cx="50" cy="50" r="45" stroke="#C9A227" strokeWidth="2" fill="none" />
                </svg>
              </div>

              {/* Header inside card */}
              <div className="flex items-center justify-between pb-3 border-b border-[#C9A227]/20 relative z-10">
                <span className="text-[11px] uppercase tracking-widest text-[#C9A227] font-semibold">
                  Generational Blueprint
                </span>
                <Badge variant="emerald" size="sm">
                  Live Preview
                </Badge>
              </div>

              {/* Generational Tree SVG Diagram with real avatar nodes */}
              <div className="relative my-auto py-4 flex flex-col items-center justify-center">
                {/* SVG Connecting Vines */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 320 220"
                >
                  {/* Lines from Gen 1 to Gen 2 */}
                  <path
                    d="M 120 40 C 120 70, 160 70, 160 105"
                    fill="none"
                    stroke="#C9A227"
                    strokeWidth="1.8"
                    strokeDasharray="3 3"
                  />
                  <path
                    d="M 200 40 C 200 70, 160 70, 160 105"
                    fill="none"
                    stroke="#C9A227"
                    strokeWidth="1.8"
                    strokeDasharray="3 3"
                  />
                  {/* Lines from Gen 2 to Gen 3 */}
                  <path
                    d="M 160 110 C 160 145, 90 145, 90 180"
                    fill="none"
                    stroke="#C9A227"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M 160 110 C 160 145, 230 145, 230 180"
                    fill="none"
                    stroke="#C9A227"
                    strokeWidth="1.8"
                  />
                </svg>

                {/* Gen 1: Great Grandparents */}
                <div className="flex items-center gap-12 relative z-10 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => navigate('/members/m1')}
                  >
                    <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" name="Arthur Montgomery" size="md" />
                    <span className="text-[11px] font-serif text-[#FAF6EE] mt-1 font-semibold">Arthur M.</span>
                    <span className="text-[9px] text-[#C9A227]">1924–2008</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => navigate('/members/m2')}
                  >
                    <Avatar src="https://randomuser.me/api/portraits/women/44.jpg" name="Eleanor Vance" size="md" />
                    <span className="text-[11px] font-serif text-[#FAF6EE] mt-1 font-semibold">Eleanor V.</span>
                    <span className="text-[9px] text-[#C9A227]">1928–2016</span>
                  </motion.div>
                </div>

                {/* Gen 2: Grandparents */}
                <div className="relative z-10 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => navigate('/members/m5')}
                  >
                    <Avatar src="https://randomuser.me/api/portraits/men/45.jpg" name="Julian Montgomery" size="lg" />
                    <span className="text-xs font-serif text-[#FAF6EE] mt-1 font-semibold">Julian Montgomery</span>
                    <span className="text-[10px] text-[#C9A227]">b. 1953</span>
                  </motion.div>
                </div>

                {/* Gen 3: Parents & Heirs */}
                <div className="flex items-center justify-between w-full px-6 relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => navigate('/members/m12')}
                  >
                    <Avatar src="https://randomuser.me/api/portraits/men/46.jpg" name="Alexander Montgomery" size="md" />
                    <span className="text-[11px] font-serif text-[#FAF6EE] mt-1 font-semibold">Alexander</span>
                    <span className="text-[9px] text-[#C9A227]">b. 1982</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => navigate('/members/m13')}
                  >
                    <Avatar src="https://randomuser.me/api/portraits/women/29.jpg" name="Elena Cruz" size="md" />
                    <span className="text-[11px] font-serif text-[#FAF6EE] mt-1 font-semibold">Elena</span>
                    <span className="text-[9px] text-[#C9A227]">b. 1986</span>
                  </motion.div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#C9A227]/20 flex items-center justify-between text-xs text-[#E8D9B5]/75">
                <span>Paternal Ancestry Segment</span>
                <span
                  onClick={() => navigate('/tree')}
                  className="text-[#C9A227] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                >
                  Expand Canvas <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-xs text-[#E8D9B5]/50 animate-bounce">
          <span>Scroll to explore archive</span>
          <div className="w-1 h-3 rounded-full bg-[#C9A227]/60 mt-1" />
        </div>
      </section>

      {/* =========================================================================
          2. FEATURES GRID (6 Pillars of Heirloom)
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="gold">Crafted with Reverence</Badge>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF6EE]">
            Designed for Family Reunions, Archives & Generations
          </h2>
          <p className="text-sm sm:text-base text-[#E8D9B5]/75 font-sans leading-relaxed">
            Every feature is architected to make family genealogy intuitive, emotionally resonant,
            and presentation-ready for your living room or family reunion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: 'Interactive Visual Canvas',
              desc: 'Seamlessly pan, zoom, and explore multi-generational family trees with automatic chronological layout and spouse connections.',
              icon: <Layers className="w-6 h-6 text-[#C9A227]" />,
              link: '/tree',
              action: 'View Interactive Tree',
            },
            {
              title: 'Cinematic Presentation Mode',
              desc: 'Turn any gathering into an unforgettable evening. Project your tree or member spotlights in full-screen on televisions and large displays.',
              icon: <Play className="w-6 h-6 text-[#C9A227]" />,
              link: '/present',
              action: 'Launch Presentation',
            },
            {
              title: 'GEDCOM Archive Import',
              desc: 'Import existing genealogies from Ancestry.com, MyHeritage, RootsMagic, or Family Tree Maker in seconds with zero data loss.',
              icon: <UploadCloud className="w-6 h-6 text-[#C9A227]" />,
              link: '/manage',
              action: 'Import .GED File',
            },
            {
              title: 'Curated Photo Gallery',
              desc: 'Preserve high-resolution scans of wedding portraits, handwritten letters, and landmark gatherings tagged with family members.',
              icon: <ImageIcon className="w-6 h-6 text-[#C9A227]" />,
              link: '/gallery',
              action: 'Browse Archive Photos',
            },
            {
              title: 'Role-Based Member Access',
              desc: 'Invite trusted relatives to contribute memoirs and photos while safeguarding authoritative records with granular permissions.',
              icon: <Lock className="w-6 h-6 text-[#C9A227]" />,
              link: '/manage',
              action: 'Security & Roles',
            },
            {
              title: 'Private & Invite-Only',
              desc: 'Your family’s memories are not for public search engines. Heirloom keeps your records in a private, encrypted sanctuary.',
              icon: <ShieldCheck className="w-6 h-6 text-[#C9A227]" />,
              link: '/manage',
              action: 'Invite Family',
            },
          ].map((f, i) => (
            <Card key={f.title} gradientBorder hoverEffect className="cursor-pointer flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1F4D3F]/80 border border-[#C9A227]/40 flex items-center justify-center mb-5 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-[#FAF6EE] mb-2">{f.title}</h3>
                <p className="text-sm text-[#E8D9B5]/80 font-sans leading-relaxed">{f.desc}</p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#C9A227]/15">
                <span
                  onClick={() => navigate(f.link)}
                  className="text-xs uppercase tracking-wider text-[#C9A227] hover:text-[#F3E3A1] font-semibold flex items-center gap-1.5 font-sans"
                >
                  {f.action} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* =========================================================================
          3. HOW IT WORKS 3-STEP TIMELINE
          ========================================================================= */}
      <section className="py-20 bg-[#0A1612] border-y border-[#C9A227]/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
              The Journey of Preservation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF6EE]">
              From Scattered Boxes to Living Legacy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-[#142822]/80 border border-[#C9A227]/30 space-y-4">
              <span className="text-4xl font-serif font-bold text-[#C9A227]/40">01</span>
              <h3 className="font-serif text-2xl font-bold text-[#FAF6EE]">Import & Map</h3>
              <p className="text-sm text-[#E8D9B5]/80 font-sans leading-relaxed">
                Upload your GEDCOM tree file or spreadsheet ledger in one click. Our parser instantly
                reconstructs four generations of lineage and familial relationships.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-[#142822]/80 border border-[#C9A227]/30 space-y-4">
              <span className="text-4xl font-serif font-bold text-[#C9A227]/40">02</span>
              <h3 className="font-serif text-2xl font-bold text-[#FAF6EE]">Enrich & Tell</h3>
              <p className="text-sm text-[#E8D9B5]/80 font-sans leading-relaxed">
                Add heartfelt memoirs, milestone timelines, wedding dates, and archive photos. Tag
                relatives so every memory lives alongside their names.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-[#142822]/80 border border-[#C9A227]/30 space-y-4">
              <span className="text-4xl font-serif font-bold text-[#C9A227]/40">03</span>
              <h3 className="font-serif text-2xl font-bold text-[#FAF6EE]">Gather & Present</h3>
              <p className="text-sm text-[#E8D9B5]/80 font-sans leading-relaxed">
                Switch into full-screen Presentation Mode during Thanksgiving, reunions, or quiet
                evenings to project ancestral spotlights and generational tales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FEATURED FAMILY MEMBERS CAROUSEL
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <Badge variant="gold">Ancestral Voices</Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF6EE] mt-2">
              Featured Lineage Records
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/members')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Browse All {members.length} Members
          </Button>
        </div>

        {/* Horizontal scroll cards */}
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin">
          {featuredMembers.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -6 }}
              onClick={() => {
                setSelectedMemberId(member.id);
                navigate(`/members/${member.id}`);
              }}
              className="min-w-[270px] max-w-[270px] rounded-2xl bg-[#142822] border border-[#C9A227]/25 hover:border-[#C9A227] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all cursor-pointer flex flex-col justify-between shrink-0"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Avatar
                    src={member.photoUrl}
                    name={`${member.firstName} ${member.lastName}`}
                    size="lg"
                    isLiving={member.isLiving}
                  />
                  <Badge variant="gold" size="sm">
                    Gen {member.generation}
                  </Badge>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#FAF6EE] truncate">
                  {member.firstName} {member.lastName}
                </h3>
                {member.maidenName && (
                  <p className="text-xs text-[#E8D9B5]/60 italic font-serif -mt-0.5">
                    née {member.maidenName}
                  </p>
                )}

                <p className="text-xs text-[#C9A227] font-sans mt-1">
                  {member.birthDate ? member.birthDate.slice(0, 4) : 'Unknown'} —{' '}
                  {member.isLiving ? 'Present' : member.deathDate ? member.deathDate.slice(0, 4) : 'Deceased'}
                </p>

                <p className="text-xs text-[#E8D9B5]/75 font-sans mt-3 line-clamp-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#C9A227]/15 flex items-center justify-between text-xs text-[#C9A227] font-semibold">
                <span>View Memoir</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. STATS BAND
          ========================================================================= */}
      <section className="py-16 bg-[#142822]/80 border-y border-[#C9A227]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-bold text-gold-shimmer">4</p>
            <p className="text-xs uppercase tracking-wider text-[#E8D9B5]/80 mt-1 font-sans">
              Generations Charted
            </p>
          </div>
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-bold text-gold-shimmer">
              {members.length}
            </p>
            <p className="text-xs uppercase tracking-wider text-[#E8D9B5]/80 mt-1 font-sans">
              Recorded Kin & Ancestors
            </p>
          </div>
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-bold text-gold-shimmer">
              100+
            </p>
            <p className="text-xs uppercase tracking-wider text-[#E8D9B5]/80 mt-1 font-sans">
              Years of Documented Lore
            </p>
          </div>
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-bold text-gold-shimmer">
              100%
            </p>
            <p className="text-xs uppercase tracking-wider text-[#E8D9B5]/80 mt-1 font-sans">
              Private & Encrypted
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. MASONRY GALLERY PREVIEW
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <Badge variant="gold">Visual Heritage</Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF6EE] mt-2">
              The Photographic Archive
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/gallery')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Explore Gallery ({photos.length} photos)
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previewPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => navigate('/gallery')}
              className={`relative rounded-2xl overflow-hidden border border-[#C9A227]/30 shadow-md cursor-pointer group ${
                idx === 0 || idx === 7 ? 'md:col-span-2 aspect-video' : 'aspect-square'
              }`}
            >
              <img
                src={photo.url}
                alt={photo.caption}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F1A] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1F4D3F]/80 text-[#F3E3A1] border border-[#C9A227]/30 font-semibold">
                  {photo.decade}
                </span>
                <p className="text-xs text-[#FAF6EE] font-serif font-medium truncate mt-1">
                  {photo.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. ON THIS DAY / UPCOMING ANNIVERSARIES & MILESTONES
          ========================================================================= */}
      <section className="py-20 bg-[#0A1612] border-t border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
              Calendarium & Memorials
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#FAF6EE] mt-1">
              Upcoming Anniversaries & Milestones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {anniversaryEvents.map((evt) => (
              <div
                key={evt.title + evt.people}
                className="p-5 rounded-2xl bg-[#142822] border border-[#C9A227]/25 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
                      {evt.date}
                    </span>
                    {evt.type === 'marriage' ? (
                      <Heart className="w-4 h-4 text-[#B5654A]" />
                    ) : (
                      <Gift className="w-4 h-4 text-[#C9A227]" />
                    )}
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#FAF6EE] mt-2">
                    {evt.title}
                  </h4>
                  <p className="text-sm text-[#FAF6EE]/90 font-serif">{evt.people}</p>
                </div>
                <p className="text-xs text-[#E8D9B5]/65 font-sans pt-2 border-t border-white/5">
                  {evt.years}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. TESTIMONIAL
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#142822] border border-[#C9A227]/50 flex items-center justify-center mx-auto text-[#C9A227] shadow-lg">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        <blockquote className="font-serif text-2xl sm:text-3xl font-medium text-[#FAF6EE] italic leading-relaxed">
          &ldquo;When we launched Heirloom on the big screen at our family reunion in Cape Cod,
          three generations sat in total silence. My 92-year-old grandmother saw her mother’s wedding
          portrait restored in high resolution for the very first time. There wasn’t a dry eye in the
          room.&rdquo;
        </blockquote>

        <div>
          <p className="font-serif text-lg font-bold text-[#F3E3A1]">Sophie Laurent Montgomery</p>
          <p className="text-xs text-[#E8D9B5]/70 uppercase tracking-widest mt-0.5">
            Oral Historian & Family Archivist
          </p>
        </div>
      </section>

      {/* =========================================================================
          9. FINAL CTA BAND
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-12">
        <div className="rounded-3xl bg-gradient-to-br from-[#1F4D3F] via-[#142822] to-[#0A1612] border border-[#C9A227]/50 p-8 sm:p-14 text-center space-y-6 shadow-[0_20px_60px_-15px_rgba(201,162,39,0.2)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#C9A227]/10 blur-3xl pointer-events-none" />

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF6EE] relative z-10">
            Begin Preserving Your Family’s Living Chronicle
          </h2>
          <p className="text-sm sm:text-base text-[#E8D9B5]/85 max-w-xl mx-auto font-sans leading-relaxed relative z-10">
            Import your existing records, invite siblings and elders, and ensure your heritage
            remains vibrant and accessible for the next hundred years.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/tree')}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Open Interactive Tree
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/manage')}
              icon={<UploadCloud className="w-4 h-4 text-[#C9A227]" />}
            >
              Import GEDCOM Archive
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
