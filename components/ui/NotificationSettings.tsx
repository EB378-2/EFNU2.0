// components/ui/NotificationSettings.tsx
'use client';

import { useEffect, useState } from 'react';
import { Notifications, NotificationsOff } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import OneSignal from 'react-onesignal';
import { useGetIdentity } from "@refinedev/core";

type User = {
  id: string;
  // add other user properties if needed
};


export function NotificationSettings() {
  const { data: user } = useGetIdentity<User>();
  const UserID = user?.id || 'defaultUserId';
  
  const [enabled, setEnabled] = useState<boolean | null>(null);

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    useEffect(() => {
    OneSignal.init({
      appId: "68782627-f22d-45b7-b1eb-44b826777b50"
    });
  }, []);

 
  const onHandleTag = (tag: string) => {
    OneSignal.User.addTag("user_role", tag)
    OneSignal.login(UserID);
    setEnabled(true);
    console.log('Tagging');
    
  }



    return (
    <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={() => onHandleTag('admin')}
            color={enabled ? 'primary' : 'default'}
          >
            {enabled ? <Notifications /> : <NotificationsOff />}
          </IconButton>
    </Box>
  );
}