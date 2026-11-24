import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBar({ value, onChange, onClear, placeholder = 'Search by title, genre, or director…' }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search size={16} className="text-text-muted" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full h-11 pl-11 pr-10
          bg-bg-secondary border border-border-subtle rounded-xl
          text-text-primary placeholder-text-muted text-sm font-body
          transition-all duration-200
          focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20
          hover:border-border-moderate
        "
        aria-label="Search movies"
      />

      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={onClear}
          className="absolute inset-y-0 right-3 flex items-center text-text-muted hover:text-text-primary transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </motion.button>
      )}
    </div>
  );
}
