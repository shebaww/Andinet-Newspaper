import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-2thip8B-f5g_7Mfnm2n2fN2jHZrKzRw",
  authDomain: "andinet-newspaper.firebaseapp.com",
  databaseURL: "https://andinet-newspaper-default-rtdb.firebaseio.com",
  projectId: "andinet-newspaper",
  storageBucket: "andinet-newspaper.firebasestorage.app",
  messagingSenderId: "484283375010",
  appId: "1:484283375010:web:0f40a84965af07297a66fb",
  measurementId: "G-GKYNLMN93X"
};

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
