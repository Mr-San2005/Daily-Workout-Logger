import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
};

// Workout API calls
export const workoutAPI = {
  getWorkouts: () => api.get('/workouts'),
  addWorkout: (workoutData) => api.post('/workouts', workoutData),
  updateWorkout: (id, workoutData) => api.put(`/workouts/${id}`, workoutData),
  deleteWorkout: (id) => api.delete(`/workouts/${id}`),
};

// Bot API calls
export const botAPI = {
  chat: (message) => api.post('/bot', { message }),
};

export default api;