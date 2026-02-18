import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { signOut } from "@/lib/auth-client";

export default function Profile() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const user = useQuery(api.users.getUser);
    const stats = useQuery(api.stats.getUserStats);

    const isLoading = user === undefined || stats === undefined;
    const profileName = user?.name?.trim() || "Your Profile";
    const profileImage =
        user?.pictureUrl?.trim() || "https://randomuser.me/api/portraits/women/67.jpg";
    const currentStreak = stats?.currentStreak ?? 0;
    const longestStreak = stats?.longestStreak ?? 0;
    const totalSessions = stats?.totalSessions ?? 0;
    const totalHours = ((stats?.totalTime ?? 0) / 60).toFixed(1);
    const memberLabel = user?.experience
        ? `${user.experience} Practice`
        : "Mindfulness Member";

    const onSignOutPress = async () => {
        try {
            await signOut();
            router.replace("/login-signup");
        } catch (err) {
            console.error("Error signing out:", err);
        }
    };

    return (
        <View className="flex-1 bg-[#121212]">
            <View className="absolute inset-0 overflow-hidden pointer-events-none">
                <View className="absolute top-0 right-0 w-full h-[60vh] opacity-30">
                    <Image
                        source={{ uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80" }}
                        contentFit="cover"
                        className="w-full h-full grayscale contrast-150 brightness-50"
                        style={{ mixBlendMode: "screen" }}
                    />
                    <LinearGradient
                        colors={["rgba(18,18,18,0.2)", "rgba(18,18,18,0.6)", "#121212"]}
                        className="absolute inset-0"
                    />
                    <LinearGradient
                        colors={["transparent", "rgba(18,18,18,0.4)", "#121212"]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        className="absolute inset-0"
                    />
                </View>
            </View>

            {/* Header with Back Button */}
            <View
                className="absolute top-0 left-0 right-0 z-50 px-6 flex-row justify-between items-center"
                style={{ paddingTop: insets.top + 10 }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10"
                >
                    <Ionicons name="arrow-back" size={20} color="#ECECEC" />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1 px-6"
                contentContainerStyle={{ paddingBottom: 100, gap: 48, paddingTop: insets.top + 80 }}
            >
                <View className="flex-col items-start">
                    <View className="flex-row items-center space-x-5 mb-3">
                        <View className="relative">
                            <View className="w-28 h-28 rounded-full border border-[#8A8A8A]/40 overflow-hidden bg-[#1A1A1A]">
                                <Image
                                    source={{ uri: profileImage }}
                                    contentFit="cover"
                                    className="w-full h-full"
                                />
                            </View>
                        </View>
                    </View>
                    <View className="mt-2">
                        <Text className="font-heading text-4xl text-[#ECECEC] mb-1">{profileName}</Text>
                        <Text className="text-[10px] uppercase tracking-[0.3em] text-[#DBC188] font-sans">
                            {memberLabel}
                        </Text>
                        {isLoading && (
                            <View className="flex-row items-center gap-2 mt-3">
                                <ActivityIndicator size="small" color="#DBC188" />
                                <Text className="text-[10px] uppercase tracking-[0.22em] text-[#8A8A8A] font-sans">
                                    Syncing profile
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View className="flex-row flex-wrap gap-4">
                    <View className="w-[47%] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2px] p-5 flex-col">
                        <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-3 font-sans">
                            Current Streak
                        </Text>
                        <Text className="font-sans text-5xl font-light tracking-tighter text-[#C0C0C0]">
                            {currentStreak}
                        </Text>
                    </View>
                    <View className="w-[47%] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2px] p-5 flex-col">
                        <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-3 font-sans">
                            Total Sessions
                        </Text>
                        <Text className="font-sans text-5xl font-light tracking-tighter text-[#C0C0C0]">
                            {totalSessions}
                        </Text>
                    </View>
                    <View className="w-[47%] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2px] p-5 flex-col">
                        <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-3 font-sans">
                            Longest Streak
                        </Text>
                        <Text className="font-sans text-5xl font-light tracking-tighter text-[#C0C0C0]">
                            {longestStreak}
                        </Text>
                    </View>
                    <View className="w-[47%] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2px] p-5 flex-col">
                        <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-3 font-sans">
                            Total Time
                        </Text>
                        <View className="flex-row items-baseline gap-1 mt-1">
                            <Text className="font-sans text-4xl font-light tracking-tight text-[#ECECEC]">
                                {totalHours}
                            </Text>
                            <Text className="text-xs tracking-widest text-[#8A8A8A] font-sans">HRS</Text>
                        </View>
                    </View>
                </View>

                <View>
                    <View className="flex-row items-center justify-between mb-6 border-b border-white/10 pb-2">
                        <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-sans">Achievements</Text>
                    </View>
                    <View className="flex-row flex-wrap gap-4">
                        {[
                            { icon: "medal", color: "#DBC188", label: "Zen Master" },
                            { icon: "fire", color: "#DBC188", label: "Streak Hero" },
                            { icon: "moon", color: "#9CAF88", label: "Night Owl" },
                            { icon: "star", color: "#9CAF88", label: "Dedicated" },
                            { icon: "heart", color: "#9CAF88", label: "Self-Care" },
                            { icon: "sunny", color: "#DBC188", label: "Early Riser" },
                        ].map((item) => (
                            <View key={item.label} className="w-[30%] bg-[#161616] border border-[#333333] rounded-[2px] p-5 flex-col items-center">
                                <View className="w-12 h-12 flex items-center justify-center mb-3">
                                    <Ionicons name={item.icon as any} size={32} color={item.color} />
                                </View>
                                <Text className="text-[10px] uppercase tracking-widest text-[#8A8A8A] text-center font-sans">
                                    {item.label}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View className="pt-4 gap-4">
                    <TouchableOpacity className="w-full py-4 px-6 border border-[#DBC188]/30 rounded-[2px] flex items-center justify-center active:bg-[#DBC188]/10 active:scale-95">
                        <Text className="text-[10px] uppercase tracking-[0.25em] text-[#DBC188] font-sans">
                            Edit Profile
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onSignOutPress}
                        className="w-full py-4 px-6 border border-[#FF5A5A]/30 rounded-[2px] flex items-center justify-center active:bg-[#FF5A5A]/10 active:scale-95"
                    >
                        <Text className="text-[10px] uppercase tracking-[0.25em] text-[#FF5A5A] font-sans">
                            Sign Out
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
