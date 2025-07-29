// pages/notifications.tsx
"use client";

import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Link,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useList } from '@refinedev/core';

type Notification = {
  id: number;
  created_at: string;
  title: string;
  content: string | null;
  ['big-Image']?: string | null;
  link?: string | null;
  role?: string | null;
};

export default function NotificationsPage() {
  const {
    data: notifications,
    isLoading,
    isError,
  } = useList<Notification>({
    resource: 'Notifications',
    pagination: { mode: 'off' }, // disable pagination if you want all
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : isError || !notifications?.data?.length ? (
        <Typography>No notifications found.</Typography>
      ) : (
        <Stack spacing={2}>
          {notifications.data.map((n) => (
            <Card key={n.id}>
              <CardContent>
                <Typography variant="h6">{n.title}</Typography>
                {n.role && (
                  <Typography variant="caption" color="text.secondary">
                    Role: {n.role}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {n.content}
                </Typography>
                {n.link && (
                  <Link
                    href={n.link}
                    target="_blank"
                    rel="noopener"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    View More
                  </Link>
                )}
                <Typography variant="caption" color="text.secondary">
                  {new Date(n.created_at).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}
