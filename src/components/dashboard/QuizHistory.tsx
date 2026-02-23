import { motion } from 'framer-motion';
import { BrainCircuit, ChevronRight } from 'lucide-react';
import { QuizResult } from './types';

interface QuizHistoryProps {
    quizzes: QuizResult[];
    itemVariants: any;
}

export const QuizHistory = ({ quizzes, itemVariants }: QuizHistoryProps) => {
    return (
        <section className="history-panel">
            <div className="flex justify-between items-center mb-8">
                <h3 className="section-title !mb-0">
                    <BrainCircuit className="text-dash-primary" />
                    Quiz Performance
                </h3>
                <button className="text-dash-primary font-bold flex items-center gap-1 text-sm">
                    View All <ChevronRight size={16} />
                </button>
            </div>

            <div className="space-y-2">
                {quizzes.map((quiz) => (
                    <motion.div
                        key={quiz.id}
                        variants={itemVariants}
                        className="history-item"
                    >
                        <div className="history-info">
                            <h4>{quiz.title}</h4>
                            <p>{quiz.time}</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className={`history-score ${quiz.status === 'perfect' ? 'bg-green-100 text-green-700 border-green-500' :
                                    quiz.status === 'excellent' ? 'bg-blue-100 text-blue-700 border-blue-500' :
                                        quiz.status === 'good' ? 'bg-yellow-100 text-yellow-700 border-yellow-500' :
                                            'bg-rose-100 text-rose-700 border-rose-500'
                                }`}>
                                {quiz.score}
                            </span>
                            <motion.button whileHover={{ x: 3 }}>
                                <ChevronRight size={20} />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
