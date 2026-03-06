import { supabase } from '../lib/supabase';

export interface QuizAttempt {
    id: string;
    user_id: string;
    topic: string;
    score: number;
    total_questions: number;
    time_spent: number;
    wrong_answers: any[];
    created_at: string;
}

export const quizService = {
    async saveQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'created_at' | 'user_id'>) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('quizzes')
            .insert([
                {
                    ...attempt,
                    user_id: userData.user.id
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error saving quiz attempt:', error);
            throw error;
        }
        return data as QuizAttempt;
    },

    async getQuizHistory() {
        const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching quiz history:', error);
            throw error;
        }
        return data as QuizAttempt[];
    },

    async getQuizById(id: string) {
        const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching quiz by id:', error);
            throw error;
        }
        return data as QuizAttempt;
    },

    async getStats() {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return { totalQuizzes: 0, avgScore: 0 };

        const { data, error } = await supabase
            .from('quizzes')
            .select('score, total_questions')
            .eq('user_id', userData.user.id);

        if (error) {
            console.error('Error fetching quiz stats:', error);
            return { totalQuizzes: 0, avgScore: 0 };
        }

        if (!data || data.length === 0) return { totalQuizzes: 0, avgScore: 0 };

        const totalScore = data.reduce((acc, curr) => acc + (curr.score / curr.total_questions), 0);
        return {
            totalQuizzes: data.length,
            avgScore: Math.round((totalScore / data.length) * 100)
        };
    }
};

export const studySessionService = {
    async logStudyTime(durationSeconds: number) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const { error } = await supabase
            .from('study_sessions')
            .insert([
                {
                    user_id: userData.user.id,
                    duration: durationSeconds,
                    started_at: new Date(Date.now() - durationSeconds * 1000).toISOString()
                }
            ]);

        if (error) console.error('Error logging study time:', error);
    },

    async getTotalStudyTime() {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return 0;

        const { data, error } = await supabase
            .from('study_sessions')
            .select('duration')
            .eq('user_id', userData.user.id);

        if (error) {
            console.error('Error fetching study time:', error);
            return 0;
        }

        return data.reduce((acc, curr) => acc + curr.duration, 0);
    }
};
