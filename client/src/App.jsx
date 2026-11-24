import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MovieModal from './components/MovieModal';
import DeleteDialog from './components/DeleteDialog';
import movieService from './services/movieService';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [stats, setStats] = useState({ totalMovies: 0, totalGenres: 0, avgRating: 0, latestYear: new Date().getFullYear() });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search / Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modal state
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingMovie, setDeletingMovie] = useState(null);

  // Active page
  const [activePage, setActivePage] = useState('dashboard');

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (genreFilter !== 'All') params.genre = genreFilter;
      params.sort = sortField;
      params.order = sortOrder;

      const [moviesData, statsData] = await Promise.all([
        movieService.getMovies(params),
        movieService.getStats(),
      ]);
      setMovies(moviesData.data);
      setStats(statsData.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, genreFilter, sortField, sortOrder]);

  useEffect(() => {
    const delay = searchQuery ? 300 : 0;
    const timer = setTimeout(fetchMovies, delay);
    return () => clearTimeout(timer);
  }, [fetchMovies, searchQuery]);

  const handleAddMovie = () => {
    setEditingMovie(null);
    setIsMovieModalOpen(true);
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setIsMovieModalOpen(true);
  };

  const handleDeleteMovie = (movie) => {
    setDeletingMovie(movie);
    setIsDeleteDialogOpen(true);
  };

  const handleMovieSubmit = async (formData) => {
    try {
      if (editingMovie) {
        await movieService.updateMovie(editingMovie._id, formData);
        toast.success(`"${formData.title}" updated successfully`);
      } else {
        await movieService.createMovie(formData);
        toast.success(`"${formData.title}" added to your collection`);
      }
      setIsMovieModalOpen(false);
      setEditingMovie(null);
      await fetchMovies();
    } catch (err) {
      toast.error(err.message);
      throw err; // Re-throw so form can handle loading state
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMovie) return;
    try {
      await movieService.deleteMovie(deletingMovie._id);
      toast.success(`"${deletingMovie.title}" removed from collection`);
      setIsDeleteDialogOpen(false);
      setDeletingMovie(null);
      await fetchMovies();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#181B24',
            color: '#F5F3EF',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          },
          success: {
            iconTheme: { primary: '#C9A84C', secondary: '#0B0C10' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0B0C10' },
          },
        }}
      />

      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          setSidebarOpen(false);
          if (page === 'add') {
            handleAddMovie();
            setActivePage('collection');
          }
        }}
        onAddMovie={handleAddMovie}
        movieCount={stats.totalMovies}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 min-w-0 md:ml-64">
        <Dashboard
          movies={movies}
          stats={stats}
          loading={loading}
          error={error}
          activePage={activePage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          genreFilter={genreFilter}
          setGenreFilter={setGenreFilter}
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onAddMovie={handleAddMovie}
          onEditMovie={handleEditMovie}
          onDeleteMovie={handleDeleteMovie}
          onRetry={fetchMovies}
          onMenuOpen={() => setSidebarOpen(true)}
        />
      </main>

      {/* Movie Add/Edit Modal */}
      <AnimatePresence>
        {isMovieModalOpen && (
          <MovieModal
            isOpen={isMovieModalOpen}
            onClose={() => {
              setIsMovieModalOpen(false);
              setEditingMovie(null);
            }}
            onSubmit={handleMovieSubmit}
            editingMovie={editingMovie}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {isDeleteDialogOpen && deletingMovie && (
          <DeleteDialog
            isOpen={isDeleteDialogOpen}
            movie={deletingMovie}
            onConfirm={handleDeleteConfirm}
            onCancel={() => {
              setIsDeleteDialogOpen(false);
              setDeletingMovie(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
