import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    Timestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface StudySession {
    id?: string;
    userId: string;
    topic: string;
    content: string;
    summary: string;
    keyPoints: string[];
    quizScore?: number;
    status: 'Mastered' | 'Reviewing' | 'Started' | 'Compiling';
    createdAt: Date;
}

export const saveSession = async (session: Omit<StudySession, 'id' | 'createdAt'>) => {
    return addDoc(collection(db, "sessions"), {
        ...session,
        createdAt: Timestamp.now()
    });
};

export const getUserSessions = async (userId: string) => {
    const q = query(
        collection(db, "sessions"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudySession));
};

export const getRecentSessions = async (userId: string, count: number = 3) => {
    const q = query(
        collection(db, "sessions"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudySession));
};
