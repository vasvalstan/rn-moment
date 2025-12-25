import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useCallback, useEffect } from "react";
import { useSignIn, useSignUp, useOAuth, useAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../components/useWarmUpBrowser";
import * as WebBrowser from "expo-web-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Complete any pending auth sessions on web
WebBrowser.maybeCompleteAuthSession();

export default function LoginSignup() {
    useWarmUpBrowser();
    const router = useRouter();
    const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
    const { signIn, setActive: setSignInActive, isLoaded: isSignInLoaded } = useSignIn();
    const { signUp, setActive: setSignUpActive, isLoaded: isSignUpLoaded } = useSignUp();
    const insets = useSafeAreaInsets();

    const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: "oauth_google" });
    const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({ strategy: "oauth_apple" });

    // If already signed in, redirect to tabs
    useEffect(() => {
        if (isAuthLoaded && isSignedIn) {
            router.replace("/(tabs)");
        }
    }, [isAuthLoaded, isSignedIn, router]);

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");

    const onSignInPress = async () => {
        // Check if already signed in
        if (isSignedIn) {
            router.replace("/(tabs)");
            return;
        }
        
        if (!isSignInLoaded) {
            Alert.alert("Loading", "Please wait while we connect to our servers...");
            return;
        }
        if (!email || !password) {
            Alert.alert("Error", "Please enter your email and password");
            return;
        }
        try {
            const completeSignIn = await signIn.create({
                identifier: email,
                password,
            });
            await setSignInActive({ session: completeSignIn.createdSessionId });
            router.replace("/(tabs)");
        } catch (err: any) {
            const errorMessage = err.errors?.[0]?.message || err.message || "";
            
            // Handle "session already exists" - means we're logged in
            if (errorMessage.toLowerCase().includes("session") && errorMessage.toLowerCase().includes("exist")) {
                router.replace("/(tabs)");
                return;
            }
            
            Alert.alert("Error", errorMessage || "Failed to sign in. Please try again.");
        }
    };

    const onSignUpPress = async () => {
        // Check if already signed in
        if (isSignedIn) {
            router.replace("/(tabs)");
            return;
        }
        
        if (!isSignUpLoaded) {
            Alert.alert("Loading", "Please wait while we connect to our servers...");
            return;
        }
        if (!email || !password) {
            Alert.alert("Error", "Please enter your email and password");
            return;
        }
        try {
            await signUp.create({
                emailAddress: email,
                password,
            });
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setPendingVerification(true);
        } catch (err: any) {
            const errorMessage = err.errors?.[0]?.message || err.message || "";
            
            // Handle "session already exists" - means we're logged in
            if (errorMessage.toLowerCase().includes("session") && errorMessage.toLowerCase().includes("exist")) {
                router.replace("/(tabs)");
                return;
            }
            
            Alert.alert("Error", errorMessage || "Failed to sign up. Please try again.");
        }
    };

    const onPressVerify = async () => {
        if (!isSignUpLoaded) return;
        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });
            await setSignUpActive({ session: completeSignUp.createdSessionId });
            router.replace("/(tabs)");
        } catch (err: any) {
            const errorMessage = err.errors?.[0]?.message || err.message || "";
            
            // Handle "session already exists" - means we're logged in
            if (errorMessage.toLowerCase().includes("session") && errorMessage.toLowerCase().includes("exist")) {
                router.replace("/(tabs)");
                return;
            }
            
            Alert.alert("Error", errorMessage || "Failed to verify. Please try again.");
        }
    };

    const onSelectOAuth = useCallback(async (strategy: "oauth_google" | "oauth_apple") => {
        try {
            // Check if already signed in
            if (isSignedIn) {
                router.replace("/(tabs)");
                return;
            }

            const startOAuthFlow = strategy === "oauth_google" ? startGoogleOAuthFlow : startAppleOAuthFlow;
            
            // Don't pass redirectUrl - let Clerk handle it automatically
            const { createdSessionId, setActive, signUp: _signUp, signIn: _signIn } = await startOAuthFlow();

            if (createdSessionId) {
                await setActive!({ session: createdSessionId });
                router.replace("/(tabs)");
            } else {
                // Check if user got signed in during the flow
                // This can happen if session already exists
                if (isSignedIn) {
                    router.replace("/(tabs)");
                }
            }
        } catch (err: any) {
            if (__DEV__) console.error("OAuth error", err);
            
            // Handle various error cases
            const errorMessage = err.errors?.[0]?.message || err.message || "";
            
            // Session exists means we're actually logged in
            if (errorMessage.toLowerCase().includes("session") && errorMessage.toLowerCase().includes("exist")) {
                router.replace("/(tabs)");
                return;
            }
            
            // Redirect mismatch - likely a stale auth session, try again
            if (errorMessage.toLowerCase().includes("redirect")) {
                Alert.alert(
                    "Please Try Again", 
                    "There was an issue with the sign-in flow. Please try again."
                );
                return;
            }
            
            Alert.alert(
                "Sign In Failed", 
                errorMessage || "Failed to sign in. Please try again."
            );
        }
    }, [startGoogleOAuthFlow, startAppleOAuthFlow, isSignedIn, router]);

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

                {!pendingVerification ? (
                    <>
                        <View className="flex-row gap-12 mb-10 border-b border-[#2A2A2A] w-full max-w-[320px]">
                            <TouchableOpacity onPress={() => setIsLogin(true)} className="pb-3 relative">
                                <Text className={`font-sans text-xs uppercase tracking-[0.2em] font-medium ${isLogin ? 'text-[#E8E4DD]' : 'text-[#6B6B6B]'}`}>
                                    Login
                                </Text>
                                {isLogin && <View className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C9A961]" />}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsLogin(false)} className="pb-3 relative">
                                <Text className={`font-sans text-xs uppercase tracking-[0.2em] font-medium ${!isLogin ? 'text-[#E8E4DD]' : 'text-[#6B6B6B]'}`}>
                                    Sign Up
                                </Text>
                                {!isLogin && <View className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C9A961]" />}
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
                                    onPress={() => onSelectOAuth("oauth_google")}
                                    className="w-12 h-12 border border-[#C9A961]/20 flex items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="google" size={20} color="#E8E4DD" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => onSelectOAuth("oauth_apple")}
                                    className="w-12 h-12 border border-[#C9A961]/20 flex items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="apple" size={20} color="#E8E4DD" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                ) : (
                    <View className="w-full max-w-[320px] space-y-6 gap-6">
                        <View>
                            <Text className="block font-sans text-[10px] uppercase tracking-[0.25em] text-[#9B9B9B] mb-3 font-light">
                                Verification Code
                            </Text>
                            <TextInput
                                value={code}
                                onChangeText={setCode}
                                placeholder="123456"
                                placeholderTextColor="#4A4A4A"
                                className="w-full h-12 px-4 bg-transparent border border-[#C9A961]/20 text-[#E8E4DD] font-sans text-sm"
                            />
                        </View>
                        <TouchableOpacity
                            onPress={onPressVerify}
                            className="group relative w-full h-12 flex items-center justify-center overflow-hidden active:scale-[0.98] mt-2"
                        >
                            <View className="absolute inset-0 bg-[#C9A961]/90" />
                            <View className="absolute inset-0 border border-[#C9A961]/30" />
                            <Text className="relative font-sans text-[#121212] font-semibold tracking-[0.15em] uppercase text-xs z-10">
                                Verify Email
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
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
