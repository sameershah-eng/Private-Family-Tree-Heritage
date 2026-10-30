/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

// Layout & UI
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommandSearchModal } from './components/layout/CommandSearchModal';
import { InitialLoader } from './components/ui/InitialLoader';

// Pages
import { HomePage } from './pages/HomePage';
import { TreePage } from './pages/TreePage';
import { MembersPage } from './pages/MembersPage';
import { MemberDetailPage } from './pages/MemberDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { PresentationPage } from './pages/PresentationPage';
import { ManagePage } from './pages/ManagePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// App Content with route transitions
function AppContent() {
  const location = useLocation();
  const isPresentation = location.pathname === '/present';
  const isTree = location.pathname === '/tree';

  return (
    <div className="flex flex-col min-h-screen bg-[#0F1F1A] text-[#FAF6EE]">
      {/* Hide standard navbar on presentation screen to ensure full cinema immersion */}
      {!isPresentation && <Navbar />}

      {/* Global Command Search (Ctrl+K) */}
      <CommandSearchModal />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/tree" element={<TreePage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/members/:id" element={<MemberDetailPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/present" element={<PresentationPage />} />
              <Route path="/manage" element={<ManagePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Hide footer on full-height tree canvas and presentation mode */}
      {!isPresentation && !isTree && <Footer />}
    </div>
  );
}

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  return (
    <BrowserRouter>
      <ScrollToTop />
      {initialLoading && <InitialLoader onComplete={() => setInitialLoading(false)} />}
      <AppContent />
    </BrowserRouter>
  );
}
