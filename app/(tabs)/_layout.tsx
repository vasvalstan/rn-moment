import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#121212",
                    borderTopColor: "#333333",
                    height: 80,
                    paddingBottom: 20,
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
