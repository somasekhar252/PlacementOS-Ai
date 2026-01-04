
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged as fbOnAuthStateChanged, 
  signOut as fbSignOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * FIREBASE CONFIGURATION
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

  try {
    // Attempt to initialize profile document
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      profileCompleted: false,
      createdAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn("Initial Firestore write failed (likely due to rules). The user is still logged in.");
  }

  return user;
};

export const signOut = async () => {
  return fbSignOut(auth);
};

export { doc, getDoc, setDoc, updateDoc };
