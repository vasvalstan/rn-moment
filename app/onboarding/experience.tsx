import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../context/OnboardingContext";
import { useState } from "react";

export default function OnboardingExperience() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
    const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
    const [customPractice, setCustomPractice] = useState("");

    const experiences = [
        {
            id: "beginner",
            title: "Complete Beginner",
            subtitle: "Just starting my journey",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop",
            style: "scale-150",
            imagePos: "right-0"
        },
        {
            id: "intermediate",
            title: "Some Experience",
            subtitle: "Tried it a few times",
            image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=400&auto=format&fit=crop",
            style: "",
            imagePos: "left-0"
        },
        {
            id: "regular",
            title: "Regular Practice",
            subtitle: "Part of my routine",
            image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=400&auto=format&fit=crop",
            style: "scale-125",
            imagePos: "right-0 bottom-0"
        },
        {
            id: "advanced",
            title: "Advanced Practitioner",
            subtitle: "Deeply experienced",
            image: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?q=80&w=400&auto=format&fit=crop",
            style: "",
            imagePos: "left-0 top-0"
        }
    ];

    const togglePractice = (practice: string) => {
        if (selectedPractices.includes(practice)) {
            setSelectedPractices(selectedPractices.filter(p => p !== practice));
        } else {
            setSelectedPractices([...selectedPractices, practice]);
        }
    };

    const handleContinue = () => {
        if (selectedExperience) {
            // Add custom practice if entered
            const allPractices = customPractice.trim() 
                ? [...selectedPractices, customPractice.trim()]
                : selectedPractices;
            
            updateData({ 
                experience: selectedExperience,
                practices: allPractices 
            });
            router.push("/onboarding/preferences");
        }
    };

    return (
        <View className="relative flex-1 w-full bg-[#121212] flex flex-col overflow-hidden">
            <LinearGradient
                colors={["#1a1a1a", "#121212"]}
                className="absolute top-0 left-0 w-full h-[60vh] opacity-50 z-0 pointer-events-none"
            />
            <View className="relative z-10 w-full pt-14 px-6 flex justify-center items-center">
                <Text className="font-mono text-xs tracking-[0.2em] text-[#6B6B6B]">
                    04 / 05
                </Text>
            </View>
            <ScrollView className="flex-1 relative z-10">
                <View className="px-8 pt-12 pb-8 flex flex-col text-center space-y-4">
                    <Text className="font-heading text-4xl leading-[1.15] tracking-tight text-[#E8E4DD] text-center">
                        How familiar are you with{"\n"}
                        <Text className="text-[#C9A961] italic">mindfulness practices?</Text>
                    </Text>
                </View>
                <View className="px-6 space-y-4 pb-8 gap-4">
                    {experiences.map((exp, index) => {
                        const isSelected = selectedExperience === exp.id;
                        return (
                            <TouchableOpacity
                                key={exp.id}
                                onPress={() => setSelectedExperience(exp.id)}
                                className={`group relative w-full overflow-hidden active:scale-[0.98] ${index % 2 !== 0 ? 'ml-8' : ''}`}
                            >
                                <View className="relative h-32 rounded-[4px] overflow-hidden">
                                    <LinearGradient
                                        colors={isSelected ? ["rgba(201, 169, 97, 0.3)", "rgba(201, 169, 97, 0.1)"] : ["rgba(26,26,26,0.6)", "rgba(18,18,18,0.4)"]}
                                        className="absolute inset-0 z-10"
                                    />
                                    <View className={`absolute w-32 h-32 opacity-30 ${exp.imagePos}`}>
                                        <Image
                                            source={{ uri: exp.image }}
                                            contentFit="cover"
                                            className={`w-full h-full ${exp.style}`}
                                            style={{ mixBlendMode: "screen" }}
                                        />
                                    </View>
                                    <View className={`absolute inset-0 border rounded-[4px] z-20 ${isSelected ? 'border-[#C9A961]' : 'border-[#C9A961]/20'}`} />
                                    <View className="relative h-full flex flex-col justify-center px-6 z-30">
                                        <Text className={`font-sans text-lg font-semibold text-left ${isSelected ? 'text-[#C9A961]' : 'text-[#E8E4DD]'}`}>
                                            {exp.title}
                                        </Text>
                                        <Text className="font-sans text-xs text-[#9B9B9B] text-left mt-1">
                                            {exp.subtitle}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View className="px-8 pt-6 pb-8">
                    <Text className="block text-sm text-[#9B9B9B] mb-3 tracking-wide">
                        What self-care practices do you currently follow?
                    </Text>
                    <View className="flex flex-row flex-wrap gap-2">
                        {["Meditation", "Yoga", "Journaling", "Exercise", "Reading", "Breathwork"].map((practice, i) => {
                            const isSelected = selectedPractices.includes(practice);
                            return (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => togglePractice(practice)}
                                    className={`px-4 py-2 rounded-full border active:scale-95 ${isSelected ? 'border-[#C9A961] bg-[#C9A961]/20' : 'border-[#C9A961]/30 bg-[#1a1a1a]/40'}`}
                                >
                                    <Text className={`text-xs font-medium ${isSelected ? 'text-[#C9A961]' : 'text-[#E8E4DD]'}`}>
                                        {practice}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View className="mt-4">
                        <TextInput
                            value={customPractice}
                            onChangeText={setCustomPractice}
                            placeholder="Or type your own..."
                            placeholderTextColor="#6B6B6B"
                            className="w-full px-4 py-3 bg-[#1a1a1a]/40 border border-[#C9A961]/20 rounded-[4px] text-[#E8E4DD] text-sm"
                        />
                    </View>
                </View>
                <View className="h-32" />
            </ScrollView>
            <View className="relative z-20 px-6 pb-8 pt-4">
                <LinearGradient
                    colors={["transparent", "#121212"]}
                    className="absolute inset-0"
                />
                <TouchableOpacity
                    onPress={handleContinue}
                    className={`group relative w-full h-14 flex items-center justify-center overflow-hidden active:scale-[0.98] ${selectedExperience ? '' : 'opacity-40'}`}
                    disabled={!selectedExperience}
                >
                    <View className="absolute inset-0 border border-[#9B9B9B]/40 rounded-[4px]" />
                    <LinearGradient
                        colors={selectedExperience ? ["#C9A961", "#A08648"] : ["#B8B8B8", "#909090"]}
                        className="absolute inset-[1px] rounded-[3px] flex items-center justify-center"
                    >
                        <Text className="font-sans text-[#121212] font-semibold tracking-[0.15em] uppercase text-xs">
                            Continue
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}
