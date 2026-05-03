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
        .filter(q => q.eq(q.field('userId') , args.userId ))
        .order('desc')
        .collect()


        return result
    }
})