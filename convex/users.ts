import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
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

        return user;
    },
});

export const createUser = mutation({
    args: {
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        pictureUrl: v.optional(v.string()),
        // Onboarding data
        purpose: v.optional(v.array(v.string())),
        age: v.optional(v.string()),
        experience: v.optional(v.string()),
        practices: v.optional(v.array(v.string())),
        // Optional preferences from onboarding
        sessionLength: v.optional(v.number()),
        practiceTime: v.optional(v.string()),
        reminders: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called createUser without authentication present");
        }

        // Check if user already exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (existingUser) {
            return existingUser._id;
        }

        // Create new user
        const userId = await ctx.db.insert("users", {
            tokenIdentifier: identity.tokenIdentifier,
            name: args.name,
            email: args.email,
            pictureUrl: args.pictureUrl,
            purpose: args.purpose,
            age: args.age,
            experience: args.experience,
            practices: args.practices,
            preferences: {
                sessionLength: args.sessionLength ?? 20,
                practiceTime: args.practiceTime ?? "morning",
                reminders: args.reminders ?? true,
                theme: "dark",
            },
        });

        // Initialize stats for the user
        await ctx.db.insert("stats", {
            userId,
            currentStreak: 0,
            longestStreak: 0,
            totalSessions: 0,
            totalTime: 0,
            weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
        });

        return userId;
    },
});

export const updatePreferences = mutation({
    args: {
        sessionLength: v.optional(v.number()),
        practiceTime: v.optional(v.string()),
        reminders: v.optional(v.boolean()),
        theme: v.optional(v.string()),
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

        const currentPreferences = user.preferences || {
            sessionLength: 20,
            practiceTime: "morning",
            reminders: true,
            theme: "dark",
        };

        await ctx.db.patch(user._id, {
            preferences: {
                ...currentPreferences,
                ...args,
            },
        });
    },
});
