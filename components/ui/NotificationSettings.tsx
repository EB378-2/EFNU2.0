// components/ui/NotificationSettings.tsx
'use client';

import { useEffect, useState } from 'react';
import { Notifications, NotificationsOff } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import OneSignal from 'react-onesignal';



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

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    useEffect(() => {
    OneSignal.init({
      appId: "68782627-f22d-45b7-b1eb-44b826777b50"
    });
  }, []);

 
  const onHandleTag = (tag: string) => {
    OneSignal.User.addTag("user_role", tag)
    console.log('Tagging');
    
  }



    return (
    <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={() => onHandleTag('admin')}
            disabled={permission === 'denied' || enabled === null}
            color={enabled ? 'primary' : 'default'}
          >
            {enabled ? <Notifications /> : <NotificationsOff />}
          </IconButton>
    </Box>
  );
}