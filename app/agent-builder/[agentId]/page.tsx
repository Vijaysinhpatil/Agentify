"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
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
  Panel,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import Header from "../_components/Header";
import StartNode from "../_customNodes/StartNode";
import AgentNode from "../_customNodes/AgentNode";
import AgentToolsPanel from "../_components/AgentToolsPanel";
import { WorkflowContext } from "@/app/context/WorkflowContext";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Agent } from "@/types/AgentTypes";
import { updateAgentDetails } from "@/convex/agent";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function AgentBuilder() {
  const workflow = useContext(WorkflowContext);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [mounted, setMounted] = useState(false);
  const [agentDetails, setAgentDetails] = useState<Agent>();
  const UpdateAgentDetail = useMutation(api.agent.updateAgentDetails)
  const convex = useConvex();
  const { agentId } = useParams();

  useEffect(() => {
    GetAgentDetails();
  }, [agentId]); // Added agentId to dependency array

  const GetAgentDetails = async () => {
    const result = await convex.query(api.agent.GetAgentById, {
      agentId: agentId as string,
    });

    /**
     * FIX 1: Convex .collect() returns an Array. 
     * We need to set the single object to match the 'Agent' type.
     */
    if (result && Array.isArray(result)) {
      setAgentDetails(result[0]);
    } else {
      setAgentDetails(result);
    }
  };

  /**
   * FIX 2: Consistency in naming. 
   * Ensure keys match exactly what is sent from AgentToolsPanel (AgentNode).
   */
  const nodeTypes = useMemo(
    () => ({
      StartNode: StartNode, // Changed from startNode to match tool logic
      AgentNode: AgentNode,
    }),
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * FIX 3: Styling logic alignment.
   * This ensures that when you click a tool, ReactFlow knows which component to render.
   */
  useEffect(() => {
    if (workflow?.addedNodes && Array.isArray(workflow.addedNodes)) {
      const styledNodes = workflow.addedNodes.map((node: any) => ({
        ...node,
        // Map any lowercase variants or ID-based types to the correct Node Component key
        type: (node.type === 'startNode' || node.id === 'start') ? 'StartNode' : node.type,
      }));
      setNodes(styledNodes);
    }
  }, [workflow?.addedNodes]);

  // save the nodes and edges

// Save the nodes and edges whenever they change
  // useEffect(() => {
  //   // Check if agentDetails exists and if there are actually nodes to save
  //   if (agentDetails?._id && nodes.length > 0) {
  //     SaveNodesAndEdges();
  //   }
  // }, [nodes, edges, agentDetails?._id]);

  const SaveNodesAndEdges = async () => {
  try {
    if (!agentDetails?._id) return;

    // Sanitize nodes to remove React-internal properties ($$typeof)
    const sanitizedNodes = nodes.map(({ id, type, position, data }) => ({
      id,
      type,
      position,
      data: {
        label: data.label,
        bgColor: data.bgColor,
        // include any other plain data fields you need
      },
    }));

    // Sanitize edges
    const sanitizedEdges = edges.map(({ id, source, target, animated }) => ({
      id,
      source,
      target,
      animated,
    }));

    const result = await UpdateAgentDetail({
      id: agentDetails._id,
      edges: sanitizedEdges,
      nodes: sanitizedNodes,
    });

    console.log("Saved successfully", result);
    
  } catch (error) {
    console.error("Error saving workflow:", error);
  }
};

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect: OnConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-[#f9fafb]">
      <Header agentDetails = {agentDetails} />
      <main className="flex-1 relative p-4 lg:p-6">
        <div className="relative w-full h-full bg-white rounded-[32px] border-4 border-slate-200/70 overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background variant={BackgroundVariant.Lines} color="#f1f5f9" />
            <Controls />
            <Panel position="top-left">
              <AgentToolsPanel />
            </Panel>
            <Panel position="bottom-center">
              <Button
                onClick={SaveNodesAndEdges}
              >
                 <Save/>Save
              </Button>
            </Panel>
          </ReactFlow>
        </div>
      </main>
    </div>
  );
}