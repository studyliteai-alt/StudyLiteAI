import { db } from "../lib/firebase";
import {
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    where
} from "firebase/firestore";

// Only expose the fields needed for the leaderboard — never the full UserProfile
export interface LeaderboardEntry {
    uid: string;
    displayName: string;
    points: number;
    avatarSeed: string;
    streak: number;
}

const USERS_COLLECTION = "users";

export const leaderboardService = {
    async getTopStudents(count: number = 5): Promise<LeaderboardEntry[]> {
        if (!db) return [];
        try {
            // Firestore can't do "where privateProfile != true AND orderBy points"
            // without a composite index, so we fetch more and filter client-side.
            const q = query(
                collection(db, USERS_COLLECTION),
                where("privateProfile", "!=", true),
                orderBy("privateProfile"),   // required when using != filter
                orderBy("points", "desc"),
                limit(count + 10)            // fetch extra to account for filtered entries
            );

            const querySnapshot = await getDocs(q);

            return querySnapshot.docs
                .map(doc => {
                    const d = doc.data();
                    return {
                        uid: d.uid,
                        displayName: d.displayName || 'Anonymous',
                        points: d.points || 0,
                        avatarSeed: d.avatarSeed || d.uid,
                        streak: d.streak || 0,
                    } as LeaderboardEntry;
                })
                .slice(0, count); // Trim to the requested count after filtering
        } catch (error: any) {
            // Fallback: If the composite index hasn't been created yet,
            // fetch without the privacy filter rather than breaking the page
            if (error.code === 'failed-precondition') {
                console.warn("[leaderboard] Missing Firestore index — fetching without privacy filter. Create the index at:", error.message?.match(/https:\/\/[^\s]+/)?.[0] || "Firebase Console");
                const fallback = query(
                    collection(db, USERS_COLLECTION),
                    orderBy("points", "desc"),
                    limit(count)
                );
                const snap = await getDocs(fallback);
                return snap.docs.map(doc => {
                    const d = doc.data();
                    return {
                        uid: d.uid,
                        displayName: d.displayName || 'Anonymous',
                        points: d.points || 0,
                        avatarSeed: d.avatarSeed || d.uid,
                        streak: d.streak || 0,
                    } as LeaderboardEntry;
                });
            }
            console.error("Error fetching leaderboard:", error);
            return [];
        }
    }
};
