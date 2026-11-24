const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const { app } = require('../server');
const Movie = require('../models/Movie');

let mongoServer;

beforeAll(async () => {
  // Disconnect from existing connection (from server.js)
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Movie.deleteMany({});
});

const sampleMovie = {
  title: 'Inception',
  genre: 'Sci-Fi',
  releaseYear: 2010,
  rating: 8.8,
  director: 'Christopher Nolan',
  posterUrl: 'https://example.com/inception.jpg',
};

describe('Movie API Tests', () => {
  describe('GET /api/movies', () => {
    it('should return empty array when no movies exist', async () => {
      const res = await request(app).get('/api/movies');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(0);
      expect(res.body.count).toBe(0);
    });

    it('should return all movies', async () => {
      await Movie.create(sampleMovie);
      await Movie.create({ ...sampleMovie, title: 'Interstellar', releaseYear: 2014 });

      const res = await request(app).get('/api/movies');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.count).toBe(2);
    });

    it('should search movies by title (case-insensitive)', async () => {
      await Movie.create(sampleMovie);
      await Movie.create({ ...sampleMovie, title: 'The Dark Knight', genre: 'Action' });

      const res = await request(app).get('/api/movies?search=inception');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Inception');
    });

    it('should search movies by genre', async () => {
      await Movie.create(sampleMovie);
      await Movie.create({ ...sampleMovie, title: 'The Matrix', genre: 'Sci-Fi' });
      await Movie.create({ ...sampleMovie, title: 'The Dark Knight', genre: 'Action' });

      const res = await request(app).get('/api/movies?search=Sci-Fi');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    it('should filter movies by genre', async () => {
      await Movie.create(sampleMovie);
      await Movie.create({ ...sampleMovie, title: 'The Dark Knight', genre: 'Action' });

      const res = await request(app).get('/api/movies?genre=Action');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].genre).toBe('Action');
    });

    it('should sort movies by rating descending', async () => {
      await Movie.create({ ...sampleMovie, title: 'Movie A', rating: 7.0 });
      await Movie.create({ ...sampleMovie, title: 'Movie B', rating: 9.0 });
      await Movie.create({ ...sampleMovie, title: 'Movie C', rating: 5.0 });

      const res = await request(app).get('/api/movies?sort=rating&order=desc');
      expect(res.status).toBe(200);
      expect(res.body.data[0].rating).toBe(9.0);
      expect(res.body.data[2].rating).toBe(5.0);
    });

    it('should sort movies by releaseYear ascending', async () => {
      await Movie.create({ ...sampleMovie, title: 'Old Movie', releaseYear: 1990 });
      await Movie.create({ ...sampleMovie, title: 'New Movie', releaseYear: 2023 });

      const res = await request(app).get('/api/movies?sort=releaseYear&order=asc');
      expect(res.status).toBe(200);
      expect(res.body.data[0].releaseYear).toBe(1990);
    });
  });

  describe('GET /api/movies/stats', () => {
    it('should return zeros for empty collection', async () => {
      const res = await request(app).get('/api/movies/stats');
      expect(res.status).toBe(200);
      expect(res.body.data.totalMovies).toBe(0);
      expect(res.body.data.totalGenres).toBe(0);
    });

    it('should compute correct stats', async () => {
      await Movie.create({ ...sampleMovie, genre: 'Sci-Fi', rating: 8.0, releaseYear: 2010 });
      await Movie.create({ ...sampleMovie, title: 'Dark Knight', genre: 'Action', rating: 9.0, releaseYear: 2008 });

      const res = await request(app).get('/api/movies/stats');
      expect(res.status).toBe(200);
      expect(res.body.data.totalMovies).toBe(2);
      expect(res.body.data.totalGenres).toBe(2);
      expect(res.body.data.avgRating).toBe(8.5);
      expect(res.body.data.latestYear).toBe(2010);
    });
  });

  describe('GET /api/movies/:id', () => {
    it('should return a single movie by ID', async () => {
      const movie = await Movie.create(sampleMovie);

      const res = await request(app).get(`/api/movies/${movie._id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Inception');
    });

    it('should return 404 for non-existent movie', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/movies/${fakeId}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app).get('/api/movies/invalid-id');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/movies', () => {
    it('should create a new movie', async () => {
      const res = await request(app).post('/api/movies').send(sampleMovie);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Inception');
      expect(res.body.data._id).toBeDefined();
    });

    it('should persist movie to database', async () => {
      await request(app).post('/api/movies').send(sampleMovie);
      const count = await Movie.countDocuments();
      expect(count).toBe(1);
    });

    it('should reject movie with missing required fields', async () => {
      const res = await request(app).post('/api/movies').send({ title: 'Incomplete Movie' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid rating (> 10)', async () => {
      const res = await request(app)
        .post('/api/movies')
        .send({ ...sampleMovie, rating: 11 });
      expect(res.status).toBe(400);
    });

    it('should reject invalid rating (< 0)', async () => {
      const res = await request(app)
        .post('/api/movies')
        .send({ ...sampleMovie, rating: -1 });
      expect(res.status).toBe(400);
    });

    it('should reject invalid genre', async () => {
      const res = await request(app)
        .post('/api/movies')
        .send({ ...sampleMovie, genre: 'InvalidGenre' });
      expect(res.status).toBe(400);
    });

    it('should reject release year before 1888', async () => {
      const res = await request(app)
        .post('/api/movies')
        .send({ ...sampleMovie, releaseYear: 1800 });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/movies/:id', () => {
    it('should update an existing movie', async () => {
      const movie = await Movie.create(sampleMovie);

      const res = await request(app)
        .put(`/api/movies/${movie._id}`)
        .send({ ...sampleMovie, rating: 9.5 });

      expect(res.status).toBe(200);
      expect(res.body.data.rating).toBe(9.5);
    });

    it('should only update the target movie', async () => {
      const movie1 = await Movie.create(sampleMovie);
      const movie2 = await Movie.create({ ...sampleMovie, title: 'Interstellar' });

      await request(app)
        .put(`/api/movies/${movie1._id}`)
        .send({ ...sampleMovie, rating: 9.9 });

      const unchanged = await Movie.findById(movie2._id);
      expect(unchanged.rating).toBe(sampleMovie.rating);
    });

    it('should return 404 for non-existent movie', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).put(`/api/movies/${fakeId}`).send(sampleMovie);
      expect(res.status).toBe(404);
    });

    it('should return 400 for invalid ID', async () => {
      const res = await request(app).put('/api/movies/bad-id').send(sampleMovie);
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/movies/:id', () => {
    it('should delete an existing movie', async () => {
      const movie = await Movie.create(sampleMovie);

      const res = await request(app).delete(`/api/movies/${movie._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const deleted = await Movie.findById(movie._id);
      expect(deleted).toBeNull();
    });

    it('should not affect other movies on delete', async () => {
      const movie1 = await Movie.create(sampleMovie);
      const movie2 = await Movie.create({ ...sampleMovie, title: 'Interstellar' });

      await request(app).delete(`/api/movies/${movie1._id}`);

      const remaining = await Movie.findById(movie2._id);
      expect(remaining).not.toBeNull();
      expect(remaining.title).toBe('Interstellar');
    });

    it('should return 404 for non-existent movie', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/movies/${fakeId}`);
      expect(res.status).toBe(404);
    });

    it('should return 400 for invalid ID', async () => {
      const res = await request(app).delete('/api/movies/bad-id');
      expect(res.status).toBe(400);
    });
  });
});
