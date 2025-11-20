// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAn5nYQuHTPIfRcP24RZGXivzdeubOti7Y",
  authDomain: "conexionfb-2db3f.firebaseapp.com",
  projectId: "conexionfb-2db3f",
  storageBucket: "conexionfb-2db3f.firebasestorage.app",
  messagingSenderId: "808489582446",
  appId: "1:808489582446:web:ea3c2ef4434a66b3200b7f",
  measurementId: "G-L632YJ3K3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);