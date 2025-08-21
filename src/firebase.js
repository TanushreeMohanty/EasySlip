// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth,GoogleAuthProvider  } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCV6e0k1s7zZJlnEbJeSvgiTeWwTGoN6Lc",
  authDomain: "receipt-generator-63bdc.firebaseapp.com",
  projectId: "receipt-generator-63bdc",
  storageBucket: "receipt-generator-63bdc.firebasestorage.app",
  messagingSenderId: "730573768359",
  appId: "1:730573768359:web:e338366dc0fde43b6bfd82"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
