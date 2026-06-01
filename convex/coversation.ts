import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const GetConversationById = query({
    args : {
         agentId : v.id("agentTable"),
         userId : v.id('users')
    },
    handler : async(ctx , args) => {
        const result = await ctx.db.query("ConversationTable")
        .filter((q) =>
            q.and(
                q.eq(q.field("agentId"), args.agentId),
                q.eq(q.field("userId"), args.userId),
            ),
        )
        .collect()

    return result[0]
    }
})

export const CreateConversation = mutation({
    args: {
        agentId: v.id("agentTable"),
        userId: v.id("users"),
        conversationId: v.string(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("ConversationTable", {
            agentId: args.agentId,
            userId: args.userId,
            conversationId: args.conversationId,
        });

        return {
            id,
            conversationId: args.conversationId,
        };
    },
})
