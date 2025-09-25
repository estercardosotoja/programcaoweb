// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Substitua pelos dados do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAkiUWZM4FXP5-XxRHSDH8ALHK_g8wSMKw",
  authDomain: "project-crud-450b5.firebaseapp.com",
  databaseURL: "https://project-crud-450b5-default-rtdb.firebaseio.com",
  projectId: "project-crud-450b5",
  storageBucket: "project-crud-450b5.firebasestorage.app",
  messagingSenderId: "408778519635",
  appId: "1:408778519635:web:62c89d69f98d41524202a6",
  measurementId: "G-9RHVF4EH7V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, app, auth };