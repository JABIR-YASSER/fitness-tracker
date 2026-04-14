import axios from 'axios'

const API = "http://localhost/fitness-tracker/backend";

export const getWorkouts = (userId) =>
  axios.get(`${API}/getWorkouts.php`, {
    params: { user_id: userId },
  })

export const addWorkout = (data) => axios.post(`${API}/addWorkout.php`, data)

export const deleteWorkout = (id, userId) =>
  axios.get(`${API}/deleteWorkout.php`, {
    params: { id, user_id: userId },
  })

export const updateWorkout = (data) =>
  axios.post(`${API}/updateWorkout.php`, data)

export const loginUser = (data) => axios.post(`${API}/login.php`, data)

export const registerUser = (data) => axios.post(`${API}/register.php`, data)
