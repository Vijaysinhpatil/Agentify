"use client";

import React, { useContext, useMemo, useState } from "react";
import { Check, Copy, MessageSquareCode, Radio, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { UserDetailContext } from "@/app/context/userDetailContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Agent } from "@/types/AgentTypes";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentDetails?: Agent | null;
};

type SnippetKey =
  | "complete"
  | "sdkRoute"
  | "chatRoute"
  | "request"
  | "response";

function PublishCodeDialogue({ open, onOpenChange, agentDetails }: Props) {
  const { userDetails } = useContext(UserDetailContext);
  const [copiedKey, setCopiedKey] = useState<SnippetKey | null>(null);

  const agentId = agentDetails?.agentId ?? "your-agent-id";
  const userId = userDetails?._id ?? "your-user-id";

  const completeSnippet = useMemo(() => {
    return `"use client";

import { useEffect, useState } from "react";

type AgentSession = {
  agentDetail: {
    _id: string;
    agentId: string;
    name: string;
    agentToolConfig: {
      agents: unknown[];
      tools: unknown[];
      primaryAgentName: string;
      systemPrompt: string;
    };
  };
  conversationId: string;
};

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

async function initializeAgentSession(): Promise<AgentSession> {
  const response = await fetch("/api/agent-sdk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agentId: "${agentId}",
      userId: "${userId}",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to initialize agent session");
  }

  return response.json();
}

async function sendAgentMessage(
  session: AgentSession,
  input: string,
  history: ChatTurn[] = []
) {
  const response = await fetch("/api/agent-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input,
      history,
      conversationId: session.conversationId,
      agents: session.agentDetail.agentToolConfig.agents,
      tools: session.agentDetail.agentToolConfig.tools,
      primaryAgentName: session.agentDetail.agentToolConfig.primaryAgentName,
      systemPrompt: session.agentDetail.agentToolConfig.systemPrompt,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error ?? "Failed to send message to agent");
  }

  return response.json();
}

export default function ${formatComponentName(agentDetails?.name)}Chat() {
  const [session, setSession] = useState<any>(null);
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeAgentSession()
      .then(setSession)
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSend = async () => {
    if (!session || !input.trim()) return;

    const nextHistory = [...history, { role: "user", content: input }];
    setHistory(nextHistory);
    setLoading(true);

    try {
      const result = await sendAgentMessage(session, input, history);
      setHistory([
        ...nextHistory,
        {
          role: "assistant",
          content: result.message ?? "No response received.",
        },
      ]);
      setInput("");
    } catch (error) {
      console.error(error);

      setHistory([
        ...nextHistory,
        {
          role: "assistant",
          content: "The agent request failed. Check your API routes and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-900">
        ${agentDetails?.name ?? "Your Agent"}
      </h2>

      <div className="space-y-2.5">
        {!session && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Initializing agent session...
          </div>
        )}

        {history.map((message, index) => (
          <div key={index} className="rounded-lg bg-zinc-50 border border-zinc-100 p-3 text-sm text-zinc-700">
            <strong className="text-zinc-900">{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask the agent something..."
          className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
        <button
          onClick={handleSend}
          disabled={!session || loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}`;
  }, [agentDetails?.name, agentId, userId]);

  const sdkRouteSnippet = useMemo(() => {
    return `import { NextRequest, NextResponse } from "next/server";

type AgentToolConfig = {
  agents: unknown[];
  tools: unknown[];
  primaryAgentName: string;
  systemPrompt: string;
};

type AgentRecord = {
  _id: string;
  agentId: string;
  name: string;
  agentToolConfig: AgentToolConfig;
};

type ConversationRecord = {
  conversationId: string;
};

type AgentSdkRequest = {
  agentId?: unknown;
  userId?: unknown;
};

function getRequestString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

async function loadAgentByPublicId(agentId: string): Promise<AgentRecord | null> {
  // TODO: Replace with your database lookup.
  // Example: return await db.agents.findUnique({ where: { agentId } });
  return {
    _id: "agent-db-id",
    agentId,
    name: "${agentDetails?.name ?? "Your Agent"}",
    agentToolConfig: {
      agents: [],
      tools: [],
      primaryAgentName: "",
      systemPrompt: "",
    },
  };
}

async function findConversation(
  agentDbId: string,
  userId: string
): Promise<ConversationRecord | null> {
  // TODO: Replace with your conversation lookup.
  return null;
}

async function createConversation(
  agentDbId: string,
  userId: string,
  conversationId: string
): Promise<ConversationRecord> {
  // TODO: Persist this conversation in your database.
  return { conversationId };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AgentSdkRequest;
    const agentId = getRequestString(body.agentId);
    const userId = getRequestString(body.userId);

    if (!agentId || !userId) {
      return NextResponse.json(
        { error: "Both agentId and userId are required." },
        { status: 400 }
      );
    }

    const agentDetail = await loadAgentByPublicId(agentId);

    if (!agentDetail) {
      return NextResponse.json(
        { error: "Agent not found." },
        { status: 404 }
      );
    }

    const existingConversation = await findConversation(agentDetail._id, userId);
    let conversationId = existingConversation?.conversationId ?? null;

    if (!conversationId) {
      conversationId = crypto.randomUUID();
      await createConversation(agentDetail._id, userId, conversationId);
    }

    return NextResponse.json(
      {
        agentDetail,
        conversationId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("agent-sdk failed", error);

    return NextResponse.json(
      {
        error: "Failed to initialize agent SDK.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}`;
  }, [agentDetails?.name]);

  const chatRouteSnippet = useMemo(() => {
    return `import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AgentConfig = {
  id: string;
  name: string;
  includeHistory?: boolean;
  output?: {
    format?: string;
    schema?: string;
    instruction?: string[];
    tools?: string[];
  };
};

type ToolConfig = {
  id: string;
  name: string;
  description?: string;
  method?: string;
  url?: string;
  includeApiKey?: boolean;
  apiKey?: string;
  parameters?: Record<string, string>;
};

type ChatTurn = {
  role: "assistant" | "user";
  content: string;
};

type ChatRequest = {
  input?: unknown;
  tools?: unknown;
  agents?: unknown;
  history?: unknown;
  conversationId?: unknown;
  primaryAgentName?: unknown;
  systemPrompt?: unknown;
};

function normalizeAgents(input: unknown): AgentConfig[] {
  return Array.isArray(input) ? (input as AgentConfig[]) : [];
}

function normalizeTools(input: unknown): ToolConfig[] {
  return Array.isArray(input) ? (input as ToolConfig[]) : [];
}

function normalizeHistory(input: unknown): ChatTurn[] {
  if (!Array.isArray(input)) return [];

  return input.filter(
    (item): item is ChatTurn =>
      Boolean(
        item &&
          typeof item === "object" &&
          "role" in item &&
          "content" in item &&
          ((item as ChatTurn).role === "user" ||
            (item as ChatTurn).role === "assistant") &&
          typeof (item as ChatTurn).content === "string"
      )
  );
}

function pickPrimaryAgent(
  agents: AgentConfig[],
  primaryAgentName: unknown
) {
  if (typeof primaryAgentName === "string" && primaryAgentName.trim()) {
    const matched = agents.find((agent) => agent.name === primaryAgentName.trim());
    if (matched) return matched;
  }

  return agents[0] ?? null;
}

async function executeHttpTool(tool: ToolConfig, args: Record<string, unknown>) {
  const method = (tool.method ?? "GET").toUpperCase();
  const url = new URL(tool.url ?? "");
  const headers = new Headers();

  if (tool.includeApiKey && tool.apiKey) {
    headers.set("Authorization", \`Bearer \${tool.apiKey}\`);
    headers.set("X-API-Key", tool.apiKey);
  }

  let body: string | undefined;

  if (method === "GET" || method === "DELETE") {
    Object.entries(args).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  } else {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(args);
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body,
  });

  const contentType = response.headers.get("content-type") ?? "text/plain";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  return {
    name: tool.name,
    ok: response.ok,
    status: response.status,
    url: url.toString(),
    data,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    const input = typeof body.input === "string" ? body.input.trim() : "";
    const agents = normalizeAgents(body.agents);
    const tools = normalizeTools(body.tools);
    const history = normalizeHistory(body.history);
    const conversationId =
      typeof body.conversationId === "string" && body.conversationId.trim()
        ? body.conversationId
        : crypto.randomUUID();

    if (!input) {
      return NextResponse.json({ error: "Missing input in request body" }, { status: 400 });
    }

    const primaryAgent = pickPrimaryAgent(agents, body.primaryAgentName);
    const systemPrompt =
      typeof body.systemPrompt === "string" && body.systemPrompt.trim()
        ? body.systemPrompt.trim()
        : "You are a helpful AI agent.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        { role: "user", content: input },
      ],
    });

    const message = completion.choices[0]?.message?.content ?? "No response received.";

    // Optional: execute runtime tools after model planning.
    // Example:
    // const toolResult = await executeHttpTool(tools[0], { q: input });

    return NextResponse.json({
      conversationId,
      message,
      primaryAgent: primaryAgent?.name ?? null,
      toolResults: [],
    });
  } catch (error) {
    console.error("agent-chat failed", error);

    return NextResponse.json(
      {
        error: "Failed to process agent chat",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}`;
  }, []);

  const requestBody = useMemo(() => {
    return JSON.stringify(
      {
        agentId,
        userId,
      },
      null,
      2
    );
  }, [agentId, userId]);

  const responseBody = useMemo(() => {
    return JSON.stringify(
      {
        agentDetail: {
          _id: agentDetails?._id ?? "agent_table_id",
          agentId: agentDetails?.agentId ?? "agent-public-id",
          name: agentDetails?.name ?? "Support Agent",
          agentToolConfig: agentDetails?.agentToolConfig ?? {
            agents: [],
            tools: [],
            primaryAgentName: "",
            systemPrompt: "",
          },
        },
        conversationId: "generated-conversation-id",
      },
      null,
      2
    );
  }, [agentDetails]);

  const handleCopy = async (value: string, key: SnippetKey) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      toast.success("Snippet copied");

      setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Could not copy");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full overflow-hidden rounded-xl border border-zinc-200 bg-white p-0 shadow-lg sm:max-w-6xl">
        <div className="border-b border-zinc-100 bg-zinc-50/50 px-6 py-5">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-zinc-100 p-2 text-zinc-700 border border-zinc-200/60">
                <MessageSquareCode className="h-5 w-5" />
              </div>

              <div className="space-y-1">
                <DialogTitle className="text-lg font-medium text-zinc-900 tracking-tight">
                  Publish Agent Integration
                </DialogTitle>
                <DialogDescription className="text-sm text-zinc-500">
                  Copy frontend and backend code to move this agent into another application.
                </DialogDescription>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 hover:bg-zinc-100 border border-transparent font-medium rounded-md px-2 py-0.5 text-xs">
                <Sparkles className="mr-1.5 h-3 w-3 text-zinc-500" />
                Agent: {agentDetails?.name ?? "Unknown"}
              </Badge>

              <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 hover:bg-zinc-100 border border-transparent font-medium rounded-md px-2 py-0.5 text-xs">
                <Radio className="mr-1.5 h-3 w-3 text-zinc-500" />
                Route: /api/agent-sdk
              </Badge>

              <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 hover:bg-zinc-100 border border-transparent font-medium rounded-md px-2 py-0.5 text-xs">
                Chat route: /api/agent-chat
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="h-[65vh] px-6 py-4">
          <div className="space-y-6 pr-2">
            <CodeBlock
              label="Complete React Component"
              description="Copy this single file into your app. It already includes the session helpers and chat UI."
              value={completeSnippet}
              copied={copiedKey === "complete"}
              onCopy={() => handleCopy(completeSnippet, "complete")}
            />

            <CodeBlock
              label="Backend Session Route"
              description="Create /api/agent-sdk with these placeholders wired to your own database."
              value={sdkRouteSnippet}
              copied={copiedKey === "sdkRoute"}
              onCopy={() => handleCopy(sdkRouteSnippet, "sdkRoute")}
            />

            <CodeBlock
              label="Backend Chat Route"
              description="Create /api/agent-chat to receive messages and return agent responses."
              value={chatRouteSnippet}
              copied={copiedKey === "chatRoute"}
              onCopy={() => handleCopy(chatRouteSnippet, "chatRoute")}
            />

            <CodeBlock
              label="Session Request Body"
              description="What your frontend sends to /api/agent-sdk."
              value={requestBody}
              copied={copiedKey === "request"}
              onCopy={() => handleCopy(requestBody, "request")}
            />

            <CodeBlock
              label="Session Response Body"
              description="What comes back before you start chatting."
              value={responseBody}
              copied={copiedKey === "response"}
              onCopy={() => handleCopy(responseBody, "response")}
            />
          </div>
        </ScrollArea>

        <DialogFooter className="border-t border-zinc-100 bg-zinc-50/50 px-6 py-3.5">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="rounded-lg border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 h-9 px-4 text-sm font-medium transition-colors"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CodeBlock({
  label,
  description,
  value,
  copied,
  onCopy,
}: {
  label: string;
  description: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold tracking-wider uppercase text-zinc-400">
            {label}
          </p>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>

        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onCopy}
          className="h-8 rounded-lg border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 px-3 text-xs font-medium transition-all"
        >
          {copied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5 text-zinc-400" />
              Copy
            </>
          )}
        </Button>
      </div>

      <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-900 shadow-sm transition-all">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-50" />
        
        <pre className="max-h-[380px] overflow-auto p-4 font-mono text-xs leading-6 text-zinc-300 scrollbar-thin scrollbar-thumb-zinc-700 selection:bg-zinc-700 selection:text-white">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}

function formatComponentName(name?: string) {
  const fallback = "Agent";
  const source = name?.trim() || fallback;

  return source
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export default PublishCodeDialogue;
