const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
      enum: {
        values: [
          'Action',
          'Adventure',
          'Animation',
          'Biography',
          'Comedy',
          'Crime',
          'Documentary',
          'Drama',
          'Fantasy',
          'Horror',
          'Musical',
          'Mystery',
          'Romance',
          'Sci-Fi',
          'Thriller',
          'War',
          'Western',
        ],
        message: '{VALUE} is not a supported genre',
      },
    },
    releaseYear: {
      type: Number,
      required: [true, 'Release year is required'],
      min: [1888, 'Release year cannot be before 1888 (first film ever made)'],
      max: [
        new Date().getFullYear() + 5,
        'Release year cannot be more than 5 years in the future',
      ],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [0, 'Rating must be at least 0'],
      max: [10, 'Rating cannot exceed 10'],
    },
    director: {
      type: String,
      required: [true, 'Director name is required'],
      trim: true,
      maxlength: [100, 'Director name cannot exceed 100 characters'],
    },
    posterUrl: {
      type: String,
      trim: true,
      default: '',
    },

videoPath: {
  type: String,
  trim: true,
  default: '',
},
videoUrl: {
  type: String,
  trim: true,
  default: '',
},

  },
  {
    timestamps: true,
  }
);

// Index for search performance
movieSchema.index({ title: 'text', genre: 'text', director: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ rating: -1 });
movieSchema.index({ releaseYear: -1 });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
