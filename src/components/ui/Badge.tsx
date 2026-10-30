import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'emerald' | 'champagne' | 'terracotta' | 'outline' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider uppercase font-semibold',
    md: 'text-xs px-2.5 py-1 tracking-wide font-medium',
  }[size];

  const variantClasses = {
    gold: 'bg-[#C9A227]/15 text-[#F3E3A1] border border-[#C9A227]/40',
    emerald: 'bg-[#1F4D3F]/60 text-[#E8D9B5] border border-[#2A6654]',
    champagne: 'bg-[#E8D9B5]/20 text-[#FAF6EE] border border-[#E8D9B5]/40',
    terracotta: 'bg-[#B5654A]/20 text-[#FAF6EE] border border-[#B5654A]/40',
    outline: 'bg-transparent text-[#E8D9B5] border border-[#E8D9B5]/30',
    muted: 'bg-[#142822]/80 text-[#E8D9B5]/70 border border-white/10',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full whitespace-nowrap transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
