import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const CrateAgent = mutation({
    args : {
        name : v.string(),
        agentId : v.string(),
        userId : v.id('users')
    },
    handler : async(ctx , args) => {
        const result = await ctx.db.insert('agentTable' , {
            name : args.name,
            agentId : args.agentId,
            published : false,
            userId : args.userId
        })
        return result;
    }
})

// query to fetch all agents those are related to perticular user
export const getUserAgents = query({
    args : {
        userId : v.id('users')
    },
    handler : async(ctx , args) => {
        const result = await ctx.db.query('agentTable')
        .withIndex("by_userId", q => q.eq("userId" , args.userId ))
        .order('desc')
        .take(100)


        return result
    }
})

// get agent by id

export const GetAgentById = query({
    args : {
        agentId : v.string()
    } ,
    handler : async(ctx , args) => {
        const result = await ctx.db.query('agentTable')
        .withIndex("by_agentId", q => q.eq("agentId" , args.agentId))
        .unique()

        return result;
    }
})


// 1. Change 'query' to 'mutation'
export const updateAgentDetails = mutation({
    args: {
        id: v.id('agentTable'),
        nodes: v.any(),
        edges: v.any()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            nodes: args.nodes,
            edges: args.edges
        });
    }
});

// update agent tool config
export const updateAgentToolConfig = mutation({
    args : {
        id : v.id('agentTable'),
        agentToolConfig : v.any()
    },
    handler : async(ctx , args) => {
          await ctx.db.patch(args.id , {
            agentToolConfig : args.agentToolConfig
          })
    }
})
