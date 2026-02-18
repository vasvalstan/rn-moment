import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useCallback, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { signIn, signUp, useSession } from "@/lib/auth-client";

export default function LoginSignup() {
    const router = useRouter();
    const { data: session, isPending: isAuthLoading } = useSession();
    const insets = useSafeAreaInsets();
    const isSignedIn = Boolean(session?.session);

    // If already signed in, redirect to tabs
    useEffect(() => {
        if (!isAuthLoading && isSignedIn) {
            router.replace("/(tabs)");
        }
    }, [isAuthLoading, isSignedIn, router]);

    const [isLogin, setIsLogin] = useState(true);
    const isSignUp = !isLogin;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSignInPress = async () => {
        if (isSignedIn) {
            router.replace("/(tabs)");
            return;
        }

        if (isAuthLoading) {
            Alert.alert("Loading", "Please wait while we connect to our servers...");
            return;
        }

        if (!email || !password) {
            Alert.alert("Error", "Please enter your email and password");
            return;
        }

        try {
            const result = await signIn.email({
                email,
                password,
            });

            if (result?.error) {
                Alert.alert("Error", result.error.message || "Failed to sign in. Please try again.");
                return;
            }

            router.replace("/(tabs)");
        } catch (err: any) {
            const errorMessage = err?.message || "Failed to sign in. Please try again.";
            Alert.alert("Error", errorMessage || "Failed to sign in. Please try again.");
        }
    };

    const onSignUpPress = async () => {
        if (isSignedIn) {
            router.replace("/(tabs)");
            return;
        }

        if (isAuthLoading) {
            Alert.alert("Loading", "Please wait while we connect to our servers...");
            return;
        }

        if (!email || !password) {
            Alert.alert("Error", "Please enter your email and password");
            return;
        }

        try {
            const result = await signUp.email({
                email,
                password,
                name: email.split("@")[0] || "User",
            });

            if (result?.error) {
                Alert.alert("Error", result.error.message || "Failed to sign up. Please try again.");
                return;
            }

            const loginResult = await signIn.email({
                email,
                password,
            });

            if (loginResult?.error) {
                Alert.alert("Account created", "Please sign in with your new account.");
                return;
            }

            router.replace("/(tabs)");
        } catch (err: any) {
            const errorMessage = err?.message || "Failed to sign up. Please try again.";
            Alert.alert("Error", errorMessage);
        }
    };

    const onSelectOAuth = useCallback(async (provider: "google" | "apple") => {
        try {
            if (isSignedIn) {
                router.replace("/(tabs)");
                return;
            }

            const result = await signIn.social({
                provider,
                callbackURL: "/(tabs)",
            });

            if (!result?.error) {
                router.replace("/(tabs)");
                return;
            }

            Alert.alert("Sign In Failed", result.error.message || "Failed to sign in. Please try again.");
            return;
        } catch (err: any) {
            if (__DEV__) console.error("OAuth error", err);
            const errorMessage = err?.message || "Failed to sign in. Please try again.";
            Alert.alert(
                "Sign In Failed",
                errorMessage || "Failed to sign in. Please try again."
            );
        }
    }, [isSignedIn, router]);

    return (
        <View className="relative flex-1 w-full bg-[#121212] flex flex-col overflow-hidden">
            <LinearGradient
                colors={["#1a1a1a", "#121212"]}
                className="absolute top-0 left-0 w-full h-[60vh] opacity-50 z-0 pointer-events-none"
            />
            <View className="absolute top-0 right-0 w-[70%] h-[50vh] z-0 overflow-hidden opacity-80">
                <Image
                    source={{ uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop" }}
                    contentFit="cover"
                    className="w-full h-full scale-125 translate-x-12 -translate-y-8"
                    // @ts-ignore
                    style={{ mixBlendMode: "screen" }}
                />
                <LinearGradient
                    colors={["transparent", "rgba(18,18,18,0.6)", "#121212"]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    className="absolute inset-0"
                />
                <LinearGradient
                    colors={["transparent", "#121212"]}
                    className="absolute inset-0"
                />
            </View>
            <View
                className="flex-1 flex flex-col items-center justify-center relative z-10 px-8"
                style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 48 }}
            >
                <View className="mb-8">
                    <View className="w-12 h-12 border border-[#C9A961]/40 flex items-center justify-center">
                        <Ionicons name="leaf" size={24} color="#C9A961" />
                    </View>
                </View>
                <Text className="font-heading text-4xl leading-[1.1] tracking-tight text-[#E8E4DD] text-center mb-12">
                    Enter Your <Text className="italic text-[#C9A961]">Sanctuary</Text>
                </Text>

                <View className="flex-row gap-12 mb-10 border-b border-[#2A2A2A] w-full max-w-[320px]">
                            <TouchableOpacity onPress={() => setIsLogin(true)} className="pb-3 relative">
                                <Text className={`font-sans text-xs uppercase tracking-[0.2em] font-medium ${isLogin ? 'text-[#E8E4DD]' : 'text-[#6B6B6B]'}`}>
                                    Login
                                </Text>
                                {isLogin && <View className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C9A961]" />}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsLogin(false)} className="pb-3 relative">
                                <Text className={`font-sans text-xs uppercase tracking-[0.2em] font-medium ${isSignUp ? 'text-[#E8E4DD]' : 'text-[#6B6B6B]'}`}>
                                    Sign Up
                                </Text>
                                {isSignUp && <View className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C9A961]" />}
                            </TouchableOpacity>
                </View>
                <View className="w-full max-w-[320px] space-y-6 gap-6">
                            <View>
                                <Text className="block font-sans text-[10px] uppercase tracking-[0.25em] text-[#9B9B9B] mb-3 font-light">
                                    Email
                                </Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    placeholder="your@email.com"
                                    placeholderTextColor="#4A4A4A"
                                    className="w-full h-12 px-4 bg-transparent border border-[#C9A961]/20 text-[#E8E4DD] font-sans text-sm"
                                />
                            </View>
                            <View>
                                <Text className="block font-sans text-[10px] uppercase tracking-[0.25em] text-[#9B9B9B] mb-3 font-light">
                                    Password
                                </Text>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    placeholder="••••••••"
                                    placeholderTextColor="#4A4A4A"
                                    className="w-full h-12 px-4 bg-transparent border border-[#C9A961]/20 text-[#E8E4DD] font-sans text-sm"
                                />
                            </View>
                            {isLogin && (
                                <View className="flex items-end">
                                    <TouchableOpacity>
                                        <Text className="font-sans text-xs text-[#8B9D7A]">
                                            Forgot Password?
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <TouchableOpacity
                                onPress={isLogin ? onSignInPress : onSignUpPress}
                                className="group relative w-full h-12 flex items-center justify-center overflow-hidden active:scale-[0.98] mt-2"
                            >
                                <View className="absolute inset-0 bg-[#C9A961]/90" />
                                <View className="absolute inset-0 border border-[#C9A961]/30" />
                                <Text className="relative font-sans text-[#121212] font-semibold tracking-[0.15em] uppercase text-xs z-10">
                                    {isLogin ? "Continue" : "Create Account"}
                                </Text>
                            </TouchableOpacity>
                            <View className="flex-row items-center gap-4 my-4">
                                <View className="flex-1 h-[1px] bg-[#2A2A2A]" />
                                <Text className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B]">
                                    or
                                </Text>
                                <View className="flex-1 h-[1px] bg-[#2A2A2A]" />
                            </View>
                            <View className="flex-row gap-4 justify-center">
                                <TouchableOpacity
                                    onPress={() => onSelectOAuth("google")}
                                    className="w-12 h-12 border border-[#C9A961]/20 flex items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="google" size={20} color="#E8E4DD" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => onSelectOAuth("apple")}
                                    className="w-12 h-12 border border-[#C9A961]/20 flex items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="apple" size={20} color="#E8E4DD" />
                                </TouchableOpacity>
                            </View>
                </View>
            </View>
            <View className="relative z-20 px-6 pb-6 pt-4 flex-row justify-center gap-6">
                <TouchableOpacity>
                    <Text className="font-sans text-[10px] uppercase tracking-widest text-[#6B6B6B]">
                        Privacy Policy
                    </Text>
                </TouchableOpacity>
                <Text className="text-[#3A3A3A]">•</Text>
                <TouchableOpacity>
                    <Text className="font-sans text-[10px] uppercase tracking-widest text-[#6B6B6B]">
                        Terms
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
