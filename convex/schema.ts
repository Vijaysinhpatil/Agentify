// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email : v.string(),
    imageUrl : v.optional(v.string()),
    subscription : v.optional(v.string()),
    token : v.number(),
  }).index("by_email", ["email"]),
  agentTable : defineTable({
    agentId : v.string(),
    name : v.string(),
    published : v.boolean(),
    config : v.optional(v.string()),
    userId : v.id('users'),
    // ADD THESE TWO LINES:
    nodes: v.optional(v.any()),
    edges: v.optional(v.any()),
    agentToolConfig : v.optional(v.any())
  })
    .index("by_agentId", ["agentId"])
    .index("by_userId", ["userId"]),
  ConversationTable : defineTable({
    conversationId : v.string(),
    agentId : v.id('agentTable'),
    userId : v.id('users'),
  })
    .index("by_conversationId", ["conversationId"])
    .index("by_agentId_and_userId", ["agentId", "userId"]),
  paymentHistory: defineTable({
    userId: v.id("users"),
    agentId: v.optional(v.id("agentTable")),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
    planName: v.string(),
    provider: v.string(),
    referenceId: v.string(),
    notes: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
});
