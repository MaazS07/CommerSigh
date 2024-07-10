// src/firebaseClient.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, reauthenticateWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDs5f3l1r3ZxAmGMw9fa4KBi4KheqEuWho",
  authDomain: "scraping-e8a0a.firebaseapp.com",
  projectId: "scraping-e8a0a",
  storageBucket: "scraping-e8a0a.appspot.com",
  messagingSenderId: "1067186613245",
  appId: "1:1067186613245:web:feb9a16ac89f7c4e89c794",
  measurementId: "G-Z49RYYGZHW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, reauthenticateWithPopup };