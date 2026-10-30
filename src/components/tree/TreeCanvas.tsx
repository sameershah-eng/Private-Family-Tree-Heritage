import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFamilyStore } from '../../store/useFamilyStore';
import { FamilyNode } from './FamilyNode';
import { buildTreeLayout } from './treeLayout';
import { TreeControls } from './TreeControls';
import { MemberDrawer } from './MemberDrawer';
import { exportToGedcom } from '../../services/familyStorageService';

const nodeTypes = {
  familyNode: FamilyNode,
};

const InnerTreeFlow: React.FC = () => {
  const { members, selectedMemberId, setSelectedMemberId, activeBranchFilter, setActiveBranchFilter } =
    useFamilyStore();
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const [focusedMemberId, setFocusedMemberId] = useState<string | null>(null);

  const reactFlowInstance = useReactFlow();

  // Compute Layout
  const { initialNodes, initialEdges } = useMemo(() => {
    const { nodes, edges } = buildTreeLayout(members, {
      orientation,
      branchFilter: activeBranchFilter,
      focusedMemberId,
    });
    return { initialNodes: nodes, initialEdges: edges };
  }, [members, orientation, activeBranchFilter, focusedMemberId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update when layout changes
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.25, duration: 600 });
    }, 100);
  }, [initialNodes, initialEdges, reactFlowInstance, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedMemberId(node.id);
    },
    [setSelectedMemberId]
  );

  const selectedMember = useMemo(() => {
    return members.find((m) => m.id === selectedMemberId) || null;
  }, [members, selectedMemberId]);

  const focusedMember = useMemo(() => {
    return members.find((m) => m.id === focusedMemberId) || null;
  }, [members, focusedMemberId]);

  const handleZoomIn = () => reactFlowInstance.zoomIn({ duration: 300 });
  const handleZoomOut = () => reactFlowInstance.zoomOut({ duration: 300 });
  const handleFitView = () => reactFlowInstance.fitView({ padding: 0.2, duration: 400 });

  const handleToggleOrientation = () => {
    setOrientation((prev) => (prev === 'vertical' ? 'horizontal' : 'vertical'));
  };

  const handleFocusMember = (id: string) => {
    setFocusedMemberId(id);
    setSelectedMemberId(null);
  };

  const handleClearFocus = () => {
    setFocusedMemberId(null);
  };

  const handleExport = () => {
    const gedText = exportToGedcom(members);
    const blob = new Blob([gedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Heirloom_Family_Tree_${new Date().toISOString().slice(0, 10)}.ged`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full h-[calc(100vh-68px)] bg-[#0A1612] overflow-hidden select-none">
      {/* Heritage Header Controls */}
      <TreeControls
        branchFilter={activeBranchFilter}
        onSelectBranch={setActiveBranchFilter}
        orientation={orientation}
        onToggleOrientation={handleToggleOrientation}
        focusedMemberName={focusedMember ? `${focusedMember.firstName} ${focusedMember.lastName}` : null}
        onClearFocus={handleClearFocus}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
        onExport={handleExport}
        totalMembersCount={members.length}
      />

      {/* Main Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.15}
        maxZoom={2.0}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1F4D3F" gap={28} size={1.2} />
        <MiniMap
          nodeColor="#C9A227"
          maskColor="rgba(15, 31, 26, 0.75)"
          className="hidden md:block !bottom-4 !right-4 !w-44 !h-32 !border-[#C9A227]/30 !bg-[#142822]/90"
        />
      </ReactFlow>

      {/* Side Profile Drawer for clicked member */}
      <MemberDrawer
        member={selectedMember}
        onClose={() => setSelectedMemberId(null)}
        onFocusMember={handleFocusMember}
      />
    </div>
  );
};

export const TreeCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <InnerTreeFlow />
    </ReactFlowProvider>
  );
};
