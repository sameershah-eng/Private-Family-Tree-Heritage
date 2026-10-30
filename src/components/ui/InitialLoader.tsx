import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface InitialLoaderProps {
  onComplete: () => void;
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'drawing' | 'leaves' | 'wordmark' | 'done'>('drawing');

  useEffect(() => {
    // Stage 1: stroke drawing (0 - 650ms)
    const t1 = setTimeout(() => setStage('leaves'), 700);
    // Stage 2: gold leaves fade in (700 - 1300ms)
    const t2 = setTimeout(() => setStage('wordmark'), 1350);
    // Stage 3: wordmark reveals & complete
    const t3 = setTimeout(() => {
      setStage('done');
      setTimeout(onComplete, 550);
    }, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          key="initial-loader"
          initial={{ opacity: 1, y: 0 }}
          exit={{ y: '-100%', opacity: 0.95 }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0F1F1A] text-[#FAF6EE] select-none"
        >
          {/* Subtle radial glow */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-[#C9A227]/10 blur-[90px] pointer-events-none" />

          {/* SVG Tree Animation */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full drop-shadow-[0_4px_16px_rgba(201,162,39,0.3)]"
            >
              {/* Outer Heritage Ring */}
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke="#C9A227"
                strokeWidth="1.2"
                strokeOpacity="0.4"
                strokeDasharray="4 4"
              />

              {/* Trunk and Roots */}
              <motion.path
                d="M100 170 V105 M100 170 Q92 182 80 186 M100 170 Q108 182 120 186"
                fill="none"
                stroke="#C9A227"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />

              {/* Primary Branches */}
              <motion.path
                d="M100 125 Q70 115 54 90 M100 115 Q130 105 146 80 M100 95 Q85 75 75 52 M100 95 Q115 75 125 52 M100 85 V45"
                fill="none"
                stroke="#C9A227"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.85, delay: 0.2, ease: 'easeOut' }}
              />

              {/* Sub-branches */}
              <motion.path
                d="M54 90 Q42 75 40 60 M54 90 Q65 78 70 70 M146 80 Q158 68 160 52 M146 80 Q135 68 130 62"
                fill="none"
                stroke="#E0BA3E"
                strokeWidth="1.8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
              />

              {/* Generational Nodes / Leaves */}
              {(stage === 'leaves' || stage === 'wordmark') && (
                <g>
                  {[
                    { cx: 100, cy: 40, r: 6, fill: '#C9A227' },
                    { cx: 75, cy: 50, r: 5, fill: '#E8D9B5' },
                    { cx: 125, cy: 50, r: 5, fill: '#E8D9B5' },
                    { cx: 40, cy: 60, r: 4.5, fill: '#F3E3A1' },
                    { cx: 70, cy: 70, r: 4, fill: '#E8D9B5' },
                    { cx: 160, cy: 52, r: 4.5, fill: '#F3E3A1' },
                    { cx: 130, cy: 62, r: 4, fill: '#E8D9B5' },
                    { cx: 54, cy: 90, r: 5.5, fill: '#C9A227' },
                    { cx: 146, cy: 80, r: 5.5, fill: '#C9A227' },
                  ].map((node, i) => (
                    <motion.circle
                      key={i}
                      cx={node.cx}
                      cy={node.cy}
                      r={node.r}
                      fill={node.fill}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: i * 0.05,
                        type: 'spring',
                        stiffness: 350,
                        damping: 20,
                      }}
                    />
                  ))}
                </g>
              )}
            </svg>
          </div>

          {/* Wordmark and Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={stage === 'wordmark' ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center mt-6"
          >
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold tracking-wider text-gold-shimmer">
              HEIRLOOM
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-[#E8D9B5]/80 mt-2 font-sans font-medium">
              Private Family Archive & Lineage
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
