// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKJz2BdK2eeQBHrURUrfFEqw3yxYsYUp8",
  authDomain: "ljthub-discord-b742e.firebaseapp.com",
  databaseURL: "https://ljthub-discord-b742e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ljthub-discord-b742e",
  storageBucket: "ljthub-discord-b742e.firebasestorage.app",
  messagingSenderId: "905315381966",
  appId: "1:905315381966:web:4d7980aca2f4e1de9bd69f",
  measurementId: "G-YMK6SHN82S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { app, db };