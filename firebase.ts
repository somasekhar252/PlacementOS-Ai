
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged as fbOnAuthStateChanged, 
  signOut as fbSignOut 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";

/**
 * FIREBASE CONFIGURATION
 * 1. Go to Firebase Console (https://console.firebase.google.com/)
 * 2. Create a Project or select an existing one.
 * 3. Add a "Web App" to your project.
 * 4. Copy the config object below and paste your real values.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDFO1z-upVOuJp-v0nMKJCHMq2XD3RvVN8",
  authDomain: "placementos-ai-d335c.firebaseapp.com",
  projectId: "placementos-ai-d335c",
  storageBucket: "placementos-ai-d335c.firebasestorage.app",
  messagingSenderId: "734192125170",
  appId: "1:734192125170:web:d79f7473fc76e1091ffc6b",
  measurementId: "G-XXTMG65Y1B"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication Wrappers
export const onAuthStateChanged = (callback: (user: any) => void) => {
  return fbOnAuthStateChanged(auth, callback);
};

export const loginUser = async (email: string, pass: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

export const signUpUser = async (email: string, pass: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  // Initialize a profile entry in Firestore for the new user
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    profileCompleted: false,
    createdAt: new Date().toISOString()
  });

  return user;
};

export const signOut = async () => {
  return fbSignOut(auth);
};

// Firestore Exports (Modular)
export { doc, getDoc, setDoc, updateDoc };
