import { motion } from 'framer-motion';
import { Search, Film, Plus } from 'lucide-react';

export default function EmptyState({ searchQuery, genreFilter, onAddMovie, onClear }) {
  const isFiltered = searchQuery || (genreFilter && genreFilter !== 'All');

  if (isFiltered) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center mb-6">
          <Search size={24} className="text-text-muted" />
        </div>
        <h3 className="font-heading font-semibold text-text-primary text-lg mb-2">
          No results found
        </h3>
        <p className="text-text-secondary text-sm max-w-sm mb-6">
          {searchQuery
            ? `No movies matching "${searchQuery}" were found in your collection.`
            : `No movies in the "${genreFilter}" genre yet.`}
        </p>
        <button onClick={onClear} className="btn-secondary text-sm">
          Clear filters
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      {/* Decorative film reel */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-bg-secondary border border-border-subtle flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-bg-elevated border border-border-moderate flex items-center justify-center">
            <Film size={28} className="text-accent-gold/50" strokeWidth={1.5} />
          </div>
        </div>
        {/* Orbiting dots */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-accent-gold/20"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${deg}deg) translateX(42px) translateY(-50%)`,
            }}
          />
        ))}
      </div>

      <h3 className="font-heading font-semibold text-text-primary text-xl mb-3">
        Your vault is empty
      </h3>
      <p className="text-text-secondary text-sm max-w-xs mb-8 leading-relaxed">
        Start building your cinema universe. Add your first film to begin your collection.
      </p>

      <motion.button
        onClick={onAddMovie}
        className="btn-primary flex items-center gap-2"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Plus size={18} strokeWidth={2.5} />
        Add First Movie
      </motion.button>
    </motion.div>
  );
}
