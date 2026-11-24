require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const connectDB = require('./config/db');

const sampleMovies = [
  {
    title: 'Inception',
    genre: 'Sci-Fi',
    releaseYear: 2010,
    rating: 8.8,
    director: 'Christopher Nolan',
    posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
  },
  {
    title: 'The Dark Knight',
    genre: 'Action',
    releaseYear: 2008,
    rating: 9.0,
    director: 'Christopher Nolan',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  },
  {
    title: 'Parasite',
    genre: 'Thriller',
    releaseYear: 2019,
    rating: 8.5,
    director: 'Bong Joon-ho',
    posterUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
  },
  {
    title: 'Interstellar',
    genre: 'Sci-Fi',
    releaseYear: 2014,
    rating: 8.6,
    director: 'Christopher Nolan',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  },
  {
    title: 'The Godfather',
    genre: 'Crime',
    releaseYear: 1972,
    rating: 9.2,
    director: 'Francis Ford Coppola',
    posterUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLeMMovruy.jpg',
  },
  {
    title: 'Pulp Fiction',
    genre: 'Crime',
    releaseYear: 1994,
    rating: 8.9,
    director: 'Quentin Tarantino',
    posterUrl: 'https://image.tmdb.org/t/p/w500/fIE3lAGcZDV1G6XM5KmuWnNsPp1.jpg',
  },
  {
    title: 'The Shawshank Redemption',
    genre: 'Drama',
    releaseYear: 1994,
    rating: 9.3,
    director: 'Frank Darabont',
    posterUrl: 'https://image.tmdb.org/t/p/w500/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg',
  },
  {
    title: 'Spirited Away',
    genre: 'Animation',
    releaseYear: 2001,
    rating: 8.6,
    director: 'Hayao Miyazaki',
    posterUrl: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
  },
  {
    title: 'Get Out',
    genre: 'Horror',
    releaseYear: 2017,
    rating: 7.7,
    director: 'Jordan Peele',
    posterUrl: 'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg',
  },
  {
    title: 'Arrival',
    genre: 'Sci-Fi',
    releaseYear: 2016,
    rating: 7.9,
    director: 'Denis Villeneuve',
    posterUrl: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg',
  },
];

const seed = async () => {
  try {
    await connectDB();
    await Movie.deleteMany({});
    console.log('🗑️  Cleared existing movies');
    const created = await Movie.insertMany(sampleMovies);
    console.log(`🎬 Seeded ${created.length} movies successfully`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
