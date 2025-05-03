import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBCEfXuTZDDRUCqhxmnyXWWpnJ9vNGeF7E",
  authDomain: "traveljuan-89b17.firebaseapp.com",
  projectId: "traveljuan-89b17",
  storageBucket: "traveljuan-89b17.appspot.com",
  messagingSenderId: "74890772792",
  appId: "1:74890772792:web:9cf099f89c938fd02e81cd",
  measurementId: "G-49N4H8BEPR",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const storage = getStorage(app);