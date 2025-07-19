'use client'

import { useEffect } from 'react'
import OneSignal from 'react-onesignal';

export default function OneSignalWrapper() {
  useEffect(() => {
    if (typeof window === 'undefined' || window.OneSignal) return

    const script = document.createElement('script')
    script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      // @ts-expect-error OneSignal types missing globally
      window.OneSignal = window.OneSignal || []
      // @ts-expect-error OneSignal SDK push method is untyped
      OneSignal.push(function () {
        OneSignal.init({
          appId: 'fbef6154-11e5-44d2-a47f-25dd7840cf20',
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
              'dialog.blocked.message': 'Follow these instructions to allow notifications:',
            },
          },
          serviceWorkerParam: { scope: '/' },
          serviceWorkerPath: '/sw.js',
          serviceWorkerUpdaterPath: '/sw.js',
        })
      })
    }
  }, [])

  return null
}
