// hooks/useSubscriptionStatus.ts
import { useEffect, useState } from "react";

export function useSubscriptionStatus() {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("subscribed");
    if (cached === "true") setSubscribed(true);
  }, []);

  const set = (value: boolean) => {
    localStorage.setItem("subscribed", String(value));
    setSubscribed(value);
  };

  return [subscribed, set] as const;
}
