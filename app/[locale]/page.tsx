"use client";



import { NavigateToResource } from "@refinedev/nextjs-router";
import { Authenticated } from "@refinedev/core";
import React, { useEffect } from "react";
import OneSignal from 'react-onesignal';
import { useGetIdentity } from "@refinedev/core";

type User = {
  id: string;
  // add other user properties if needed
};

export default function IndexPage() {
  const { data: user } = useGetIdentity<User>();
  const UserID = user?.id || 'defaultUserId';

  useEffect(() => {
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
  }, []);
  OneSignal.User.addTag("user_role", 'admin');
  OneSignal.login(UserID);


  return (
    <Authenticated key="home">
        <NavigateToResource />
    </Authenticated>
  )
}