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
import { useHandlePostClick } from "@components/Home/client";
import { LocalBlog } from "@/types/Blog";
import { Suspense } from 'react';
import { Spinner } from "@/components/ui/Spinner";

export default function LatestPosts() {
  const t = useTranslations("Home");
  const theme = useTheme();

  const { data: postData } = useList<LocalBlog>({
    resource: "blogs",
    meta: { select: "*" },
    pagination: { pageSize: 3 },
    sorters: [{ field: "published_at", order: "desc" }],
    filters: [{ field: "published", operator: "eq", value: true }]
  });
  const posts = postData?.data || [];

  return (
    <Suspense fallback={<Spinner/>}>
        <Box sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>{t("AirportUpdates")}</Typography>
            <Stack spacing={2}>
            {posts.map(post => (
                <Card key={post.id} sx={{ p: 2, borderLeft: `4px solid ${post.categoryColor || theme.palette.primary.main}` }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{post.title}</Typography>
                <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>{post.content.substring(0, 80)}...</Typography>
                <Button size="small" sx={{ mt: 1 }} onClick={() => useHandlePostClick(post.id)}>{t("readMore")}</Button>
                </Card>
            ))}
            </Stack>
        </Box>
    </Suspense>
  );
}