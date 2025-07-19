// hooks/useMessageCache.ts
import { useEffect, useState } from "react";

export function useCachedMessage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const cached = localStorage.getItem("draftMessage");
    if (cached) setMessage(cached);
  }, []);

  useEffect(() => {
    localStorage.setItem("draftMessage", message);
  }, [message]);

  return [message, setMessage] as const;
}
