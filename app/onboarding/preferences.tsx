import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useOnboarding } from "../../context/OnboardingContext";
import { useState } from "react";
import { requestNotificationPermissions, scheduleDailyReminder } from "../../utils/notifications";

export default function OnboardingPreferences() {
    const router = useRouter();
    const { updateData } = useOnboarding();

    const [sessionLength, setSessionLength] = useState(20);
    const [practiceTime, setPracticeTime] = useState("morning");
    const [reminders, setReminders] = useState(false);

    const toggleReminders = async () => {
        const nextValue = !reminders;
        if (nextValue) {
            const granted = await requestNotificationPermissions();
            if (!granted) {
                Alert.alert(
                    "Permissions Required",
                    "Please enable notifications in your settings to receive daily reminders."
                );
                return;
            }
        }
        setReminders(nextValue);
    };

    const handleComplete = async () => {
        if (reminders) {
            // Map practiceTime to hours
            let hour = 8; // Default morning
            if (practiceTime === "afternoon") hour = 14;
            if (practiceTime === "evening") hour = 20;
            
            await scheduleDailyReminder(hour, 0);
        }
        
        updateData({ sessionLength, practiceTime, reminders });
        router.push("/login-signup");
    };

    return (
        <View className="relative flex-1 flex-col overflow-hidden bg-[#121212]">
            <View className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    source={{ uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop" }}
                    contentFit="cover"
                    className="w-full h-full scale-110 opacity-20"
                    style={{ mixBlendMode: "overlay" }}
                />
                <LinearGradient
                    colors={["rgba(18,18,18,0.9)", "rgba(18,18,18,0.7)", "#121212"]}
                    className="absolute inset-0"
                />
            </View>
            <View className="flex-1 flex flex-col relative z-10 px-6 pt-20">
                <View className="text-center mb-10">
                    <Text className="font-heading text-4xl leading-[1.15] tracking-tight italic text-white text-center">
                        Personalize your{"\n"}
                        <Text className="text-primary">experience</Text>
                    </Text>
                </View>
                <View className="space-y-10 flex-1 gap-10">
                    <View className="space-y-4 gap-4">
                        <Text className="block text-sm font-medium tracking-wide text-[#E0E0E0]">
                            Preferred session length?
                        </Text>
                        <View className="flex-row gap-3">
                            {[5, 10, 20, 30].map((min) => (
                                <TouchableOpacity
                                    key={min}
                                    onPress={() => setSessionLength(min)}
                                    className={`flex-1 h-12 rounded-sm border text-sm font-medium items-center justify-center active:scale-95 ${sessionLength === min ? 'border-[#C9A961] bg-[#C9A961]/20' : 'border-[#2A2A2A] bg-[#1A1A1A]'}`}
                                >
                                    <Text className={sessionLength === min ? 'text-[#C9A961]' : 'text-[#E0E0E0]'}>{min} min{min === 30 ? '+' : ''}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View className="space-y-4 gap-4">
                        <Text className="block text-sm font-medium tracking-wide text-[#E0E0E0]">
                            When would you like to practice?
                        </Text>
                        <View className="flex-row gap-4 justify-center">
                            {[
                                { id: "morning", icon: "weather-sunset-up", label: "Morning" },
                                { id: "afternoon", icon: "weather-sunny", label: "Afternoon" },
                                { id: "evening", icon: "weather-night", label: "Evening" }
                            ].map((time) => (
                                <TouchableOpacity
                                    key={time.id}
                                    onPress={() => setPracticeTime(time.id)}
                                    className={`flex flex-col items-center justify-center rounded-sm border active:scale-95 w-20 h-20 ${practiceTime === time.id ? 'border-[#C9A961] bg-[#C9A961]/15' : 'border-[#2A2A2A] bg-[#1A1A1A]'}`}
                                >
                                    <MaterialCommunityIcons name={time.icon as any} size={28} color="#8B9D7A" />
                                    <Text className="text-[10px] uppercase tracking-wider mt-2 text-[#9B9B9B]">
                                        {time.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View className="flex-row items-center justify-between py-4 px-1">
                        <Text className="text-sm font-medium tracking-wide text-[#E0E0E0]">
                            Daily reminder?
                        </Text>
                        <TouchableOpacity
                            onPress={toggleReminders}
                            activeOpacity={0.8}
                            className={`relative w-14 h-7 rounded-full ${reminders ? 'bg-[#C9A961]' : 'bg-[#2A2A2A]'}`}
                        >
                            <View 
                                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm ${reminders ? 'right-0.5' : 'left-0.5'}`} 
                                style={{
                                    transform: [{ translateX: 0 }] // Force re-render if needed
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View className="relative z-20 px-6 pb-8 pt-6">
                <LinearGradient
                    colors={["transparent", "rgba(18,18,18,0.95)", "#121212"]}
                    className="absolute inset-0"
                />
                <TouchableOpacity
                    onPress={handleComplete}
                    className="group relative w-full h-14 flex items-center justify-center overflow-hidden active:scale-[0.98]"
                >
                    <View className="absolute inset-0 border rounded-sm border-[#C9A961]" />
                    <View className="absolute inset-[1px] rounded-[1px] flex items-center justify-center bg-[#C9A961]">
                        <Text className="font-sans text-primary-foreground font-semibold tracking-[0.15em] uppercase text-xs">
                            Complete Setup
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
