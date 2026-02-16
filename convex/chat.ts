"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import OpenAI from "openai";
import { getTodaysTopic } from "./topics";

type ConversationDoc = {
  _id: Id<"conversations">;
  _creationTime: number;
  userId: Id<"users">;
  date: string;
  topic: string;
  topicCategory: string;
};

type MessageDoc = {
  _id: Id<"chatMessages">;
  _creationTime: number;
  conversationId: Id<"conversations">;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

// ─── Public action: send a message and get AI response ───────────────────────

export const sendMessage = action({
  args: {
    conversationId: v.id("conversations"),
    message: v.string(),
  },
  handler: async (ctx, { conversationId, message }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Save the user's message
    await ctx.runMutation(internal.chatHelpers.insertMessage, {
      conversationId,
      role: "user",
      content: message,
      createdAt: Date.now(),
    });

    // Load conversation history for context (memory)
    const allMessages = await ctx.runQuery(
      internal.chatHelpers.getMessagesByConversation,
      { conversationId }
    );

    // Load user profile for personalization
    const user = await ctx.runQuery(internal.chatHelpers.getUserByToken, {
      tokenIdentifier: identity.tokenIdentifier,
    });

    // Load conversation to get the daily topic
    const conversation = await ctx.runQuery(
      internal.chatHelpers.getConversationByUserDate,
      { userId: user!._id, date: new Date().toISOString().split("T")[0] }
    );

    // Build system prompt
    const systemPrompt = buildSystemPrompt(user, conversation);

    // Build message history (last 20 messages for context window)
    const recentMessages = allMessages.slice(-20);
    const openaiMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...recentMessages.map((m: MessageDoc) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // Call OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      max_tokens: 500,
      temperature: 0.8,
    });

    const assistantContent =
      completion.choices[0]?.message?.content ?? "I'm here to listen. Could you share more?";

    // Save assistant response
    await ctx.runMutation(internal.chatHelpers.insertMessage, {
      conversationId,
      role: "assistant",
      content: assistantContent,
      createdAt: Date.now(),
    });

    return { content: assistantContent };
  },
});

// ─── Public action: get or create today's conversation ───────────────────────

export const getOrCreateConversation = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user: any = await ctx.runQuery(internal.chatHelpers.getUserByToken, {
      tokenIdentifier: identity.tokenIdentifier,
    });
    if (!user) throw new Error("User not found");

    const today = new Date().toISOString().split("T")[0];

    // Check if conversation already exists for today
    let conversation: ConversationDoc | null = await ctx.runQuery(
      internal.chatHelpers.getConversationByUserDate,
      { userId: user._id, date: today }
    ) as ConversationDoc | null;

    if (!conversation) {
      const todaysTopic = getTodaysTopic(today);
      const conversationId: Id<"conversations"> = await ctx.runMutation(
        internal.chatHelpers.createConversation,
        {
          userId: user._id,
          date: today,
          topic: todaysTopic.topic,
          topicCategory: todaysTopic.category,
        }
      );

      conversation = {
        _id: conversationId,
        _creationTime: Date.now(),
        userId: user._id,
        date: today,
        topic: todaysTopic.topic,
        topicCategory: todaysTopic.category,
      };
    }

    // Load existing messages
    const messages: MessageDoc[] = await ctx.runQuery(
      internal.chatHelpers.getMessagesByConversation,
      { conversationId: conversation._id }
    ) as MessageDoc[];

    return {
      conversation,
      messages,
    };
  },
});

// ─── Helper: Build the system prompt ─────────────────────────────────────────

function buildSystemPrompt(
  user: any,
  conversation: any
): string {
  const name = user?.name || "friend";
  const experience = user?.experience || "beginner";
  const purposes = user?.purpose?.join(", ") || "general wellness";
  const practices = user?.practices?.join(", ") || "meditation";
  const topic = conversation?.topic || "mindfulness";
  const category = conversation?.topicCategory || "mindfulness";

  return `You are a warm, wise, and gentle mindfulness companion in a meditation app called "Moment." Your role is to guide daily reflections with compassion and depth.

ABOUT THE USER:
- Name: ${name}
- Experience level: ${experience}
- Their purpose for practicing: ${purposes}
- Practices they enjoy: ${practices}

TODAY'S REFLECTION TOPIC: "${topic}" (Category: ${category})

GUIDELINES:
- Be conversational, warm, and non-judgmental. Address them by name occasionally.
- Ask thoughtful follow-up questions to deepen the reflection.
- Keep responses concise (2-4 sentences). This is a mobile chat, not an essay.
- Draw from mindfulness, meditation, and contemplative traditions.
- Gently guide the conversation back to today's topic if it drifts too far.
- Never diagnose, prescribe medication, or give medical advice.
- If the user shares something heavy, acknowledge it with compassion and suggest speaking to a professional if appropriate.
- Use a calm, grounded tone. Avoid excessive enthusiasm or emojis.`;
}
