// components/ui/NotificationSettings.tsx
'use client';

import { useEffect, useState } from 'react';
import { Notifications, NotificationsOff } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import OneSignal from 'react-onesignal';
import { useGetIdentity } from "@refinedev/core";
import { ProfileRoleNotification } from '../functions/FetchFunctions'; // Adjust the import path as necessary

type User = {
  id: string;
};


export function NotificationSettings() {
  const { data: user } = useGetIdentity<User>();
  const UserID = user?.id || 'defaultUserId';
  
  const [enabled, setEnabled] = useState<boolean | null>(null);
  useEffect(() => {
    OneSignal.init({
      appId: "fbef6154-11e5-44d2-a47f-25dd7840cf20"
    });
  }, []);
  const role = ProfileRoleNotification({profileId: UserID}) as string;

 
  const onHandleTag = (tag: string) => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      OneSignal.init({
        appId: 'fbef6154-11e5-44d2-a47f-25dd7840cf20',
        // You can add other initialization options here
        notifyButton: {
          enable: true,
          prenotify: true,
          showCredit: false,
          text: {
            'tip.state.unsubscribed': 'Subscribe to notifications',
            'tip.state.subscribed': "You're subscribed to notifications",
            'tip.state.blocked': "You've blocked notifications",
            'message.prenotify': 'Click to subscribe to notifications',
            'message.action.subscribed': "Thanks for subscribing!",
            'message.action.resubscribed': "You're subscribed to notifications",
            'message.action.unsubscribed': "You won't receive notifications again",
            'message.action.subscribing': "Subscribing...",
            'dialog.main.title': 'Manage Site Notifications',
            'dialog.main.button.subscribe': 'SUBSCRIBE',
            'dialog.main.button.unsubscribe': 'UNSUBSCRIBE',
            'dialog.blocked.title': 'Unblock Notifications',
            'dialog.blocked.message': 'Follow these instructions to allow notifications:'
          }
        }
      });
    }
    OneSignal.User.PushSubscription.optIn();
    OneSignal.User.addTag("user_role", tag)
    OneSignal.login(UserID);
    OneSignal.Slidedown.promptPush();
    setEnabled(true);
    console.log('Tagging');
    
  }



    return (
    <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={() => onHandleTag(role)}
            color={enabled ? 'primary' : 'default'}
          >
            {enabled ? <Notifications /> : <NotificationsOff />}
          </IconButton>
    </Box>
  );
}