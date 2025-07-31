'use client';

import { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';
import { useGetIdentity } from '@refinedev/core';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { Notifications, NotificationsOff } from '@mui/icons-material';
import { ProfileRoleNotification } from '../functions/FetchFunctions'; // Adjust as needed

type User = {
  id: string;
};

export default function NotificationManager() {
  const { data: user } = useGetIdentity<User>();
  const userId = user?.id || '';

  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [alreadyInitialized, setAlreadyInitialized] = useState(false);
  const role = ProfileRoleNotification({ profileId: userId }) as string;

  useEffect(() => {
    if (!alreadyInitialized && typeof window !== 'undefined') {
      const initOneSignal = async () => {
        try {
          console.log('Initializing OneSignal...');
          await OneSignal.init({
            appId: process.env.NEXT_PUBLIC_APP_ID || 'fbef6154-11e5-44d2-a47f-25dd7840cf20',
            allowLocalhostAsSecureOrigin: true,
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

          OneSignal.User.PushSubscription.addEventListener('change', event => {
            const subId = event.current.id || null;
            setSubscriptionId(subId);
            setEnabled(!!subId);
          });

          OneSignal.Notifications.addEventListener(
            'foregroundWillDisplay',
            event => {
              console.info('Notification will display:', event);
            }
          );

          setAlreadyInitialized(true);
        } catch (e) {
          console.error('OneSignal initialization failed:', e);
        }
      };

      initOneSignal();
    }
  }, [alreadyInitialized]);

  const handleTagAndSubscribe = async () => {
    if (!userId || !role) return;

    console.log('Launching prompt...');
    await OneSignal.Slidedown.promptPush({
      force: true,
      forceSlidedownOverNative: true
    });
    console.log('Prompt launched.');

    console.log('Tagging and subscribing...');
    await OneSignal.User.PushSubscription.optIn();
    await OneSignal.User.addTag('user_role', role);
    await OneSignal.login(userId);
    await OneSignal.Slidedown.promptPush();
    console.log('User tagged and logged in:', { userId, role });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="h6">
        Subscription ID:{' '}
        <span style={{ fontFamily: 'monospace', background: '#111', color: '#9f0', padding: '2px 6px' }}>
          {subscriptionId || 'Anonymous'}
        </span>
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        <IconButton onClick={handleTagAndSubscribe} color={enabled ? 'primary' : 'default'}>
          {enabled ? <Notifications /> : <NotificationsOff />}
        </IconButton>

      </Box>
    </Box>
  );
}
