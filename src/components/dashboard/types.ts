import { ReactNode } from 'react';

export interface NavItem {
    id: string;
    icon: ReactNode;
    label: string;
}

export interface Stat {
    label: string;
    value: string;
    color: string;
}

export interface Session {
    id: number;
    title: string;
    category: string;
    date: string;
    items: number;
    mastery: number;
    color: string;
}

export interface QuizResult {
    id: number;
    title: string;
    score: string;
    time: string;
    status: 'perfect' | 'excellent' | 'good' | 'needs-review';
}

export type DashboardView = 'overview' | 'workspace';
export type WorkspaceStep = 'input' | 'processing' | 'results';
export type ResultTab = 'summary' | 'exam-points' | 'quiz';

export interface StudyData {
    summary: string;
    examPoints: { title: string; desc: string }[];
    quiz: { question: string; options: string[]; correctIndex: number }[];
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning';
    time: string;
    read: boolean;
}

export interface UserProfile {
    name: string;
    handle: string;
    avatarSeed: string;
}
