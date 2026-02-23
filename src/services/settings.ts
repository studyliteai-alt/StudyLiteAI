import { db } from "../lib/firebase";
import {
    doc,
    setDoc,
    getDoc
} from "firebase/firestore";

export interface UserSettings {
    isLowData: boolean;
    notificationsEnabled: boolean;
    // Add more settings here
}

const SETTINGS_COLLECTION = "userSettings";

export const settingsService = {
    async saveSettings(userId: string, settings: UserSettings) {
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
        } catch (error) {
            console.error("Error fetching settings:", error);
            return null;
        }
    }
};
