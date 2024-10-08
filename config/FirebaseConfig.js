// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "nexo-tchad.firebaseapp.com",
  projectId: "nexo-tchad",
  storageBucket: "nexo-tchad.appspot.com",
  messagingSenderId: "432362137253",
  appId: "1:432362137253:web:fe1f88ea568d512b848f4c",
  measurementId: "G-9D41T76RWE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
const analytics = getAnalytics(app);