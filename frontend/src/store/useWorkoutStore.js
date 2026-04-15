import { create } from 'zustand'
import { getWorkouts as apiGet, addWorkout as apiAdd, deleteWorkout as apiDelete, updateWorkout as apiUpdate, getProfile as apiGetProfile, getExercises as apiGetExercises, getRoutines as apiGetRoutines } from '../services/api'

const useWorkoutStore = create((set, get) => ({
  workouts: [],
  exercises: [],
  routines: [],
  profile: null,
  currentUser: JSON.parse(window.localStorage.getItem('fitness-user') || 'null'),
  loading: false,

  setLogged: async (user) => {
    if (user) {
      window.localStorage.setItem('fitness-user', JSON.stringify(user));
      set({ currentUser: user });
      await get().fetchWorkouts();
      await get().fetchProfile();
      await get().fetchExercises();
      await get().fetchRoutines();
    } else {
      window.localStorage.removeItem('fitness-user');
      set({ currentUser: null, workouts: [], exercises: [], routines: [], profile: null });
    }
  },

  fetchProfile: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const response = await apiGetProfile();
      if (response.data?.profile) set({ profile: response.data.profile });
    } catch (error) {
      // ignore
    }
  },

  fetchExercises: async () => {
    try {
      const response = await apiGetExercises();
      if (response.data?.exercises) set({ exercises: response.data.exercises });
    } catch (error) {
      // ignore
    }
  },

  fetchRoutines: async () => {
    try {
      const response = await apiGetRoutines();
      if (response.data?.routines) set({ routines: response.data.routines });
    } catch (error) {
       // ignore
    }
  },
  
  setProfileLocally: (profile) => set({ profile }),

  fetchWorkouts: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    
    set({ loading: true });
    try {
      const response = await apiGet();
      set({ workouts: response.data || [] });
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      set({ loading: false });
    }
  },

  addWorkout: async (form) => {
    const { currentUser } = get();
    const optimisticWorkout = {
      ...form,
      id: `temp-${Date.now()}`,
      user_id: currentUser.id,
    };

    set((state) => ({ workouts: [optimisticWorkout, ...state.workouts] }));

    try {
      const response = await apiAdd(form);
      const savedWorkout = response.data.workout ?? {
        ...form,
        id: response.data.id ?? optimisticWorkout.id,
        user_id: currentUser.id,
      };

      set((state) => ({
        workouts: state.workouts.map((w) => w.id === optimisticWorkout.id ? savedWorkout : w)
      }));
    } catch (error) {
      set((state) => ({
        workouts: state.workouts.filter((w) => w.id !== optimisticWorkout.id)
      }));
      throw error;
    }
  },

  updateWorkout: async (updatedWorkout) => {
    const previousWorkouts = get().workouts;
    const previous = previousWorkouts.find(w => String(w.id) === String(updatedWorkout.id));
    
    set((state) => ({
      workouts: state.workouts.map((w) => String(w.id) === String(updatedWorkout.id) ? { ...w, ...updatedWorkout } : w)
    }));

    try {
      const response = await apiUpdate(updatedWorkout);
      if (response.data && response.data.status === 'success') {
          // Sync auto-computed calories to UI
          set((state) => ({
             workouts: state.workouts.map((w) => String(w.id) === String(updatedWorkout.id) ? { ...w, calories: response.data.calories } : w)
          }));
      }
    } catch (error) {
      if (previous) {
        set((state) => ({
          workouts: state.workouts.map((w) => String(w.id) === String(previous.id) ? previous : w)
        }));
      }
      throw error;
    }
  },

  deleteWorkout: async (id) => {
    const previousWorkouts = get().workouts;
    const previous = previousWorkouts.find(w => String(w.id) === String(id));

    set((state) => ({
      workouts: state.workouts.filter(w => String(w.id) !== String(id))
    }));

    try {
      await apiDelete(id);
    } catch (error) {
      if (previous) {
        set((state) => ({ workouts: [previous, ...state.workouts] }));
      }
      throw error;
    }
  }
}));

export default useWorkoutStore;
