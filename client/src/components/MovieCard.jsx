import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Edit2, Trash2, Film, Calendar, User } from 'lucide-react';

const GENRE_COLORS = {
  Action: 'bg-red-500/15 text-red-400 border-red-500/20',
  Adventure: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  Animation: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  Biography: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Comedy: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  Crime: 'bg-red-700/15 text-red-500 border-red-700/20',
  Documentary: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  Drama: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  Fantasy: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Horror: 'bg-rose-700/15 text-rose-500 border-rose-700/20',
  Musical: 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/20',
  Mystery: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  Romance: 'bg-pink-600/15 text-pink-500 border-pink-600/20',
  'Sci-Fi': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  Thriller: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  War: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
  Western: 'bg-yellow-700/15 text-yellow-600 border-yellow-700/20',
};

// Beautiful CSS fallback poster
function PosterFallback({ title, genre }) {
  const letter = title ? title[0].toUpperCase() : '?';
  const genreColor = GENRE_COLORS[genre] || '';

  return (
    <div className="absolute inset-0 poster-fallback overflow-hidden">
      {/* Decorative film strips */}
      <div className="absolute top-0 left-0 right-0 flex">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-6 border-r border-bg-secondary/40"
            style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.3)' : 'transparent' }}
          />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-6 border-r border-bg-secondary/40"
            style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.3)' : 'transparent' }}
          />
        ))}
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-accent-gold/5 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-accent-gold/10 flex items-center justify-center">
            <span
              className="text-5xl font-heading font-bold text-accent-gold/40"
              style={{ lineHeight: 1 }}
            >
              {letter}
            </span>
          </div>
        </div>
      </div>

      {/* Film icon */}
      <div className="absolute top-8 right-4 opacity-10">
        <Film size={24} className="text-text-primary" />
      </div>
    </div>
  );
}

export default function MovieCard({ movie, onEdit, onDelete, index }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const genreClass = GENRE_COLORS[movie.genre] || 'bg-bg-elevated text-text-secondary border-border-subtle';
  const ratingColor =
    movie.rating >= 8 ? 'text-accent-gold' :
    movie.rating >= 6 ? 'text-green-400' : 'text-text-secondary';

  const hasPoster = movie.posterUrl && !imageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4), ease: 'easeOut' }}
      layout
      className="group relative bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-card
                 hover:shadow-card-hover hover:border-border-moderate transition-all duration-300"
    >
      {/* Poster area */}
      <div className="relative aspect-poster overflow-hidden bg-bg-secondary">
        {hasPoster && (
          <>
            {!imageLoaded && <PosterFallback title={movie.title} genre={movie.genre} />}
            <motion.img
              src={movie.posterUrl}
              alt={`${movie.title} poster`}
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </>
        )}

        {(!hasPoster) && <PosterFallback title={movie.title} genre={movie.genre} />}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent opacity-80" />

        {/* Top row: Genre + Rating */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span
            className={`text-[10px] font-heading font-semibold tracking-wide uppercase px-2 py-1 rounded-lg border backdrop-blur-sm ${genreClass}`}
          >
            {movie.genre}
          </span>

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
            <Star size={11} className={`${ratingColor} fill-current`} />
            <span className={`text-xs font-heading font-semibold ${ratingColor}`}>
              {movie.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Action buttons - appear on hover */}
        <div
          className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200
                       translate-x-2 group-hover:translate-x-0"
          style={{ top: '44px' }}
        >
          <motion.button
            onClick={() => onEdit(movie)}
            className="w-8 h-8 rounded-lg bg-bg-elevated/90 backdrop-blur-sm border border-border-moderate
                       flex items-center justify-center text-text-secondary hover:text-accent-gold
                       hover:border-accent-gold/40 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Edit ${movie.title}`}
          >
            <Edit2 size={13} />
          </motion.button>
          <motion.button
            onClick={() => onDelete(movie)}
            className="w-8 h-8 rounded-lg bg-bg-elevated/90 backdrop-blur-sm border border-border-moderate
                       flex items-center justify-center text-text-secondary hover:text-red-400
                       hover:border-red-500/40 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Delete ${movie.title}`}
          >
            <Trash2 size={13} />
          </motion.button>
        </div>
      </div>

      {/* Card info */}
      <div className="p-4">
        <h3
          className="font-heading font-semibold text-text-primary text-sm leading-snug mb-2 line-clamp-2 group-hover:text-accent-gold-light transition-colors"
          title={movie.title}
        >
          {movie.title}
        </h3>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-text-muted">
            <User size={11} strokeWidth={1.75} />
            <span className="text-xs truncate" title={movie.director}>{movie.director}</span>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <Calendar size={11} strokeWidth={1.75} />
            <span className="text-xs">{movie.releaseYear}</span>
          </div>
        </div>

        {/* Mobile edit/delete */}
        <div className="mt-3 pt-3 border-t border-border-subtle flex gap-2 md:hidden">
          <button
            onClick={() => onEdit(movie)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-heading
                       text-text-secondary bg-bg-secondary hover:text-accent-gold transition-colors"
          >
            <Edit2 size={12} /> Edit
          </button>
          <button
            onClick={() => onDelete(movie)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-heading
                       text-text-secondary bg-bg-secondary hover:text-red-400 transition-colors"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
