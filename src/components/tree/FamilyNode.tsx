import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FamilyMember } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

interface FamilyNodeProps {
  data: {
    member: FamilyMember;
    isFocused?: boolean;
  };
  selected?: boolean;
}

export const FamilyNode = memo(({ data, selected }: FamilyNodeProps) => {
  const { member, isFocused } = data;

  const birthYear = member.birthDate ? member.birthDate.slice(0, 4) : '?';
  const deathYear = member.isLiving ? 'Present' : member.deathDate ? member.deathDate.slice(0, 4) : 'Deceased';

  return (
    <div
      className={`group relative w-[240px] rounded-2xl bg-[#142822]/95 border transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.5)] p-3.5 backdrop-blur-md cursor-pointer select-none ${
        selected || isFocused
          ? 'border-[#C9A227] shadow-[0_0_25px_rgba(201,162,39,0.45)] ring-2 ring-[#C9A227]/50 scale-105'
          : 'border-[#C9A227]/30 hover:border-[#C9A227]/80 hover:shadow-[0_12px_30px_rgba(201,162,39,0.2)]'
      }`}
    >
      {/* React Flow Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-[#C9A227] !border-2 !border-[#0F1F1A]"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-[#C9A227] !border-2 !border-[#0F1F1A]"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-2.5 !h-2.5 !bg-[#E8D9B5] !border-2 !border-[#0F1F1A]"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-2.5 !h-2.5 !bg-[#E8D9B5] !border-2 !border-[#0F1F1A]"
      />

      <div className="flex items-center gap-3">
        {/* Member Portrait */}
        <div className="relative shrink-0">
          <Avatar
            src={member.photoUrl}
            name={`${member.firstName} ${member.lastName}`}
            size="md"
            isLiving={member.isLiving}
          />
          {!member.isLiving && (
            <span
              title="Deceased"
              className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#0F1F1A] border border-[#E8D9B5]/40 flex items-center justify-center text-[9px] text-[#E8D9B5]"
            >
              †
            </span>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <Badge variant="gold" size="sm">
              Gen {member.generation}
            </Badge>
            {member.branch && (
              <span className="text-[9px] uppercase tracking-wider text-[#E8D9B5]/60 font-semibold truncate">
                {member.branch}
              </span>
            )}
          </div>

          <h4 className="font-serif font-semibold text-sm sm:text-base text-[#FAF6EE] truncate group-hover:text-[#F3E3A1] transition-colors leading-snug">
            {member.firstName} {member.lastName}
          </h4>

          <p className="text-[11px] text-[#E8D9B5]/75 font-sans mt-0.5 truncate">
            {birthYear} – {deathYear}
          </p>
        </div>
      </div>

      {member.occupation && (
        <div className="mt-2 pt-2 border-t border-[#C9A227]/15 flex items-center justify-between text-[10px] text-[#E8D9B5]/65">
          <span className="truncate">{member.occupation}</span>
          <span className="text-[#C9A227] font-serif text-xs">Explore →</span>
        </div>
      )}
    </div>
  );
});
