import { db } from "../lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp,
    DocumentData
} from "firebase/firestore";
export interface StudySession {
    id: string;
    title: string;
    category: string;
    date: string;
    items: number;
    mastery: number;
    color: string;
}

const SESSIONS_COLLECTION = "sessions";

export const studySessionService = {
    async saveSession(userId: string, session: Omit<StudySession, 'id'>) {
        if (!db) return null;
        try {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            let pointsToAdd = 10; // Default points for a session
            let streakUpdate = {};

            if (userSnap.exists()) {
                const userData = userSnap.data();
                const lastActiveDate = userData.lastActiveDate;
                const today = new Date().toISOString().split('T')[0];
                const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

                if (lastActiveDate !== today) {
                    if (lastActiveDate === yesterday) {
                        streakUpdate = { streak: increment(1), lastActiveDate: today };
                    } else {
                        streakUpdate = { streak: 1, lastActiveDate: today };
                    }
                }
            }

            const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), {
                ...session,
                userId,
                createdAt: serverTimestamp(),
            });

            await updateDoc(userRef, {
                points: increment(pointsToAdd),
                ...streakUpdate
            });

            return docRef.id;
        } catch (error: any) {
            if (error.code === 'unavailable' || error.message?.includes('offline')) {
                console.warn("[studySessionService] Offline: Session will be synced when online.");
            } else {
                console.error("Error saving study session:", error);
            }
            throw error;
        }
    },

    async getUserSessions(userId: string): Promise<StudySession[]> {
        if (!db) return [];
        try {
            const q = query(
                collection(db, SESSIONS_COLLECTION),
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => {
                const data = doc.data() as DocumentData;
                return {
                    id: doc.id,
                    title: data.title,
                    category: data.category,
                    date: data.date,
                    items: data.items,
                    mastery: data.mastery,
                    color: data.color
                } as unknown as StudySession;
            });
        } catch (error: any) {
            if (error.code === 'unavailable' || error.message?.includes('offline')) {
                console.warn("[studySessionService] Offline: Using local cache for sessions.");
            } else {
                console.error("Error fetching study sessions:", error);
            }
            return [];
        }
    }
};
