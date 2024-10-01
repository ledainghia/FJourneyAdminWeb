import { getApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { firebaseConfig } from './fnContants';

// Replace the following with your app's Firebase project configuration

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
    const supported = await isSupported();
    return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
    const fbConfig = firebaseConfig;
    try {
        const fcmMessaging = await messaging();
        if (fcmMessaging) {
            const token = await getToken(fcmMessaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
                serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js' + '?cf=' + JSON.stringify(fbConfig), { scope: '/' }),
            });
            return token;
        }
        return null;
    } catch (err) {
        console.error('An error occurred while fetching the token:', err);
        return null;
    }
};

export { app, messaging };
