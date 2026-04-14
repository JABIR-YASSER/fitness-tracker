import { useCallback, useState } from 'react'
import Dashboard from './components/Dashboard'
import WorkoutForm from './components/WorkoutForm'
import WorkoutList from './components/WorkoutList'
import Login from './pages/Login'
import { useEffect } from "react";
import {
  addWorkout,
  deleteWorkout,
  getWorkouts,
  updateWorkout,
} from './services/api'

function App() {
  const [workouts, setWorkouts] = useState([])
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = window.localStorage.getItem('fitness-user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [dark, setDark] = useState(
    () => window.localStorage.getItem('theme') === 'dark',
  )
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const logged = Boolean(currentUser)
  useEffect(() => {
  if (logged && workouts.length === 0) {
    fetchData();
  }
  }, [logged]);
  const fetchData = useCallback(async (userId = currentUser?.id) => {
    if (!userId) {
      return
    }

    try {
      setLoading(true)
      const response = await getWorkouts(userId)
      setWorkouts(response.data)
    } catch (error) {
      console.error('Error fetching workouts:', error)
    } finally {
      setLoading(false)
    }
  }, [currentUser?.id])

  const handleLoginChange = async (user) => {
    if (user) {
      setCurrentUser(user)
      window.localStorage.setItem('fitness-user', JSON.stringify(user))
      await fetchData(user.id)
      return
    }

    setCurrentUser(null)
    setWorkouts([])
    window.localStorage.removeItem('fitness-user')
  }

  const handleCreateWorkout = async (form) => {
    const optimisticWorkout = {
      ...form,
      id: `temp-${Date.now()}`,
      user_id: currentUser.id,
    }

    setWorkouts((currentWorkouts) => [optimisticWorkout, ...currentWorkouts])

    try {
      const response = await addWorkout({
        ...form,
        user_id: currentUser.id,
      })

      const savedWorkout = response.data.workout ?? {
        ...form,
        id: response.data.id ?? optimisticWorkout.id,
        user_id: currentUser.id,
      }

      setWorkouts((currentWorkouts) =>
        currentWorkouts.map((workout) =>
          workout.id === optimisticWorkout.id ? savedWorkout : workout,
        ),
      )
    } catch (error) {
      setWorkouts((currentWorkouts) =>
        currentWorkouts.filter((workout) => workout.id !== optimisticWorkout.id),
      )
      throw error
    }
  }

  const handleUpdateWorkout = async (updatedWorkout) => {
    const previousWorkout = workouts.find(
      (workout) => String(workout.id) === String(updatedWorkout.id),
    )

    setWorkouts((currentWorkouts) =>
      currentWorkouts.map((workout) =>
        String(workout.id) === String(updatedWorkout.id)
          ? { ...workout, ...updatedWorkout }
          : workout,
      ),
    )

    try {
      await updateWorkout({
        ...updatedWorkout,
        user_id: currentUser.id,
      })
    } catch (error) {
      if (previousWorkout) {
        setWorkouts((currentWorkouts) =>
          currentWorkouts.map((workout) =>
            String(workout.id) === String(previousWorkout.id)
              ? previousWorkout
              : workout,
          ),
        )
      }
      throw error
    }
  }

  const handleDeleteWorkout = async (id) => {
    const previousWorkout = workouts.find(
      (workout) => String(workout.id) === String(id),
    )

    setWorkouts((currentWorkouts) =>
      currentWorkouts.filter((workout) => String(workout.id) !== String(id)),
    )

    try {
      await deleteWorkout(id, currentUser.id)
    } catch (error) {
      if (previousWorkout) {
        setWorkouts((currentWorkouts) => [previousWorkout, ...currentWorkouts])
      }
      throw error
    }
  }

  const filteredWorkouts = workouts.filter((workout) => {
    const matchSearch = workout.exercise
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchDate =
      (!startDate || workout.date >= startDate) &&
      (!endDate || workout.date <= endDate)

    return matchSearch && matchDate
  })

  const shellTheme = dark
    ? 'bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_48%,_#000000_100%)]'
    : 'bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_transparent_32%),linear-gradient(135deg,_#1d4ed8_0%,_#7c3aed_48%,_#db2777_100%)]'

  const containerTheme = dark
    ? 'border-white/10 bg-white/8 shadow-black/50'
    : 'border-white/20 bg-white/12 shadow-indigo-950/35'

  const totalCardTheme = dark
    ? 'border-white/10 bg-white/8 shadow-black/40'
    : 'border-white/20 bg-white/18 shadow-black/15'

  const themeLabel = dark ? 'Light' : 'Dark'

  const dashboardMessage = loading
    ? 'Syncing workouts...'
    : filteredWorkouts.length === 0
      ? 'Add a workout to unlock weekly analytics.'
      : `${filteredWorkouts.length} workout${filteredWorkouts.length === 1 ? '' : 's'} in view`

  const totalCalories = filteredWorkouts.reduce(
    (sum, workout) => sum + Number(workout.calories),
    0,
  )

  const totalDuration = filteredWorkouts.reduce(
    (sum, workout) => sum + Number(workout.duration),
    0,
  )

  const avgCalories =
    filteredWorkouts.length > 0
      ? Math.round(totalCalories / filteredWorkouts.length)
      : 0

  const bestWorkout = filteredWorkouts.reduce(
    (maxWorkout, workout) =>
      Number(workout.calories) > Number(maxWorkout.calories ?? 0)
        ? workout
        : maxWorkout,
    filteredWorkouts[0] ?? {},
  )

  if (!logged) {
    return <Login setLogged={handleLoginChange} />
  }

  return (
    <div className={dark ? 'dark' : ''}>
      <div className={`min-h-screen ${shellTheme} p-4 sm:p-5 md:p-6`}>
        <div
          className={`mx-auto max-w-5xl rounded-[2rem] border px-2 py-5 shadow-2xl backdrop-blur-xl sm:px-6 md:p-8 ${containerTheme}`}
        >
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                Fitness Tracker 💪
              </h1>
              <p className="mt-2 text-sm text-white/80 md:text-base">
                Track your progress like a pro with a polished workout command
                center.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const nextTheme = !dark
                  setDark(nextTheme)
                  window.localStorage.setItem(
                    'theme',
                    nextTheme ? 'dark' : 'light',
                  )
                }}
                className="rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-sm font-medium text-white transition duration-300 hover:scale-105 hover:bg-white/25"
              >
                {dark ? '☀️' : '🌙'} {themeLabel}
              </button>
              <button
                onClick={() => handleLoginChange(null)}
                className="rounded-xl border border-white/20 bg-white/15 px-4 py-2 font-medium text-white backdrop-blur transition duration-300 hover:scale-105 hover:bg-white/25"
              >
                Log out
              </button>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-sm text-white/80">{dashboardMessage}</p>
            {loading ? (
              <p className="text-sm font-medium text-white/90">Loading...</p>
            ) : null}
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div
              className={`rounded-3xl border p-5 shadow-lg backdrop-blur-md transition duration-300 hover:scale-[1.03] ${totalCardTheme}`}
            >
              <p className="text-sm uppercase tracking-[0.18em] text-white/70">
                Total Calories
              </p>
              <p className="mt-3 text-3xl font-bold text-white md:text-4xl">
                {totalCalories}
              </p>
            </div>

            <div
              className={`rounded-3xl border p-5 shadow-lg backdrop-blur-md transition duration-300 hover:scale-[1.03] ${totalCardTheme}`}
            >
              <p className="text-sm uppercase tracking-[0.18em] text-white/70">
                Total Duration
              </p>
              <p className="mt-3 text-3xl font-bold text-white md:text-4xl">
                {totalDuration} min
              </p>
            </div>

            <div
              className={`rounded-3xl border p-5 shadow-lg backdrop-blur-md transition duration-300 hover:scale-[1.03] ${totalCardTheme}`}
            >
              <p className="text-sm uppercase tracking-[0.18em] text-white/70">
                Avg Calories
              </p>
              <p className="mt-3 text-3xl font-bold text-white md:text-4xl">
                {avgCalories}
              </p>
            </div>

            <div
              className={`rounded-3xl border p-5 shadow-lg backdrop-blur-md transition duration-300 hover:scale-[1.03] ${totalCardTheme}`}
            >
              <p className="text-sm uppercase tracking-[0.18em] text-white/70">
                Best Workout
              </p>
              <p className="mt-3 text-xl font-bold text-white md:text-2xl">
                {bestWorkout.exercise || 'N/A'}
              </p>
            </div>
          </div>

          <Dashboard workouts={filteredWorkouts} dark={dark} />
          <WorkoutForm onCreateWorkout={handleCreateWorkout} dark={dark} />

          <div
            className={`mb-6 grid grid-cols-1 gap-3 rounded-3xl border p-4 shadow-lg backdrop-blur-md md:grid-cols-[2fr_1fr_1fr] ${
              dark
                ? 'border-white/10 bg-white/8 shadow-black/40'
                : 'border-white/20 bg-white/18 shadow-black/15'
            }`}
          >
            <input
              placeholder="Search exercise..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl bg-white/75 p-3 text-gray-900 outline-none transition duration-300 placeholder:text-gray-500 focus:bg-white"
            />
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-xl bg-white/75 p-3 text-gray-900 outline-none transition duration-300 focus:bg-white"
            />
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-xl bg-white/75 p-3 text-gray-900 outline-none transition duration-300 focus:bg-white"
            />
          </div>

          <WorkoutList
            workouts={filteredWorkouts}
            onDeleteWorkout={handleDeleteWorkout}
            onUpdateWorkout={handleUpdateWorkout}
            dark={dark}
          />
        </div>
      </div>
    </div>
  )
}

export default App
