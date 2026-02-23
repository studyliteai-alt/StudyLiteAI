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
import { QuizResult } from "../components/dashboard/types";

const QUIZ_COLLECTION = "quizzes";

export const quizService = {
    async saveQuizResult(userId: string, result: Omit<QuizResult, 'id'>) {
        if (!db) return null;
        try {
            const docRef = await addDoc(collection(db, QUIZ_COLLECTION), {
                ...result,
                userId,
                createdAt: serverTimestamp(),
            });
            return docRef.id;
        } catch (error) {
            console.error("Error saving quiz result:", error);
            throw error;
        }
    },

    async getUserQuizzes(userId: string): Promise<QuizResult[]> {
        if (!db) return [];
        try {
            const q = query(
                collection(db, QUIZ_COLLECTION),
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => {
                const data = doc.data() as DocumentData;
                return {
                    id: doc.id,
                    title: data.title,
                    score: data.score,
                    time: data.time,
                    status: data.status
                } as unknown as QuizResult;
            });
        } catch (error) {
            console.error("Error fetching quiz history:", error);
            return [];
        }
    }
};
