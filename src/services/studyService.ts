import { supabase } from '../lib/supabase';

export interface Project {
    id: string;
    user_id: string;
    name: string;
    file_type: string;
    file_size: string;
    created_at: string;
    summary?: string;
    content_url?: string;
}

export const studyService = {
    async getProjects() {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
        return data as Project[];
    },

    async createProject(project: Omit<Project, 'id' | 'created_at' | 'user_id'>) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('projects')
            .insert([
                {
                    ...project,
                    user_id: userData.user.id
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating project:', error);
            throw error;
        }
        return data as Project;
    },

    async deleteProject(id: string) {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    },

    subscribeToProjects(callback: (payload: any) => void) {
        return supabase
            .channel('projects_realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'projects' },
                callback
            )
            .subscribe();
    }
};
