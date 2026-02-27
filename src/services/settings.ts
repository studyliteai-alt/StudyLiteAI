import { db } from "../lib/firebase";
import {
    doc,
    setDoc,
    getDoc
} from "firebase/firestore";

export interface UserSettings {
    isLowData: boolean;
    notifications: boolean;
    privateProfile: boolean;
    notificationsEnabled: boolean;  // legacy field kept for compatibility
    hapticsEnabled: boolean;
    privacyMode: boolean;
    theme?: 'light' | 'dark' | 'system';
}

export const SETTINGS_DEFAULTS: UserSettings = {
    isLowData: false,
    notifications: true,
    privateProfile: false,
    notificationsEnabled: true,
    hapticsEnabled: true,
    privacyMode: false,
    theme: 'light'
};

const SETTINGS_COLLECTION = "userSettings";

export const settingsService = {
    async saveSettings(userId: string, settings: Partial<UserSettings>) {
        if (!db) return;
        try {
            await setDoc(doc(db, SETTINGS_COLLECTION, userId), settings, { merge: true });
        } catch (error) {
            console.error("Error saving settings:", error);
            throw error;
        }
    },

    async getSettings(userId: string): Promise<UserSettings | null> {
        if (!db) return null;
        try {
            const docRef = doc(db, SETTINGS_COLLECTION, userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data() as UserSettings;
            }
            return null;
        } catch (error: any) {
            if (error.code === 'unavailable' || error.message?.includes('offline')) {
                console.warn("[settingsService] Offline: Using default settings.");
            } else {
                console.error("Error fetching settings:", error);
            }
            return null;
        }
    }
};
