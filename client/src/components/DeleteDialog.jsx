import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteDialog({ isOpen, movie, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    // Focus cancel button for accessibility
    cancelRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onCancel}
      role="alertdialog"
      aria-modal="true"
      aria-label="Confirm deletion"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 8 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="
          relative w-full max-w-sm
          glass-modal rounded-2xl shadow-modal
          border border-border-subtle p-6
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center
                     text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all"
          aria-label="Cancel"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
          <AlertTriangle size={22} className="text-red-400" strokeWidth={1.75} />
        </div>

        {/* Content */}
        <h2 className="font-heading font-bold text-text-primary text-lg mb-2">
          Remove from Vault?
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          You're about to permanently remove{' '}
          <span className="text-text-primary font-semibold">"{movie?.title}"</span>{' '}
          from your collection. This action cannot be undone.
        </p>

        {/* Movie info */}
        {movie && (
          <div className="bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 mb-6">
            <p className="text-text-primary text-sm font-heading font-medium">{movie.title}</p>
            <p className="text-text-muted text-xs mt-0.5">{movie.genre} · {movie.releaseYear} · ★ {movie.rating}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            Keep Film
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger flex-1 flex items-center justify-center gap-2"
          >
            <Trash2 size={15} />
            Remove
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
