import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import instance from "@/lib/axios/axios";
import { NotificationPayload } from "@/types/notification";

/* =========================
   REGISTER DEVICE FOR FCM
========================= */
export const requestNotificationPermission = async () => {
  try {
    if (typeof window === "undefined") return null;

    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    console.log("🔥 FCM TOKEN:", token);

    if (token) {
      await instance.post("/devices/register", {
        token,
        platform: "WEB",
      });

      console.log("✅ Device token registered");
    }

    return token;
  } catch (error) {
    console.log("FCM registration error:", error);
    return null;
  }
};

/* =========================
   FOREGROUND PUSH LISTENER
========================= */
export const listenForegroundNotification = async (
  callback?: () => void
) => {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log("Foreground notification:", payload);

      if (payload.notification) {
        new Notification(payload.notification.title || "AgriLink", {
          body: payload.notification.body,
          icon: "/logo.png",
        });
      }

      // refresh header badge / notification page
      if (callback) callback();
    });
  } catch (error) {
    console.log("Foreground listener error:", error);
  }
};

/* =========================
   GET ALL NOTIFICATIONS
========================= */
/* =========================
   GET ALL NOTIFICATIONS
========================= */
export const getNotifications = async (): Promise<NotificationPayload[]> => {
  try {
    const res = await instance.get("/notification");
    console.log("GET /notification =>", res.data);

    if (Array.isArray(res.data)) return res.data;
    
    return res.data.notification || res.data.data || res.data.notifications || [];
  } catch (error) {
    console.log("Get notifications error:", error);
    return [];
  }
};

/* =========================
   GET ONLY NEW/UNREAD
========================= */
export const getNewNotifications = async (): Promise<NotificationPayload[]> => {
  try {
    const res = await instance.get("/notification/new");
    console.log("GET /notification/new =>", res.data);

    // FIX: The API returns { newNotifications: [...] }
    if (Array.isArray(res.data)) return res.data;

    return res.data.newNotifications || res.data.data || res.data.notifications || [];
  } catch (error) {
    console.log("Get new notifications error:", error);
    return [];
  }
};

/* =========================
   MARK ONE AS READ
========================= */
export const markNotificationRead = async (id: string) => {
  try {
    const res = await instance.patch(`/notification/${id}`);
    console.log("PATCH /notification/:id =>", res.data);
    return res.data;
  } catch (error) {
    console.log("Mark notification read error:", error);
    throw error;
  }
};