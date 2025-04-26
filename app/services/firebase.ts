// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCEfXuTZDDRUCqhxmnyXWWpnJ9vNGeF7E",
  authDomain: "traveljuan-89b17.firebaseapp.com",
  projectId: "traveljuan-89b17",
  storageBucket: "traveljuan-89b17.firebasestorage.app",
  messagingSenderId: "74890772792",
  appId: "1:74890772792:web:9cf099f89c938fd02e81cd",
  measurementId: "G-49N4H8BEPR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);