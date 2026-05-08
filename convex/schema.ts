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
  }),
  agentTable : defineTable({
    agentId : v.string(),
    name : v.string(),
    published : v.boolean(),
    config : v.optional(v.string()),
    userId : v.id('users'),
    // ADD THESE TWO LINES:
    nodes: v.optional(v.any()),
    edges: v.optional(v.any()),
  })
});