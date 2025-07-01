// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1QK7Z4UaSyC87LFGjaVLK9bnQRI1I0IY",
  authDomain: "noirfolio-8eda9.firebaseapp.com",
  projectId: "noirfolio-8eda9",
  storageBucket: "noirfolio-8eda9.firebasestorage.app",
  messagingSenderId: "560926353323",
  appId: "1:560926353323:web:01edd0f7f5cec9d2c054ee",
  measurementId: "G-0KLBDPNHN7"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
