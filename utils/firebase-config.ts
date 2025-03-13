import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDGkJSdQT3actkMUTUPhCRWalNzhnqVcBM",
  authDomain: "deviceinfo-hub-9a34d.firebaseapp.com",
  projectId: "deviceinfo-hub-9a34d",
  storageBucket: "deviceinfo-hub-9a34d.appspot.com",
  messagingSenderId: "127759514005",
  appId: "1:127759514005:web:baba8a80a0bc646c215e9c",
  measurementId: "G-N473WWH0YM",
};

const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app); 
const auth = getAuth(app);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
//const db=getFirestore(app)
if (!auth) {
  throw new Error('Firebase Auth is not initialized properly');
}


export { app, auth,firestore,firebaseConfig };
