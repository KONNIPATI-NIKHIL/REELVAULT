import { motion } from 'framer-motion';
import { ChevronDown, ArrowUpDown, X } from 'lucide-react';

const GENRES = [
  'All',
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy',
  'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror',
  'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western',
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'title', label: 'Title' },
  { value: 'rating', label: 'Rating' },
  { value: 'releaseYear', label: 'Year' },
];

export default function FilterBar({
  genreFilter,
  setGenreFilter,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  onClearFilters,
  hasActiveFilters,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Genre filter */}
      <div className="relative">
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="
            appearance-none h-10 pl-3 pr-8 rounded-xl text-sm font-body
            bg-bg-secondary border border-border-subtle
            text-text-primary
            focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20
            hover:border-border-moderate
            cursor-pointer transition-all duration-200
          "
          aria-label="Filter by genre"
        >
          {GENRES.map((g) => (
            <option key={g} value={g} className="bg-bg-card">
              {g === 'All' ? 'All Genres' : g}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
      </div>

      {/* Sort field */}
      <div className="relative">
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="
            appearance-none h-10 pl-3 pr-8 rounded-xl text-sm font-body
            bg-bg-secondary border border-border-subtle
            text-text-primary
            focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20
            hover:border-border-moderate
            cursor-pointer transition-all duration-200
          "
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-bg-card">
              Sort: {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
      </div>

      {/* Sort order toggle */}
      <motion.button
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="h-10 w-10 flex items-center justify-center rounded-xl bg-bg-secondary border border-border-subtle
                   text-text-muted hover:text-text-primary hover:border-border-moderate transition-all duration-200"
        whileTap={{ scale: 0.9 }}
        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        aria-label={`Toggle sort order: currently ${sortOrder}`}
      >
        <ArrowUpDown
          size={15}
          className={`transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`}
        />
      </motion.button>

      {/* Clear filters */}
      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={onClearFilters}
          className="h-10 flex items-center gap-1.5 px-3 rounded-xl text-xs font-heading font-medium
                     text-text-muted bg-bg-secondary border border-border-subtle
                     hover:text-red-400 hover:border-red-500/30 transition-all duration-200"
        >
          <X size={13} />
          Clear
        </motion.button>
      )}
    </div>
  );
}
