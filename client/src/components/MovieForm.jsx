import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Film, ChevronDown, AlertCircle, Loader2 } from 'lucide-react';

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy',
  'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror',
  'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western',
];

const CURRENT_YEAR = new Date().getFullYear();

const DEFAULT_FORM = {
  title: '',
  genre: '',
  releaseYear: '',
  rating: '',
  director: '',
  posterUrl: '',
  trailerUrl: '',
    videoUrl: '',
};

function FieldError({ message }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400"
    >
      <AlertCircle size={12} />
      {message}
    </motion.p>
  );
}

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Title is required';
  else if (form.title.trim().length > 200) errors.title = 'Title too long (max 200 characters)';

  if (!form.genre) errors.genre = 'Please select a genre';

  const year = Number(form.releaseYear);
  if (!form.releaseYear) errors.releaseYear = 'Release year is required';
  else if (!Number.isInteger(year) || year < 1888 || year > CURRENT_YEAR + 5)
    errors.releaseYear = `Year must be between 1888 and ${CURRENT_YEAR + 5}`;

  const rating = Number(form.rating);
  if (form.rating === '' || form.rating === null) errors.rating = 'Rating is required';
  else if (isNaN(rating) || rating < 0 || rating > 10) errors.rating = 'Rating must be between 0 and 10';

  if (!form.director.trim()) errors.director = 'Director name is required';
  else if (form.director.trim().length > 100) errors.director = 'Director name too long (max 100 characters)';

  return errors;
}

export default function MovieForm({ initialData, onSubmit, onCancel, isEditing }) {
  const [form, setForm] = useState(() =>
    initialData
      ? {
          title: initialData.title || '',
          genre: initialData.genre || '',
          releaseYear: initialData.releaseYear?.toString() || '',
          rating: initialData.rating?.toString() || '',
          director: initialData.director || '',
          posterUrl: initialData.posterUrl || '',
          trailerUrl: initialData.trailerUrl || '',
          videoUrl: initialData.videoUrl || '',
        }
      : { ...DEFAULT_FORM }
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        genre: form.genre,
        releaseYear: Number(form.releaseYear),
        rating: Number(form.rating),
        director: form.director.trim(),
        posterUrl: form.posterUrl.trim(),
        trailerUrl: form.trailerUrl.trim(),
        videoUrl: form.videoUrl.trim(),
        videoFile: videoFile,
      });
    } catch {
      // Error handled in parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-xs font-heading font-semibold text-text-secondary uppercase tracking-wide mb-2">
            Movie Title <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Inception"
            className={`input-field ${errors.title ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}`}
            aria-required="true"
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          <FieldError message={errors.title} />
        </div>

        {/* Genre */}
        <div>
          <label htmlFor="genre" className="block text-xs font-heading font-semibold text-text-secondary uppercase tracking-wide mb-2">
            Genre <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              id="genre"
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className={`input-field appearance-none pr-10 cursor-pointer ${errors.genre ? 'border-red-500/50' : ''}`}
              aria-required="true"
            >
              <option value="" disabled className="bg-bg-card text-text-muted">Select a genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g} className="bg-bg-card text-text-primary">{g}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
          <FieldError message={errors.genre} />
        </div>

        {/* Release Year + Rating (side by side) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="releaseYear" className="block text-xs font-heading font-semibold text-text-secondary uppercase tracking-wide mb-2">
              Release Year <span className="text-red-400">*</span>
            </label>
            <input
              id="releaseYear"
              name="releaseYear"
              type="number"
              value={form.releaseYear}
              onChange={handleChange}
              placeholder="2024"
              min="1888"
              max={CURRENT_YEAR + 5}
              className={`input-field ${errors.releaseYear ? 'border-red-500/50' : ''}`}
              aria-required="true"
            />
            <FieldError message={errors.releaseYear} />
          </div>

          <div>
            <label htmlFor="rating" className="block text-xs font-heading font-semibold text-text-secondary uppercase tracking-wide mb-2">
              Rating (0–10) <span className="text-red-400">*</span>
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              value={form.rating}
              onChange={handleChange}
              placeholder="8.5"
              min="0"
              max="10"
              step="0.1"
              className={`input-field ${errors.rating ? 'border-red-500/50' : ''}`}
              aria-required="true"
            />
            <FieldError message={errors.rating} />
          </div>
        </div>

        {/* Director */}
        <div>
          <label htmlFor="director" className="block text-xs font-heading font-semibold text-text-secondary uppercase tracking-wide mb-2">
            Director <span className="text-red-400">*</span>
          </label>
          <input
            id="director"
            name="director"
            type="text"
            value={form.director}
            onChange={handleChange}
            placeholder="e.g. Christopher Nolan"
            className={`input-field ${errors.director ? 'border-red-500/50' : ''}`}
            aria-required="true"
          />
          <FieldError message={errors.director} />
        </div>

        {/* Poster URL */}
        <div>
          <label htmlFor="posterUrl" className="block text-xs font-heading font-semibold text-text-secondary uppercase tracking-wide mb-2">
            Poster Image URL <span className="text-text-muted font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="posterUrl"
            name="posterUrl"
            type="url"
            value={form.posterUrl}
            onChange={handleChange}
            placeholder="https://example.com/poster.jpg"
            className="input-field"
          />
          <p className="mt-1.5 text-xs text-text-muted">
            Paste a direct link to a movie poster image for the best visual result.
          </p>
        </div>
{/* YouTube Trailer URL */}
<div>
  <label
    htmlFor="trailerUrl"
    className="block text-xs font-heading font-semibold text-text-secondary uppercase tracking-wide mb-2"
  >
    YouTube Trailer URL
    <span className="text-text-muted font-normal normal-case tracking-normal">
      (optional)
    </span>
  </label>

  <input
    id="trailerUrl"
    name="trailerUrl"
    type="url"
    value={form.trailerUrl}
    onChange={handleChange}
    placeholder="https://www.youtube.com/watch?v=..."
    className="input-field"
  />

  <p className="mt-1.5 text-xs text-text-muted">
    Paste the YouTube trailer link of your movie.
  </p>
</div>

{/* Full Movie MP4 Upload */}
<div>
  <label
    htmlFor="videoFile"
    className="block text-xs font-heading font-semibold text-text-secondary uppercase tracking-wide mb-2"
  >
    Upload Full Movie (MP4)
    <span className="text-text-muted font-normal normal-case tracking-normal">
      (optional)
    </span>
  </label>

  <input
    id="videoFile"
    type="file"
    accept="video/mp4,.mp4"
    onChange={(e) => setVideoFile(e.target.files[0] || null)}
    className="input-field"
  />

  {videoFile && (
    <p className="mt-2 text-xs text-green-400">
      Selected: {videoFile.name}
    </p>
  )}

  <p className="mt-1.5 text-xs text-text-muted">
    Select an MP4 video file (maximum 500 MB).
  </p>
</div>

{/* Full Movie Video URL */}
<div>
  <label
    htmlFor="videoUrl"
    className="block text-xs font-heading font-semibold text-text-secondary uppercase tracking-wide mb-2"
  >
    Full Movie Video URL
    <span className="text-text-muted font-normal normal-case tracking-normal">
      (optional)
    </span>
  </label>

  <input
    id="videoUrl"
    name="videoUrl"
    type="url"
    value={form.videoUrl}
    onChange={handleChange}
    placeholder="https://example.com/movie.mp4"
    className="input-field"
  />

  <p className="mt-1.5 text-xs text-text-muted">
    Paste a direct MP4 video link.
  </p>
</div>

        {/* Rating preview */}
        {form.rating !== '' && !isNaN(Number(form.rating)) && Number(form.rating) >= 0 && Number(form.rating) <= 10 && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-bg-secondary border border-border-subtle">
            <div className="flex gap-0.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-1.5 rounded-full transition-all"
                  style={{
                    background: i < Math.round(Number(form.rating))
                      ? '#C9A84C'
                      : 'rgba(255,255,255,0.08)',
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-text-secondary ml-1">{Number(form.rating).toFixed(1)} / 10</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {isEditing ? 'Saving…' : 'Adding…'}
            </>
          ) : (
            <>
              <Film size={16} />
              {isEditing ? 'Save Changes' : 'Add to Collection'}
            </>
          )}
        </button>
      </div>
      
    </form>
  );
}
