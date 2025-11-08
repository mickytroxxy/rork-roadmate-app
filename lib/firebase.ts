import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBMaeratxolleF0cB4XtHurLklXbgNchGc",
  authDomain: "smarthealth-a0720.firebaseapp.com",
  projectId: "smarthealth-a0720",
  storageBucket: "smarthealth-a0720.appspot.com",
  messagingSenderId: "393573646039",
  appId: "1:393573646039:web:456cc0af5be5d6b2773a92"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
