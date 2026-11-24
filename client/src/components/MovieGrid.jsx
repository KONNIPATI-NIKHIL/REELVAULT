import { AnimatePresence, motion } from 'framer-motion';
import MovieCard from './MovieCard';

export default function MovieGrid({ movies, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <AnimatePresence mode="popLayout">
        {movies.map((movie, index) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
