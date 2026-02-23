import { db } from "../lib/firebase";
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
import { Session } from "../components/dashboard/types";

const SESSIONS_COLLECTION = "sessions";

export const studySessionService = {
    async saveSession(userId: string, session: Omit<Session, 'id'>) {
        if (!db) return null;
        try {
            const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), {
                ...session,
                userId,
                createdAt: serverTimestamp(),
            });
            return docRef.id;
        } catch (error) {
            console.error("Error saving study session:", error);
            throw error;
        }
    },

    async getUserSessions(userId: string): Promise<Session[]> {
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
                } as unknown as Session;
            });
        } catch (error) {
            console.error("Error fetching study sessions:", error);
            return [];
        }
    }
};
