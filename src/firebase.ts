import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  getDocFromServer
} from "firebase/firestore";

const firebaseConfig = {
  projectId: "serious-woods-krwfn",
  appId: "1:156613909966:web:e3b9a02fcc85db6bdb5f9f",
  apiKey: "AIzaSyB0f7MbZlenFC1lJAba4SX2WHHleKh0l0o",
  authDomain: "serious-woods-krwfn.firebaseapp.com",
  storageBucket: "serious-woods-krwfn.firebasestorage.app",
  messagingSenderId: "156613909966"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Use the custom database ID as provided in config
export const db = getFirestore(app, "ai-studio-4f7c31f9-2102-44ab-9702-cf2803aa87eb");

export const googleProvider = new GoogleAuthProvider();

// Test connection on boot to verify setup
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection verified.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network status.", error);
    } else {
      console.log("Firebase initialized.");
    }
  }
}
testConnection();

export {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  type User
};
