import { openRouter } from "@/config/OpenRouterModel";
import { NextRequest, NextResponse } from "next/server";

type FlowRequest = {
  jsonConfig?: unknown;
};

type AgentConfig = {
  id: string;
  name: string;
  includeHistory: boolean;
  output: {
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

    const prompt = `
You are given a workflow JSON for an agent builder.

Convert it into a JSON object with exactly this top-level shape:
{
  "systemPrompt": "",
  "primaryAgentName": "",
  "agents": [
    {
      "id": "agent-id",
      "name": "",
      "includeHistory": true,
      "output": {
        "tools": ["tool-id-1"],
        "instruction": ["step 1", "step 2"]
      }
    }
  ],
  "tools": [
    {
      "id": "tool-id",
      "name": "",
      "description": "",
      "method": "GET",
      "url": "",
      "includeApiKey": false,
      "apiKey": "",
      "parameters": {
        "key": "string"
      },
      "usage": ["step 1"],
      "assignedAgent": "agent-id"
    }
  ]
}

Rules:
- Return valid JSON only.
- "agents" must always be an array.
- "tools" must always be an array.
- "output.tools" must always be an array of strings.
- "output.instruction" must always be an array of strings.
- If a value is unknown, use an empty string, false, or an empty array.
- Base the answer only on this workflow config.

Workflow config:
${JSON.stringify(flowConfig, null, 2)}
`;

    // Replaced Gemini API call with OpenRouter Completions API
    const response = await openRouter.chat.completions.create({
      model: "liquid/lfm-2.5-1.2b-instruct:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" }, // Enforces a structural JSON response matching your rules
    });

    const rawText = response.choices[0]?.message?.content?.trim();

    if (!rawText) {
      return NextResponse.json(
        {
          error: "No response from OpenRouter model",
        },
        {
          status: 502,
        }
      );
    }

    const parsedConfig = JSON.parse(extractJsonBlock(rawText));
    const normalizedConfig = normalizeAgentToolConfig(parsedConfig);

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