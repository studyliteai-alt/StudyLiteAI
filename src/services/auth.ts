import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    handle: string;
    avatarSeed: string;
    role: 'user' | 'admin';
    createdAt: string;
}

export const subscribeToAuth = (callback: (user: User | null) => void) => {
    if (!auth) {
        callback(null);
        return () => { };
    }
    return onAuthStateChanged(auth, callback);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    if (!db) return null;
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};

export const signUp = async (email: string, pass: string, name: string) => {
    if (!auth || !db) throw new Error("Authentication services not initialized.");
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // Update Firebase Auth profile
    await updateProfile(user, { displayName: name });

    // Create Firestore profile
    const profile: UserProfile = {
        uid: user.uid,
        email: email,
        displayName: name,
        handle: 'Pro Member',
        avatarSeed: name,
        role: 'user', // Default role
        createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, "users", user.uid), profile);
    return userCredential;
};

export const logIn = (email: string, pass: string) => {
    if (!auth) throw new Error("Authentication service not initialized.");
    return signInWithEmailAndPassword(auth, email, pass);
};

export const logOut = () => {
    if (!auth) return Promise.resolve();
    return signOut(auth);
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    if (!db) return;
    try {
        const docRef = doc(db, "users", uid);
        await setDoc(docRef, data, { merge: true });
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

const ensureUserProfile = async (user: User) => {
    if (!db) return;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        const profile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Student',
            handle: 'Pro Member',
            avatarSeed: user.displayName || user.uid,
            role: 'user',
            createdAt: new Date().toISOString()
        };
        await setDoc(docRef, profile);
    }
};

export const signInWithGoogle = async () => {
    if (!auth) throw new Error("Authentication service not initialized.");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await ensureUserProfile(result.user);
    return result;
};

export const signInWithApple = async () => {
    if (!auth) throw new Error("Authentication service not initialized.");
    const provider = new OAuthProvider('apple.com');
    const result = await signInWithPopup(auth, provider);
    await ensureUserProfile(result.user);
    return result;
};
