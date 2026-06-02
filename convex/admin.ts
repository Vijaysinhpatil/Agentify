import { v } from "convex/values";

import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

type UserSummary = Pick<
  Doc<"users">,
  "_id" | "_creationTime" | "name" | "email" | "subscription" | "token" | "imageUrl"
>;

type AgentSummary = Pick<
  Doc<"agentTable">,
  "_id" | "_creationTime" | "agentId" | "name" | "published" | "userId"
> & {
  ownerName: string;
  ownerEmail: string;
};

type PaymentSummary = Pick<
  Doc<"paymentHistory">,
  | "_id"
  | "_creationTime"
  | "amount"
  | "currency"
  | "status"
  | "planName"
  | "provider"
  | "referenceId"
  | "notes"
> & {
  agentName: string | null;
  userEmail: string;
  userName: string;
};

export const getAdminOverview = query({
  args: {},
  handler: async (ctx) => {
    const recentUsers = await ctx.db.query("users").order("desc").take(8);
    const recentAgents = await ctx.db.query("agentTable").order("desc").take(10);
    const recentPayments = await ctx.db.query("paymentHistory").order("desc").take(10);
    const recentConversations = await ctx.db.query("ConversationTable").order("desc").take(10);

    let totalUsers = 0;
    let totalAgents = 0;
    let totalPayments = 0;
    let totalConversations = 0;
    let publishedAgents = 0;
    let activeSubscribers = 0;
    let totalRevenue = 0;

    for await (const user of ctx.db.query("users")) {
      totalUsers += 1;
      if (user.subscription && user.subscription.trim()) {
        activeSubscribers += 1;
      }
    }

    for await (const agent of ctx.db.query("agentTable")) {
      totalAgents += 1;
      if (agent.published) {
        publishedAgents += 1;
      }
    }

    for await (const payment of ctx.db.query("paymentHistory")) {
      totalPayments += 1;
      if (payment.status.toLowerCase() === "paid") {
        totalRevenue += payment.amount;
      }
    }

    for await (const conversation of ctx.db.query("ConversationTable")) {
      void conversation;
      totalConversations += 1;
    }

    const userIds = new Set<Id<"users">>();
    const agentIds = new Set<Id<"agentTable">>();

    for (const agent of recentAgents) {
      userIds.add(agent.userId);
    }

    for (const payment of recentPayments) {
      userIds.add(payment.userId);
      if (payment.agentId) {
        agentIds.add(payment.agentId);
      }
    }

    for (const conversation of recentConversations) {
      userIds.add(conversation.userId);
      agentIds.add(conversation.agentId);
    }

    const userMap = new Map<Id<"users">, UserSummary>();
    const agentMap = new Map<Id<"agentTable">, Pick<Doc<"agentTable">, "_id" | "name" | "agentId">>();

    for (const userId of userIds) {
      const user = await ctx.db.get(userId);
      if (user) {
        userMap.set(userId, user);
      }
    }

    for (const agentId of agentIds) {
      const agent = await ctx.db.get(agentId);
      if (agent) {
        agentMap.set(agentId, {
          _id: agent._id,
          name: agent.name,
          agentId: agent.agentId,
        });
      }
    }

    const userSummaries: UserSummary[] = recentUsers.map((user) => ({
      _id: user._id,
      _creationTime: user._creationTime,
      name: user.name,
      email: user.email,
      subscription: user.subscription,
      token: user.token,
      imageUrl: user.imageUrl,
    }));

    const agentSummaries: AgentSummary[] = recentAgents.map((agent) => {
      const owner = userMap.get(agent.userId);

      return {
        _id: agent._id,
        _creationTime: agent._creationTime,
        agentId: agent.agentId,
        name: agent.name,
        published: agent.published,
        userId: agent.userId,
        ownerName: owner?.name ?? "Unknown owner",
        ownerEmail: owner?.email ?? "Unknown email",
      };
    });

    const paymentSummaries: PaymentSummary[] = recentPayments.map((payment) => {
      const user = userMap.get(payment.userId);
      const agent = payment.agentId ? agentMap.get(payment.agentId) : null;

      return {
        _id: payment._id,
        _creationTime: payment._creationTime,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        planName: payment.planName,
        provider: payment.provider,
        referenceId: payment.referenceId,
        notes: payment.notes,
        userName: user?.name ?? "Unknown user",
        userEmail: user?.email ?? "Unknown email",
        agentName: agent?.name ?? null,
      };
    });

    const conversationActivity = recentConversations.map((conversation) => {
      const user = userMap.get(conversation.userId);
      const agent = agentMap.get(conversation.agentId);

      return {
        _id: conversation._id,
        _creationTime: conversation._creationTime,
        conversationId: conversation.conversationId,
        userName: user?.name ?? "Unknown user",
        agentName: agent?.name ?? "Unknown agent",
      };
    });

    return {
      stats: {
        totalUsers,
        totalAgents,
        totalPayments,
        totalConversations,
        totalRevenue,
        publishedAgents,
        activeSubscribers,
      },
      recentUsers: userSummaries,
      recentAgents: agentSummaries,
      recentPayments: paymentSummaries,
      recentConversations: conversationActivity,
    };
  },
});

export const recordPaymentHistory = mutation({
  args: {
    userId: v.id("users"),
    agentId: v.optional(v.id("agentTable")),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
    planName: v.string(),
    provider: v.string(),
    referenceId: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("paymentHistory", {
      userId: args.userId,
      agentId: args.agentId,
      amount: args.amount,
      currency: args.currency,
      status: args.status,
      planName: args.planName,
      provider: args.provider,
      referenceId: args.referenceId,
      notes: args.notes,
    });
  },
});
