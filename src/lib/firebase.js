import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCHpyVqTBsIu3fbG6uUcR3OCMyvXbwND4",
  authDomain: "campus-automation-3bf0b.firebaseapp.com",
  projectId: "campus-automation-3bf0b",
  storageBucket: "campus-automation-3bf0b.firebasestorage.app",
  messagingSenderId: "71908522015",
  appId: "1:71908522015:web:bcdafb6f7aab2552d9bd2a",
  measurementId: "G-R51V7NKH6K"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app); 
