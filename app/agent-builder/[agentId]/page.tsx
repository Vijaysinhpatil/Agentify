"use client";

import React, { useCallback, useState, useMemo, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  BackgroundVariant,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import Header from "../_components/Header";
import StartNode from "../_customNodes/StartNode";
import AgentNode from "../_customNodes/AgentNode";

// Static data defined outside to maintain reference stability
const initialNodes: Node[] = [
  {
    id: "n1",
    type: "StartNode",
    position: { x: 250, y: 150 },
    data: { label: "New Lead" },
  },
  {
    id: "n2",
    type: "AgentNode",
    position: { x: 250, y: 350 },
    data: { label: "Send Email" },
  },
];

const initialEdges: Edge[] = [
  {
    id: "n1-n2",
    source: "n1",
    target: "n2",
    animated: true,
    style: { stroke: "#cbd5e1", strokeWidth: 2 },
  },
];

export default function AgentBuilder() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [mounted, setMounted] = useState(false);

  // Handle mounting to prevent hydration mismatches with system themes
  useEffect(() => {
    setMounted(true);
  }, []);

  const nodeTypes = useMemo(() => ({
    StartNode: StartNode,
    AgentNode: AgentNode,
  }), []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          { 
            ...params, 
            animated: true, 
            style: { stroke: "#cbd5e1", strokeWidth: 2 } 
          }, 
          eds
        )
      ),
    []
  );

  // Premium Skeleton/Loading State
  if (!mounted) {
    return (
      <div className="flex flex-col h-screen bg-[#f8fafc]">
        <Header />
        <div className="flex-1 p-6">
          <div className="w-full h-full bg-white/50 border border-zinc-200/60 rounded-[32px] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-zinc-100/30 to-transparent animate-[pulse_3s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden text-slate-900 selection:bg-blue-100/50">
      <Header />

      <main className="flex-1 relative w-full h-full p-4 lg:p-6">
        {/* Canvas Wrapper with Apple-like depth and curves */}
        <div className="relative w-full h-full bg-white rounded-[32px] border-5 border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_8px_16px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
          
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            colorMode="light"
            snapToGrid={true}
            snapGrid={[20, 20]}
            defaultEdgeOptions={{
              style: { strokeWidth: 2, stroke: '#cbd5e1' },
              animated: true,
              deletable: true,
            }}
          >
            {/* Soft, minimal background pattern */}
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="#e2e8f0"
              className="opacity-60"
            />
            
            {/* Re-styled floating controls */}
            <Controls
              showInteractive={false}
              className="!bg-white/80 !backdrop-blur-md !border-slate-200/60 !rounded-2xl !shadow-2xl !shadow-slate-200/50 !m-6 !border !flex !gap-1 !p-1.5"
            />
          </ReactFlow>

          {/* Gradient vignettes for "infinite" depth feel */}
          <div className="absolute inset-0 pointer-events-none rounded-[32px] ring-1 ring-inset ring-slate-900/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.01)]" />
          
          {/* Subtle decorative glass bar for status or Breadcrumbs if needed */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-full text-[11px] font-medium text-slate-500 shadow-sm pointer-events-none">
             Workflow Designer • Auto-saved
          </div>
        </div>
      </main>
    </div>
  );
}