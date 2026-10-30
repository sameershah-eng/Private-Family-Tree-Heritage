import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#0A1612] border-t border-[#C9A227]/20 pt-16 pb-12 overflow-hidden text-[#E8D9B5]/80">
      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-[#C9A227]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#C9A227]/15">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1F4D3F] to-[#0F1F1A] border border-[#C9A227] flex items-center justify-center shadow-[0_0_15px_rgba(201,162,39,0.25)]">
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
              <span className="font-serif text-2xl font-bold tracking-wide text-[#FAF6EE]">
                Heirloom
              </span>
            </Link>

            <p className="text-sm text-[#E8D9B5]/75 leading-relaxed max-w-sm font-sans">
              A private, timeless archive for the stories, photographs, and ancestral bonds that form
              the living foundation of our family.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#C9A227] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
              <span>Private & invite-only repository</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#FAF6EE] mb-3">Lineage</h4>
            <ul className="space-y-2 text-sm font-sans">
              <li>
                <Link to="/tree" className="hover:text-[#F3E3A1] transition-colors">
                  Interactive Family Tree
                </Link>
              </li>
              <li>
                <Link to="/members" className="hover:text-[#F3E3A1] transition-colors">
                  Member Directory
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#F3E3A1] transition-colors">
                  Photographic Archive
                </Link>
              </li>
              <li>
                <Link to="/present" className="hover:text-[#F3E3A1] transition-colors">
                  Presentation Mode
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Archive */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#FAF6EE] mb-3">Archive Tools</h4>
            <ul className="space-y-2 text-sm font-sans">
              <li>
                <Link to="/manage" className="hover:text-[#F3E3A1] transition-colors">
                  GEDCOM Import & Export
                </Link>
              </li>
              <li>
                <Link to="/manage" className="hover:text-[#F3E3A1] transition-colors">
                  CSV Registry Ledger
                </Link>
              </li>
              <li>
                <Link to="/manage" className="hover:text-[#F3E3A1] transition-colors">
                  Relationship Manager
                </Link>
              </li>
              <li>
                <Link to="/manage" className="hover:text-[#F3E3A1] transition-colors">
                  Activity Audit Log
                </Link>
              </li>
            </ul>
          </div>

          {/* Quote & Heritage */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#FAF6EE] mb-3">Heritage</h4>
            <blockquote className="text-xs italic text-[#E8D9B5]/70 border-l-2 border-[#C9A227]/40 pl-3 leading-relaxed">
              &ldquo;To forget one&rsquo;s ancestors is to be a brook without a source, a tree without a root.&rdquo;
            </blockquote>
            <p className="text-[11px] text-[#C9A227] mt-2 font-serif">— Traditional Proverb</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8D9B5]/50 gap-4 font-sans">
          <p>© 2026 Heirloom Family Archive. All generational records preserved with care.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#E8D9B5] cursor-pointer">Privacy Charter</span>
            <span className="hover:text-[#E8D9B5] cursor-pointer">Heritage Terms</span>
            <span className="hover:text-[#E8D9B5] cursor-pointer">Export Ledger</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
