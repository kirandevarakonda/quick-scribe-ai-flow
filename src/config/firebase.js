import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKk4cTjvSvzd_ymJtzKU_V44fa1ptkOVw",
  authDomain: "seocreator-97b49.firebaseapp.com",
  projectId: "seocreator-97b49",
  storageBucket: "seocreator-97b49.firebasestorage.app",
  messagingSenderId: "317717952746",
  appId: "1:317717952746:web:1b8bf9f86e6d6d426eff93",
  measurementId: "G-7D07MD3T7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth }; 