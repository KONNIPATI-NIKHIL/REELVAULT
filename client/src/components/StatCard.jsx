import { motion } from 'framer-motion';
import { Film, Star, Calendar, TrendingUp, Layers } from 'lucide-react';

const STAT_CONFIG = [
  {
    key: 'totalMovies',
    label: 'Total Films',
    icon: Film,
    color: 'gold',
    format: (v) => v,
  },
  {
    key: 'totalGenres',
    label: 'Genres',
    icon: Layers,
    color: 'violet',
    format: (v) => v,
  },
  {
    key: 'avgRating',
    label: 'Avg Rating',
    icon: Star,
    color: 'gold',
    format: (v) => v > 0 ? v.toFixed(1) : '—',
  },
  {
    key: 'latestYear',
    label: 'Latest Year',
    icon: Calendar,
    color: 'violet',
    format: (v) => v,
  },
];

export default function StatCard({ stat, value, index }) {
  const cfg = STAT_CONFIG.find((s) => s.key === stat) || STAT_CONFIG[0];
  const Icon = cfg.icon;
  const isGold = cfg.color === 'gold';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="stat-card group cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isGold
              ? 'bg-accent-gold/10 border border-accent-gold/20'
              : 'bg-accent-violet/10 border border-accent-violet/20'
          }`}
        >
          <Icon
            size={18}
            className={isGold ? 'text-accent-gold' : 'text-accent-violet'}
            strokeWidth={1.75}
          />
        </div>
        <TrendingUp size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="mb-1">
        <span
          className={`text-3xl font-heading font-bold ${
            isGold ? 'gradient-text-gold' : 'gradient-text-violet'
          }`}
        >
          {cfg.format(value)}
        </span>
      </div>

      <p className="text-text-secondary text-sm font-body">{cfg.label}</p>
    </motion.div>
  );
}

export { STAT_CONFIG };
