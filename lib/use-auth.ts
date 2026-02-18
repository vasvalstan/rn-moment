import { useCallback } from "react";
import { authClient, useSession } from "./auth-client";

export function useAppAuth() {
  const { data, isPending, refetch } = useSession();

  const isSignedIn = Boolean(data?.session);

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      const sessionResult = await authClient.getSession({
        query: {
          disableCookieCache: forceRefreshToken,
        },
      });

      if (!sessionResult?.data?.session) {
        return null;
      }

      const tokenResult = await authClient.token();

      return tokenResult?.data?.token ?? null;
    },
    []
  );

  return {
    isLoading: isPending,
    isAuthenticated: isSignedIn,
    fetchAccessToken,
    session: data,
    refetchSession: refetch,
  };
}
