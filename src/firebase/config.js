// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Use environment variables for production, fallback for development
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB-2thip8B-f5g_7Mfnm2n2fN2jHZrKzRw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "andinet-newspaper.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "andinet-newspaper",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "andinet-newspaper.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "484283375010",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:484283375010:web:0f40a84965af07297a66fb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GKYNLMN93X"
};

// WARNING: In production, environment variables MUST be set
if (import.meta.env.PROD && !import.meta.env.VITE_FIREBASE_API_KEY) {
  console.error('🚨 CRITICAL: Firebase API key not set in environment variables!');
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  console.log("🔥 Connected to Firebase Emulators");
}
