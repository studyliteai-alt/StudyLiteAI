import { motion } from 'framer-motion';
import { Stat } from './types';

interface StatsGridProps {
    stats: Stat[];
    itemVariants: any;
}

export const StatsGrid = ({ stats, itemVariants }: StatsGridProps) => {
    return (
        <div className="stats-grid">
            {stats.map((stat, i) => (
                <motion.div
                    key={i}
                    variants={itemVariants}
                    className="stat-card"
                >
                    <span className="stat-label">{stat.label}</span>
                    <span className={`stat-value text-${stat.color}`}>{stat.value}</span>
                </motion.div>
            ))}
        </div>
    );
};
