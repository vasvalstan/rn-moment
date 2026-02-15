import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";

export default function Stats() {
    return (
        <View className="flex-1 bg-[#121212]">
            <View className="flex-row justify-between items-end px-6 pt-12 pb-4 bg-[#121212]/80 border-b border-white/5">
                <View className="flex-col">
                    <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-1 font-sans">
                        Your Progress
                    </Text>
                    <Text className="text-sm font-medium tracking-widest text-[#ECECEC] font-sans">
                        WEEK 42
                    </Text>
                </View>
                <TouchableOpacity>
                    <Text className="text-[10px] uppercase tracking-[0.2em] text-[#DBC188] font-sans">
                        Export
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView className="flex-1 px-6 pt-3 pb-24" contentContainerStyle={{ paddingBottom: 100, gap: 40 }}>
                <View className="relative">
                    <View className="absolute right-0 top-0 w-3/5 h-72 overflow-hidden opacity-30 rounded-[4px]">
                        <Image
                            source={{ uri: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80" }}
                            contentFit="cover"
                            className="w-full h-full grayscale contrast-125 brightness-75"
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
                    <View className="relative z-10 pt-4">
                        <Text className="font-heading text-6xl leading-[1.05] text-[#ECECEC] max-w-[75%]">
                            Statistics
                        </Text>
                    </View>
                </View>

                <View className="gap-6">
                    <View className="bg-white/5 backdrop-blur-sm border border-[#333333] rounded-[2px] p-6 relative overflow-hidden">
                        <View className="absolute top-0 right-0 w-24 h-24 bg-[#DBC188]/5 rounded-full blur-2xl" />
                        <View className="relative z-10">
                            <Text className="block text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A] mb-3 font-medium font-sans">
                                Current Streak
                            </Text>
                            <Text className="font-sans text-7xl font-light tracking-tighter text-[#ECECEC] mb-2">
                                47
                            </Text>
                            <Text className="text-xs text-[#9CAF88] tracking-wide font-sans">Consecutive Days</Text>
                        </View>
                    </View>

                    <View className="bg-white/5 backdrop-blur-sm border border-[#333333] rounded-[2px] p-6 relative overflow-hidden">
                        <View className="absolute bottom-0 left-0 w-32 h-32 bg-[#9CAF88]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                        <View className="relative z-10">
                            <Text className="block text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A] mb-4 font-medium font-sans">
                                Weekly Activity
                            </Text>
                            <View className="flex-row items-end justify-between h-40 gap-3">
                                {[
                                    { day: "M", height: "h-20" },
                                    { day: "T", height: "h-16" },
                                    { day: "W", height: "h-20" },
                                    { day: "T", height: "h-14" },
                                    { day: "F", height: "h-24" },
                                    { day: "S", height: "h-12" },
                                    { day: "S", height: "h-10", color: "text-[#DBC188]" },
                                ].map((item, index) => (
                                    <View key={index} className="flex-1 flex-col justify-end items-center gap-2">
                                        <View className="w-full bg-[#262626] rounded-t-[2px] h-24 flex-col justify-end">
                                            <View className={`w-full bg-[#9CAF88] rounded-t-[2px] ${item.height}`} />
                                        </View>
                                        <Text className={`text-[9px] tracking-widest font-sans ${item.color || 'text-[#8A8A8A]'}`}>
                                            {item.day}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                <View className="flex-row gap-4">
                    <View className="flex-1 bg-[#161616] border border-[#333333] rounded-[2px] p-5 flex-col justify-between min-h-[140px]">
                        <Text className="block text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A] font-medium font-sans">
                            Total Time
                        </Text>
                        <View className="mt-auto">
                            <Text className="font-sans text-4xl font-light tracking-tight text-[#ECECEC] mb-1">
                                24.5
                            </Text>
                            <Text className="text-[10px] text-[#8A8A8A] tracking-widest font-sans">HOURS</Text>
                        </View>
                    </View>
                    <View className="flex-1 bg-[#161616] border border-[#333333] rounded-[2px] p-5 flex-col justify-between min-h-[140px] relative overflow-hidden">
                        <View className="absolute bottom-0 right-0 w-20 h-20 bg-[#DBC188]/5 rounded-full blur-xl" />
                        <Text className="block text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A] font-medium relative z-10 font-sans">
                            Sessions
                        </Text>
                        <View className="mt-auto relative z-10">
                            <Text className="font-sans text-4xl font-light tracking-tight text-[#ECECEC] mb-1">
                                142
                            </Text>
                            <Text className="text-[10px] text-[#8A8A8A] tracking-widest font-sans">COMPLETED</Text>
                        </View>
                    </View>
                </View>

                <View className="bg-white/5 backdrop-blur-sm border border-[#333333] rounded-[2px] p-6">
                    <View className="flex-row justify-between items-start mb-6">
                        <Text className="block text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A] font-medium font-sans">
                            Habit Completion
                        </Text>
                        <Text className="text-xs text-[#9CAF88] tracking-wide font-sans">This Week</Text>
                    </View>
                    <View className="flex-row items-center justify-center gap-8">
                        <View className="relative items-center justify-center">
                            <Svg width="120" height="120" className="transform -rotate-90">
                                <Circle cx="60" cy="60" r="50" fill="none" stroke="#262626" strokeWidth="8" />
                                <Circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#DBC188"
                                    strokeWidth="8"
                                    strokeDasharray="314"
                                    strokeDashoffset="47"
                                    strokeLinecap="round"
                                />
                            </Svg>
                            <View className="absolute inset-0 items-center justify-center flex-col">
                                <Text className="font-sans text-3xl font-light tracking-tight text-[#ECECEC]">
                                    85
                                </Text>
                                <Text className="text-[9px] text-[#8A8A8A] tracking-widest font-sans">PERCENT</Text>
                            </View>
                        </View>
                        <View className="flex-col gap-3">
                            <View className="flex-row items-center gap-2">
                                <View className="w-3 h-3 bg-[#DBC188] rounded-[1px]" />
                                <Text className="text-xs text-[#ECECEC] tracking-wide font-sans">Completed</Text>
                            </View>
                            <View className="flex-row items-center gap-2">
                                <View className="w-3 h-3 bg-[#262626] rounded-[1px]" />
                                <Text className="text-xs text-[#8A8A8A] tracking-wide font-sans">Remaining</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="bg-[#161616] border border-[#333333] rounded-[2px] p-6 relative overflow-hidden">
                    <View className="absolute top-0 left-0 w-40 h-40 bg-[#9CAF88]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                    <View className="relative z-10">
                        <Text className="block text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A] mb-4 font-medium font-sans">
                            Average Duration
                        </Text>
                        <View className="flex-row items-baseline gap-2 mb-1">
                            <Text className="font-sans text-5xl font-light tracking-tight text-[#ECECEC]">
                                18
                            </Text>
                            <Text className="text-xl text-[#8A8A8A] font-light font-sans">min</Text>
                        </View>
                        <View className="flex-row items-center gap-2 mt-4">
                            <View className="flex-1 h-[1px] bg-[#262626]">
                                <View className="w-3/5 h-full bg-[#9CAF88]" />
                            </View>
                            <Text className="text-[9px] text-[#9CAF88] tracking-widest font-sans">+12% FROM LAST WEEK</Text>
                        </View>
                    </View>
                </View>

                <View className="pt-4">
                    <View className="w-full h-[1px] bg-white/10 mb-6" />
                    <View className="flex-row justify-between items-center">
                        <View className="flex-col">
                            <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-sans">
                                Best Day
                            </Text>
                            <Text className="font-heading text-2xl text-[#ECECEC] mt-1">Friday</Text>
                        </View>
                        <View className="flex-col items-end">
                            <Text className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] font-sans">
                                Longest Session
                            </Text>
                            <Text className="font-sans text-2xl font-light tracking-tight text-[#ECECEC] mt-1">
                                45:00
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
