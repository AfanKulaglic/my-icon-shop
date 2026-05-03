// Firebase setup — fill in your credentials in a .env file as VITE_FIREBASE_*.
// All exports are lazy so the app runs without Firebase configured.

import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const config = {
  apiKey: "AIzaSyBCaBkqahLU7Acqt0VbiC-j4IEjZrq-v1I",
  authDomain: "chat-app-24ef7.firebaseapp.com",
  databaseURL: "https://chat-app-24ef7-default-rtdb.firebaseio.com",
  projectId: "chat-app-24ef7",
  storageBucket: "chat-app-24ef7.appspot.com",
  messagingSenderId: "65091768529",
  appId: "1:65091768529:web:95d34e1f8c8d48d58df5f0"
};

let app = null;
let database = null;

export function getFirebaseApp() {
  if (!app) {
    app = getApps()[0] || initializeApp(config);
  }
  return app;
}

export function getFirebaseDatabase() {
  if (!database) {
    const firebaseApp = getFirebaseApp();
    database = getDatabase(firebaseApp);
  }
  return database;
}
