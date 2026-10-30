import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Settings,
  Sparkles,
  X,
  Clock,
  Layers,
  Palette,
  Eye,
  Camera,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useFamilyStore } from '../store/useFamilyStore';
import { FamilyMember } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';

export const PresentationPage: React.FC = () => {
  const { members, photos } = useFamilyStore();

  // Setup configuration state
  const [isPlaying, setIsPlaying] = useState(false);
  const [scope, setScope] = useState<'entire' | 'paternal' | 'maternal' | 'direct'>('entire');
  const [theme, setTheme] = useState<'dark' | 'parchment'>('dark');
  const [slideDuration, setSlideDuration] = useState(6);
  const [showPhotos, setShowPhotos] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  // Runtime Presentation state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter members based on chosen scope
  const presentationMembers = useMemo(() => {
    let list = [...members];
    if (scope === 'paternal') {
      list = members.filter((m) => m.branch === 'Paternal' || m.branch === 'Direct');
    } else if (scope === 'maternal') {
      list = members.filter((m) => m.branch === 'Maternal' || m.branch === 'Direct');
    } else if (scope === 'direct') {
      list = members.filter((m) => m.branch === 'Direct');
    }
    // Sort chronologically by generation, then birth date
    list.sort((a, b) => {
      if (a.generation !== b.generation) return a.generation - b.generation;
      return (a.birthDate || '').localeCompare(b.birthDate || '');
    });
    return list;
  }, [members, scope]);

  // Construct Slides Deck:
  // 1. Title Slide
  // 2. Generational Summary
  // 3..N Member Spotlight Slides
  // Last: Legacy Finale Slide
  interface SlideData {
    type: 'title' | 'generation-summary' | 'member-spotlight' | 'finale';
    member?: FamilyMember;
    generation?: number;
  }

  const slides = useMemo<SlideData[]>(() => {
    const deck: SlideData[] = [];
    deck.push({ type: 'title' });

    // Group members by generation for episodic transitions
    const genGroups = new Map<number, FamilyMember[]>();
    presentationMembers.forEach((m) => {
      const g = m.generation || 1;
      if (!genGroups.has(g)) genGroups.set(g, []);
      genGroups.get(g)!.push(m);
    });

    const sortedGens = Array.from(genGroups.keys()).sort((a, b) => a - b);

    sortedGens.forEach((g) => {
      deck.push({ type: 'generation-summary', generation: g });
      const membersInGen = genGroups.get(g) || [];
      membersInGen.forEach((m) => {
        deck.push({ type: 'member-spotlight', member: m });
      });
    });

    deck.push({ type: 'finale' });
    return deck;
  }, [presentationMembers]);

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying || !autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => {
        if (prev < slides.length - 1) return prev + 1;
        return 0; // loop
      });
    }, slideDuration * 1000);

    return () => clearInterval(timer);
  }, [isPlaying, autoPlay, slideDuration, slides.length]);

  // Inactivity fade for on-screen presentation controls
  const handleUserActivity = () => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setIsControlsVisible(false);
    }, 3200);
  };

  // Keyboard navigation & Esc exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      handleUserActivity();

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
      } else if (e.key === 'Escape') {
        handleExitPresentation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, slides.length]);

  // Fullscreen trigger
  const handleStartPresentation = () => {
    setIsPlaying(true);
    setCurrentSlideIndex(0);
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    }
  };

  const handleExitPresentation = () => {
    setIsPlaying(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentSlide = slides[currentSlideIndex];

  // =========================================================================
  // SETUP SCREEN (When not currently presenting)
  // =========================================================================
  if (!isPlaying) {
    return (
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen bg-[#0F1F1A] text-[#FAF6EE]">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <Badge variant="gold">Cinematic Showcase</Badge>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF6EE]">
            Family Presentation Mode
          </h1>
          <p className="text-sm sm:text-base text-[#E8D9B5]/80 font-sans leading-relaxed">
            Project your family chronicle onto television screens or during reunions. Select your
            focus branch, narrative theme, and timing.
          </p>
        </div>

        {/* Setup Configuration Card */}
        <div className="rounded-3xl bg-[#142822] border border-[#C9A227]/35 p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] space-y-8">
          {/* Scope Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-3 font-sans">
              1. Narrative Scope ({presentationMembers.length} members included)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'entire', label: 'Entire Tree', desc: 'All generations & branches' },
                { id: 'direct', label: 'Direct Line', desc: 'Direct ancestors & descendants' },
                { id: 'paternal', label: 'Paternal Branch', desc: 'Montgomery family line' },
                { id: 'maternal', label: 'Maternal Branch', desc: 'Sterling family line' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScope(s.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    scope === s.id
                      ? 'bg-[#1F4D3F] border-[#C9A227] text-[#FAF6EE] shadow-md'
                      : 'bg-[#0F1F1A]/60 border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  <p className="font-serif text-base font-semibold text-[#FAF6EE]">{s.label}</p>
                  <p className="text-xs text-[#E8D9B5]/60 mt-1 font-sans">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Theme & Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#C9A227]/15">
            {/* Visual Theme */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-3 font-sans">
                2. Visual Atmosphere
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    theme === 'dark'
                      ? 'bg-[#0F1F1A] border-[#C9A227] text-[#F3E3A1]'
                      : 'bg-[#0F1F1A]/60 border-white/10 text-white/70'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-[#0F1F1A] border border-[#C9A227]" />
                  <span className="text-xs font-semibold">Dark Heritage</span>
                </button>

                <button
                  onClick={() => setTheme('parchment')}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    theme === 'parchment'
                      ? 'bg-[#FAF6EE] border-[#C9A227] text-[#0F1F1A]'
                      : 'bg-[#0F1F1A]/60 border-white/10 text-white/70'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-[#FAF6EE] border border-[#1F4D3F]" />
                  <span className="text-xs font-semibold">Ivory Classic</span>
                </button>
              </div>
            </div>

            {/* Slide Duration */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-3 font-sans">
                3. Slide Duration & Pacing
              </label>
              <div className="flex items-center gap-2">
                {[4, 6, 8, 10].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setSlideDuration(sec)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                      slideDuration === sec
                        ? 'bg-[#C9A227] text-[#0F1F1A]'
                        : 'bg-[#0F1F1A]/70 text-[#E8D9B5]/80 border border-white/10'
                    }`}
                  >
                    {sec} seconds
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Autoplay & Photos Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#C9A227]/15 text-xs font-sans">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoPlayCheck"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
                className="w-4 h-4 rounded text-[#C9A227] focus:ring-[#C9A227] bg-[#0F1F1A]"
              />
              <label htmlFor="autoPlayCheck" className="text-[#FAF6EE] cursor-pointer">
                Automatic Slide Progression (Autoplay)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showPhotosCheck"
                checked={showPhotos}
                onChange={(e) => setShowPhotos(e.target.checked)}
                className="w-4 h-4 rounded text-[#C9A227] focus:ring-[#C9A227] bg-[#0F1F1A]"
              />
              <label htmlFor="showPhotosCheck" className="text-[#FAF6EE] cursor-pointer">
                Display High-Resolution Archival Portraits
              </label>
            </div>
          </div>

          {/* Start CTA */}
          <div className="pt-6 border-t border-[#C9A227]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#E8D9B5]/60 font-sans">
              Press <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10">F11</kbd> or click below to launch full-screen cinema.
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleStartPresentation}
              icon={<Play className="w-5 h-5 fill-current" />}
            >
              Launch Presentation ({slides.length} Slides)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RUNTIME PRESENTATION VIEW (Full Screen Cinematic Mode)
  // =========================================================================
  const isDark = theme === 'dark';
  const progressPercent = ((currentSlideIndex + 1) / slides.length) * 100;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
      onTouchStart={handleUserActivity}
      className={`fixed inset-0 z-50 overflow-hidden flex flex-col justify-between transition-colors duration-700 select-none ${
        isDark ? 'bg-[#0F1F1A] text-[#FAF6EE]' : 'bg-[#FAF6EE] text-[#0F1F1A]'
      }`}
    >
      {/* Background ambient light */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          isDark
            ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F4D3F]/40 via-[#0F1F1A] to-[#0A1612]'
            : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E8D9B5]/40 via-[#FAF6EE] to-[#EBE2CF]'
        }`}
      />

      {/* Top Header & Progress Bar */}
      <div
        className={`relative z-20 transition-opacity duration-300 ${
          isControlsVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div
          className="h-1 bg-[#C9A227] transition-all duration-300 shadow-[0_0_10px_#C9A227]"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span
              className={`font-serif text-lg font-bold tracking-wider ${
                isDark ? 'text-[#FAF6EE]' : 'text-[#0F1F1A]'
              }`}
            >
              HEIRLOOM
            </span>
            <span className="text-xs uppercase tracking-widest text-[#C9A227] font-semibold">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {autoPlay ? <Pause className="w-5 h-5 text-[#C9A227]" /> : <Play className="w-5 h-5 text-[#C9A227]" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-[#C9A227]" />
            </button>
            <button
              onClick={handleExitPresentation}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Exit Presentation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Main Content Area with Animated Transitions */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 sm:p-12">
        <AnimatePresence mode="wait">
          {/* SLIDE 1: TITLE SLIDE */}
          {currentSlide.type === 'title' && (
            <motion.div
              key="slide-title"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center max-w-4xl space-y-6"
            >
              <Badge variant="gold" size="md">
                Ancestral Chronicle
              </Badge>
              <h1
                className={`font-serif text-5xl sm:text-7xl font-bold tracking-tight ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#0F1F1A]'
                }`}
              >
                The Montgomery &amp; Sterling
                <span className="italic block text-gold-shimmer mt-2">Family Chronicle</span>
              </h1>
              <p
                className={`text-lg sm:text-2xl font-serif max-w-2xl mx-auto ${
                  isDark ? 'text-[#E8D9B5]' : 'text-[#1F4D3F]'
                }`}
              >
                A hundred years of bonds, migrations, and enduring heritage across four generations.
              </p>
              <p className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold font-sans pt-4">
                1924 — 2026 • Private Family Gathering
              </p>
            </motion.div>
          )}

          {/* SLIDE 2: GENERATION SUMMARY */}
          {currentSlide.type === 'generation-summary' && (
            <motion.div
              key={`slide-gen-${currentSlide.generation}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-3xl space-y-4"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-[#C9A227] font-semibold">
                Chapter Revelation
              </span>
              <h2
                className={`font-serif text-5xl sm:text-6xl font-bold ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#0F1F1A]'
                }`}
              >
                Generation {currentSlide.generation}
              </h2>
              <p
                className={`text-base sm:text-lg font-sans leading-relaxed ${
                  isDark ? 'text-[#E8D9B5]/85' : 'text-[#1F4D3F]/85'
                }`}
              >
                {currentSlide.generation === 1 &&
                  'The Great-Grandparents: Founders and architects who crossed oceans to build our family foundations.'}
                {currentSlide.generation === 2 &&
                  'The Grandparents: Stewards of coastal traditions, music, and civil infrastructure.'}
                {currentSlide.generation === 3 &&
                  'The Parents & Scholars: Custodians who digitized oral lore and safeguarded family memoirs.'}
                {currentSlide.generation === 4 &&
                  'The Heirs & Children: The living buds and future custodians of our legacy.'}
              </p>
            </motion.div>
          )}

          {/* SLIDE 3: MEMBER SPOTLIGHT */}
          {currentSlide.type === 'member-spotlight' && currentSlide.member && (
            <motion.div
              key={`slide-member-${currentSlide.member.id}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.7 }}
              className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Photo Frame with Ken Burns effect */}
              {showPhotos && (
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-2 border-[#C9A227] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                    <img
                      src={currentSlide.member.photoUrl}
                      alt={currentSlide.member.firstName}
                      className="w-full h-full object-cover animate-ken-burns"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="gold">Gen {currentSlide.member.generation}</Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Biography & Story */}
              <div
                className={`${
                  showPhotos ? 'md:col-span-7' : 'md:col-span-12 max-w-3xl mx-auto'
                } space-y-4 text-left`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-[#C9A227] font-semibold">
                    {currentSlide.member.branch} Lineage
                  </span>
                  {!currentSlide.member.isLiving && (
                    <span className="text-xs text-[#E8D9B5]/60 italic">In Memoriam</span>
                  )}
                </div>

                <h2
                  className={`font-serif text-4xl sm:text-5xl font-bold tracking-tight ${
                    isDark ? 'text-[#FAF6EE]' : 'text-[#0F1F1A]'
                  }`}
                >
                  {currentSlide.member.firstName} {currentSlide.member.lastName}
                </h2>
                {currentSlide.member.maidenName && (
                  <p className="text-base text-[#E8D9B5]/80 italic font-serif -mt-2">
                    née {currentSlide.member.maidenName}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs sm:text-sm text-[#C9A227] font-sans">
                  <span>
                    {currentSlide.member.birthDate?.slice(0, 4) || 'Unknown'} —{' '}
                    {currentSlide.member.isLiving
                      ? 'Present'
                      : currentSlide.member.deathDate?.slice(0, 4) || 'Deceased'}
                  </span>
                  {currentSlide.member.birthPlace && <span>• {currentSlide.member.birthPlace}</span>}
                </div>

                <p
                  className={`text-sm sm:text-base font-sans leading-relaxed pt-2 ${
                    isDark ? 'text-[#FAF6EE]/90' : 'text-[#0F1F1A]/90'
                  }`}
                >
                  {currentSlide.member.bio}
                </p>

                {currentSlide.member.occupation && (
                  <p className="text-xs uppercase tracking-wider text-[#C9A227] font-semibold pt-1">
                    Vocation: {currentSlide.member.occupation}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: FINALE SLIDE */}
          {currentSlide.type === 'finale' && (
            <motion.div
              key="slide-finale"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-[#1F4D3F] border-2 border-[#C9A227] flex items-center justify-center mx-auto text-[#C9A227] shadow-xl">
                <Sparkles className="w-10 h-10" />
              </div>

              <h2
                className={`font-serif text-4xl sm:text-6xl font-bold ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#0F1F1A]'
                }`}
              >
                Every Name Remembered.
                <span className="italic block text-gold-shimmer mt-2">
                  Every Bond Cherished.
                </span>
              </h2>

              <p
                className={`text-base sm:text-lg font-serif ${
                  isDark ? 'text-[#E8D9B5]' : 'text-[#1F4D3F]'
                }`}
              >
                Thank you for gathering tonight to honor our shared ancestry.
              </p>

              <div className="pt-6">
                <Button variant="primary" onClick={handleExitPresentation}>
                  Return to Archive
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Floating Navigation Bar */}
      <div
        className={`relative z-20 flex items-center justify-between px-6 py-6 transition-opacity duration-300 ${
          isControlsVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={() =>
            setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1))
          }
          className="p-3 rounded-full bg-[#142822]/80 hover:bg-[#1F4D3F] text-[#FAF6EE] border border-[#C9A227]/30 transition-all"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentSlideIndex
                  ? 'w-8 bg-[#C9A227]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() =>
            setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0))
          }
          className="p-3 rounded-full bg-[#142822]/80 hover:bg-[#1F4D3F] text-[#FAF6EE] border border-[#C9A227]/30 transition-all"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
