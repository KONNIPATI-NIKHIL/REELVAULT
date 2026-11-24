const Movie = require('../models/Movie');
const mongoose = require('mongoose');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  const { search, genre, sort = 'createdAt', order = 'desc' } = req.query;

  const filter = {};

  // Search by title or genre (case-insensitive)
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { genre: { $regex: search, $options: 'i' } },
      { director: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by genre
  if (genre && genre !== 'All') {
    filter.genre = genre;
  }

  // Sort configuration
  const allowedSortFields = ['title', 'genre', 'releaseYear', 'rating', 'createdAt'];
  const sortField = allowedSortFields.includes(sort) ? sort : 'createdAt';
  const sortOrder = order === 'asc' ? 1 : -1;

  const movies = await Movie.find(filter).sort({ [sortField]: sortOrder });

  res.json({
    success: true,
    count: movies.length,
    data: movies,
  });
};

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid movie ID format');
  }

  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  res.json({
    success: true,
    data: movie,
  });
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Public

const createMovie = async (req, res) => {
  const { title, genre, releaseYear, rating, director, posterUrl, videoUrl } = req.body;

  const movie = await Movie.create({
    title,
    genre,
    releaseYear,
    rating,
    director,
    posterUrl: posterUrl || '',
    videoUrl: videoUrl || '',
    videoPath: req.file ? `/uploads/${req.file.filename}` : '',
  });

  res.status(201).json({
    success: true,
    data: movie,
    message: 'Movie added to your collection',
  });
};


// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Public

const updateMovie = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid movie ID format');
  }

  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  const {
    title,
    genre,
    releaseYear,
    rating,
    director,
    posterUrl,
    videoUrl,
  } = req.body;

  const updatedMovie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title,
      genre,
      releaseYear,
      rating,
      director,
      posterUrl,
      videoUrl: videoUrl !== undefined ? videoUrl : movie.videoUrl,
      videoPath: req.file
        ? `/uploads/${req.file.filename}`
        : movie.videoPath,
    },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: updatedMovie,
    message: 'Movie updated successfully',
  });
};


// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Public
const deleteMovie = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid movie ID format');
  }

  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  await Movie.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: `"${movie.title}" has been removed from the collection`,
  });
};

// @desc    Get dashboard statistics
// @route   GET /api/movies/stats
// @access  Public
const getStats = async (req, res) => {
  const totalMovies = await Movie.countDocuments();

  const genreAgg = await Movie.aggregate([
    { $group: { _id: '$genre' } },
    { $count: 'total' },
  ]);
  const totalGenres = genreAgg.length > 0 ? genreAgg[0].total : 0;

  const ratingAgg = await Movie.aggregate([
    { $group: { _id: null, avgRating: { $avg: '$rating' }, maxYear: { $max: '$releaseYear' } } },
  ]);

  const avgRating = ratingAgg.length > 0 ? Math.round(ratingAgg[0].avgRating * 10) / 10 : 0;
  const latestYear = ratingAgg.length > 0 ? ratingAgg[0].maxYear : new Date().getFullYear();

  res.json({
    success: true,
    data: {
      totalMovies,
      totalGenres,
      avgRating,
      latestYear,
    },
  });
};

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie, getStats };
