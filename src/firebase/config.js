// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Emulators are ONLY for local development
// They are commented out for production safety
// To use emulators locally, uncomment these lines:
// if (import.meta.env.DEV && window.location.hostname === 'localhost') {
//   import('firebase/auth').then(({ connectAuthEmulator }) => {
//     connectAuthEmulator(auth, "http://127.0.0.1:9099");
//   });
//   import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
//     connectFirestoreEmulator(db, "127.0.0.1", 8080);
//   });
//   import('firebase/storage').then(({ connectStorageEmulator }) => {
//     connectStorageEmulator(storage, "127.0.0.1", 9199);
//   });
//   console.log("🔥 Connected to Firebase Emulators");
// }
