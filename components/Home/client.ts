"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useHandleEventClick = () => {
  const router = useRouter();

  return useCallback((eventId: string) => {
    router.push(`/calendar/${eventId}`);
  }, [router]);
};

export const useHandlePostClick = () => {
  const router = useRouter();

  return useCallback((postId: string) => {
    router.push(`/blog/${postId}`);
  }, [router]);
};
