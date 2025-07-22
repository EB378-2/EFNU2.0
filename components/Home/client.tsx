"use client";

import { useRouter } from "next/navigation";
import React from "react";

export const useHandleEventClick = (eventId: string) => {
    const router = useRouter();
    router.push(`/calendar/${eventId}`);
  };

export const useHandlePostClick = (postId: string) => {
    const router = useRouter();
    router.push(`/blog/${postId}`);
  };
