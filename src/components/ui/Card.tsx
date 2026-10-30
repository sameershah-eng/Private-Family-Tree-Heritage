import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  gradientBorder?: boolean;
  hoverEffect?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  gradientBorder = false,
  hoverEffect = false,
  className = '',
  ...props
}) => {
  if (gradientBorder) {
    return (
      <motion.div
        whileHover={hoverEffect ? { y: -6, transition: { duration: 0.25 } } : undefined}
        className={`gold-gradient-border shadow-[0_10px_35px_-10px_rgba(15,31,26,0.5)] ${className}`}
        {...props}
      >
        <div className="gold-gradient-border-inner p-6 sm:p-7 backdrop-blur-md">
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -6, transition: { duration: 0.25 } } : undefined}
      className={`rounded-2xl bg-[#142822]/90 border border-[#C9A227]/20 p-6 sm:p-7 shadow-[0_10px_35px_-10px_rgba(15,31,26,0.4)] backdrop-blur-md transition-shadow hover:shadow-[0_16px_45px_-10px_rgba(201,162,39,0.15)] hover:border-[#C9A227]/40 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
