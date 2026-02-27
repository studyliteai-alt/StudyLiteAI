import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider,
    getAdditionalUserInfo,
    getIdToken
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    handle: string;
    avatarSeed: string;
    role: 'user' | 'admin';
    createdAt: string;
    points: number;
    streak: number;
    promptsUsed: number;
    quizzesUsed: number;
    subscriptionStatus: 'free' | 'pro';
    lastActiveDate: string;
}

/**
 * Fast check: only force-refresh the token if it's expiring within
 * the next 5 minutes. Otherwise use the cached token.
 * This avoids a network round-trip on every page load.
 */
const validateSession = async (user: User): Promise<boolean> => {
    try {
        const token = await user.getIdTokenResult();
        const expiresAt = new Date(token.expirationTime).getTime();
        const fiveMinutes = 5 * 60 * 1000;
        const isExpiringSoon = expiresAt - Date.now() < fiveMinutes;

        if (isExpiringSoon) {
            // Only hit the network if the token needs refreshing
            await getIdToken(user, true);
        }
        return true;
    } catch (err: any) {
        const deletedOrDisabled =
            err.code === 'auth/user-not-found' ||
            err.code === 'auth/user-disabled' ||
            err.code === 'auth/user-token-expired' ||
            err.code === 'auth/invalid-user-token' ||
            err.message?.includes('USER_NOT_FOUND');

        if (deletedOrDisabled) {
            // Store the reason so the Login page can show a clear message
            const reason = err.code === 'auth/user-disabled' ? 'disabled' : 'deleted';
            sessionStorage.setItem('auth_signout_reason', reason);
            return false;
        }
        // Network error / offline — trust the cached session
        return true;
    }
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
    if (!auth) {
        callback(null);
        return () => { };
    }

    return onAuthStateChanged(auth, async (user) => {
        if (!user) {
            callback(null);
            return;
        }

        const sessionValid = await validateSession(user);
        if (!sessionValid) {
            await signOut(auth!);
            callback(null);
        } else {
            callback(user);
        }
    });
};

export const subscribeToProfile = (uid: string, callback: (profile: UserProfile | null) => void) => {
    if (!db) return () => { };
    return onSnapshot(doc(db, "users", uid), (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data() as UserProfile);
        } else {
            callback(null);
        }
    }, (error) => {
        console.error("Error subscribing to profile:", error);
        callback(null);
    });
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
    } catch (error: any) {
        if (error.code === 'unavailable' || error.message?.includes('offline')) {
            console.warn("[authService] Client is offline, using cache for profile.");
        } else {
            console.error("Error fetching user profile:", error.code || "unknown_error");
        }
        return null;
    }
};

export const signUp = async (email: string, pass: string, name: string) => {
    if (!auth || !db) throw new Error("Authentication services not initialized.");
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const profile: UserProfile = {
        uid: user.uid,
        email: email,
        displayName: name,
        handle: 'Free Member',
        avatarSeed: name,
        role: 'user',
        createdAt: new Date().toISOString(),
        points: 0,
        streak: 0,
        promptsUsed: 0,
        quizzesUsed: 0,
        subscriptionStatus: 'free',
        lastActiveDate: new Date().toISOString()
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

const WHITELISTED_PROFILE_FIELDS = ['displayName', 'handle', 'avatarSeed', 'privateProfile'];

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    if (!db) return;
    try {
        const filteredData = Object.keys(data)
            .filter(key => WHITELISTED_PROFILE_FIELDS.includes(key))
            .reduce((obj: any, key) => {
                obj[key] = data[key as keyof UserProfile];
                return obj;
            }, {});

        if (Object.keys(filteredData).length === 0) {
            console.warn("[authService] No whitelisted fields provided for update.");
            return;
        }

        const docRef = doc(db, "users", uid);
        await setDoc(docRef, filteredData, { merge: true });
    } catch (error: any) {
        console.error("Error updating user profile:", error.code || "update_failed");
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
            handle: 'Free Member',
            avatarSeed: user.displayName || user.uid,
            role: 'user',
            createdAt: new Date().toISOString(),
            points: 0,
            streak: 0,
            promptsUsed: 0,
            quizzesUsed: 0,
            subscriptionStatus: 'free',
            lastActiveDate: new Date().toISOString()
        };
        try {
            await setDoc(docRef, profile);
        } catch (err: any) {
            if (err.code === 'unavailable' || err.message?.includes('offline')) {
                console.warn("[authService] Offline: Cannot ensure profile on cloud.");
            } else {
                console.error("Error ensuring user profile:", err.code || "profile_init_failed");
            }
        }
    }
};

/**
 * Social Auth - LOGIN ONLY
 *
 * Uses Firebase's `getAdditionalUserInfo(result).isNewUser` — the most
 * reliable way to detect a brand-new Google sign-in vs an existing account.
 * If the user is new, we immediately delete their Auth record and reject.
 */
export const signInWithGoogleOnly = async () => {
    if (!auth) throw new Error("Authentication service not initialized.");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const info = getAdditionalUserInfo(result);

    if (info?.isNewUser) {
        // They just registered for the first time — delete the Auth record
        // so they can't sneak in without a proper signup
        try {
            await result.user.delete();
        } catch {
            // If delete fails, sign out is the fallback
            await signOut(auth);
        }
        throw new Error("account-not-found");
    }

    return result;
};

export const signInWithAppleOnly = async () => {
    if (!auth) throw new Error("Authentication service not initialized.");
    const provider = new OAuthProvider('apple.com');
    const result = await signInWithPopup(auth, provider);

    const info = getAdditionalUserInfo(result);

    if (info?.isNewUser) {
        try {
            await result.user.delete();
        } catch {
            await signOut(auth);
        }
        throw new Error("account-not-found");
    }

    return result;
};

/**
 * Social Auth - SIGNUP
 * Creates a Firestore profile if it doesn't exist.
 */
export const signUpWithGoogle = async () => {
    if (!auth) throw new Error("Authentication service not initialized.");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await ensureUserProfile(result.user);
    return result;
};

export const signUpWithApple = async () => {
    if (!auth) throw new Error("Authentication service not initialized.");
    const provider = new OAuthProvider('apple.com');
    const result = await signInWithPopup(auth, provider);
    await ensureUserProfile(result.user);
    return result;
};
