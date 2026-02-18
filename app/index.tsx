import { Redirect } from "expo-router";
import { useSession } from "@/lib/auth-client";

export default function Index() {
  const { data: session } = useSession();
  const isSignedIn = Boolean(session?.session);

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding/welcome" />;
}
