import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  RotateCcw,
  Sparkles,
  Search,
  Download,
  Share2,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface TreeControlsProps {
  branchFilter: string | null;
  onSelectBranch: (branch: string | null) => void;
  orientation: 'vertical' | 'horizontal';
  onToggleOrientation: () => void;
  focusedMemberName: string | null;
  onClearFocus: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onExport: () => void;
  totalMembersCount: number;
}

export const TreeControls: React.FC<TreeControlsProps> = ({
  branchFilter,
  onSelectBranch,
  orientation,
  onToggleOrientation,
  focusedMemberName,
  onClearFocus,
  onZoomIn,
  onZoomOut,
  onFitView,
  onExport,
  totalMembersCount,
}) => {
  const branches = [
    { label: 'All Lineages', value: null },
    { label: 'Paternal Line', value: 'Paternal' },
    { label: 'Maternal Line', value: 'Maternal' },
    { label: 'Direct Line', value: 'Direct' },
  ];

  return (
    <div className="absolute top-24 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      {/* Left Pill: Branch Filters & Focus Notice */}
      <div className="pointer-events-auto flex flex-wrap items-center gap-2 bg-[#142822]/90 border border-[#C9A227]/30 p-1.5 sm:p-2 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="flex items-center gap-1">
          {branches.map((b) => (
            <button
              key={b.label}
              onClick={() => onSelectBranch(b.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                branchFilter === b.value
                  ? 'bg-[#C9A227] text-[#0F1F1A] font-semibold shadow-sm'
                  : 'text-[#E8D9B5]/80 hover:text-[#FAF6EE] hover:bg-[#1F4D3F]/50'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {focusedMemberName && (
          <div className="flex items-center gap-2 pl-2 border-l border-[#C9A227]/30 text-xs text-[#F3E3A1]">
            <span>Focused on: <strong>{focusedMemberName}</strong></span>
            <button
              onClick={onClearFocus}
              className="p-1 rounded-full hover:bg-[#C9A227]/20 text-[#E8D9B5]"
              title="Show entire tree"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Right Pill: Canvas View Tools & Export */}
      <div className="pointer-events-auto flex items-center gap-1.5 bg-[#142822]/90 border border-[#C9A227]/30 p-1.5 sm:p-2 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
        {/* Orientation Toggle */}
        <button
          onClick={onToggleOrientation}
          title={`Switch to ${orientation === 'vertical' ? 'Horizontal' : 'Vertical'} View`}
          className="px-2.5 py-1.5 rounded-xl text-xs text-[#E8D9B5] hover:text-[#FAF6EE] hover:bg-[#1F4D3F]/50 border border-[#C9A227]/20 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#C9A227]" />
          <span className="hidden sm:inline capitalize">{orientation}</span>
        </button>

        {/* Fit View */}
        <button
          onClick={onFitView}
          title="Fit entire tree to screen"
          className="p-2 rounded-xl text-[#E8D9B5] hover:text-[#FAF6EE] hover:bg-[#1F4D3F]/50 transition-colors"
        >
          <Maximize2 className="w-4 h-4 text-[#C9A227]" />
        </button>

        {/* Zoom In */}
        <button
          onClick={onZoomIn}
          title="Zoom in"
          className="p-2 rounded-xl text-[#E8D9B5] hover:text-[#FAF6EE] hover:bg-[#1F4D3F]/50 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={onZoomOut}
          title="Zoom out"
          className="p-2 rounded-xl text-[#E8D9B5] hover:text-[#FAF6EE] hover:bg-[#1F4D3F]/50 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Export Tree */}
        <button
          onClick={onExport}
          title="Export Tree Archive"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-[#FAF6EE] bg-[#1F4D3F] border border-[#C9A227]/40 hover:bg-[#255C4C] transition-all ml-1"
        >
          <Download className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};
