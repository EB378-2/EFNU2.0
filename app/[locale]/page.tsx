'use client'

import React, { useState, useEffect, ChangeEvent } from 'react';
import type { JSX } from 'react';
import { subscribeUser, unsubscribeUser, sendNotification } from '../actions';
import { useTranslations } from 'next-intl';
import OneSignal from 'react-onesignal';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function PushNotificationManager(): JSX.Element {
  const [isSupported, setIsSupported] = useState<boolean>(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [message, setMessage] = useState<string>('')
  const [history, setHistory] = useState<string[]>([])

  const t = useTranslations('PushNotifications')

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker().catch(console.error)
    }

    // Load cached history from localStorage
    const stored = localStorage.getItem('notificationHistory')
    if (stored) {
      setHistory(JSON.parse(stored))
    }
  }, [])

  async function registerServiceWorker(): Promise<void> {
    const registration = await navigator.serviceWorker.register('/OneSignalSDKWorker.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }

  async function subscribeToPush(): Promise<void> {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    const serializedSub = JSON.parse(JSON.stringify(sub))
    await subscribeUser(serializedSub)
  }

  async function unsubscribeFromPush(): Promise<void> {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }

  async function sendTestNotification(): Promise<void> {
    if (subscription && message.trim() !== '') {
      await sendNotification(message)
      const updated = [message, ...history].slice(0, 10) // keep only latest 10
      setHistory(updated)
      localStorage.setItem('notificationHistory', JSON.stringify(updated))
      setMessage('')
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Push Notifications</h3>

      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={unsubscribeFromPush}>Unsubscribe</button>
          <div className="flex gap-2">
            <input
              type="text"
              className="border px-2 py-1 rounded"
              placeholder="Enter notification message"
              value={message}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMessage(e.target.value)
              }
            />
            <button onClick={sendTestNotification}>
              {t('SendTest') || 'Send'}
            </button>
          </div>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button onClick={subscribeToPush}>Subscribe</button>
        </>
      )}

      {history.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium">Sent Notifications</h4>
          <ul className="list-disc pl-5 text-sm">
            {history.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function InstallPrompt(): JSX.Element | null {
  const [isIOS, setIsIOS] = useState<boolean>(false)
  const [isStandalone, setIsStandalone] = useState<boolean>(false)

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window))
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  if (isStandalone) return null

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Install App</h3>
      {isIOS ? (
        <p>
          To install this app on iOS: tap the share button{' '}
          <span role="img" aria-label="share">⎋</span> then “Add to Home Screen”{' '}
          <span role="img" aria-label="plus">➕</span>
        </p>
      ) : (
        <p>Use your browser menu to “Install App”.</p>
      )}
    </div>
  )
}

export default function Page() {
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

  return (
    <div>
      <h1>Hello, world!</h1>
        <div className="p-4 max-w-xl mx-auto">
        <PushNotificationManager />
        <InstallPrompt />
      </div>
    </div>
  );
}