import { View, Text, TouchableOpacity, Animated, Easing, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useFaceDownDetection } from "../hooks/useFaceDownDetection";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";

type SessionState = 
    | "waiting"     // Waiting for phone to be placed face-down
    | "active"      // Timer running, phone face-down
    | "paused"      // Phone picked up, timer paused
    | "completed"   // Session finished successfully
    | "cancelled";  // User cancelled

export default function MeditationSession() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ duration: string }>();
    const targetDuration = parseInt(params.duration || "1200", 10); // Default 20 mins in seconds
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
    const { isSignedIn, isLoaded: isClerkLoaded, getToken } = useAuth();

    // Session state
    const [sessionState, setSessionState] = useState<SessionState>("waiting");
    const [elapsedTime, setElapsedTime] = useState(0);
    const [interruptions, setInterruptions] = useState(0);
    const [sessionId, setSessionId] = useState<Id<"sessions"> | null>(null);
    const [sensorReady, setSensorReady] = useState(false);
    const [authError, setAuthError] = useState(false);

    // Refs for timer
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const sessionStateRef = useRef<SessionState>("waiting");

    // Keep sessionState ref in sync
    useEffect(() => {
        sessionStateRef.current = sessionState;
    }, [sessionState]);

    // Animations
    const flipAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    // Convex mutations
    const startSession = useMutation(api.sessions.startSession);
    const completeSession = useMutation(api.sessions.completeSession);
    const cancelSession = useMutation(api.sessions.cancelSession);

    // Face-down detection with callbacks that check current state
    const handleFaceDown = useCallback(() => {
        if (sessionStateRef.current === "waiting") {
            handleSessionStart();
        } else if (sessionStateRef.current === "paused") {
            handleResume();
        }
    }, []);

    const handlePickedUp = useCallback(() => {
        if (sessionStateRef.current === "active") {
            handlePause();
        }
    }, []);

    const { isFaceDown, isListening, startListening, stopListening, isAvailable, sensorData } = 
        useFaceDownDetection({
            hapticFeedback: true,
            onFaceDown: handleFaceDown,
            onPickedUp: handlePickedUp,
        });

    // Phone flip animation
    useEffect(() => {
        if (sessionState === "waiting") {
            const flipAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(flipAnim, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.inOut(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.delay(800),
                    Animated.timing(flipAnim, {
                        toValue: 0,
                        duration: 1500,
                        easing: Easing.inOut(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.delay(800),
                ])
            );
            flipAnimation.start();
            return () => flipAnimation.stop();
        }
    }, [sessionState, flipAnim]);

    // Floating animation for the container
    useEffect(() => {
        if (sessionState === "waiting") {
            const float = Animated.loop(
                Animated.sequence([
                    Animated.timing(floatAnim, {
                        toValue: -8,
                        duration: 2000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(floatAnim, {
                        toValue: 0,
                        duration: 2000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            );
            float.start();
            return () => float.stop();
        }
    }, [sessionState, floatAnim]);

    // Pulse animation for the glow
    useEffect(() => {
        if (sessionState === "waiting") {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        }
    }, [sessionState, pulseAnim]);

    // Initialize session and keep awake
    useEffect(() => {
        const init = async () => {
            await activateKeepAwakeAsync();
            const success = await startListening();
            setSensorReady(success);
        };
        init();

        return () => {
            deactivateKeepAwake();
            stopListening();
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // Timer effect
    useEffect(() => {
        if (sessionState === "active") {
            startTimeRef.current = Date.now() - elapsedTime * 1000;
            
            timerRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                setElapsedTime(elapsed);

                // Check if session is complete
                if (elapsed >= targetDuration) {
                    handleSessionComplete();
                }
            }, 100);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [sessionState, targetDuration]);

    const handleSessionStart = async () => {
        console.log("Starting session - Clerk loaded:", isClerkLoaded, "Clerk signed in:", isSignedIn, "Convex auth loading:", isAuthLoading, "Convex authenticated:", isAuthenticated);
        
        // Wait for Clerk to finish loading
        if (!isClerkLoaded) {
            console.log("Clerk still loading, waiting...");
            setTimeout(() => handleSessionStart(), 500);
            return;
        }
        
        // If Clerk says we're signed in but Convex doesn't know yet, try to refresh token
        if (isSignedIn && !isAuthenticated && !isAuthLoading) {
            console.log("Clerk signed in but Convex not authenticated - trying to get token...");
            try {
                const token = await getToken({ template: "convex" });
                console.log("Got Convex token:", token ? "yes" : "no");
                // Wait a moment for Convex to sync
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (e) {
                console.log("Failed to get Convex token:", e);
            }
        }
        
        // If still loading auth, wait a moment and retry
        if (isAuthLoading) {
            console.log("Convex auth still loading, waiting...");
            setTimeout(() => handleSessionStart(), 500);
            return;
        }
        
        // Try to start session with Convex (will work if authenticated)
        // Only try Convex if authenticated, otherwise just run locally
        if (isAuthenticated) {
            try {
                const id = await startSession({ targetDuration });
                console.log("Session started with ID:", id);
                setSessionId(id);
            } catch (error: any) {
                console.log("Failed to save to Convex, continuing locally:", error.message);
            }
        } else {
            console.log("Running session locally (not authenticated with Convex)");
        }
        
        // Always start the session locally - meditation works regardless of auth
        setSessionState("active");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const handlePause = () => {
        setSessionState("paused");
        setInterruptions((prev) => prev + 1);
    };

    const handleResume = () => {
        setSessionState("active");
    };

    const handleSessionComplete = useCallback(async () => {
        if (sessionStateRef.current === "completed") return;
        
        setSessionState("completed");
        stopListening();
        
        // Strong haptic feedback for completion
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 200);

        if (sessionId) {
            try {
                await completeSession({
                    sessionId,
                    actualDuration: elapsedTime,
                    interruptions,
                });
                console.log("Session completed and saved to Convex");
            } catch (error) {
                console.error("Failed to save session completion:", error);
                // Session still completed locally, just not tracked
            }
        } else {
            console.log("Session completed locally (not tracked)");
        }
    }, [sessionId, elapsedTime, interruptions, completeSession, stopListening]);

    const handleCancel = async () => {
        setSessionState("cancelled");
        stopListening();
        
        if (sessionId) {
            try {
                await cancelSession({
                    sessionId,
                    actualDuration: elapsedTime,
                    interruptions,
                });
                console.log("Session cancelled and saved to Convex");
            } catch (error) {
                console.error("Failed to save session cancellation:", error);
                // Continue anyway - session is cancelled locally
            }
        } else {
            console.log("Session cancelled locally (was not tracked)");
        }
        
        router.back();
    };

    const handleManualStart = () => {
        // Fallback for when sensor isn't available
        handleSessionStart();
    };

    const handleDone = () => {
        router.back();
    };

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Calculate remaining time
    const remainingTime = Math.max(0, targetDuration - elapsedTime);
    const progress = elapsedTime / targetDuration;

    // Interpolate rotation for flip effect
    const flipInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    // Show auth error only if explicitly set
    if (authError) {
        return (
            <View 
                className="flex-1 bg-[#0a0a0a] items-center justify-center px-8"
                style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            >
                <StatusBar style="light" />
                <View className="items-center">
                    <Ionicons name="alert-circle-outline" size={64} color="#f59e0b" />
                    <Text className="text-[#ECECEC] text-xl font-heading text-center mt-4 mb-2">
                        Sign In Required
                    </Text>
                    <Text className="text-[#8A8A8A] text-sm text-center font-sans mb-8">
                        Please sign in to start a meditation session
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="px-8 py-3 bg-[#DBC188] rounded-lg"
                    >
                        <Text className="text-[#0a0a0a] font-semibold tracking-widest uppercase text-xs font-sans">
                            Go Back
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Render based on state
    if (sessionState === "waiting") {
        return (
            <View 
                className="flex-1 bg-[#0a0a0a] items-center justify-center px-8"
                style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            >
                <StatusBar style="light" />
                
                <Animated.View 
                    className="items-center"
                    style={{ transform: [{ translateY: floatAnim }] }}
                >
                    {/* Phone icon with flip animation */}
                    <View className="relative mb-10">
                        {/* Glow effect */}
                        <Animated.View 
                            className="absolute -inset-4 bg-[#DBC188]/10 rounded-3xl blur-xl"
                            style={{ transform: [{ scale: pulseAnim }], opacity: 0.5 }}
                        />
                        
                        {/* Phone container */}
                        <Animated.View 
                            style={{ 
                                transform: [{ rotateX: flipInterpolate }],
                                backfaceVisibility: 'hidden',
                            }}
                            className="w-28 h-28 border-2 border-[#DBC188]/40 rounded-2xl items-center justify-center bg-[#151515]"
                        >
                            <Ionicons name="phone-portrait-outline" size={52} color="#DBC188" />
                            {/* Screen indicator */}
                            <View className="absolute top-3 w-8 h-1 bg-[#DBC188]/30 rounded-full" />
                        </Animated.View>
                    </View>
                    
                    <Text className="text-[#ECECEC] text-2xl font-heading text-center mb-3">
                        Place your phone{"\n"}face down
                    </Text>
                    <Text className="text-[#8A8A8A] text-sm text-center font-sans tracking-wide mb-2">
                        Your {Math.floor(targetDuration / 60)} minute session will begin{"\n"}when the screen faces the surface
                    </Text>

                    {/* Sensor status indicator */}
                    <View className="flex-row items-center mt-4 px-3 py-1.5 bg-white/5 rounded-full">
                        <View className={`w-2 h-2 rounded-full mr-2 ${isListening ? 'bg-green-500' : isAvailable === false ? 'bg-red-500' : 'bg-yellow-500'}`} />
                        <Text className="text-[#6B6B6B] text-xs font-sans">
                            {isListening ? 'Sensor active' : isAvailable === false ? 'Sensor unavailable' : 'Initializing...'}
                        </Text>
                    </View>

                    {/* Debug info for sensor */}
                    {sensorData && (
                        <View className="mt-4 px-4 py-2 bg-white/5 rounded">
                            <Text className="text-[#6B6B6B] text-xs font-mono text-center">
                                z: {sensorData.z.toFixed(2)} {sensorData.z > 0.7 ? '(face down)' : '(face up)'}
                            </Text>
                        </View>
                    )}

                    {/* Manual start fallback when sensor isn't available */}
                    {isAvailable === false && (
                        <TouchableOpacity
                            onPress={handleManualStart}
                            className="mt-8 px-8 py-4 bg-[#DBC188] rounded-lg active:scale-95"
                        >
                            <Text className="text-[#0a0a0a] text-sm font-semibold tracking-widest uppercase font-sans">
                                Start Manually
                            </Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>

                <TouchableOpacity
                    onPress={handleCancel}
                    className="absolute bottom-12 px-8 py-3"
                    style={{ bottom: insets.bottom + 24 }}
                >
                    <Text className="text-[#8A8A8A] text-sm tracking-widest uppercase font-sans">
                        Cancel
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (sessionState === "paused") {
        return (
            <View 
                className="flex-1 bg-[#0a0a0a] items-center justify-center px-8"
                style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            >
                <StatusBar style="light" />
                
                <View className="absolute top-0 left-0 right-0 h-1 bg-[#1a1a1a]">
                    <View 
                        className="h-full bg-[#DBC188]" 
                        style={{ width: `${progress * 100}%` }} 
                    />
                </View>

                <View className="items-center">
                    <View className="w-20 h-20 border-2 border-amber-500/50 rounded-full items-center justify-center mb-6">
                        <Ionicons name="pause" size={32} color="#f59e0b" />
                    </View>
                    
                    <Text className="text-amber-500 text-lg font-sans tracking-widest uppercase mb-2">
                        Session Paused
                    </Text>
                    <Text className="text-[#ECECEC] text-5xl font-light tracking-tight mb-4 font-sans">
                        {formatTime(remainingTime)}
                    </Text>
                    <Text className="text-[#8A8A8A] text-sm text-center font-sans">
                        Phone picked up • {interruptions} interruption{interruptions !== 1 ? "s" : ""}
                    </Text>
                </View>

                <View className="absolute bottom-0 left-0 right-0 px-8" style={{ paddingBottom: insets.bottom + 24 }}>
                    {sensorReady ? (
                        <Text className="text-[#8A8A8A] text-center text-sm mb-6 font-sans">
                            Place phone face down to continue
                        </Text>
                    ) : (
                        <TouchableOpacity
                            onPress={handleResume}
                            className="w-full py-4 bg-[#DBC188] rounded-lg items-center mb-4"
                        >
                            <Text className="text-[#0a0a0a] text-sm font-semibold tracking-widest uppercase font-sans">
                                Resume
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={handleCancel}
                        className="w-full py-4 border border-red-500/30 rounded-lg items-center"
                    >
                        <Text className="text-red-400 text-sm tracking-widest uppercase font-sans">
                            End Session
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (sessionState === "active") {
        return (
            <View className="flex-1 bg-[#050505] items-center justify-center">
                <StatusBar style="dark" hidden />
                
                {/* Minimal progress indicator at top */}
                <View className="absolute top-0 left-0 right-0 h-[2px] bg-[#1a1a1a]">
                    <View 
                        className="h-full bg-[#DBC188]/50" 
                        style={{ width: `${progress * 100}%` }} 
                    />
                </View>

                {/* Very subtle center content - the screen should be mostly dark */}
                <View className="items-center opacity-30">
                    <Text className="text-[#ECECEC] text-6xl font-light tracking-tight font-sans">
                        {formatTime(remainingTime)}
                    </Text>
                </View>

                {/* Manual pause button for when sensor isn't available */}
                {!sensorReady && (
                    <TouchableOpacity
                        onPress={handlePause}
                        className="absolute bottom-16 px-8 py-3 opacity-50"
                        style={{ bottom: insets.bottom + 24 }}
                    >
                        <Text className="text-[#8A8A8A] text-sm tracking-widest uppercase font-sans">
                            Pause
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    if (sessionState === "completed") {
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

        return (
            <View 
                className="flex-1 bg-[#0a0a0a] items-center justify-center px-8"
                style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            >
                <StatusBar style="light" />
                
                <View className="items-center">
                    <View className="w-24 h-24 border-2 border-[#9CAF88] rounded-full items-center justify-center mb-8">
                        <Ionicons name="checkmark" size={48} color="#9CAF88" />
                    </View>
                    
                    <Text className="text-[#9CAF88] text-sm font-sans tracking-widest uppercase mb-2">
                        Session Complete
                    </Text>
                    <Text className="text-[#ECECEC] text-4xl font-heading text-center mb-2">
                        Well done
                    </Text>
                    <Text className="text-[#8A8A8A] text-base font-sans mb-8">
                        {minutes} min {seconds > 0 ? `${seconds} sec` : ""} of stillness
                    </Text>

                    {interruptions > 0 && (
                        <View className="bg-white/5 px-4 py-2 rounded-full mb-8">
                            <Text className="text-[#8A8A8A] text-xs font-sans">
                                {interruptions} interruption{interruptions !== 1 ? "s" : ""} during session
                            </Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    onPress={handleDone}
                    className="absolute w-3/4 py-4 bg-[#DBC188] rounded-lg items-center"
                    style={{ bottom: insets.bottom + 24 }}
                >
                    <Text className="text-[#0a0a0a] text-sm font-semibold tracking-widest uppercase font-sans">
                        Done
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return null;
}
