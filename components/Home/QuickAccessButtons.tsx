"use client";

import React, { Suspense, useState } from "react";
import { useGetIdentity, useOne } from "@refinedev/core";
import resources from '@/resources';
import { QuickButton } from "@/types/QuickButton";
import { Spinner } from "@components/ui/Spinner";
import { Box, Grid, Button } from "@node_modules/@mui/material";
import { useTranslations } from "next-intl";
import { useTheme } from "@hooks/useTheme";
import { useRouter } from "next/navigation";
import AlertCreateModal from "./CreateAlertPublicModal";

const DEFAULT_BUTTON_KEYS = ["notams", "priornotice", "webcam", "lights", "flyk", "weather"];

export default function QuickAccessButtons() {
  const t = useTranslations("Home");
  const t2 = useTranslations("NavBar");
  const theme = useTheme();
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  type UserIdentity = { id: string };
  const { data: userIdentity } = useGetIdentity<UserIdentity>();
  const menuResources = resources;
  
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
    <Suspense fallback={<Spinner/>}>
      <Box sx={{ mb: 5 }}>
        <Grid container spacing={2}>
          {quickNavButtons.map(({ icon, label, path }: QuickButton) => (
            <Grid item xs={6} sm={4} key={label}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 4,
                  fontSize: "1.1rem",
                  borderRadius: "14px",
                  background: theme.palette.primary.main,
                  color: theme.palette.secondary.contrastText,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                  textTransform: "none",
                  '&:hover': {
                    background: theme.palette.primary.dark,
                  }
                }}
                onClick={() => router.push(path)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.2
                  }}
                >
                  {icon}
                  {t2(`${label}`)}
                </Box>
              </Button>
            </Grid>
          ))}
        
          <Grid item xs={12}>
            <Button variant="contained" sx={{ width: "100%", background: theme.palette.secondary.main, color: theme.palette.primary.contrastText }} onClick={() => setCreateModalOpen(true)}>{t("ReportTroubleatEFNU")}</Button>
          </Grid>
        </Grid>
        <AlertCreateModal 
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => {
            setCreateModalOpen(false);
          }}
        />
        
      </Box>
    </Suspense>
  );
}
