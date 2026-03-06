import { supabase } from '../lib/supabase';

export interface ChatMessage {
    id: string;
    session_id: string;
    user_id: string;
    role: 'user' | 'model';
    content: string;
    is_liked: boolean;
    created_at: string;
}

export interface ChatSession {
    id: string;
    user_id: string;
    title: string | null;
    created_at: string;
}

export const chatService = {
    async createSession(title?: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('chat_sessions')
            .insert({
                user_id: user.id,
                title: title || 'New Conversation'
            })
            .select()
            .single();

        if (error) throw error;
        return data as ChatSession;
    },

    async getSessions() {
        const { data, error } = await supabase
            .from('chat_sessions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as ChatSession[];
    },

    async getMessages(sessionId: string) {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as ChatMessage[];
    },

    async saveMessage(sessionId: string, role: 'user' | 'model', content: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('chat_messages')
            .insert({
                session_id: sessionId,
                user_id: user.id,
                role,
                content
            })
            .select()
            .single();

        if (error) throw error;
        return data as ChatMessage;
    },

    async updateMessage(messageId: string, content: string) {
        const { data, error } = await supabase
            .from('chat_messages')
            .update({ content })
            .eq('id', messageId)
            .select()
            .single();

        if (error) throw error;
        return data as ChatMessage;
    },

    async toggleLike(messageId: string, isLiked: boolean) {
        const { data, error } = await supabase
            .from('chat_messages')
            .update({ is_liked: isLiked })
            .eq('id', messageId)
            .select()
            .single();

        if (error) throw error;
        return data as ChatMessage;
    },

    async deleteSession(sessionId: string) {
        const { error } = await supabase
            .from('chat_sessions')
            .delete()
            .eq('id', sessionId);

        if (error) throw error;
    }
};
