// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyByiOkhjMRmhg_Y5l2byzhnWKxdY0SXFUw",
  authDomain: "newidolgame.firebaseapp.com",
  projectId: "newidolgame",
  storageBucket: "newidolgame.appspot.com",
  messagingSenderId: "167024582833",
  appId: "1:167024582833:web:3e37558077a853e7ba8290",
  measurementId: "G-CDMTML8QW6"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
