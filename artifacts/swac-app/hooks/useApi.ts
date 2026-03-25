import { useAuth } from "@/context/AuthContext";
import { useCallback } from "react";

const BASE_URL = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`
  : "/api";

export function useApi() {
  const { token } = useAuth();

  const request = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string> || {}),
      };
      const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Erreur ${res.status}`);
      }
      return res.json();
    },
    [token]
  );

  return { request };
}
