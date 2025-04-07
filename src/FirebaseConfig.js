import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAMhw3kUHR_Eus2r9NZhPB9Zqq3wOP7zuQ",
  authDomain: "honducare-hn-47688.firebaseapp.com",
  projectId: "honducare-hn-47688",
  storageBucket: "honducare-hn-47688.firebaseapp.com",
  messagingSenderId: "43308977165",
  appId: "43308977165"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export{ auth };
