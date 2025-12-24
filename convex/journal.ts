import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getEntries = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) {
            return [];
        }

        const entries = await ctx.db
            .query("journalEntries")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect();

        return entries;
    },
});

export const createEntry = mutation({
    args: {
        content: v.string(),
        mood: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        date: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.insert("journalEntries", {
            userId: user._id,
            content: args.content,
            mood: args.mood,
            tags: args.tags,
            date: args.date,
        });
    },
});
