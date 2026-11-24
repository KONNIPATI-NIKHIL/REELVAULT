
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 0,
});

// Convert movie data into FormData when an MP4 is selected
const prepareMovieData = (movieData) => {
  const { videoFile, ...fields } = movieData;

  // Normal JSON request when no file is uploaded
  if (!videoFile) {
    return fields;
  }

  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  // Must match upload.single('video') in movieRoutes.js
  formData.append('video', videoFile);

  return formData;
};

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);

const movieService = {
  getMovies: async (params = {}) => {
    const { data } = await api.get('/movies', { params });
    return data;
  },

  getMovieById: async (id) => {
    const { data } = await api.get(`/movies/${id}`);
    return data;
  },

  createMovie: async (movieData) => {
    const payload = prepareMovieData(movieData);
    const { data } = await api.post('/movies', payload);
    return data;
  },

  updateMovie: async (id, movieData) => {
    const payload = prepareMovieData(movieData);
    const { data } = await api.put(`/movies/${id}`, payload);
    return data;
  },

  deleteMovie: async (id) => {
    const { data } = await api.delete(`/movies/${id}`);
    return data;
  },

  getStats: async () => {
    const { data } = await api.get('/movies/stats');
    return data;
  },
};

export default movieService;
