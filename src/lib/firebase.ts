import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth as FirebaseAuth } from "firebase/auth";
import {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
    Firestore as FirestoreType
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app: FirebaseApp | undefined;
let auth: FirebaseAuth | null = null;
let db: FirestoreType | null = null;
let storage: FirebaseStorage | null = null;

if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined") {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);

        db = initializeFirestore(app, {
            localCache: persistentLocalCache({
                tabManager: persistentMultipleTabManager()
            })
        });

        storage = getStorage(app);
    } catch (error) {
        console.error("Firebase initialization failed:", error);
    }
} else {
    console.warn("Firebase credentials missing. Running in local mode.");
}

export { auth, db, storage };
export default app;
