import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { View, ActivityIndicator, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
    const { isSignedIn, isLoaded } = useAuth();
    const insets = useSafeAreaInsets();
    const isAndroid = Platform.OS === "android";

    // Show loading while Clerk is initializing
    if (!isLoaded) {
        return (
            <View className="flex-1 bg-[#121212] items-center justify-center">
                <ActivityIndicator size="large" color="#C9A961" />
            </View>
        );
    }

    // Redirect to login if not authenticated
    if (!isSignedIn) {
        return <Redirect href="/login-signup" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#121212",
                    borderTopColor: "#333333",
                    height: isAndroid ? 60 + insets.bottom : 80,
                    paddingBottom: isAndroid ? Math.max(insets.bottom, 10) : 20,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: "#DBC188",
                tabBarInactiveTintColor: "#8A8A8A",
                tabBarLabelStyle: {
                    fontFamily: "InstrumentSans_400Regular",
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="journal"
                options={{
                    title: "Journal",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="book-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: "Stats",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bar-chart-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings-outline" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
