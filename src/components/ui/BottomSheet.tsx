import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F1F1A]/80 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative z-10 w-full max-h-[85vh] bg-[#142822] border-t border-[#C9A227]/30 rounded-t-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden pb-safe"
          >
            {/* Grab handle */}
            <div className="flex flex-col items-center pt-3 pb-2 cursor-grab shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-[#E8D9B5]/30" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 pb-3 border-b border-[#C9A227]/15 shrink-0">
                <h3 className="font-serif text-xl font-semibold text-[#FAF6EE]">{title}</h3>
                <button
                  onClick={onClose}
                  aria-label="Close sheet"
                  className="p-1 rounded-full text-[#E8D9B5]/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto px-6 py-4 flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
