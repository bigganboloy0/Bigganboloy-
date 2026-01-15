import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCCdKuPLeSLJlYpGV-FLJpCADYgyXdMyhc",
  authDomain: "bigganboloy-8.firebaseapp.com",
  projectId: "bigganboloy-8",
  storageBucket: "bigganboloy-8.firebasestorage.app",
  messagingSenderId: "789581245755",
  appId: "1:789581245755:web:fd154ac7d0b5cba9821b1e",
  measurementId: "G-BJJGMQK2V8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// অ্যাডমিন ইমেইল
export const ADMIN_EMAIL = 'bigganboloy0@gmail.com';