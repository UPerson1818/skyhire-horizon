
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA_e983VtxfgBl7uNCTcYd3C1B_8Us0MV8",
  authDomain: "sky-hire.firebaseapp.com",
  projectId: "sky-hire",
  storageBucket: "sky-hire.firebasestorage.app",
  messagingSenderId: "308333462828",
  appId: "1:308333462828:web:5213d30a13f05876735889"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
