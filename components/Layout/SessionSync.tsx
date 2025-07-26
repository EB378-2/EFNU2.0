// components/SessionSync.tsx
'use client';
import { useEffect } from 'react';
import { useGetIdentity } from "@refinedev/core";

const ROLE_FETCH_INTERVAL = 60 * 60 * 1000; // 1 hour

export function SessionSync() {
  const { data: identity } = useGetIdentity<{ role?: string }>();

  useEffect(() => {
    const updateRole = async () => {
      const lastFetch = Number(localStorage.getItem('role-last-fetch') || 0);
      const now = Date.now();

      // Skip if recently fetched or role exists in identity
      if (now - lastFetch < ROLE_FETCH_INTERVAL || identity?.role) return;

      try {
        const res = await fetch('/api/get-role');
        const { role } = await res.json();
        const finalRole = role || 'anonymous';

        localStorage.setItem('user-role', finalRole);
        localStorage.setItem('role-last-fetch', now.toString());
      } catch (error) {
        console.error("Role sync failed:", error);
      }
    };

    updateRole();
  }, [identity?.role]); // Only rerun if identity.role changes

  return null;
}