import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isLiving?: boolean;
  className?: string;
  borderRing?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  isLiving = true,
  className = '',
  borderRing = true,
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
    '2xl': 'w-32 h-32 text-3xl',
  }[size];

  const ringClasses = borderRing
    ? isLiving
      ? 'ring-2 ring-[#C9A227]/70 shadow-[0_0_12px_rgba(201,162,39,0.25)]'
      : 'ring-2 ring-[#E8D9B5]/30 grayscale-[35%]'
    : '';

  // Generate 2 initials
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-[#1F4D3F] text-[#FAF6EE] font-serif select-none transition-all duration-300 ${sizeClasses} ${ringClasses} ${className}`}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1F4D3F] to-[#0F1F1A] text-[#E8D9B5] font-medium font-serif">
          {initials || 'H'}
        </div>
      )}
    </div>
  );
};
