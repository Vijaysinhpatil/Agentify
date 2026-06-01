import { openRouter } from "@/config/OpenRouterModel";
import { NextRequest, NextResponse } from "next/server";

type FlowRequest = {
  jsonConfig?: unknown;
};

type NodeSettings = Record<string, unknown>;

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

type ParsedAgentToolConfig = {
  systemPrompt: string;
  primaryAgentName: string;
  agents: AgentConfig[];
  tools: ToolConfig[];
};

type FlowNode = {
  id: string;
  type: string;
  label: string;
  settings?: NodeSettings;
  next?: unknown;
};

type FlowConfigInput = {
  startNode?: string | null;
  flow?: FlowNode[];
};

function extractJsonBlock(rawText: string) {
  const cleanedText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const firstBrace = cleanedText.indexOf("{");
  const lastBrace = cleanedText.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    return cleanedText;
  }

  return cleanedText.slice(firstBrace, lastBrace + 1);
}

function normalizeAgentToolConfig(input: unknown): ParsedAgentToolConfig {
  const source =
    input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  const rawAgents = Array.isArray(source.agents) ? source.agents : [];
  const rawTools = Array.isArray(source.tools) ? source.tools : [];

  return {
    systemPrompt:
      typeof source.systemPrompt === "string" ? source.systemPrompt : "",
    primaryAgentName:
      typeof source.primaryAgentName === "string" ? source.primaryAgentName : "",
    agents: rawAgents.map((agent, index) => {
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
    }),
    tools: rawTools.map((tool, index) => {
      const record =
        tool && typeof tool === "object"
          ? (tool as Record<string, unknown>)
          : {};
      const parameters =
        record.parameters && typeof record.parameters === "object"
          ? (record.parameters as Record<string, unknown>)
          : {};

      return {
        id:
          typeof record.id === "string" && record.id.trim()
            ? record.id
            : `tool-${index + 1}`,
        name: typeof record.name === "string" ? record.name : "",
        description:
          typeof record.description === "string" ? record.description : "",
        method: typeof record.method === "string" ? record.method : "GET",
        url: typeof record.url === "string" ? record.url : "",
        includeApiKey: Boolean(record.includeApiKey),
        apiKey: typeof record.apiKey === "string" ? record.apiKey : "",
        parameters: Object.fromEntries(
          Object.entries(parameters)
            .filter(([key]) => typeof key === "string" && key.length > 0)
            .map(([key, value]) => [key, typeof value === "string" ? value : "string"])
        ),
        usage: Array.isArray(record.usage)
          ? record.usage.filter(
              (step): step is string => typeof step === "string"
            )
          : [],
        assignedAgent:
          typeof record.assignedAgent === "string" ? record.assignedAgent : "",
      };
    }),
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asBoolean(value: unknown) {
  return Boolean(value);
}

function instructionsToSteps(instructions: string) {
  return instructions
    .split(/\r?\n/)
    .map((step) => step.trim())
    .filter(Boolean);
}

function inferToolParametersFromUrl(url: string) {
  if (!url.trim()) {
    return {};
  }

  try {
    const parsedUrl = new URL(url);
    return Object.fromEntries(
      Array.from(parsedUrl.searchParams.keys()).map((key) => [key, "string"])
    );
  } catch {
    return {};
  }
}

function buildAgentToolConfigFromFlow(flowConfig: unknown): ParsedAgentToolConfig {
  const config = asRecord(flowConfig) as FlowConfigInput;
  const flow = Array.isArray(config.flow) ? config.flow : [];
  const nodes = flow.map((node) => ({
    ...node,
    settings: asRecord(node.settings),
  }));

  const agentNodes = nodes.filter((node) => node.type === "AgentNode");
  const apiNodes = nodes.filter((node) => node.type === "ApiNode");

  const tools: ToolConfig[] = apiNodes.map((node, index) => {
    const settings = asRecord(node.settings);
    const url = asString(settings.url);
    const method = asString(settings.method).trim().toUpperCase() || "GET";
    const authType = asString(settings.authType).trim();
    const apiKey = asString(settings.apiKey);
    const headers = asString(settings.headers);
    const body = asString(settings.body);

    const parameters: Record<string, string> = {
      ...inferToolParametersFromUrl(url),
    };

    if (headers.trim()) {
      parameters.headers = "string";
    }

    if (body.trim()) {
      parameters.body = "string";
    }

    return {
      id: node.id || `tool-${index + 1}`,
      name: asString(settings.name).trim() || node.label || `Tool ${index + 1}`,
      description: asString(settings.description).trim(),
      method,
      url,
      includeApiKey: authType === "apiKey" && apiKey.trim().length > 0,
      apiKey,
      parameters,
      usage: [],
      assignedAgent: agentNodes[0]?.id ?? "",
    };
  });

  const agents: AgentConfig[] = agentNodes.map((node, index) => {
    const settings = asRecord(node.settings);
    return {
      id: node.id || `agent-${index + 1}`,
      name: asString(settings.name).trim() || node.label || `Agent ${index + 1}`,
      includeHistory: asBoolean(settings.includeChatHistory),
      output: {
        format: asString(settings.output).trim() || "text",
        schema: asString(settings.schema),
        tools: tools.map((tool) => tool.id),
        instruction: instructionsToSteps(asString(settings.instructions)),
      },
    };
  });

  return {
    systemPrompt: "",
    primaryAgentName: agents[0]?.name ?? "",
    agents,
    tools,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FlowRequest;
    const flowConfig = body?.jsonConfig;

    if (!flowConfig) {
      return NextResponse.json(
        {
          error: "Missing jsonConfig in request body",
        },
        {
          status: 400,
        }
      );
    }

    const deterministicConfig = buildAgentToolConfigFromFlow(flowConfig);
    const normalizedConfig = normalizeAgentToolConfig(deterministicConfig);

    return NextResponse.json(normalizedConfig);
  } catch (error: any) {
    console.error("generate-agent-tool-config failed", error);

    const status = error?.status || 500;
    const details = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to generate agent tool config",
        details,
      },
      {
        status,
      }
    );
  }
}
