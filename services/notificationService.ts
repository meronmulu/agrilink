import { getToken, onMessage } from "firebase/messaging"
import { getFirebaseMessaging } from "@/lib/firebase"
import instance from "@/lib/axios/axios"

export const requestNotificationPermission = async () => {
  try {
    if (typeof window === "undefined") return null

    const messaging = await getFirebaseMessaging()
    if (!messaging) return null

    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register("/firebase-messaging-sw.js")
    }

    const permission = await Notification.requestPermission()

    if (permission !== "granted") {
      console.log("Notification permission denied")
      return null
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    })

    console.log("🔥 FCM TOKEN:", token)

    if (token) {
      await instance.post("/devices/register", {
        token: token,
        platform: "WEB",
      })
      console.log("✅ Device token registered")
    }

    return token
  } catch (error) {
    console.log("FCM registration error:", error)
    return null
  }
}

export const listenForegroundNotification = async () => {
  const messaging = await getFirebaseMessaging()
  if (!messaging) return

  onMessage(messaging, (payload) => {
    console.log("Foreground notification:", payload)

    if (payload.notification) {
      new Notification(payload.notification.title || "Agrilink", {
        body: payload.notification.body,
        icon: "/logo.png",
      })
    }
  })
}


export const getNotifications = async () => {
  const res = await instance.get("/notification")
  return res.data
}

