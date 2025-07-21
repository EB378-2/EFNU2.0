// components/ui/NotificationSettings.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Notifications, NotificationsOff } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';


export function NotificationSettings() {
  const [permission, setPermission] = useState<'default' | 'granted' | 'denied'>('default');
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    // Check permission directly from the browser
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }

    // Check if push is enabled
    if (typeof window !== 'undefined' && (window as any).OneSignal) {
      (window as any).OneSignal.isPushNotificationsEnabled().then((res: boolean) => {
        setEnabled(res);
      });
    }
  }, []);

  const toggleSubscription = async () => {
    const OS = (window as any).OneSignal;
    if (!OS) return;

    const isEnabled = await OS.isPushNotificationsEnabled();
    if (isEnabled) {
      await OS.setSubscription(false);
      setEnabled(false);
    } else {
      await OS.setSubscription(true);
      setEnabled(true);
    }
  };

    return (
    <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={toggleSubscription}
            disabled={permission === 'denied' || enabled === null}
            color={enabled ? 'primary' : 'default'}
          >
            {enabled ? <Notifications /> : <NotificationsOff />}
          </IconButton>
    </Box>
  );
}