import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../context/OnboardingContext";
import { useState } from "react";

export default function OnboardingAge() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selectedAge, setSelectedAge] = useState<string | null>(null);

    const ageRanges = ["18–24", "25–34", "35–44", "45–54", "55–64", "65+"];

    const handleContinue = () => {
        if (selectedAge) {
            updateData({ age: selectedAge });
            router.push("/onboarding/experience");
        }
    };

    return (
        <View className="relative flex-1 w-full bg-[#121212] flex flex-col overflow-hidden">
            <LinearGradient
                colors={["#1a1a1a", "#121212"]}
                className="absolute top-0 left-0 w-full h-[60vh] opacity-50 z-0 pointer-events-none"
            />
            <View className="flex-1 flex flex-col relative z-10 px-8 pt-28">
                <View className="text-center mb-16">
                    <Text className="font-heading text-5xl leading-[1.1] tracking-tight text-[#E8E4DD] text-center">
                        What&apos;s your{"\n"}
                        <Text className="text-[#C9A961] italic">age range?</Text>
                    </Text>
                </View>
                <ScrollView className="flex-1 flex flex-col space-y-4 pb-8" contentContainerStyle={{ gap: 16 }}>
                    {ageRanges.map((range, index) => {
                        const isSelected = selectedAge === range;
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedAge(range)}
                                className="group relative w-full h-16 flex items-center justify-center overflow-hidden active:scale-[0.98]"
                            >
                                <View className={`absolute inset-0 rounded-[4px] border ${isSelected ? 'bg-[#C9A961]/20 border-[#C9A961]' : 'bg-[#1a1a1a]/40 border-[#C9A961]/20'}`} />
                                <View className="relative z-10">
                                    <Text className={`font-sans font-light tracking-[0.1em] text-base ${isSelected ? 'text-[#C9A961] font-medium' : 'text-[#E8E4DD]'}`}>
                                        {range}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
            <View className="relative z-20 px-6 pb-8 pt-4">
                <LinearGradient
                    colors={["transparent", "#121212"]}
                    className="absolute inset-0"
                />
                <TouchableOpacity
                    onPress={handleContinue}
                    className={`group relative w-full h-14 flex items-center justify-center overflow-hidden active:scale-[0.98] ${selectedAge ? '' : 'opacity-40'}`}
                    disabled={!selectedAge}
                >
                    <View className="absolute inset-0 border border-[#C9A961]/30 rounded-[4px]" />
                    <View className="absolute inset-[1px] bg-[#C9A961] rounded-[3px]">
                        <View className="w-full h-full flex items-center justify-center">
                            <Text className="font-sans text-[#121212] font-semibold tracking-[0.15em] uppercase text-xs">
                                Continue
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
