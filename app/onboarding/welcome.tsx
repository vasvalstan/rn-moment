import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingWelcome() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-[#121212]">
            {/* Background Image */}
            <View className="absolute inset-0">
                <Image
                    source={{
                        uri: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
                    }}
                    contentFit="cover"
                    className="w-full h-full opacity-40"
                />
                <LinearGradient
                    colors={["#121212", "transparent", "transparent", "#121212"]}
                    locations={[0, 0.3, 0.7, 1]}
                    className="absolute inset-0"
                />
            </View>

            {/* Content - Centered */}
            <View 
                className="flex-1 justify-center px-6"
                style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            >
                {/* Main Content Block */}
                <View className="w-full items-center">
                    {/* Step Indicator */}
                    <Text className="font-mono text-xs tracking-[0.2em] text-[#6B6B6B] mb-8">
                        01 / 05
                    </Text>

                    {/* Title */}
                    <Text className="font-heading text-5xl leading-[1.1] tracking-tight text-[#E8E4DD] text-center mb-6">
                        Welcome to{"\n"}
                        <Text className="text-[#C9A961] italic">Your Journey</Text>
                    </Text>

                    {/* Subtitle */}
                    <Text className="font-sans text-sm leading-relaxed text-[#9B9B9B] tracking-wide font-light text-center mb-12 px-4">
                        Cultivate mindfulness, build lasting habits, find clarity in the
                        chaos of modern life.
                    </Text>

                    {/* Begin Button */}
                    <TouchableOpacity
                        onPress={() => router.push("/onboarding/purpose")}
                        className="w-full h-14 mb-4 bg-[#C9A961] rounded-[4px] items-center justify-center active:scale-[0.98] active:opacity-90"
                    >
                        <Text className="font-sans text-[#121212] font-semibold tracking-[0.15em] uppercase text-xs">
                            Begin
                        </Text>
                    </TouchableOpacity>

                    {/* Already Have Account Button - Bigger */}
                    <TouchableOpacity
                        onPress={() => router.push("/login-signup")}
                        className="w-full h-14 border border-[#3A3A3A] rounded-[4px] items-center justify-center active:bg-white/5 active:scale-[0.98]"
                    >
                        <Text className="font-sans text-[#9B9B9B] font-medium tracking-[0.1em] uppercase text-xs">
                            Already have an account?
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
