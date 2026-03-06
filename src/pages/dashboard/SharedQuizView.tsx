import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, ArrowRight, Brain, Trophy, Clock, Target } from 'lucide-react';
import { quizService, QuizAttempt } from '../../services/quizService';
import { useToast } from '../../context/ToastContext';

export const SharedQuizView = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const [quiz, setQuiz] = useState<QuizAttempt | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!quizId) return;
            try {
                const data = await quizService.getQuizById(quizId);
                setQuiz(data);
            } catch (err) {
                showToast('Not Found', 'This quiz archive could not be accessed.', 'error');
                navigate('/dashboard/quiz');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);

    const handleAttempt = () => {
        if (quiz) {
            // Navigate to quiz view with the topic pre-filled in state or search params
            navigate('/dashboard/quiz', { state: { topic: quiz.topic } });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brandPurple border-t-transparent"></div>
            </div>
        );
    }

    if (!quiz) return null;

    const scorePercentage = Math.round((quiz.score / quiz.total_questions) * 100);

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <div className="bg-white border-2 border-brandBlack rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="bg-brandPurple p-12 text-white relative h-64 flex flex-col justify-end">
                    <div className="absolute top-10 left-10 w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center">
                        <Share2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60">Shared Quiz Results</p>
                        <h1 className="text-4xl font-black italic tracking-tighter">{quiz.topic}</h1>
                    </div>
                </div>

                <div className="p-12 space-y-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-cream border-2 border-brandBlack p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                            <Trophy className="w-6 h-6 text-brandYellow mb-2" />
                            <p className="text-[10px] font-black uppercase text-brandBlack/40 mb-1">Score</p>
                            <p className="text-2xl font-black italic">{scorePercentage}%</p>
                        </div>
                        <div className="bg-cream border-2 border-brandBlack p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                            <Target className="w-6 h-6 text-brandPurple mb-2" />
                            <p className="text-[10px] font-black uppercase text-brandBlack/40 mb-1">Correct</p>
                            <p className="text-2xl font-black italic">{quiz.score}/{quiz.total_questions}</p>
                        </div>
                        <div className="bg-cream border-2 border-brandBlack p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                            <Clock className="w-6 h-6 text-blue-500 mb-2" />
                            <p className="text-[10px] font-black uppercase text-brandBlack/40 mb-1">Time</p>
                            <p className="text-2xl font-black italic">{Math.floor(quiz.time_spent / 60)}m {quiz.time_spent % 60}s</p>
                        </div>
                        <div className="bg-cream border-2 border-brandBlack p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                            <Brain className="w-6 h-6 text-pink-500 mb-2" />
                            <p className="text-[10px] font-black uppercase text-brandBlack/40 mb-1">Type</p>
                            <p className="text-2xl font-black italic underline decoration-brandBlack/10">AI GEN</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black italic">Feeling sharp?</h2>
                            <p className="text-sm font-bold text-brandBlack/60">Try this quiz yourself and see if you can beat the score!</p>
                        </div>

                        <button
                            onClick={handleAttempt}
                            className="w-full bg-brandBlack text-white py-6 rounded-3xl font-black text-xl border-2 border-brandBlack shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 group"
                        >
                            ATTEMPT THIS QUIZ
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-brandBlack/30">
                Shared via StudyLite Neural Engine
            </p>
        </div>
    );
};
