import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOnboarding } from "../../context/OnboardingContext";
import { useUser } from "@clerk/clerk-expo";

export default function Home() {
    const router = useRouter();
    const user = useQuery(api.users.getUser);
    const createUser = useMutation(api.users.createUser);
    const insets = useSafeAreaInsets();
    const { data: onboardingData } = useOnboarding();
    const { user: clerkUser } = useUser();

    useEffect(() => {
        // If user is authenticated and not in database yet, create user profile
        // with data from Clerk and onboarding
        if (user === null && clerkUser) {
            // Get user's name from Clerk
            const userName = clerkUser.fullName || 
                           `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 
                           "User";
            
            // Get primary email from Clerk
            const userEmail = clerkUser.emailAddresses?.[0]?.emailAddress || "";
            
            // Get profile picture URL from Clerk
            const pictureUrl = clerkUser.imageUrl || "";

            createUser({
                name: userName,
                email: userEmail,
                pictureUrl: pictureUrl,
                purpose: onboardingData.purpose,
                age: onboardingData.age,
                experience: onboardingData.experience,
                practices: onboardingData.practices,
                sessionLength: onboardingData.sessionLength,
                practiceTime: onboardingData.practiceTime,
                reminders: onboardingData.reminders,
            }).catch((err) => console.log("Error creating user:", err));
        }
    }, [user, clerkUser, createUser, onboardingData]);

    const currentDate = new Date();
    const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" });
    const dateString = currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();

    return (
        <View className="flex-1 bg-[#121212]">
            <View
                className="flex-row justify-between items-end px-6 pb-4 bg-[#121212]/80 border-b border-white/5"
                style={{ paddingTop: insets.top + 10 }}
            >
                <View className="flex-col">
                    <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-1 font-sans">
                        {dayName}
                    </Text>
                    <Text className="text-sm font-medium tracking-widest text-[#ECECEC] font-sans">
                        {dateString}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => router.push("/profile")}>
                    <Text className="text-[10px] uppercase tracking-[0.2em] text-[#DBC188] font-sans">
                        Profile
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView className="flex-1 px-6 pt-8 pb-24" contentContainerStyle={{ paddingBottom: 100, gap: 48 }}>
                <View className="relative">
                    <View className="absolute right-0 top-0 w-2/3 h-64 overflow-hidden opacity-40 rounded-[4px]">
                        <Image
                            source={{ uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" }}
                            contentFit="cover"
                            className="w-full h-full grayscale contrast-125 brightness-75"
                            style={{ mixBlendMode: "screen" }}
                        />
                        <LinearGradient
                            colors={["transparent", "rgba(18,18,18,0.2)", "#121212"]}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                            className="absolute inset-0"
                        />
                        <LinearGradient
                            colors={["rgba(18,18,18,0.1)", "transparent", "#121212"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            className="absolute inset-0"
                        />
                    </View>
                    <View className="relative z-10 pt-12 pr-12">
                        <Text className="block text-[10px] uppercase tracking-[0.3em] text-[#DBC188] mb-6 pl-1 border-l border-[#DBC188] font-sans">
                            Daily Insight
                        </Text>
                        <Text className="font-heading text-5xl leading-[1.1] text-[#ECECEC] max-w-[90%]">
                            Stillness{"\n"}
                            <Text className="text-[#8A8A8A] italic font-light">is the key</Text>{"\n"}
                            to clarity.
                        </Text>
                    </View>
                </View>

                <View className="flex-col items-start">
                    <View className="w-full flex-row justify-between items-end mb-6 border-b border-white/10 pb-2">
                        <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-sans">
                            Current Focus
                        </Text>
                        <Text className="text-[10px] uppercase tracking-[0.2em] text-[#9CAF88] font-sans">
                            Mindfulness
                        </Text>
                    </View>
                    <View className="w-full bg-[#161616] border border-[#333333] rounded-[4px] p-6 relative overflow-hidden group">
                        <View className="absolute top-0 right-0 w-32 h-32 bg-[#DBC188]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="block text-xs text-[#8A8A8A] tracking-wider mb-2 font-sans">
                                    SESSION DURATION
                                </Text>
                                <Text className="font-sans text-6xl font-light tracking-tighter text-[#ECECEC]">
                                    {user?.preferences?.sessionLength || 20}<Text className="text-[#333333]">:</Text>00
                                </Text>
                            </View>
                            <TouchableOpacity 
                                onPress={() => {
                                    // Use user's session length if available, otherwise default to 20 minutes
                                    const duration = (user?.preferences?.sessionLength || 20) * 60; // Convert to seconds
                                    console.log("Starting session with duration:", duration);
                                    router.push(`/session?duration=${duration}`);
                                }}
                                className="w-16 h-16 border border-[#DBC188]/30 rounded-[2px] flex items-center justify-center active:bg-[#DBC188]/10 active:scale-95"
                            >
                                <Ionicons name="play-outline" size={24} color="#DBC188" />
                            </TouchableOpacity>
                        </View>
                        <View className="mt-6 w-full h-[1px] bg-[#262626]">
                            <View className="w-1/3 h-full bg-[#DBC188]" />
                        </View>
                    </View>
                </View>

                <View>
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-sans">Daily Habits</Text>
                        <TouchableOpacity>
                            <Text className="text-[10px] uppercase tracking-[0.2em] text-[#ECECEC] font-sans">
                                View All
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className="gap-4">
                        <View className="bg-white/5 border border-white/10 rounded-[4px] p-5 flex-row items-center justify-between">
                            <View className="flex-col">
                                <Text className="text-lg font-heading text-[#ECECEC]">Morning Breathwork</Text>
                                <Text className="text-[10px] text-[#8A8A8A] tracking-widest mt-1 font-sans">
                                    COMPLETED • 8:30 AM
                                </Text>
                            </View>
                            <View className="w-6 h-6 border border-[#9CAF88] bg-[#9CAF88]/20 flex items-center justify-center rounded-[1px]">
                                <Ionicons name="checkmark" size={16} color="#9CAF88" />
                            </View>
                        </View>
                        <View className="bg-[#161616] border border-[#333333] rounded-[4px] p-5 flex-row items-center justify-between opacity-80">
                            <View className="flex-col">
                                <Text className="text-lg font-heading text-[#ECECEC]">Digital Detox</Text>
                                <Text className="text-[10px] text-[#8A8A8A] tracking-widest mt-1 font-sans">
                                    SCHEDULED • 9:00 PM
                                </Text>
                            </View>
                            <View className="w-6 h-6 border border-[#333333] flex items-center justify-center rounded-[1px]" />
                        </View>
                        <View className="bg-[#161616] border border-[#333333] rounded-[4px] p-5 flex-row items-center justify-between opacity-80">
                            <View className="flex-col">
                                <Text className="text-lg font-heading text-[#ECECEC]">Gratitude Journal</Text>
                                <Text className="text-[10px] text-[#8A8A8A] tracking-widest mt-1 font-sans">PENDING</Text>
                            </View>
                            <View className="w-6 h-6 border border-[#333333] flex items-center justify-center rounded-[1px]" />
                        </View>
                    </View>
                </View>

                <View className="pt-4">
                    <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-6 text-right font-sans">
                        Up Next
                    </Text>
                    <View className="relative overflow-hidden rounded-[4px] group min-h-[140px]">
                        <Image
                            source={{ uri: "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800&q=80" }}
                            contentFit="cover"
                            className="absolute inset-0 w-full h-full opacity-20 grayscale"
                        />
                        <LinearGradient
                            colors={["#161616", "rgba(22,22,22,0.5)"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="absolute inset-0"
                        />
                        <View className="relative z-10 p-6 border border-white/10 rounded-[4px] flex-col h-full justify-between">
                            <View className="flex-row justify-between items-start w-full">
                                <View className="bg-[#DBC188]/10 border border-[#DBC188]/20 px-3 py-1 rounded-[2px]">
                                    <Text className="text-[10px] tracking-widest text-[#DBC188] uppercase font-sans">
                                        Live Event
                                    </Text>
                                </View>
                                <Text className="text-[10px] tracking-widest text-[#ECECEC] font-sans">20:00 GMT</Text>
                            </View>
                            <View>
                                <Text className="font-heading text-2xl text-[#ECECEC]">Sound Bath & Clarity</Text>
                                <Text className="text-xs text-[#8A8A8A] mt-1 font-sans tracking-wide">
                                    With Instructor Sarah Chen
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
