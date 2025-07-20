"use client";


import React from "react";
import { useGetIdentity, useOne } from "@refinedev/core";
import resources from '@/resources';
import { QuickButton } from "@/types/QuickButton";

const DEFAULT_BUTTON_KEYS = ["notams", "priornotice", "webcam", "lights", "flyk", "weather"];

export default function QuickAccessButtons() {
  type UserIdentity = { id: string };
  const { data: userIdentity } = useGetIdentity<UserIdentity>();
  const menuResources = resources;
  console.log(menuResources)
  
  const { data: userData } = useOne({
    resource: "profiles",
    id: userIdentity?.id,
    meta: {
      select: "quick_nav",
    },
    queryOptions: {
      enabled: !!userIdentity?.id,
    },
  });

  const quickNavKeys = userData?.data?.quick_nav ?? DEFAULT_BUTTON_KEYS;


  const quickNavButtons: QuickButton[] = quickNavKeys
    .map((key: string) => {
      const resource = menuResources.find((res) => res.name === key);
      if (!resource) return null;
      return {
        icon: resource.meta?.icon,
        label: resource.meta?.label ?? key,
        path: resource.list,
        name: resource.name,
      };
    })
    .filter(Boolean) as QuickButton[];

  return (
    quickNavButtons
  );
}
