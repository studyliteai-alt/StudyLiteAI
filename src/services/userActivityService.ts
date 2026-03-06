import { supabase } from '../lib/supabase';

export interface LeaderboardEntry {
    user_id: string;
    total_xp: number;
    quizzes_completed: number;
    rank: number;
    // We will join this mock data on the frontend since we don't have a public.profiles table yet
    name?: string;
    avatar?: string;
    streak?: number;
    trend?: 'up' | 'down' | 'same';
}

export const userActivityService = {
    /**
     * Fetches the global leaderboard using the security definer RPC function.
     * This bypasses RLS on the quizzes table to calculate total XP across all users.
     */
    async getGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
        try {
            const { data, error } = await supabase.rpc('get_global_leaderboard');

            if (error) {
                console.error("Error fetching global leaderboard:", error);
                throw error;
            }

            // Return the raw data and let the component enrich it with mock names/avatars 
            // until a proper public.profiles table is implemented.
            return data || [];
        } catch (error) {
            console.error("Leaderboard Service Error:", error);
            return [];
        }
    }
};
