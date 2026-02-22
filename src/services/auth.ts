import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: 'user' | 'admin';
    createdAt: string;
}

export const subscribeToAuth = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // Update Firebase Auth profile
    await updateProfile(user, { displayName: name });

    // Create Firestore profile
    const profile: UserProfile = {
        uid: user.uid,
        email: email,
        displayName: name,
        role: 'user', // Default role
        createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, "users", user.uid), profile);
    return userCredential;
};

export const logIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
};

export const logOut = () => {
    return signOut(auth);
};
