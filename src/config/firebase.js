import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration loaded securely from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Singleton App Instance to prevent HMR duplicate app init
let app;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  console.warn("Firebase App Init Failed:", e);
  app = null;
}

let tmpAuth = null;
let tmpProvider = null;
if (app) {
  try {
    tmpAuth = getAuth(app);
    tmpProvider = new GoogleAuthProvider();
  } catch (e) {
    console.warn("Firebase Auth Init Failed. Check API Key.", e);
  }
}

export const auth = tmpAuth;
export const googleProvider = tmpProvider;

// Initialize Firestore with forced HTTP Long Polling to bypass AdBlocker / Privacy extension channel blocks
let firestoreDb = null;
if (app) {
  try {
    firestoreDb = initializeFirestore(app, {
      experimentalForceLongPolling: true,
      useFetchStreams: false
    });
  } catch (e) {
    try {
      firestoreDb = getFirestore(app);
    } catch (ignore) {}
  }
}

export const db = firestoreDb;

// Initialize Analytics only in production environments (skips localhost to avoid ERR_ADDRESS_UNREACHABLE)
export let analytics;
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  isSupported()
    .then(supported => {
      if (supported && firebaseConfig.measurementId) {
        try {
          analytics = getAnalytics(app);
        } catch (err) {
          // Ignore analytics failure
        }
      }
    })
    .catch(() => {});
}
