import { v } from "convex/values";
import { mutation } from "./_generated/server";
export const CreateNewUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), args.email))
      .collect();

    if (user?.length == 0) {
      const UserData = {
        name: args?.name,
        email: args?.email,
        token: 5000,
      };

      const result = await ctx.db.insert('users', UserData);

      const newUser = await ctx.db.get(result); 
     
     
      
      return newUser;
    }

    return user[0];
  },
});