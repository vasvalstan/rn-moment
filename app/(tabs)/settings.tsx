import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Settings() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-[#121212]">
            <View className="flex-row justify-between items-end px-6 pt-12 pb-4 bg-[#121212]/80 border-b border-white/5">
                <View className="flex-col">
                    <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-1 font-sans">
                        Preferences
                    </Text>
                    <Text className="text-sm font-medium tracking-widest text-[#ECECEC] font-sans">
                        CONTROL
                    </Text>
                </View>
                <TouchableOpacity>
                    <Text className="text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A] font-sans">
                        Done
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView className="flex-1 px-6 pt-8 pb-24" contentContainerStyle={{ paddingBottom: 100, gap: 40 }}>
                <View className="relative">
                    <View className="absolute right-0 top-0 w-3/4 h-80 overflow-hidden opacity-20 rounded-[4px]">
                        <Image
                            source={{ uri: "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800&q=80" }}
                            contentFit="cover"
                            className="w-full h-full grayscale contrast-125 brightness-50"
                            style={{ mixBlendMode: "screen" }}
                        />
                        <LinearGradient
                            colors={["transparent", "rgba(18,18,18,0.3)", "#121212"]}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                            className="absolute inset-0"
                        />
                        <LinearGradient
                            colors={["rgba(18,18,18,0.2)", "transparent", "#121212"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            className="absolute inset-0"
                        />
                    </View>
                    <View className="relative z-10 pt-6">
                        <Text className="font-heading text-6xl leading-[1.05] text-[#ECECEC] tracking-tight">
                            Settings
                        </Text>
                    </View>
                </View>

                <View>
                    <View className="flex-row items-center justify-between mb-4 pb-2 border-b border-white/5">
                        <Text className="text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A] font-sans">Account</Text>
                    </View>
                    <View className="bg-white/5 backdrop-blur-sm border border-[#333333] rounded-[2px] overflow-hidden">
                        <TouchableOpacity 
                            onPress={() => router.push("/profile")}
                            className="flex-row items-center justify-between px-5 py-4 border-b border-white/5 active:bg-white/5"
                        >
                            <Text className="font-heading text-lg text-[#ECECEC]">Profile Settings</Text>
                            <Ionicons name="chevron-forward" size={20} color="#DBC188" />
                        </TouchableOpacity>
                        <View className="flex-row items-center justify-between px-5 py-4 border-b border-white/5">
                            <Text className="font-heading text-lg text-[#ECECEC]">Notifications</Text>
                            <View className="flex-row items-center gap-2">
                                <Text className="text-[10px] uppercase tracking-widest text-[#8A8A8A] font-sans">On</Text>
                                <View className="relative w-11 h-6 bg-[#9CAF88]/30 rounded-full border border-[#9CAF88]/50">
                                    <View className="absolute right-0.5 top-0.5 w-5 h-5 bg-[#9CAF88] rounded-full" />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View>
                    <View className="flex-row items-center justify-between mb-4 pb-2 border-b border-white/5">
                        <Text className="text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A] font-sans">Preferences</Text>
                    </View>
                    <View className="bg-white/5 backdrop-blur-sm border border-[#333333] rounded-[2px] overflow-hidden">
                        <TouchableOpacity className="flex-row items-center justify-between px-5 py-4 border-b border-white/5 active:bg-white/5">
                            <Text className="font-heading text-lg text-[#ECECEC]">Theme</Text>
                            <View className="flex-row items-center gap-2">
                                <Text className="text-xs tracking-wider text-[#DBC188] font-sans">Dark</Text>
                                <Ionicons name="chevron-forward" size={20} color="#8A8A8A" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center justify-between px-5 py-4 border-b border-white/5 active:bg-white/5">
                            <Text className="font-heading text-lg text-[#ECECEC]">Language</Text>
                            <View className="flex-row items-center gap-2">
                                <Text className="text-xs tracking-wider text-[#DBC188] font-sans">English</Text>
                                <Ionicons name="chevron-forward" size={20} color="#8A8A8A" />
                            </View>
                        </TouchableOpacity>
                        <View className="flex-row items-center justify-between px-5 py-4">
                            <Text className="font-heading text-lg text-[#ECECEC]">Reminders</Text>
                            <View className="relative w-11 h-6 bg-[#262626] rounded-full border border-[#333333]">
                                <View className="absolute left-0.5 top-0.5 w-5 h-5 bg-[#8A8A8A] rounded-full" />
                            </View>
                        </View>
                    </View>
                </View>

                <View>
                    <View className="flex-row items-center justify-between mb-4 pb-2 border-b border-white/5">
                        <Text className="text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A] font-sans">Session</Text>
                    </View>
                    <View className="bg-white/5 backdrop-blur-sm border border-[#333333] rounded-[2px] overflow-hidden">
                        <TouchableOpacity className="flex-row items-center justify-between px-5 py-4 border-b border-white/5 active:bg-white/5">
                            <Text className="font-heading text-lg text-[#ECECEC]">Default Duration</Text>
                            <View className="flex-row items-center gap-2">
                                <Text className="text-xs tracking-wider text-[#DBC188] font-sans">20 min</Text>
                                <Ionicons name="chevron-forward" size={20} color="#8A8A8A" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center justify-between px-5 py-4 active:bg-white/5">
                            <Text className="font-heading text-lg text-[#ECECEC]">Sound Settings</Text>
                            <Ionicons name="chevron-forward" size={20} color="#DBC188" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View>
                    <View className="flex-row items-center justify-between mb-4 pb-2 border-b border-white/5">
                        <Text className="text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A] font-sans">About</Text>
                    </View>
                    <View className="bg-white/5 backdrop-blur-sm border border-[#333333] rounded-[2px] overflow-hidden">
                        <View className="flex-row items-center justify-between px-5 py-4 border-b border-white/5">
                            <Text className="font-heading text-lg text-[#ECECEC]">Version</Text>
                            <Text className="text-xs tracking-wider text-[#8A8A8A] font-sans">2.4.1</Text>
                        </View>
                        <TouchableOpacity className="flex-row items-center justify-between px-5 py-4 active:bg-white/5">
                            <Text className="font-heading text-lg text-[#ECECEC]">Privacy Policy</Text>
                            <Ionicons name="chevron-forward" size={20} color="#DBC188" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
