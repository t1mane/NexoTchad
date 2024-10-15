import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDPs3IYIPGuil3bk7rdDORPG5MzIq8NjUg",
  authDomain: "nexotchad.firebaseapp.com",
  projectId: "nexotchad",
  storageBucket: "nexotchad.appspot.com",
  messagingSenderId: "944673865745",
  appId: "1:944673865745:web:7fd0a11c065b233ab231b0",
  measurementId: "G-J7MXKWLEG3"
};

// Initialize Firebase App (Singleton Pattern)
const FIREBASE_APP = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIRESTORE_DB = getFirestore(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB };
