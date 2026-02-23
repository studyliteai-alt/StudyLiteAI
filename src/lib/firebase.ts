import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined") {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);

        // Use initializeFirestore to enable persistent cache (offline support)
        db = initializeFirestore(app, {
            localCache: persistentLocalCache({
                tabManager: persistentMultipleTabManager()
            })
        });

        storage = getStorage(app);
        console.log("Firebase initialized successfully with persistent cache");
    } catch (error) {
        console.error("Firebase initialization failed:", error);
    }
} else {
    console.warn("Firebase credentials missing. Dashboard will use Local Storage for persistence.");
}

export { auth, db, storage };
export default app;
