"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useTheme } from "@hooks/useTheme";
import {
  getfinishTime,
  getlocalDate,
  getlocalTime,
  getutcTime
} from "@components/Home/time";
import SunriseSunsetCard from "@components/Home/SunriseSunsetCard"
import { Suspense } from 'react';
import { Spinner } from "@/components/ui/Spinner";


export default function Header() {
  const t = useTranslations("Home");
  const theme = useTheme();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const localTime = getlocalTime(currentTime);
  const utcTime = getutcTime(currentTime);
  const finishTime = getfinishTime(currentTime);
  const todayDate = getlocalDate(currentTime);

  return (
    <Box sx={{ mb: 4, textAlign: "center", color: theme.palette.primary.contrastText }}>
        <Typography variant="overline" sx={{ opacity: 0.7 }}>{todayDate}</Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{t("title")}
          ONGOING UPDATES, SOME ERRORS MAY BE VISIBLE!
        </Typography>
        <Suspense fallback={<Spinner />}>
            <Stack direction="row" spacing={2} justifyContent="center">
            <Typography variant="body2">LCL: {localTime}</Typography>
            <Typography variant="body2">UTC: {utcTime}</Typography>
            <Typography variant="body2">FIN: {finishTime}</Typography>
            </Stack>
            <SunriseSunsetCard />
        </Suspense>
    </Box>
  );
}