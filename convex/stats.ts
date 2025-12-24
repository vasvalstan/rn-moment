import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) {
            return null;
        }

        const stats = await ctx.db
            .query("stats")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .unique();

        return stats;
    },
});

export const updateStats = mutation({
    args: {
        sessionDuration: v.number(), // in minutes
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

        const stats = await ctx.db
            .query("stats")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .unique();

        if (!stats) {
            // Should have been created on user creation, but just in case
            return;
        }

        // Simple logic to update stats
        // In a real app, you'd calculate streaks based on dates
        const newTotalSessions = stats.totalSessions + 1;
        const newTotalTime = stats.totalTime + args.sessionDuration;

        // Update weekly activity (simplified - just adding to today's index, assuming 0 is Monday)
        // Real implementation would need to determine the correct day index
        const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
        // Adjust to 0-6 where 0 is Monday
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;

        const newWeeklyActivity = [...stats.weeklyActivity];
        newWeeklyActivity[adjustedIndex] += args.sessionDuration;

        await ctx.db.patch(stats._id, {
            totalSessions: newTotalSessions,
            totalTime: newTotalTime,
            weeklyActivity: newWeeklyActivity,
            lastPracticeDate: new Date().toISOString(),
        });
    },
});
