import { fetchMutation, fetchQuery } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { api } from "@/convex/_generated/api";
import { type Agent } from "@/types/AgentTypes";

type AgentSdkRequest = {
  agentId?: unknown;
  userId?: unknown;
};

function getRequestString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function pickAgent(agentResult: Agent[] | Agent | null) {
  if (Array.isArray(agentResult)) {
    return agentResult[0] ?? null;
  }

  return agentResult ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AgentSdkRequest;
    const agentId = getRequestString(body.agentId);
    const userId = getRequestString(body.userId);

    if (!agentId || !userId) {
      return NextResponse.json(
        {
          error: "Both agentId and userId are required.",
        },
        { status: 400 },
      );
    }

    const agentResult = await fetchQuery(api.agent.GetAgentById, {
      agentId,
    });
    const agentDetail = pickAgent(agentResult as Agent[] | Agent | null);

    if (!agentDetail) {
      return NextResponse.json(
        {
          error: "Agent not found.",
        },
        { status: 404 },
      );
    }

    const existingConversation = await fetchQuery(
      api.coversation.GetConversationById,
      {
        agentId: agentDetail._id,
        userId: userId as Agent["userId"],
      },
    );

    let conversationId = existingConversation?.conversationId ?? null;

    if (!conversationId) {
      const createdConversationId = crypto.randomUUID();

      const createdConversation = await fetchMutation(
        api.coversation.CreateConversation,
        {
          agentId: agentDetail._id,
          userId: userId as Agent["userId"],
          conversationId: createdConversationId,
        },
      );

      conversationId = createdConversation.conversationId;
    }

    return NextResponse.json(
      {
        agentDetail,
        conversationId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("agent-sdk failed", error);

    return NextResponse.json(
      {
        error: "Failed to initialize agent SDK.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
