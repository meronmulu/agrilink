importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js")

firebase.initializeApp({
  apiKey: "AIzaSyCT7-LpogE_O037-RjmX0_9f9TTBVbhp98",
  authDomain: "agrilink-c9788.firebaseapp.com",
  projectId: "agrilink-c9788",
  storageBucket: "agrilink-c9788.firebasestorage.app",
  messagingSenderId: "842881665346",
  appId: "1:842881665346:web:b134bd30fee5353246e0db"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function(payload) {
  console.log("Background notification:", payload)

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
  })
})