import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getTodaysTopic } from "@/convex/topics";
import { TypewriterText } from "@/components/TypewriterText";

interface ChatMessage {
  _id: string;
  conversationId: Id<"conversations">;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

interface Conversation {
  _id: Id<"conversations">;
  topic: string;
  topicCategory: string;
  date: string;
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const getOrCreateConversation = useAction(api.chat.getOrCreateConversation);
  const sendMessageAction = useAction(api.chat.sendMessage);

  const todaysTopic = getTodaysTopic();

  // Load today's conversation on mount
  useEffect(() => {
    loadConversation();
  }, []);

  const loadConversation = async () => {
    try {
      setIsLoading(true);
      const result = await getOrCreateConversation();
      setConversation(result.conversation as Conversation);
      setMessages(result.messages as ChatMessage[]);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || !conversation || isSending) return;

    const userMessage = inputText.trim();
    setInputText("");
    setIsSending(true);

    // Optimistically add the user message
    const optimisticUserMsg: ChatMessage = {
      _id: `temp-${Date.now()}`,
      conversationId: conversation._id,
      role: "user",
      content: userMessage,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, optimisticUserMsg]);

    try {
      const result = await sendMessageAction({
        conversationId: conversation._id,
        message: userMessage,
      });

      // Add the assistant response with streaming animation
      const assistantId = `assistant-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        _id: assistantId,
        conversationId: conversation._id,
        role: "assistant",
        content: result.content,
        createdAt: Date.now(),
      };
      setStreamingMsgId(assistantId);
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove the optimistic message on error
      setMessages((prev) => prev.filter((m) => m._id !== optimisticUserMsg._id));
    } finally {
      setIsSending(false);
    }
  }, [inputText, conversation, isSending, sendMessageAction]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Keep scrolling during typewriter animation so the text stays visible
  useEffect(() => {
    if (!streamingMsgId) return;
    const scrollInterval = setInterval(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 400);
    return () => clearInterval(scrollInterval);
  }, [streamingMsgId]);

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isUser = item.role === "user";
      const isStreaming = item._id === streamingMsgId;
      return (
        <View
          className={`mb-3 max-w-[85%] ${isUser ? "self-end" : "self-start"}`}
        >
          {!isUser && (
            <Text className="text-[9px] uppercase tracking-[0.2em] text-[#8A8A8A] mb-1.5 ml-1 font-sans">
              Moment
            </Text>
          )}
          <View
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? "bg-[#DBC188]/15 border border-[#DBC188]/20 rounded-br-sm"
                : "bg-[#1a1a1a] border border-white/5 rounded-bl-sm"
            }`}
          >
            {!isUser && isStreaming ? (
              <TypewriterText
                text={item.content}
                wordDelay={45}
                animate={true}
                onComplete={() => setStreamingMsgId(null)}
                className="text-sm leading-5 font-sans text-[#C8C8C8]"
              />
            ) : (
              <Text
                className={`text-sm leading-5 font-sans ${
                  isUser ? "text-[#ECECEC]" : "text-[#C8C8C8]"
                }`}
              >
                {item.content}
              </Text>
            )}
          </View>
          <Text
            className={`text-[9px] text-[#555] mt-1 font-sans ${
              isUser ? "text-right mr-1" : "ml-1"
            }`}
          >
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      );
    },
    [streamingMsgId]
  );

  // Loading state
  if (isLoading) {
    return (
      <View
        className="flex-1 bg-[#121212] items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="small" color="#DBC188" />
        <Text className="text-[#8A8A8A] text-xs mt-3 font-sans tracking-wider">
          PREPARING YOUR REFLECTION
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#121212]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View
        className="px-6 pb-4 bg-[#121212]/80 border-b border-white/5"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row justify-between items-end">
          <View className="flex-col">
            <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-1 font-sans">
              Daily Reflection
            </Text>
            <Text className="text-sm font-medium tracking-widest text-[#ECECEC] font-sans">
              {new Date()
                .toLocaleDateString("en-US", { month: "short", day: "numeric" })
                .toUpperCase()}
            </Text>
          </View>
          <View className="bg-[#DBC188]/10 border border-[#DBC188]/15 px-3 py-1 rounded-[2px]">
            <Text className="text-[9px] tracking-widest text-[#DBC188] uppercase font-sans">
              {conversation?.topicCategory || todaysTopic.category}
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 8,
          flexGrow: 1,
        }}
        ListHeaderComponent={
          <View className="mb-6">
            {/* Topic banner */}
            <View className="bg-[#161616] border border-[#282828] rounded-lg p-5 mb-4">
              <Text className="text-[9px] uppercase tracking-[0.25em] text-[#DBC188] mb-2 font-sans">
                Today's Topic
              </Text>
              <Text className="text-lg font-heading text-[#ECECEC] mb-2">
                {conversation?.topic || todaysTopic.topic}
              </Text>
              <Text className="text-xs text-[#8A8A8A] leading-4 font-sans">
                {todaysTopic.suggestedQuestion}
              </Text>
            </View>
            {messages.length === 0 && (
              <View className="items-center py-8">
                <View className="w-14 h-14 rounded-full bg-[#DBC188]/8 border border-[#DBC188]/15 items-center justify-center mb-4">
                  <Ionicons name="leaf-outline" size={24} color="#DBC188" />
                </View>
                <Text className="text-[#8A8A8A] text-xs text-center font-sans leading-5 max-w-[260px]">
                  Start your daily reflection by sharing what comes to mind, or
                  use the suggested prompt above.
                </Text>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          isSending ? (
            <View className="self-start mb-3 max-w-[85%]">
              <Text className="text-[9px] uppercase tracking-[0.2em] text-[#8A8A8A] mb-1.5 ml-1 font-sans">
                Moment
              </Text>
              <View className="bg-[#1a1a1a] border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
                <View className="flex-row items-center gap-1.5">
                  <View className="w-1.5 h-1.5 rounded-full bg-[#DBC188]/60" />
                  <View className="w-1.5 h-1.5 rounded-full bg-[#DBC188]/40" />
                  <View className="w-1.5 h-1.5 rounded-full bg-[#DBC188]/20" />
                </View>
              </View>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Input area */}
      <View
        className="px-4 pt-3 pb-2 border-t border-white/5 bg-[#121212]"
        style={{ paddingBottom: Math.max(insets.bottom, 8) }}
      >
        <View className="flex-row items-end gap-2">
          <View className="flex-1 bg-[#1a1a1a] border border-[#333333] rounded-2xl px-4 py-2.5 min-h-[44px] max-h-[120px]">
            <TextInput
              className="text-sm text-[#ECECEC] font-sans leading-5"
              placeholder="Share your thoughts..."
              placeholderTextColor="#555"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
              editable={!isSending}
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
          </View>
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
            className={`w-11 h-11 rounded-full items-center justify-center mb-0.5 ${
              inputText.trim() && !isSending
                ? "bg-[#DBC188]"
                : "bg-[#1a1a1a] border border-[#333333]"
            }`}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#DBC188" />
            ) : (
              <Ionicons
                name="arrow-up"
                size={18}
                color={inputText.trim() ? "#121212" : "#555"}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
