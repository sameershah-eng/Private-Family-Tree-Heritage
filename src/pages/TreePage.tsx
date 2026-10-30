import React from 'react';
import { TreeCanvas } from '../components/tree/TreeCanvas';

export const TreePage: React.FC = () => {
  return (
    <div className="pt-[68px] min-h-screen bg-[#0A1612]">
      <TreeCanvas />
    </div>
  );
};
