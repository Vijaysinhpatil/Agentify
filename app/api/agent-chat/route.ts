import { NextRequest, NextResponse } from "next/server";

import { openRouter } from "@/config/OpenRouterModel";

type AgentConfig = {
  id: string;
  name: string;
  includeHistory: boolean;
  output: {
    format?: string;
    schema?: string;
    tools: string[];
    instruction: string[];
  };
};

type ToolConfig = {
  id: string;
  name: string;
  description: string;
  method: string;
  url: string;
  includeApiKey: boolean;
  apiKey: string;
  parameters: Record<string, string>;
  usage: string[];
  assignedAgent: string;
};

type ChatRequest = {
  input?: unknown;
  tools?: unknown;
  agents?: unknown;
  history?: unknown;
  conversationalId?: unknown;
  conversationId?: unknown;
  primaryAgentName?: unknown;
  systemPrompt?: unknown;
};

type ChatHistoryMessage = {
  role: "assistant" | "user";
  content: string;
};

type ExecutedToolResult = {
  args: Record<string, unknown>;
  contentType: string;
  name: string;
  ok: boolean;
  status: number;
  url: string;
  data: unknown;
};

function normalizeAgents(input: unknown): AgentConfig[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.map((agent, index) => {
    const record =
      agent && typeof agent === "object"
        ? (agent as Record<string, unknown>)
        : {};
    const output =
      record.output && typeof record.output === "object"
        ? (record.output as Record<string, unknown>)
        : {};

    return {
      id:
        typeof record.id === "string" && record.id.trim()
          ? record.id
          : `agent-${index + 1}`,
      name:
        typeof record.name === "string" && record.name.trim()
          ? record.name
          : `Agent ${index + 1}`,
      includeHistory: Boolean(record.includeHistory),
      output: {
        format: typeof output.format === "string" ? output.format : "text",
        schema: typeof output.schema === "string" ? output.schema : "",
        tools: Array.isArray(output.tools)
          ? output.tools.filter(
              (toolId): toolId is string => typeof toolId === "string"
            )
          : [],
        instruction: Array.isArray(output.instruction)
          ? output.instruction.filter(
              (step): step is string => typeof step === "string"
            )
          : [],
      },
    };
  });
}

function normalizeTools(input: unknown): ToolConfig[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.map((tool, index) => {
    const record =
      tool && typeof tool === "object" ? (tool as Record<string, unknown>) : {};
    const parameters =
      record.parameters && typeof record.parameters === "object"
        ? (record.parameters as Record<string, unknown>)
        : {};

    return {
      id:
        typeof record.id === "string" && record.id.trim()
          ? record.id
          : `tool-${index + 1}`,
      name:
        typeof record.name === "string" && record.name.trim()
          ? record.name
          : `Tool ${index + 1}`,
      description:
        typeof record.description === "string" ? record.description : "",
      method:
        typeof record.method === "string" && record.method.trim()
          ? record.method.toUpperCase()
          : "GET",
      url: typeof record.url === "string" ? record.url : "",
      includeApiKey: Boolean(record.includeApiKey),
      apiKey: typeof record.apiKey === "string" ? record.apiKey : "",
      parameters: Object.fromEntries(
        Object.entries(parameters)
          .filter(([key]) => typeof key === "string" && key.trim().length > 0)
          .map(([key, value]) => [key, typeof value === "string" ? value : "string"])
      ),
      usage: Array.isArray(record.usage)
        ? record.usage.filter((step): step is string => typeof step === "string")
        : [],
      assignedAgent:
        typeof record.assignedAgent === "string" ? record.assignedAgent : "",
    };
  });
}

function normalizeHistory(input: unknown): ChatHistoryMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      const record =
        item && typeof item === "object" ? (item as Record<string, unknown>) : {};
      const role = record.role;
      const content = record.content;

      if (
        (role === "assistant" || role === "user") &&
        typeof content === "string" &&
        content.trim()
      ) {
        return {
          role,
          content: content.trim(),
        } satisfies ChatHistoryMessage;
      }

      return null;
    })
    .filter((item): item is ChatHistoryMessage => item !== null);
}

function pickPrimaryAgent(
  agents: AgentConfig[],
  primaryAgentName: unknown
): AgentConfig | null {
  if (typeof primaryAgentName === "string" && primaryAgentName.trim()) {
    const byName = agents.find((agent) => agent.name === primaryAgentName.trim());
    if (byName) {
      return byName;
    }
  }

  return agents[0] ?? null;
}

function buildSystemPrompt(
  primaryAgent: AgentConfig | null,
  tools: ToolConfig[],
  systemPrompt: unknown
) {
  const toolCatalog = tools
    .map((tool) => {
      const usageText =
        tool.usage.length > 0 ? `Usage: ${tool.usage.join(" | ")}` : "Usage: none";
      const assignedText = tool.assignedAgent
        ? `Assigned agent: ${tool.assignedAgent}`
        : "Assigned agent: any";

      return `- ${tool.name} [${tool.id}] (${tool.method} ${tool.url})
  Description: ${tool.description || "No description provided"}
  ${assignedText}
  ${usageText}`;
    })
    .join("\n");

  const basePrompt =
    typeof systemPrompt === "string" && systemPrompt.trim()
      ? systemPrompt.trim()
      : "You are an AI agent inside an agent builder preview. Be concise, practical, and only call tools when they help answer the user's request.";

  const instructionText =
    primaryAgent?.output.instruction.join("\n") || "No agent-specific steps provided.";
  const outputFormat = primaryAgent?.output.format === "advanced" ? "advanced" : "text";
  const outputSchema = primaryAgent?.output.schema?.trim() ?? "";

  const allowedToolIds = new Set(primaryAgent?.output.tools ?? []);
  const allowedTools = tools.filter(
    (tool) => allowedToolIds.size === 0 || allowedToolIds.has(tool.id)
  );

  return {
    prompt: `${basePrompt}

Primary agent: ${primaryAgent?.name ?? "Unknown"}
Include chat history: ${primaryAgent?.includeHistory ? "yes" : "no"}

Agent instructions:
${instructionText}

Response format: ${outputFormat}
${outputSchema ? `Response schema:\n${outputSchema}` : ""}

Allowed tools:
${allowedTools.length > 0 ? toolCatalog : "No tools are configured."}

Rules:
- Use a tool only when the user request requires external data or an API action.
- If no tool is needed, answer directly.
- When a tool fails, explain the failure plainly and continue if possible.
- Do not invent tool results.`,
    allowedTools,
    outputFormat,
    outputSchema,
  };
}

function buildToolDefinitions(tools: ToolConfig[]) {
  return tools
    .filter((tool) => tool.url.trim())
    .map((tool) => ({
      type: "function" as const,
      function: {
        name: tool.id,
        description: tool.description || `Call ${tool.name}`,
        parameters: {
          type: "object",
          properties: {
            input: {
              type: "string",
              description:
                "User request or context to pass to the tool when relevant.",
            },
            ...Object.fromEntries(
              Object.entries(tool.parameters).map(([key, valueType]) => [
                key,
                {
                  type: "string",
                  description: `Parameter ${key} of declared type ${valueType}.`,
                },
              ])
            ),
          },
          required: [],
          additionalProperties: true,
        },
      },
    }));
}

function parseToolArguments(rawArguments: string | undefined) {
  if (!rawArguments) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawArguments);
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

async function readToolResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "text/plain";

  if (contentType.includes("application/json")) {
    return {
      contentType,
      data: await response.json(),
    };
  }

  return {
    contentType,
    data: await response.text(),
  };
}

async function executeHttpTool(
  tool: ToolConfig,
  args: Record<string, unknown>
): Promise<ExecutedToolResult> {
  const method = tool.method || "GET";
  const url = new URL(tool.url);
  const headers = new Headers();

  if (tool.includeApiKey && tool.apiKey.trim()) {
    headers.set("Authorization", `Bearer ${tool.apiKey}`);
    headers.set("X-API-Key", tool.apiKey);
  }

  let body: string | undefined;

  if (method === "GET" || method === "DELETE") {
    if (tool.includeApiKey && tool.apiKey.trim() && !url.searchParams.has("key")) {
      url.searchParams.set("key", tool.apiKey);
    }

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

  const payload = await readToolResponse(response);

  return {
    args,
    contentType: payload.contentType,
    name: tool.name,
    ok: response.ok,
    status: response.status,
    url: url.toString(),
    data: payload.data,
  };
}

function getAssistantText(message: { content?: unknown }) {
  if (typeof message.content === "string") {
    return message.content;
  }

  if (Array.isArray(message.content)) {
    return message.content
      .map((item) => {
        if (
          item &&
          typeof item === "object" &&
          "type" in item &&
          "text" in item &&
          (item as { type?: unknown }).type === "text"
        ) {
          return String((item as { text?: unknown }).text ?? "");
        }

        return "";
      })
      .join("")
      .trim();
  }

  return "";
}

function formatAssistantResponse(
  rawText: string,
  outputFormat: string,
  outputSchema: string
) {
  if (outputFormat !== "advanced") {
    return rawText;
  }

  try {
    const parsed = JSON.parse(rawText);
    return JSON.stringify(parsed, null, 2);
  } catch {
    const schemaText = outputSchema.trim();
    return schemaText
      ? `Invalid structured response for schema:\n${schemaText}\n\nRaw response:\n${rawText}`
      : rawText;
  }
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
        : typeof body.conversationalId === "string" && body.conversationalId.trim()
          ? body.conversationalId
          : crypto.randomUUID();

    if (!input) {
      return NextResponse.json(
        {
          error: "Missing input in request body",
        },
        {
          status: 400,
        }
      );
    }

    const primaryAgent = pickPrimaryAgent(agents, body.primaryAgentName);
    const { prompt, allowedTools, outputFormat, outputSchema } = buildSystemPrompt(
      primaryAgent,
      tools,
      body.systemPrompt
    );
    const toolDefinitions = buildToolDefinitions(allowedTools);

    const messages: Array<Record<string, unknown>> = [
      {
        role: "system",
        content: prompt,
      },
    ];

    if (primaryAgent?.includeHistory) {
      messages.push(
        ...history.map((message) => ({
          role: message.role,
          content: message.content,
        }))
      );
    }

    messages.push({
      role: "user",
      content: input,
    });

    const executedTools: ExecutedToolResult[] = [];
    let finalText = "";

    for (let turn = 0; turn < 4; turn += 1) {
      const completion = await openRouter.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: messages as never,
        parallel_tool_calls: false,
        response_format:
          outputFormat === "advanced"
            ? { type: "json_object" }
            : undefined,
        tool_choice: toolDefinitions.length > 0 ? "auto" : undefined,
        tools: toolDefinitions.length > 0 ? (toolDefinitions as never) : undefined,
      });

      const assistantMessage = completion.choices[0]?.message;

      if (!assistantMessage) {
        return NextResponse.json(
          {
            error: "No assistant response returned from model",
          },
          {
            status: 502,
          }
        );
      }

      finalText = getAssistantText(assistantMessage);

      messages.push({
        role: "assistant",
        content: assistantMessage.content ?? "",
        tool_calls: assistantMessage.tool_calls,
      });

      if (!assistantMessage.tool_calls?.length) {
        return NextResponse.json({
          conversationId,
          message: formatAssistantResponse(
            finalText,
            outputFormat,
            outputSchema
          ),
          primaryAgent: primaryAgent?.name ?? null,
          toolResults: executedTools,
        });
      }

      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type !== "function") {
          continue;
        }

        const matchedTool = allowedTools.find(
          (tool) => tool.id === toolCall.function.name
        );

        if (!matchedTool) {
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({
              ok: false,
              error: `Tool ${toolCall.function.name} is not configured`,
            }),
          });
          continue;
        }

        const toolArgs = parseToolArguments(toolCall.function.arguments);
        const toolResult = await executeHttpTool(matchedTool, toolArgs);

        executedTools.push(toolResult);
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        });
      }
    }

    return NextResponse.json({
      conversationId,
      message:
        formatAssistantResponse(
          finalText || "The agent reached the tool-call limit before finishing.",
          outputFormat,
          outputSchema
        ),
      primaryAgent: primaryAgent?.name ?? null,
      toolResults: executedTools,
      warning: "Tool-call limit reached",
    });
  } catch (error) {
    console.error("agent-chat failed", error);

    const details = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to process agent chat",
        details,
      },
      {
        status: 500,
      }
    );
  }
}
