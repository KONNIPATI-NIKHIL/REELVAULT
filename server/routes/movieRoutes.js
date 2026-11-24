
const express = require('express');
const router = express.Router();

const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getStats,
} = require('../controllers/movieController');

const upload = require('../middleware/upload');

// Statistics route
router.get('/stats', getStats);

// Movie routes with MP4 upload support
router.route('/')
  .get(getMovies)
  .post(upload.single('video'), createMovie);

router.route('/:id')
  .get(getMovieById)
  .put(upload.single('video'), updateMovie)
  .delete(deleteMovie);

module.exports = router;
