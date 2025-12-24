import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        tokenIdentifier: v.string(),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        pictureUrl: v.optional(v.string()),
        // Onboarding data
        purpose: v.optional(v.array(v.string())),
        age: v.optional(v.string()),
        experience: v.optional(v.string()),
        practices: v.optional(v.array(v.string())),
        // Preferences
        preferences: v.optional(
            v.object({
                sessionLength: v.number(), // in minutes
                practiceTime: v.string(), // e.g., "morning", "evening"
                reminders: v.boolean(),
                theme: v.optional(v.string()),
            })
        ),
    }).index("by_token", ["tokenIdentifier"]),

    journalEntries: defineTable({
        userId: v.id("users"),
        content: v.string(),
        mood: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        date: v.string(), // ISO date string
    }).index("by_user", ["userId"]),

    stats: defineTable({
        userId: v.id("users"),
        currentStreak: v.number(),
        longestStreak: v.number(),
        totalSessions: v.number(),
        totalTime: v.number(), // in minutes
        lastPracticeDate: v.optional(v.string()),
        weeklyActivity: v.array(v.number()), // Array of 7 numbers representing minutes per day
    }).index("by_user", ["userId"]),

    sessions: defineTable({
        userId: v.id("users"),
        startTime: v.number(),           // timestamp when session started
        endTime: v.optional(v.number()), // timestamp when session ended
        targetDuration: v.number(),      // target duration in seconds
        actualDuration: v.number(),      // actual duration in seconds
        status: v.union(
            v.literal("active"),
            v.literal("completed"),
            v.literal("cancelled")
        ),
        interruptions: v.number(),       // how many times phone was picked up
    }).index("by_user", ["userId"]),
});
