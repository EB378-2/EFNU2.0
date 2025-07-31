'use client'
import { useEffect, useState } from 'react'
import OneSignal from 'react-onesignal'

export default function Demo() {
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null)
  const [alreadyInitialized, setAlreadyInitialized] = useState(false)

  useEffect(() => {
    if (alreadyInitialized) return

    const init = async () => {
      try {
        console.log('Initializing OneSignal')
        await OneSignal.init({
          appId: process.env['NEXT_PUBLIC_APP_ID']!,
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
        })

        OneSignal.User.PushSubscription.addEventListener('change', event => {
          event.current.id
            ? setSubscriptionId(event.current.id)
            : setSubscriptionId(null)
        })
        OneSignal.Notifications.addEventListener(
          'foregroundWillDisplay',
          event => {
            console.info('Notification willDisplay', event)
          }
        )

        setAlreadyInitialized(true)
      } catch (e) {
        console.error('OneSignal initilization error.', e)
      }
    }
    window && init()
  }, [])

  return (
    <>
      <p className="justify-center mx-auto text-xl">
        Subscription ID:{' '}
        <span className="font-mono bg-gray-800 text-lime-400  p-1">
          {subscriptionId || 'Anonymous'}
        </span>
      </p>

      <button
        className="p-2 border border-slate-50 w-48 justify-center mx-auto hover:border-red-500"
        onClick={async e => {
          e.preventDefault()
          console.log('Launching prompt')

          await OneSignal.Slidedown.promptPush({
            force: true,
            forceSlidedownOverNative: true,
          })
          console.log('Launched prompt')
        }}
      >
        Launch prompt
      </button>
    </>
  )
}