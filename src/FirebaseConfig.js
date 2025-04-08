import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDNJGki27SXQqM7q9tZeOx0Dsl99XmdcaU",
  authDomain: "honducare-hn-47688.firebaseapp.com",
  projectId: "honducare-hn-47688",
  storageBucket: "honducare-hn-47688.firebasestorage.app",
  messagingSenderId: "43308977165",
  appId: "1:43308977165:web:7b0724844a6e27b4e89944",
  measurementId: "G-1ZGFK3YXTC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export{ auth };
