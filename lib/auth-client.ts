import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

const baseURL = process.env.EXPO_PUBLIC_BETTER_AUTH_URL;

if (!baseURL) {
  // Keep this loud in development so missing env is obvious.
  console.warn(
    "EXPO_PUBLIC_BETTER_AUTH_URL is not set. Better Auth requests will fail until configured."
  );
}

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    expoClient({
      scheme: "moment",
      storagePrefix: "moment",
      storage: SecureStore,
    }),
    jwtClient(),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
