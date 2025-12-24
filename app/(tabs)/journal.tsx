import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function Journal() {
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
                        Filter
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView className="flex-1 px-6 pt-8 pb-24" contentContainerStyle={{ paddingBottom: 100, gap: 32 }}>
                <View className="relative">
                    <View className="absolute left-0 top-12 w-1/2 h-96 overflow-hidden opacity-30 rounded-[2px] pointer-events-none">
                        <Image
                            source={{ uri: "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800&q=80" }}
                            contentFit="cover"
                            className="w-full h-full grayscale contrast-125 brightness-75 blur-sm"
                            style={{ mixBlendMode: "screen" }}
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
                    </View>
                </View>

                <View className="gap-6">
                    <View className="bg-white/5 backdrop-blur-sm border border-[#DBC188]/30 rounded-[2px] p-6 relative overflow-hidden">
                        <View className="absolute top-0 right-0 w-24 h-24 bg-[#DBC188]/5 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3" />
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-sans">
                                    Oct 24, 2024
                                </Text>
                            </View>
                            <Text className="text-[10px] tracking-widest text-[#DBC188] font-sans">8:45 AM</Text>
                        </View>
                        <Text className="font-heading text-2xl text-[#ECECEC] mb-3">Morning Clarity</Text>
                        <Text className="text-sm text-[#8A8A8A] leading-relaxed font-sans">
                            Woke up feeling grounded today. The meditation session brought a sense of calm that
                            carried through breakfast. Noticed how...
                        </Text>
                    </View>

                    <View className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2px] p-6 relative overflow-hidden">
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-sans">
                                    Oct 23, 2024
                                </Text>
                            </View>
                            <Text className="text-[10px] tracking-widest text-[#ECECEC] font-sans">9:30 PM</Text>
                        </View>
                        <Text className="font-heading text-2xl text-[#ECECEC] mb-3">Evening Reflections</Text>
                        <Text className="text-sm text-[#8A8A8A] leading-relaxed font-sans">
                            Today was challenging but rewarding. The breath work helped me navigate through
                            moments of tension. Grateful for the...
                        </Text>
                    </View>

                    <View className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2px] p-6 relative overflow-hidden">
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-sans">
                                    Oct 22, 2024
                                </Text>
                            </View>
                            <Text className="text-[10px] tracking-widest text-[#ECECEC] font-sans">7:15 AM</Text>
                        </View>
                        <Text className="font-heading text-2xl text-[#ECECEC] mb-3">Gratitude Practice</Text>
                        <Text className="text-sm text-[#8A8A8A] leading-relaxed font-sans">
                            Three things I'm grateful for: the quiet morning hours, supportive friends, and the
                            courage to keep showing up for...
                        </Text>
                    </View>

                    <View className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2px] p-6 relative overflow-hidden">
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-sans">
                                    Oct 21, 2024
                                </Text>
                            </View>
                            <Text className="text-[10px] tracking-widest text-[#ECECEC] font-sans">6:00 PM</Text>
                        </View>
                        <Text className="font-heading text-2xl text-[#ECECEC] mb-3">Mindful Movement</Text>
                        <Text className="text-sm text-[#8A8A8A] leading-relaxed font-sans">
                            The yoga flow today opened something within me. Each pose felt intentional, connected.
                            The body knows what it needs...
                        </Text>
                    </View>

                    <View className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2px] p-6 relative overflow-hidden">
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-sans">
                                    Oct 20, 2024
                                </Text>
                            </View>
                            <Text className="text-[10px] tracking-widest text-[#ECECEC] font-sans">10:00 AM</Text>
                        </View>
                        <Text className="font-heading text-2xl text-[#ECECEC] mb-3">Digital Detox Day</Text>
                        <Text className="text-sm text-[#8A8A8A] leading-relaxed font-sans">
                            Spending time away from screens revealed how much mental space I've been giving to
                            notifications. The silence was...
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity className="absolute bottom-6 right-6 w-14 h-14 bg-[#DBC188] rounded-[2px] flex items-center justify-center shadow-lg active:bg-[#B89A5F] active:scale-95 z-40">
                <Ionicons name="add-circle" size={24} color="#121212" />
            </TouchableOpacity>
        </View>
    );
}
