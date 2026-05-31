"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
import AgentToolsPanel from "../_components/AgentToolsPanel";
import SettingPanel from "../_components/SettingPanel";
import { nodeTypes } from "../_customNodes/nodeTypes";

import { WorkflowContext } from "@/app/context/WorkflowContext";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Agent } from "@/types/AgentTypes";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AgentBuilder() {
  const workflow = useContext(WorkflowContext);

  const { selectedNode, setSelectedNode } = workflow;

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agentDetails, setAgentDetails] = useState<Agent>();

  const UpdateAgentDetail = useMutation(api.agent.updateAgentDetails);
  const convex = useConvex();
  const { agentId } = useParams();
  const defaultStartNode: Node[] = useMemo(
    () => [
      {
        id: "start",
        position: { x: 0, y: 0 },
        data: { label: "Start" },
        type: "StartNode",
      },
    ],
    []
  );

  const normalizeNodeType = (type: string, id?: string) => {
    if (type === "startNode" || id === "start") return "StartNode";
    if (type === "endNode" || id === "end") return "EndNode";
    if (type === "agentNode") return "AgentNode";
    if (type === "ifElseNode") return "IfElseNode";
    if (type === "whileNode") return "WhileNode";
    if (type === "apiNode" || type === "Api") return "ApiNode";

    if (
      type === "ApprovalNode" ||
      type === "userApprovalNode" ||
      type === "UserApprovalNode" ||
      type === "userApproval" ||
      type === "UserApproval" ||
      type === "userApprovelNode" ||
      type === "UserApprovelNode"
    ) {
      return "UserApprovalNode";
    }

    return type;
  };

  const GetAgentDetails = useCallback(async () => {
    try {
      setLoading(true);

      const result = await convex.query(api.agent.GetAgentById, {
        agentId: agentId as string,
      });

      const agent = Array.isArray(result) ? result[0] : result;
      setAgentDetails(agent);

      if (agent?.nodes && Array.isArray(agent.nodes)) {
        const fixedNodes = agent.nodes.map((node: Node) => ({
          ...node,
          type: normalizeNodeType(node.type as string, node.id),
        }));

        setNodes(fixedNodes);
      } else {
        setNodes(defaultStartNode);
      }

      if (agent?.edges && Array.isArray(agent.edges)) {
        setEdges(agent.edges);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load workflow");
    } finally {
      setLoading(false);
    }
  }, [agentId, convex, defaultStartNode]);

  useEffect(() => {
    setMounted(true);

    if (agentId) {
      GetAgentDetails();
    }
  }, [agentId, GetAgentDetails]);

  const SaveNodesAndEdges = async () => {
    try {
      if (!agentDetails?._id) {
        toast.error("Agent identification missing");
        return;
      }

      const sanitizedNodes = nodes.map(({ id, type, position, data }) => ({
        id,
        type,
        position,
        data: {
          ...data,
        },
      }));

      const sanitizedEdges = edges.map(
        ({ id, source, target, sourceHandle, targetHandle, animated }) => ({
          id,
          source,
          target,
          sourceHandle,
          targetHandle,
          animated,
        })
      );

      await UpdateAgentDetail({
        id: agentDetails._id,
        edges: sanitizedEdges,
        nodes: sanitizedNodes,
      });

      toast.success("Workflow saved", {
        description: "All connections and node positions are synchronized.",
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        className: "bg-white border-emerald-100 shadow-2xl py-4 rounded-[16px]",
        descriptionClassName: "text-zinc-500 font-medium",
      });
    } catch (error) {
      console.error("Save error:", error);

      toast.error("Failed to save progress", {
        icon: <AlertCircle className="h-5 w-5 text-rose-500" />,
        className: "bg-white border-rose-100 shadow-2xl py-4 rounded-[16px]",
      });
    }
  };

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect: OnConnect = useCallback((params: Connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          animated: true,
          type: "smoothstep",
        },
        eds
      )
    );
  }, []);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      console.log("Selected Node:", node);
    },
    [setSelectedNode]
  );

  if (!mounted || loading) {
    return (
      <div className="flex h-screen flex-col bg-[#f8fafc]">
        <header className="flex h-14 w-full items-center justify-between border-b border-zinc-200 bg-white px-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-32 animate-pulse bg-slate-200" />
              <Skeleton className="h-3 w-20 animate-pulse bg-slate-200 opacity-60" />
            </div>
          </div>

          <div className="flex gap-3">
            <Skeleton className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
            <Skeleton className="h-9 w-24 animate-pulse rounded-lg bg-slate-200" />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <div className="flex h-full w-full items-center justify-center rounded-[32px] border-4 border-slate-100 bg-slate-50">
            <Skeleton className="h-[98%] w-[98%] animate-pulse rounded-[26px] bg-slate-200" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#f8fafc]">
      <Header agentDetails={agentDetails} />

      <main className="relative flex-1 p-4 lg:p-6">
        <div className="relative h-full w-full overflow-hidden rounded-[32px] border-4 border-slate-200/70 bg-slate-50 shadow-sm">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background
              id="small-grid"
              variant={BackgroundVariant.Lines}
              gap={22}
              size={1}
              color="#e2e8f0"
            />

            <Background
              id="large-grid"
              variant={BackgroundVariant.Lines}
              gap={110}
              size={1.4}
              color="#cbd5e1"
            />

            <Controls />

            <Panel position="top-left">
              <AgentToolsPanel setNodes={setNodes} />
            </Panel>

            <Panel position="top-right" >
              <SettingPanel
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
                setNodes={setNodes}
              />
            </Panel>

            <Panel position="bottom-center">
              <Button
                onClick={SaveNodesAndEdges}
                className="mb-4 flex items-center gap-2.5 rounded-full bg-zinc-900 px-8 py-6 text-sm font-bold text-white shadow-2xl transition-all hover:bg-zinc-800"
              >
                <Save className="h-4 w-4" />
                Save Progress
              </Button>
            </Panel>
          </ReactFlow>
        </div>
      </main>
    </div>
  );
}
