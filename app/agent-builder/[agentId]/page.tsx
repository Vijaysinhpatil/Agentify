"use client";

import React, { useCallback, useState } from "react";
import Header from "../_components/Header";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  { 
    id: "n1", 
    position: { x: 250, y: 100 }, 
    data: { label: "Trigger: New Lead" },
    className: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm font-medium text-sm p-4 w-48 text-zinc-900 dark:text-zinc-100 hover:shadow-md transition-all duration-200"
  },
  { 
    id: "n2", 
    position: { x: 250, y: 250 }, 
    data: { label: "Action: Send Email" },
    className: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm font-medium text-sm p-4 w-48 text-zinc-900 dark:text-zinc-100 hover:shadow-md transition-all duration-200"
  },
];

const initialEdges = [
  { 
    id: "n1-n2", 
    source: "n1", 
    target: "n2", 
    animated: true,
    style: { stroke: '#e4e4e7' } 
  },
];

function AgentBuilder() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) =>
        applyNodeChanges(changes, nodesSnapshot)
      ),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) =>
        applyEdgeChanges(changes, edgesSnapshot)
      ),
    []
  );

  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) =>
        addEdge({ ...params, animated: true, style: { stroke: '#e4e4e7' } }, edgesSnapshot)
      ),
    []
  );

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <Header />

      <main className="flex-1 relative w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          colorMode="system"
          defaultEdgeOptions={{
            animated: true,
            style: { strokeWidth: 2 }
          }}
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color="#d4d4d8" 
            className="dark:opacity-20"
          />
          <Controls 
            className="bg-white! dark:bg-zinc-900! border-zinc-200! dark:border-zinc-800! rounded-lg! shadow-sm! m-4!" 
            showInteractive={false}
          />
        </ReactFlow>
        
        {/* Subtle Canvas Border */}
        <div className="absolute inset-0 pointer-events-none border border-zinc-200/50 dark:border-zinc-800/50 m-4 rounded-2xl" />
      </main>
    </div>
  );
}

export default AgentBuilder;