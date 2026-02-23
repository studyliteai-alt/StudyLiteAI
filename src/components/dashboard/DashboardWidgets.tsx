import { motion } from 'framer-motion';

export const ProTip = ({ itemVariants }: { itemVariants: any }) => (
    <motion.div
        variants={itemVariants}
        className="info-card"
    >
        <h3>Pro Tip 💡</h3>
        <p>
            Try the **"Explain Simpler"** mode if you're struggling with complex concepts. Our AI is trained to break down even the toughest WAEC/JAMB topics!
        </p>
        <button className="action-btn primary w-full">Go Pro</button>
    </motion.div>
);

export const DailyGoal = ({ itemVariants }: { itemVariants: any }) => (
    <motion.div
        variants={itemVariants}
        className="stat-card border-dash-secondary bg-zinc-50"
    >
        <span className="stat-label">Daily Goal</span>
        <div className="flex items-end justify-between">
            <span className="stat-value">3/5</span>
            <span className="text-xs font-bold text-dash-text-muted">Sessions done</span>
        </div>
        <div className="progress-container h-2 mt-4">
            <div className="progress-fill bg-dash-secondary" style={{ width: '60%' }} />
        </div>
    </motion.div>
);
