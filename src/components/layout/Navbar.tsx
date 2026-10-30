import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Menu, X, Shield, Sparkles, ChevronDown, LogOut, Check } from 'lucide-react';
import { useFamilyStore, DEMO_USERS } from '../../store/useFamilyStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, loginAsRole, setIsCommandSearchOpen } = useFamilyStore();

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Scroll tracking for frosted effect, scroll progress, and smart hide/reveal
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (totalScroll > 0) {
        setScrollProgress((currentScrollY / totalScroll) * 100);
      }

      setScrolled(currentScrollY > 40);

      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY && !mobileMenuOpen) {
          // Scrolling down
          setVisible(false);
        } else {
          // Scrolling up
          setVisible(true);
        }
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Family Tree', path: '/tree' },
    { name: 'Members', path: '/members' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Present', path: '/present' },
    { name: 'Manage', path: '/manage' },
  ];

  const handleRoleSwitch = (role: UserRole) => {
    loginAsRole(role);
    setUserDropdownOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled
            ? 'h-[68px] bg-[#0F1F1A]/85 backdrop-blur-xl border-b border-[#C9A227]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'h-[88px] bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Monogram */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#1F4D3F] to-[#0F1F1A] border border-[#C9A227]/60 flex items-center justify-center shadow-[0_0_15px_rgba(201,162,39,0.2)] group-hover:border-[#C9A227] transition-all duration-300">
              {/* Tree Monogram SVG */}
              <svg viewBox="0 0 40 40" className="w-6 h-6">
                <path
                  d="M20 32 V16 M20 23 Q14 20 12 14 M20 21 Q26 18 28 13 M20 18 Q16 13 17 9 M20 17 Q24 12 23 9"
                  fill="none"
                  stroke="#C9A227"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="14" r="1.5" fill="#E8D9B5" />
                <circle cx="28" cy="13" r="1.5" fill="#E8D9B5" />
                <circle cx="17" cy="9" r="1.5" fill="#E8D9B5" />
                <circle cx="23" cy="9" r="1.5" fill="#E8D9B5" />
                <circle cx="20" cy="7" r="1.8" fill="#C9A227" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wide text-[#FAF6EE] group-hover:text-[#F3E3A1] transition-colors leading-tight">
                Heirloom
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#C9A227] font-sans font-semibold -mt-0.5">
                Heritage Archive
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-[#F3E3A1]' : 'text-[#FAF6EE]/80 hover:text-[#FAF6EE]'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent rounded-full shadow-[0_0_8px_rgba(201,162,39,0.8)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & User Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Button */}
            <button
              onClick={() => setIsCommandSearchOpen(true)}
              aria-label="Search members (Ctrl+K)"
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-full bg-[#142822]/70 border border-[#C9A227]/30 text-[#E8D9B5] hover:text-[#FAF6EE] hover:border-[#C9A227] transition-all text-xs"
            >
              <Search className="w-4 h-4 text-[#C9A227]" />
              <span className="hidden sm:inline font-sans">Search</span>
              <kbd className="hidden md:inline-block text-[10px] font-mono text-[#E8D9B5]/50 px-1.5 py-0.2 rounded bg-[#0F1F1A]">
                ⌘K
              </kbd>
            </button>

            {/* User Dropdown (Role Switcher for demo) */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#1F4D3F]/40 border border-[#C9A227]/20 transition-all focus:outline-none"
              >
                <Avatar
                  src={currentUser.avatar}
                  name={currentUser.name}
                  size="sm"
                  borderRing={false}
                />
                <div className="hidden xl:flex flex-col text-left pr-1">
                  <span className="text-xs font-serif font-medium text-[#FAF6EE] max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[#C9A227] font-semibold">
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#E8D9B5]/60 hidden xl:inline" />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#142822] border border-[#C9A227]/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)] p-3 z-50 backdrop-blur-xl"
                  >
                    <div className="px-3 py-2 border-b border-[#C9A227]/15 mb-2">
                      <p className="text-sm font-serif font-semibold text-[#FAF6EE]">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-[#E8D9B5]/60 font-sans truncate">
                        {currentUser.email}
                      </p>
                      <div className="mt-1.5">
                        <Badge
                          variant={
                            currentUser.role === 'owner'
                              ? 'gold'
                              : currentUser.role === 'editor'
                              ? 'emerald'
                              : 'muted'
                          }
                          size="sm"
                        >
                          <Shield className="w-3 h-3 mr-0.5" />
                          Role: {currentUser.role.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-[#E8D9B5]/50 px-3 py-1 font-semibold">
                        Switch Demo Role
                      </p>
                      {(['owner', 'editor', 'viewer'] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleSwitch(role)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans transition-colors ${
                            currentUser.role === role
                              ? 'bg-[#C9A227]/20 text-[#F3E3A1]'
                              : 'text-[#E8D9B5] hover:bg-[#1F4D3F]/50 hover:text-[#FAF6EE]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="capitalize">{role}</span>
                            <span className="text-[10px] text-[#E8D9B5]/50">
                              ({role === 'owner' ? 'Full Control' : role === 'editor' ? 'Can Edit' : 'Read Only'})
                            </span>
                          </div>
                          {currentUser.role === role && <Check className="w-3.5 h-3.5 text-[#C9A227]" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary CTA (Desktop) */}
            <div className="hidden sm:block">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/tree')}
                icon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Open the Tree
              </Button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-[#FAF6EE] hover:bg-[#1F4D3F]/50 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#C9A227]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar at very bottom of navbar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#1F4D3F] via-[#C9A227] to-[#F3E3A1] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-30 lg:hidden bg-gradient-to-b from-[#0F1F1A] via-[#142822] to-[#0A1612] pt-24 pb-8 px-6 flex flex-col justify-between overflow-y-auto"
          >
            <div className="flex flex-col gap-4 mt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold mb-2">
                Archives & Navigation
              </p>
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block font-serif text-3xl font-semibold text-[#FAF6EE] hover:text-[#F3E3A1] py-2 border-b border-[#C9A227]/10"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-[#C9A227]/20">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#142822] border border-[#C9A227]/20">
                <div className="flex items-center gap-3">
                  <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
                  <div>
                    <p className="text-sm font-serif text-[#FAF6EE]">{currentUser.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[#C9A227]">
                      Role: {currentUser.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/manage');
                  }}
                  className="text-xs text-[#E8D9B5] underline"
                >
                  Manage
                </button>
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/tree');
                }}
              >
                Explore Family Tree
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
