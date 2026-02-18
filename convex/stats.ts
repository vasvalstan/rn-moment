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

export const getUserStats = query({
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

        const baseStats = stats ?? {
            userId: user._id,
            currentStreak: 0,
            longestStreak: 0,
            totalSessions: 0,
            totalTime: 0,
            lastPracticeDate: undefined,
            weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
        };

        const completedSessions = await ctx.db
            .query("sessions")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .filter((q) => q.eq(q.field("status"), "completed"))
            .collect();

        const longestSessionSeconds = completedSessions.reduce(
            (longest, session) => Math.max(longest, session.actualDuration),
            0
        );

        const averageSessionMinutes =
            baseStats.totalSessions > 0 ? baseStats.totalTime / baseStats.totalSessions : 0;

        // Data is stored Sunday-first. Convert to Monday-first for charts/UI.
        const weeklyActivityMondayFirst = [
            baseStats.weeklyActivity[1] ?? 0,
            baseStats.weeklyActivity[2] ?? 0,
            baseStats.weeklyActivity[3] ?? 0,
            baseStats.weeklyActivity[4] ?? 0,
            baseStats.weeklyActivity[5] ?? 0,
            baseStats.weeklyActivity[6] ?? 0,
            baseStats.weeklyActivity[0] ?? 0,
        ];

        const hasWeeklyData = weeklyActivityMondayFirst.some((value) => value > 0);
        const bestDayIndex = hasWeeklyData
            ? weeklyActivityMondayFirst.reduce(
                  (bestIndex, value, index, values) =>
                      value > values[bestIndex] ? index : bestIndex,
                  0
              )
            : null;

        return {
            ...baseStats,
            averageSessionMinutes,
            longestSessionSeconds,
            weeklyActivityMondayFirst,
            bestDayIndex,
        };
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
