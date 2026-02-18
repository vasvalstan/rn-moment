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
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { StatusBar } from "expo-status-bar";
import { OnboardingProvider } from "../context/OnboardingContext";
import { useAppAuth } from "@/lib/use-auth";

SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

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
    <ConvexProviderWithAuth client={convex} useAuth={useAppAuth}>
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
              presentation: "fullScreenModal",
              animation: "fade",
            }}
          />
        </Stack>
      </OnboardingProvider>
    </ConvexProviderWithAuth>
  );
}
