import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Film, Edit2 } from 'lucide-react';
import MovieForm from './MovieForm';

export default function MovieModal({ isOpen, onClose, onSubmit, editingMovie }) {
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={editingMovie ? 'Edit Movie' : 'Add Movie'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="
          relative w-full max-w-lg max-h-[90vh] overflow-y-auto
          glass-modal rounded-2xl shadow-modal
          border border-border-subtle
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 glass-modal border-b border-border-subtle px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-gold to-accent-gold-light flex items-center justify-center">
                {editingMovie
                  ? <Edit2 size={16} className="text-bg-primary" strokeWidth={2.5} />
                  : <Film size={16} className="text-bg-primary" strokeWidth={2.5} />
                }
              </div>
              <div>
                <h2 className="font-heading font-bold text-text-primary text-base">
                  {editingMovie ? 'Edit Film' : 'Add New Film'}
                </h2>
                <p className="text-text-muted text-xs mt-0.5">
                  {editingMovie
                    ? `Editing "${editingMovie.title}"`
                    : 'Add a new movie to your vault'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="
                w-8 h-8 rounded-lg flex items-center justify-center
                text-text-muted hover:text-text-primary
                bg-transparent hover:bg-bg-elevated
                transition-all duration-150
              "
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-6">
          <MovieForm
            initialData={editingMovie}
            onSubmit={onSubmit}
            onCancel={onClose}
            isEditing={!!editingMovie}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
