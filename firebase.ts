import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: (import.meta.env as any).VITE_FIREBASE_API_KEY || "AIzaSyDFO1z-upVOuJp-v0nMKJCHMq2XD3RvVN8",
  authDomain: (import.meta.env as any).VITE_FIREBASE_AUTH_DOMAIN || "placementos-ai-d335c.firebaseapp.com",
  projectId: (import.meta.env as any).VITE_FIREBASE_PROJECT_ID || "placementos-ai-d335c",
  // use the correct default host for Firebase Storage
  storageBucket: (import.meta.env as any).VITE_FIREBASE_STORAGE_BUCKET || "placementos-ai-d335c.appspot.com",
  messagingSenderId: (import.meta.env as any).VITE_FIREBASE_MESSAGING_SENDER_ID || "734192125170",
  appId: (import.meta.env as any).VITE_FIREBASE_APP_ID || "1:734192125170:web:bb08ca987b0ac72f1ffc6b",
  measurementId: (import.meta.env as any).VITE_FIREBASE_MEASUREMENT_ID || "G-B7XS9K3VLD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Authentication Listeners
export { onAuthStateChanged, signOut };

// Real Auth Actions
export const loginUser = async (email: string, pass: string) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  } catch (err) {
    // rethrow so callers can handle UI navigation/errors
    throw err;
  }
};

export const signUpUser = async (email: string, pass: string) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    // Initialize user profile in Firestore immediately
    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      uid: cred.user.uid,
      profileCompleted: false,
      createdAt: new Date().toISOString()
    });
    return cred.user;
  } catch (err) {
    // cleanup or custom handling could go here; rethrow for caller
    throw err;
  }
};

// New: initAuthNavigation helps route on auth state changes.
// - navigate: function that receives a path string (e.g. from react-router's navigate or vue-router's router.push).
// - onSignedIn: optional callback invoked with the User when signed in.
// Returns: unsubscribe function to stop listening.
export const initAuthNavigation = (
  navigate: (path: string) => any,
  onSignedIn?: (user: User) => void
) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // user is signed in -> go to dashboard
      try { navigate("/dashboard"); } catch {}
      if (onSignedIn) onSignedIn(user);
    } else {
      // not signed in -> go to login
      try { navigate("/login"); } catch {}
    }
  });
  return unsubscribe;
};

// Firestore Helpers
export { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs };