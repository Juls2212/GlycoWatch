"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function useProtectedRoute(redirectTo = "/login"): { ready: boolean; authorized: boolean } {
  const router = useRouter();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!isHydrated) return;
    if (!accessToken) {
      router.replace(redirectTo);
    }
  }, [isHydrated, accessToken, redirectTo, router]);

  return {
    ready: isHydrated,
    authorized: Boolean(accessToken)
  };
}

