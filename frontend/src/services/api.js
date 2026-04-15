import axios from 'axios';
import toast from 'react-hot-toast';
import useWorkoutStore from '../store/useWorkoutStore';

const API = "http://localhost/fitness-tracker/backend";

const api = axios.create({
  baseURL: API,
});

api.interceptors.request.use((config) => {
  try {
    const userStr = window.localStorage.getItem('fitness-user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
  } catch (e) {
    console.error("Format de token corrompu dans le LocalStorage:", e);
    window.localStorage.removeItem('fitness-user');
  }
  return config;
}, (error) => Promise.reject(error));



api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred.';
    if (error.response) {
      if (error.response.status === 401) {
        toast.error('Session expired, logging out.');
        useWorkoutStore.getState().setLogged(null);
      } else {
        message = error.response.data?.message || 'Server returned an error.';
        toast.error(message);
      }
    } else if (error.request) {
      toast.error('Network Error: Server Unreachable.');
    } else {
      toast.error(`Request Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export const getWorkouts = () => api.get(`/getWorkouts.php`);
export const addWorkout = (data) => api.post(`/addWorkout.php`, data);
export const deleteWorkout = (id) => api.get(`/deleteWorkout.php`, { params: { id } });
export const updateWorkout = (data) => api.post(`/updateWorkout.php`, data);
export const loginUser = (data) => api.post(`/login.php`, data);
export const registerUser = (data) => api.post(`/register.php`, data);
export const getProfile = () => api.get(`/getProfile.php`);
export const updateProfile = (data) => api.post(`/updateProfile.php`, data);
export const getAiSuggestion = () => api.get(`/ai_suggestions.php`);
export const getExercises = () => api.get(`/getExercises.php`);
export const getLeaderboard = () => api.get(`/getLeaderboard.php`);
export const getRoutines = () => api.get(`/getRoutines.php`);
export const logRoutine = (data) => api.post(`/logRoutine.php`, data);
