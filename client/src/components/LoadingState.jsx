import { motion } from 'framer-motion';

const dots = [0, 1, 2];

export default function LoadingState({ message = 'Loading your collection…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex items-center gap-2 mb-6">
        {dots.map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-accent-gold"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <p className="text-text-secondary text-sm font-body">{message}</p>
    </div>
  );
}
