'use client'

import React, { useState, useEffect, ChangeEvent } from 'react'
import type { JSX } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from '../actions'
import { useTranslations } from 'next-intl'

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

export default function Page(): JSX.Element {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  )
}
