"use client";

import React, { useMemo } from "react";

// ============================================================================
// Types & Interfaces
// ============================================================================

type Props = {
  code: string;
};

type AgentConfig = {
  id: string;
  includeHistory?: boolean;
  name: string;
  output?: {
    format?: string;
    instruction?: string[];
    schema?: string;
    tools?: string[];
  };
};

type ToolConfig = {
  apiKey?: string;
  assignedAgent?: string;
  description?: string;
  id: string;
  includeApiKey?: boolean;
  method?: string;
  name: string;
  parameters?: Record<string, string>;
  url?: string;
};

type RuntimeConfig = {
  agents?: AgentConfig[];
  primaryAgentName?: string;
  systemPrompt?: string;
  tools?: ToolConfig[];
};

// ============================================================================
// Helper Utilities
// ============================================================================

function parseRuntimeConfig(code: string): RuntimeConfig | null {
  try {
    const parsed = JSON.parse(code);
    return parsed && typeof parsed === "object" ? (parsed as RuntimeConfig) : null;
  } catch {
    return null;
  }
}

function stringifyLiteral(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

// ============================================================================
// Snippet Builder Logic
// ============================================================================

function buildProductionSnippet(code: string): string {
  const runtimeConfig = parseRuntimeConfig(code);

  if (!runtimeConfig) {
    return `// Invalid runtime config
// The saved config could not be parsed as JSON.

export const agentRuntimeConfig = ${code || "{}"};
`;
  }

  const primaryAgent =
    runtimeConfig.agents?.find((agent) => agent.name === runtimeConfig.primaryAgentName) ??
    runtimeConfig.agents?.[0] ??
    null;

  const toolIds = new Set(primaryAgent?.output?.tools ?? []);
  const scopedTools =
    runtimeConfig.tools?.filter((tool) => toolIds.size === 0 || toolIds.has(tool.id)) ?? [];

  const schemaComment =
    primaryAgent?.output?.format === "advanced" && primaryAgent.output.schema
      ? `/**
 * Expected structured output schema configured in the builder:
 * ${primaryAgent.output.schema.replace(/\r?\n/g, "\n * ")}
 */`
      : `// Agent returns plain text output by default.`;

  return `// agent-runtime.ts
// Production-oriented integration snippet generated from Agentify preview.

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type AgentChatRequest = {
  input: string;
  history?: ChatTurn[];
  conversationId?: string;
};

export type AgentChatResponse = {
  conversationId: string;
  message: string;
  primaryAgent: string | null;
  toolResults: Array<{
    name: string;
    url: string;
    status: number;
    ok: boolean;
    data: unknown;
  }>;
  warning?: string;
};

type AgentTool = {
  id: string;
  name: string;
  description: string;
  method: string;
  url: string;
  includeApiKey: boolean;
  apiKey: string;
  parameters: Record<string, string>;
  assignedAgent: string;
};

type RuntimeAgent = {
  id: string;
  name: string;
  includeHistory: boolean;
  output: {
    format: "text" | "advanced";
    schema: string;
    instruction: string[];
    tools: string[];
  };
};

export type AgentRuntimeConfig = {
  systemPrompt: string;
  primaryAgentName: string;
  agents: RuntimeAgent[];
  tools: AgentTool[];
};

export const agentRuntimeConfig: AgentRuntimeConfig = ${stringifyLiteral(runtimeConfig)};

export const primaryAgentName = ${JSON.stringify(
    primaryAgent?.name ?? runtimeConfig.primaryAgentName ?? "Agent"
  )};

export const allowedTools = ${stringifyLiteral(scopedTools)};

${schemaComment}

export async function chatWithAgent(
  request: AgentChatRequest
): Promise<AgentChatResponse> {
  const response = await fetch("/api/agent-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: request.input,
      history: request.history ?? [],
      conversationId: request.conversationId,
      agents: agentRuntimeConfig.agents,
      tools: agentRuntimeConfig.tools,
      primaryAgentName: agentRuntimeConfig.primaryAgentName,
      systemPrompt: agentRuntimeConfig.systemPrompt,
    }),
  });

  const payload = (await response.json()) as
    | AgentChatResponse
    | { error?: string; details?: string };

  if (!response.ok) {
    const message =
      "error" in payload && payload.error
        ? payload.error
        : "Agent chat request failed.";
    throw new Error(message);
  }

  return payload as AgentChatResponse;
}

// Example usage:
// const result = await chatWithAgent({
//   input: "Tell me today's weather in London",
//   history: [{ role: "user", content: "Hi" }],
// });
// console.log(result.message);
`;
}

// ============================================================================
// Main Component
// ============================================================================

export default function CodeView({ code }: Props) {
  const productionSnippet = useMemo(() => buildProductionSnippet(code), [code]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
      {/* Header */}
      <div className="flex shrink-0 items-center border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Production Integration Snippet
        </span>
      </div>

      {/* Code Display */}
      <pre className="min-h-0 flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-zinc-700 selection:bg-zinc-200 dark:text-zinc-300 dark:selection:bg-zinc-800">
        <code>{productionSnippet}</code>
      </pre>
    </div>
  );
}