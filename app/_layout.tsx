import "../global.css";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  InstrumentSans_400Regular,
} from "@expo-google-fonts/instrument-sans";
import {
  DMSerifDisplay_400Regular,
} from "@expo-google-fonts/dm-serif-display";
import {
  PlayfairDisplay_400Regular,
} from "@expo-google-fonts/playfair-display";
import {
  JetBrainsMono_400Regular,
} from "@expo-google-fonts/jetbrains-mono";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { OnboardingProvider } from "../context/OnboardingContext";

SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Use environment variable for Clerk key (fallback to dev key for local development)
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_c3dlZXBpbmctZ2xpZGVyLTQwLmNsZXJrLmFjY291bnRzLmRldiQ";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    InstrumentSans_400Regular,
    DMSerifDisplay_400Regular,
    PlayfairDisplay_400Regular,
    JetBrainsMono_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <OnboardingProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding/welcome" />
            <Stack.Screen name="onboarding/purpose" />
            <Stack.Screen name="onboarding/age" />
            <Stack.Screen name="onboarding/experience" />
            <Stack.Screen name="onboarding/preferences" />
            <Stack.Screen name="login-signup" />
            <Stack.Screen name="profile" />
            <Stack.Screen 
              name="session" 
              options={{ 
                presentation: 'fullScreenModal',
                animation: 'fade',
              }} 
            />
          </Stack>
        </OnboardingProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
