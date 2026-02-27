import { db } from "../lib/firebase";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp
} from "firebase/firestore";

const ANALYTICS_COLLECTION = "analytics";

export interface AIInsight {
    id?: string;
    userId: string;
    topic: string;
    opinion: string;
    sentiment: 'positive' | 'neutral' | 'needs-focus';
    createdAt?: any;
}

export const analyticsService = {
    async saveInsight(userId: string, insight: Omit<AIInsight, 'id' | 'userId' | 'createdAt'>) {
        if (!db) return null;
        try {
            const docRef = await addDoc(collection(db, ANALYTICS_COLLECTION), {
                ...insight,
                userId,
                createdAt: serverTimestamp(),
            });
            return docRef.id;
        } catch (error) {
            console.error("Error saving analytic insight:", error);
            return null;
        }
    },

    async logEvent(name: string, data: any) {
        console.log(`[Analytics] Event: ${name}`, data);
    },

    async getUserInsights(userId: string): Promise<AIInsight[]> {
        if (!db) return [];
        try {
            const q = query(
                collection(db, ANALYTICS_COLLECTION),
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as AIInsight));
        } catch (error) {
            console.error("Error fetching insights:", error);
            return [];
        }
    }
};
