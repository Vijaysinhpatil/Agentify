"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Edge,
  Node,
  ReactFlow,
} from "@xyflow/react";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { RefreshCwOffIcon } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Agent } from "@/types/AgentTypes";

import Header from "../../_components/Header";
import { nodeTypes } from "../../_customNodes/nodeTypes";

import "@xyflow/react/dist/style.css";

type AgentNodeData = {
  label?: string;
  settings?: Record<string, unknown>;
};

type WorkflowNext =
  | string
  | string[]
  | {
      if: string | null;
      else: string | null;
    }
  | null;

type WorkflowNodeConfig = {
  id: string;
  type: string;
  label: string;
  settings: Record<string, unknown>;
  next: WorkflowNext;
};

type WorkflowConfig = {
  startNode: string | null;
  flow: WorkflowNodeConfig[];
};

function PreviewAgent() {
  const convex = useConvex();
  const { agentId } = useParams<{ agentId: string }>();
  const [agentDetail, setAgentDetail] = useState<Agent | undefined>();
  const [flowConfig, setFlowConfig] = useState<WorkflowConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const updateAgentToolConfig = useMutation(api.agent.updateAgentToolConfig);

  const getAgentDetails = useCallback(async () => {
    if (!agentId) {
      return;
    }

    const result = await convex.query(api.agent.GetAgentById, {
      agentId,
    });
    const agent = Array.isArray(result) ? result[0] : result;
    setAgentDetail(agent);
  }, [agentId, convex]);

  useEffect(() => {
    void getAgentDetails();
  }, [getAgentDetails]);

  const generateWorkflow = useCallback(() => {
    const nodes = Array.isArray(agentDetail?.nodes)
      ? (agentDetail.nodes as Node<AgentNodeData>[])
      : [];
    const edges = Array.isArray(agentDetail?.edges)
      ? (agentDetail.edges as Edge[])
      : [];

    if (nodes.length === 0) {
      setFlowConfig(null);
      return;
    }

    const edgeMap = edges.reduce<Record<string, Edge[]>>((acc, edge) => {
      if (!acc[edge.source]) {
        acc[edge.source] = [];
      }

      acc[edge.source].push(edge);
      return acc;
    }, {});

    const flow = nodes.map((node): WorkflowNodeConfig => {
      const connectedEdges = edgeMap[node.id] ?? [];
      const nodeType = node.type ?? "UnknownNode";
      let next: WorkflowNext = null;

      switch (nodeType) {
        case "IfElseNode": {
          const ifEdge = connectedEdges.find((edge) => edge.sourceHandle === "if");
          const elseEdge = connectedEdges.find(
            (edge) => edge.sourceHandle === "else"
          );

          next = {
            if: ifEdge?.target ?? null,
            else: elseEdge?.target ?? null,
          };
          break;
        }

        case "AgentNode":
        case "ApiNode":
        case "UserApprovalNode":
        case "StartNode":
        default: {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          } else if (connectedEdges.length > 1) {
            next = connectedEdges.map((edge) => edge.target);
          }

          if (nodeType === "EndNode") {
            next = null;
          }
          break;
        }
      }

      return {
        id: node.id,
        type: nodeType,
        label: node.data?.label ?? nodeType,
        settings: node.data?.settings ?? {},
        next,
      };
    });

    const startNode = nodes.find((node) => node.type === "StartNode");
    const config: WorkflowConfig = {
      startNode: startNode?.id ?? null,
      flow,
    };

    console.log("Generated workflow config:", config);
    setFlowConfig(config);
  }, [agentDetail]);

  useEffect(() => {
    generateWorkflow();
  }, [generateWorkflow]);

  const generateAgentToolConfig = async () => {
    if (!flowConfig) {
      return;
    }
    if (!agentDetail?._id) {
      console.error("generateAgentToolConfig failed: missing agent id");
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post("/api/generate-agent-tool-config", {
        jsonConfig: flowConfig,
      });
      console.log("Generated agent tool config:", result.data);
      console.log("Agents array:", result.data?.agents ?? []);
      console.log("Tools array:", result.data?.tools ?? []);

      await updateAgentToolConfig({
        id: agentDetail._id,
        agentToolConfig: result.data,
      });
      getAgentDetails();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "generateAgentToolConfig failed:",
          error.response?.data ?? error.message
        );
      } else {
        console.error("generateAgentToolConfig failed:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const previewNodes = Array.isArray(agentDetail?.nodes)
    ? (agentDetail.nodes as Node[])
    : [];
  const previewEdges = Array.isArray(agentDetail?.edges)
    ? (agentDetail.edges as Edge[])
    : [];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-50 font-sans text-zinc-900">
      <Header previewHeader={true} agentDetails={agentDetail} />

      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm">
          {!agentDetail ? (
            <div className="flex h-full w-full animate-pulse flex-col justify-between p-8">
              <div className="flex w-full items-center justify-between">
                <div className="h-7 w-28 rounded-full bg-zinc-200/80" />
                <div className="h-8 w-24 rounded-lg bg-zinc-200/80" />
              </div>
              <div className="flex flex-1 items-center justify-center gap-12">
                <div className="h-20 w-36 rounded-xl border border-zinc-200/40 bg-zinc-100" />
                <div className="h-0.5 w-12 bg-zinc-200" />
                <div className="h-24 w-40 rounded-xl border border-zinc-200/40 bg-zinc-100" />
                <div className="h-0.5 w-12 bg-zinc-200" />
                <div className="h-20 w-36 rounded-xl border border-zinc-200/40 bg-zinc-100" />
              </div>
              <div className="h-4 w-32 self-start rounded-md bg-zinc-100" />
            </div>
          ) : (
            <>
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-zinc-200/60 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-md">
                <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                <span className="text-xs font-medium tracking-wide text-zinc-500">
                  Agent Flow
                </span>
              </div>

              <div className="h-full w-full">
                <ReactFlow
                  nodes={previewNodes}
                  edges={previewEdges}
                  nodeTypes={nodeTypes}
                  fitView
                  minZoom={0.2}
                  maxZoom={1.5}
                >
                  <Background
                    id="small-grid"
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="#e4e4e7"
                  />
                  <Background
                    id="large-grid"
                    variant={BackgroundVariant.Lines}
                    gap={100}
                    size={1}
                    color="#f4f4f5"
                  />
                </ReactFlow>
              </div>
            </>
          )}
        </div>

        <div className="flex w-96 flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm">
          {!agentDetail ? (
            <div className="flex h-full w-full animate-pulse flex-col justify-between p-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="h-4 w-24 rounded bg-zinc-200" />
                <div className="h-4 w-8 rounded bg-zinc-100" />
              </div>
              <div className="my-4 flex flex-1 flex-col justify-end gap-3 px-2">
                <div className="h-8 w-2/3 self-start rounded-lg bg-zinc-100" />
                <div className="h-12 w-3/4 self-end rounded-lg bg-zinc-200/60" />
                <div className="h-8 w-1/2 self-start rounded-lg bg-zinc-100" />
              </div>
              <div className="h-10 w-full rounded-lg border border-zinc-200/60 bg-zinc-100" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 p-4">
                <h3 className="text-sm font-semibold tracking-tight text-zinc-700">
                  Test Agent
                </h3>
                <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-500">
                  v1.0
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-end p-4">
                <div className="m-2 flex flex-1 items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50/50 text-xs font-medium text-zinc-400">
                  CHAT UI PLACEHOLDER
                </div>

                <div className="mt-2 p-2">
                  <div className="flex h-10 w-full select-none items-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-xs text-zinc-400">
                    Type a message to test...
                  </div>
                  <div>
                    {agentDetail && !agentDetail.agentToolConfig && (
                      <Button
                        onClick={generateAgentToolConfig}
                        disabled={loading || !flowConfig}
                      >
                        <RefreshCwOffIcon
                          className={loading ? "animate-spin" : ""}
                        />
                        Reboot Agent
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreviewAgent;
