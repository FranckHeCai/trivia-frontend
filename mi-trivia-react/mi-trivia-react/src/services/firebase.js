import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_PROJECT_ID + '.firebaseapp.com',
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_PROJECT_ID + ".appspot.com",
  databaseURL: import.meta.env.VITE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
