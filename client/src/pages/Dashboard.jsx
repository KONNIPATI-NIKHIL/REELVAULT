import { motion } from 'framer-motion';
import { Plus, Menu, AlertCircle, RefreshCw, Film } from 'lucide-react';
import StatCard, { STAT_CONFIG } from '../components/StatCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';

function ErrorState({ error, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
        <AlertCircle size={24} className="text-red-400" />
      </div>
      <h3 className="font-heading font-semibold text-text-primary text-lg mb-2">
        Unable to load collection
      </h3>
      <p className="text-text-secondary text-sm max-w-sm mb-2 leading-relaxed">{error}</p>
      <p className="text-text-muted text-xs mb-6">
        Make sure the backend server is running on port 5000 and MongoDB is connected.
      </p>
      <button onClick={onRetry} className="btn-secondary flex items-center gap-2">
        <RefreshCw size={15} />
        Try Again
      </button>
    </motion.div>
  );
}

export default function Dashboard({
  movies,
  stats,
  loading,
  error,
  activePage,
  searchQuery,
  setSearchQuery,
  genreFilter,
  setGenreFilter,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  onAddMovie,
  onEditMovie,
  onDeleteMovie,
  onRetry,
  onMenuOpen,
}) {
  const hasActiveFilters =
    searchQuery.length > 0 ||
    (genreFilter && genreFilter !== 'All') ||
    sortField !== 'createdAt' ||
    sortOrder !== 'desc';

  const clearFilters = () => {
    setSearchQuery('');
    setGenreFilter('All');
    setSortField('createdAt');
    setSortOrder('desc');
  };

  const isDashboard = activePage === 'dashboard';

  return (
    <div className="min-h-screen">
      {/* Mobile top bar */}
      <div className="glass-nav sticky top-0 z-30 md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={onMenuOpen}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent-gold to-accent-gold-light flex items-center justify-center">
              <Film size={13} className="text-bg-primary" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-bold text-sm text-text-primary">
              REEL<span className="gradient-text-gold">VAULT</span>
            </span>
          </div>

          <button
            onClick={onAddMovie}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-accent-gold text-bg-primary hover:bg-accent-gold-light transition-all"
            aria-label="Add movie"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Page body */}
      <div className="px-5 md:px-8 lg:px-10 py-8 max-w-screen-2xl mx-auto">

        {/* ══════════════ DASHBOARD ══════════════ */}
        {isDashboard && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <p className="section-label mb-3">Your Cinema Universe</p>
              <h1 className="font-heading font-bold text-4xl md:text-5xl text-text-primary leading-[1.1] mb-3">
                Every story,
                <br />
                <span className="gradient-text-gold">organized</span> in one place.
              </h1>
              <p className="text-text-secondary text-base max-w-md leading-relaxed mb-6">
                REELVAULT is your personal movie collection manager — search, curate, and explore your cinematic library with ease.
              </p>
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={onAddMovie}
                  className="btn-primary flex items-center gap-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus size={18} strokeWidth={2.5} />
                  Add Movie
                </motion.button>
                <span className="text-text-muted text-sm">
                  {stats.totalMovies > 0
                    ? `${stats.totalMovies} film${stats.totalMovies !== 1 ? 's' : ''} in your vault`
                    : 'Start building your collection'}
                </span>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {STAT_CONFIG.map((s, i) => (
                <StatCard
                  key={s.key}
                  stat={s.key}
                  value={stats[s.key] ?? 0}
                  index={i}
                />
              ))}
            </div>

            {/* Recent films */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="mb-6">
                <p className="section-label mb-1">Recent Additions</p>
                <h2 className="font-heading font-semibold text-text-primary text-2xl">
                  Latest to your vault
                </h2>
              </div>

              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={onRetry} />
              ) : movies.length === 0 ? (
                <EmptyState
                  searchQuery=""
                  genreFilter="All"
                  onAddMovie={onAddMovie}
                  onClear={clearFilters}
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {movies.slice(0, 10).map((movie, index) => (
                    <MovieCard
                      key={movie._id}
                      movie={movie}
                      index={index}
                      onEdit={onEditMovie}
                      onDelete={onDeleteMovie}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* ══════════════ COLLECTION ══════════════ */}
        {!isDashboard && (
          <motion.div
            key="collection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Collection header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <p className="section-label mb-2">Movie Collection</p>
              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="font-heading font-bold text-3xl md:text-4xl text-text-primary">
                  Your <span className="gradient-text-gold">Vault</span>
                </h1>
                <motion.button
                  onClick={onAddMovie}
                  className="btn-primary hidden md:flex items-center gap-2 shrink-0"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus size={18} strokeWidth={2.5} />
                  Add Movie
                </motion.button>
              </div>

              {/* Search bar */}
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
              />

              {/* Filter row */}
              <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
                <FilterBar
                  genreFilter={genreFilter}
                  setGenreFilter={setGenreFilter}
                  sortField={sortField}
                  setSortField={setSortField}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  onClearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
                {!loading && (
                  <span className="text-text-muted text-xs font-body">
                    {movies.length} film{movies.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Results */}
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} onRetry={onRetry} />
            ) : movies.length === 0 ? (
              <EmptyState
                searchQuery={searchQuery}
                genreFilter={genreFilter}
                onAddMovie={onAddMovie}
                onClear={clearFilters}
              />
            ) : (
              <MovieGrid
                movies={movies}
                onEdit={onEditMovie}
                onDelete={onDeleteMovie}
              />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
