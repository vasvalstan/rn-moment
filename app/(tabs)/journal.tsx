import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });

const buildTitleFromContent = (content: string) => {
    const words = content.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
        return "Untitled Reflection";
    }
    const title = words.slice(0, 3).join(" ");
    return title.charAt(0).toUpperCase() + title.slice(1);
};

export default function Journal() {
    const entries = useQuery(api.journal.getEntries);
    const createEntry = useMutation(api.journal.createEntry);

    const [composerOpen, setComposerOpen] = useState(false);
    const [entryText, setEntryText] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const isLoading = entries === undefined;
    const hasEntries = (entries?.length ?? 0) > 0;

    const placeholderQuote = useMemo(
        () => "Capture what moved you today, even if it is only one sentence.",
        []
    );

    const handleCreateEntry = async () => {
        const content = entryText.trim();
        if (!content || isSaving) {
            return;
        }

        setIsSaving(true);
        try {
            await createEntry({
                content,
                date: new Date().toISOString(),
            });
            setEntryText("");
            setComposerOpen(false);
        } catch (error) {
            console.error("Failed to create journal entry:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-[#121212]">
            <View className="flex-row justify-between items-end px-6 pt-12 pb-4 bg-[#121212]/80 border-b border-white/5">
                <View className="flex-col">
                    <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-1 font-sans">
                        Reflections
                    </Text>
                    <Text className="text-sm font-medium tracking-widest text-[#ECECEC] font-sans">
                        JOURNAL
                    </Text>
                </View>
                <TouchableOpacity>
                    <Text className="text-[10px] uppercase tracking-[0.2em] text-[#DBC188] font-sans">
                        {isLoading ? "Syncing" : `${entries?.length ?? 0} Entries`}
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView className="flex-1 px-6 pt-3 pb-24" contentContainerStyle={{ paddingBottom: 100, gap: 32 }}>
                <View className="relative">
                    <View className="absolute left-0 top-12 w-1/2 h-96 overflow-hidden opacity-30 rounded-[2px] pointer-events-none">
                        <Image
                            source={{ uri: "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800&q=80" }}
                            contentFit="cover"
                            className="w-full h-full grayscale contrast-125 brightness-75 blur-sm"
                        />
                        <LinearGradient
                            colors={["transparent", "rgba(18,18,18,0.4)", "#121212"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="absolute inset-0"
                        />
                        <LinearGradient
                            colors={["rgba(18,18,18,0.3)", "transparent", "#121212"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            className="absolute inset-0"
                        />
                    </View>
                    <View className="relative z-10">
                        <Text className="font-heading text-6xl leading-[1.1] text-[#ECECEC] mb-2">Journal</Text>
                        <Text className="text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A] font-sans">
                            YOUR MINDFUL MOMENTS
                        </Text>
                        {isLoading && (
                            <View className="flex-row items-center gap-2 mt-3">
                                <ActivityIndicator size="small" color="#DBC188" />
                                <Text className="text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A] font-sans">
                                    Loading entries
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View className="gap-6">
                    {!isLoading && !hasEntries && (
                        <View className="bg-white/5 backdrop-blur-sm border border-[#333333] rounded-[2px] p-6">
                            <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-sans mb-4">
                                No Entries Yet
                            </Text>
                            <Text className="font-heading text-2xl text-[#ECECEC] mb-3">Start your first reflection</Text>
                            <Text className="text-sm text-[#8A8A8A] leading-relaxed font-sans">
                                {placeholderQuote}
                            </Text>
                        </View>
                    )}

                    {entries?.map((entry, index) => {
                        const isLatest = index === 0;
                        const title = entry.mood
                            ? `${entry.mood} Reflection`
                            : buildTitleFromContent(entry.content);
                        const excerpt =
                            entry.content.length > 220
                                ? `${entry.content.slice(0, 217)}...`
                                : entry.content;

                        return (
                            <View
                                key={entry._id}
                                className={`bg-white/5 backdrop-blur-sm rounded-[2px] p-6 relative overflow-hidden ${
                                    isLatest
                                        ? "border border-[#DBC188]/30"
                                        : "border border-white/10"
                                }`}
                            >
                                {isLatest && (
                                    <View className="absolute top-0 right-0 w-24 h-24 bg-[#DBC188]/5 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3" />
                                )}
                                <View className="flex-row justify-between items-start mb-4">
                                    <View>
                                        <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-sans">
                                            {formatDate(entry.date)}
                                        </Text>
                                    </View>
                                    <Text
                                        className={`text-[10px] tracking-widest font-sans ${
                                            isLatest ? "text-[#DBC188]" : "text-[#ECECEC]"
                                        }`}
                                    >
                                        {formatTime(entry.date)}
                                    </Text>
                                </View>
                                <Text className="font-heading text-2xl text-[#ECECEC] mb-3">{title}</Text>
                                <Text className="text-sm text-[#8A8A8A] leading-relaxed font-sans">{excerpt}</Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <TouchableOpacity
                onPress={() => setComposerOpen(true)}
                className="absolute bottom-6 right-6 w-14 h-14 bg-[#DBC188] rounded-[2px] flex items-center justify-center shadow-lg active:bg-[#B89A5F] active:scale-95 z-40"
            >
                <Ionicons name="add-circle" size={24} color="#121212" />
            </TouchableOpacity>

            <Modal
                visible={composerOpen}
                transparent
                animationType="slide"
                onRequestClose={() => setComposerOpen(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    className="flex-1 justify-end bg-black/60"
                >
                    <View className="bg-[#121212] border-t border-[#333333] px-6 pt-6 pb-8">
                        <View className="flex-row items-center justify-between mb-5">
                            <Text className="font-heading text-3xl text-[#ECECEC]">New Entry</Text>
                            <TouchableOpacity onPress={() => setComposerOpen(false)}>
                                <Ionicons name="close" size={24} color="#8A8A8A" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            value={entryText}
                            onChangeText={setEntryText}
                            multiline
                            autoFocus
                            maxLength={2500}
                            placeholder="What did you notice today?"
                            placeholderTextColor="#6B6B6B"
                            className="min-h-[180px] bg-[#161616] border border-[#333333] rounded-[2px] p-4 text-[#ECECEC] text-base font-sans"
                            textAlignVertical="top"
                        />

                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A] font-sans">
                                {entryText.trim().length} chars
                            </Text>
                            <Text className="text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A] font-sans">
                                {new Date().toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })}
                            </Text>
                        </View>

                        <View className="flex-row gap-3 mt-6">
                            <TouchableOpacity
                                onPress={() => setComposerOpen(false)}
                                className="flex-1 py-4 border border-[#333333] rounded-[2px] items-center"
                            >
                                <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-sans">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleCreateEntry}
                                disabled={!entryText.trim() || isSaving}
                                className={`flex-1 py-4 rounded-[2px] items-center ${
                                    entryText.trim() && !isSaving ? "bg-[#DBC188]" : "bg-[#333333]"
                                }`}
                            >
                                {isSaving ? (
                                    <ActivityIndicator size="small" color="#121212" />
                                ) : (
                                    <Text
                                        className={`text-[10px] uppercase tracking-[0.25em] font-sans ${
                                            entryText.trim() ? "text-[#121212]" : "text-[#8A8A8A]"
                                        }`}
                                    >
                                        Save Entry
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}
