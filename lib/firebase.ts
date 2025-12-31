import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC0LtaZcZOzfFR1N-owhtdJSB6096Gjy5I",
    authDomain: "sst-manager-80241.firebaseapp.com",
    projectId: "sst-manager-80241",
    storageBucket: "sst-manager-80241.firebasestorage.app",
    messagingSenderId: "552285398446",
    appId: "1:552285398446:web:89f4b3da39121434ec943f",
    measurementId: "G-QLE3889BH0"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
