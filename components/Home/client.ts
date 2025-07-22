"use client";

import { useRouter } from "next/navigation";

export const handleEventClick = (eventId: string) => {
    const router = useRouter();
    router.push(`/calendar/${eventId}`);
  };

export const handlePostClick = (postId: string) => {
    const router = useRouter();
    router.push(`/blog/${postId}`);
  };
