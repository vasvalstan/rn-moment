import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Start a new meditation session
export const startSession = mutation({
    args: {
        targetDuration: v.number(), // in seconds
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        // Get user from database
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        // Create new session
        const sessionId = await ctx.db.insert("sessions", {
            userId: user._id,
            startTime: Date.now(),
            targetDuration: args.targetDuration,
            actualDuration: 0,
            status: "active",
            interruptions: 0,
        });

        return sessionId;
    },
});

// Complete a meditation session
export const completeSession = mutation({
    args: {
        sessionId: v.id("sessions"),
        actualDuration: v.number(), // in seconds
        interruptions: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        const session = await ctx.db.get(args.sessionId);
        if (!session) {
            throw new Error("Session not found");
        }

        // Update session as completed
        await ctx.db.patch(args.sessionId, {
            endTime: Date.now(),
            actualDuration: args.actualDuration,
            status: "completed",
            interruptions: args.interruptions,
        });

        // Update user stats
        const stats = await ctx.db
            .query("stats")
            .withIndex("by_user", (q) => q.eq("userId", session.userId))
            .unique();

        const today = new Date().toISOString().split("T")[0];
        const durationInMinutes = Math.round(args.actualDuration / 60);

        if (stats) {
            // Calculate streak
            let currentStreak = stats.currentStreak;
            const lastPractice = stats.lastPracticeDate;
            
            if (lastPractice) {
                const lastDate = new Date(lastPractice);
                const todayDate = new Date(today);
                const diffDays = Math.floor(
                    (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
                );
                
                if (diffDays === 1) {
                    // Consecutive day
                    currentStreak += 1;
                } else if (diffDays > 1) {
                    // Streak broken
                    currentStreak = 1;
                }
                // If same day, streak stays the same
            } else {
                currentStreak = 1;
            }

            // Update weekly activity (shift array and add today's minutes)
            const weeklyActivity = [...stats.weeklyActivity];
            const dayOfWeek = new Date().getDay(); // 0 = Sunday
            weeklyActivity[dayOfWeek] = (weeklyActivity[dayOfWeek] || 0) + durationInMinutes;

            await ctx.db.patch(stats._id, {
                totalSessions: stats.totalSessions + 1,
                totalTime: stats.totalTime + durationInMinutes,
                currentStreak,
                longestStreak: Math.max(stats.longestStreak, currentStreak),
                lastPracticeDate: today,
                weeklyActivity,
            });
        } else {
            // Create initial stats
            const weeklyActivity = [0, 0, 0, 0, 0, 0, 0];
            weeklyActivity[new Date().getDay()] = durationInMinutes;

            await ctx.db.insert("stats", {
                userId: session.userId,
                totalSessions: 1,
                totalTime: durationInMinutes,
                currentStreak: 1,
                longestStreak: 1,
                lastPracticeDate: today,
                weeklyActivity,
            });
        }

        return { success: true };
    },
});

// Cancel a meditation session
export const cancelSession = mutation({
    args: {
        sessionId: v.id("sessions"),
        actualDuration: v.number(), // in seconds (time before cancellation)
        interruptions: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        const session = await ctx.db.get(args.sessionId);
        if (!session) {
            throw new Error("Session not found");
        }

        // Update session as cancelled
        await ctx.db.patch(args.sessionId, {
            endTime: Date.now(),
            actualDuration: args.actualDuration,
            status: "cancelled",
            interruptions: args.interruptions,
        });

        return { success: true };
    },
});

// Get active session (if any)
export const getActiveSession = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            return null;
        }

        // Find active session
        const sessions = await ctx.db
            .query("sessions")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        return sessions.find((s) => s.status === "active") || null;
    },
});

// Get recent sessions
export const getRecentSessions = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            return [];
        }

        const sessions = await ctx.db
            .query("sessions")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .order("desc")
            .take(args.limit || 10);

        return sessions;
    },
});

