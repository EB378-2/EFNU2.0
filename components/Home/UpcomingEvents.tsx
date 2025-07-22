"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card
} from "@mui/material";
import { useTheme } from "@hooks/useTheme";
import { useTranslations } from "next-intl";
import { useList } from "@refinedev/core";
import { useHandleEventClick } from "@components/Home/client";
import { format } from "date-fns";
import { CalendarEvent } from "@/types/Calendar";
import { Suspense } from 'react';
import { Spinner } from "@/components/ui/Spinner";

export default function UpcomingEvents() {
  const handleEventClick = useHandleEventClick();
  const t = useTranslations("Home");
  const theme = useTheme();

  const { data: eventData } = useList<CalendarEvent>({
    resource: "events",
    meta: { select: "*" },
    pagination: { pageSize: 10 },
    sorters: [{ field: "end_time", order: "asc" }],
    filters: [{ field: "end_time", operator: "gte", value: new Date().toISOString() }]
  });
  const events = eventData?.data || [];

  return (
    <Suspense fallback={<Spinner/>}>
        <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>{t("UpcomingEvents")}</Typography>
            <Stack spacing={2}>
                {events.map(event => (
                <Card key={event.id} sx={{ p: 2, borderLeft: `4px solid ${theme.palette.secondary.main}` }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{event.title}</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {format(event.start_time, "dd/MM/yyyy, HH:mm")} – {format(event.end_time, "HH:mm")}
                    </Typography>
                    <Button size="small" sx={{ mt: 1 }} onClick={() => handleEventClick(event.id)}>{t("Details")}</Button>
                </Card>
                ))}
            </Stack>
        </Box>
    </Suspense>
  );
}