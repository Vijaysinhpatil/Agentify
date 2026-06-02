import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      const UserData = {
        name: args?.name,
        email: args?.email,
        token: 5000,
      };

      const result = await ctx.db.insert('users', UserData);

      const newUser = await ctx.db.get(result); 
     
       
      
       return newUser;
     }

    return user;
  },
});

export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});
