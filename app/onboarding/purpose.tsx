import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../context/OnboardingContext";
import { useState } from "react";

export default function OnboardingPurpose() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);

    const purposes = [
        "Reduce Stress",
        "Build Better Habits",
        "Improve Focus",
        "Find Inner Peace",
        "Sleep Better",
        "Daily Reflection",
    ];

    const togglePurpose = (purpose: string) => {
        if (selectedPurposes.includes(purpose)) {
            setSelectedPurposes(selectedPurposes.filter(p => p !== purpose));
        } else {
            setSelectedPurposes([...selectedPurposes, purpose]);
        }
    };

    const handleContinue = () => {
        updateData({ purpose: selectedPurposes });
        router.push("/onboarding/age");
    };

    return (
        <View className="relative flex-1 w-full bg-[#121212] flex flex-col overflow-hidden">
            <LinearGradient
                colors={["#1a1a1a", "#121212"]}
                className="absolute top-0 left-0 w-full h-[60vh] opacity-50 z-0 pointer-events-none"
            />
            <View className="relative z-10 w-full pt-14 px-6 flex justify-center items-center">
                <Text className="font-mono text-xs tracking-[0.2em] text-[#6B6B6B]">
                    02 / 05
                </Text>
            </View>
            <View className="flex-1 flex flex-col relative z-10 px-6 pt-12 pb-6">
                <View className="mb-10">
                    <Text className="font-heading text-[42px] leading-[1.15] tracking-tight text-[#E8E4DD] mb-3">
                        What brings you{"\n"}
                        here?
                    </Text>
                    <View className="w-16 h-[1px] bg-[#C9A961]" />
                </View>
                <ScrollView className="flex-1 -mx-6 px-6 pb-4" contentContainerStyle={{ paddingBottom: 20 }}>
                    <View className="space-y-3 gap-3">
                        {purposes.map((purpose, index) => {
                            const isSelected = selectedPurposes.includes(purpose);
                            return (
                                <View key={index} className={`relative group ${index % 2 === 0 ? 'ml-0' : 'ml-8'}`}>
                                    <LinearGradient
                                        colors={isSelected ? ["rgba(201, 169, 97, 0.2)", "transparent"] : ["rgba(139,157,122,0.1)", "transparent"]}
                                        className="absolute inset-0 rounded-[2px]"
                                    />
                                    <TouchableOpacity
                                        onPress={() => togglePurpose(purpose)}
                                        className={`relative border rounded-[2px] p-5 active:scale-[0.98] ${isSelected ? 'border-[#C9A961] bg-[#C9A961]/10' : 'border-[#C9A961]/20 bg-[#1a1a1a]/40'}`}
                                    >
                                        <Text className={`font-sans text-sm tracking-[0.15em] uppercase font-light ${isSelected ? 'text-[#C9A961]' : 'text-[#E8E4DD]'}`}>
                                            {purpose}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>
            <View className="relative z-20 px-6 pb-8 pt-4">
                <LinearGradient
                    colors={["transparent", "#121212"]}
                    className="absolute inset-0"
                />
                <TouchableOpacity
                    onPress={handleContinue}
                    className="group relative w-full h-14 flex items-center justify-center overflow-hidden active:scale-[0.98]"
                >
                    <View className="absolute inset-0 border border-[#C9A961]/30 rounded-[4px]" />
                    <View className="absolute inset-[1px] bg-[#C9A961] rounded-[3px] flex items-center justify-center">
                        <Text className="font-sans text-[#121212] font-semibold tracking-[0.15em] uppercase text-xs">
                            Continue
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
