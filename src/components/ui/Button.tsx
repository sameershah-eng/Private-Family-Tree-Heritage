import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-medium rounded-full tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1F1A] disabled:opacity-50 disabled:cursor-not-allowed select-none overflow-hidden cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-5 py-2.5 gap-2 h-10',
    lg: 'text-base px-7 py-3.5 gap-2.5 h-12',
  }[size];

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#C9A227] via-[#E0BA3E] to-[#C9A227] text-[#0F1F1A] font-semibold shadow-[0_4px_20px_rgba(201,162,39,0.25)] hover:shadow-[0_6px_25px_rgba(201,162,39,0.4)] border border-[#F3E3A1]/40',
    outline:
      'border border-[#E8D9B5]/40 text-[#FAF6EE] hover:border-[#C9A227] hover:bg-[#C9A227]/10 hover:text-[#F3E3A1] backdrop-blur-sm',
    secondary:
      'bg-[#1F4D3F] text-[#FAF6EE] border border-[#2A6654] hover:bg-[#255C4C] hover:border-[#C9A227]/40 shadow-sm',
    ghost:
      'text-[#E8D9B5] hover:text-[#FAF6EE] hover:bg-[#1F4D3F]/40',
    danger:
      'bg-[#B5654A]/20 border border-[#B5654A]/50 text-[#F4ECE1] hover:bg-[#B5654A]/40 hover:border-[#B5654A]',
  }[variant];

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {/* Shine sweep on primary */}
      {variant === 'primary' && !disabled && (
        <span
          className="absolute inset-0 w-1/2 h-full bg-white/25 -skew-x-12 -translate-x-full hover:animate-[shine_1.2s_ease-in-out]"
          style={{ pointerEvents: 'none' }}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
