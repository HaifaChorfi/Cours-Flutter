import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB9wL1JhgfcYJriLvyDxAxNQWBXeGhxbLo",
  authDomain: "flutterqcm.firebaseapp.com",
  projectId: "flutterqcm",
  storageBucket: "flutterqcm.firebasestorage.app",
  messagingSenderId: "758018454310",
  appId: "1:758018454310:web:015ef358ed48790c8507e7",
  measurementId: "G-03HLJL4MBF"
 };

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);