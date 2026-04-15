import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import WorkoutForm from './components/WorkoutForm'
import WorkoutList from './components/WorkoutList'
import ProfileSettings from './components/ProfileSettings'
import Login from './pages/Login'
import Register from './pages/Register'
import Leaderboard from './pages/Leaderboard'
import useWorkoutStore from './store/useWorkoutStore'

function App() {
  const { workouts, currentUser, loading, setLogged, fetchWorkouts, fetchProfile } = useWorkoutStore();
  const [authPage, setAuthPage] = useState('login'); // conditional render
  const [currentView, setCurrentView] = useState('dashboard'); // v3 routing
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const logged = Boolean(currentUser)

  useEffect(() => {
    if (logged) {
      if (workouts.length === 0) fetchWorkouts();
      fetchProfile();
      useWorkoutStore.getState().fetchExercises();
    }
  }, [logged, fetchWorkouts, fetchProfile]);

  const filteredWorkouts = workouts.filter((workout) => {
    const matchSearch = String(workout.exercise).toLowerCase().includes(search.toLowerCase())
    const matchDate = (!startDate || workout.date >= startDate) && (!endDate || workout.date <= endDate)
    return matchSearch && matchDate
  })

  // Theme constants - High Focus Dark Mode
  const shellTheme = 'bg-zinc-950 text-white'
  const containerTheme = 'border border-white/10 bg-black shadow-none rounded-none'
  const totalCardTheme = 'border border-white/10 bg-black shadow-none rounded-none text-white'

  const dashboardMessage = loading
    ? 'Syncing parameters...'
    : filteredWorkouts.length === 0
      ? 'Add a workout to unlock weekly analytics.'
      : `${filteredWorkouts.length} workouts tracked`

  const totalCalories = filteredWorkouts.reduce((sum, w) => sum + Number(w.calories), 0)
  const totalDuration = filteredWorkouts.reduce((sum, w) => sum + Number(w.duration), 0)
  const avgCalories = filteredWorkouts.length > 0 ? Math.round(totalCalories / filteredWorkouts.length) : 0
  const bestWorkout = filteredWorkouts.reduce((max, w) => Number(w.calories) > Number(max.calories ?? 0) ? w : max, filteredWorkouts[0] ?? {})

  if (!logged) {
    return authPage === 'login' ? <Login setAuthPage={setAuthPage} /> : <Register setAuthPage={setAuthPage} />
  }

  // Navigation Bar V3
  const Navbar = () => (
    <nav className="w-full border-b border-white/10 bg-black p-4 flex gap-6 items-center justify-center font-bold tracking-widest uppercase text-xs">
        <button 
           onClick={() => setCurrentView('dashboard')} 
           className={`transition-colors ${currentView === 'dashboard' ? 'text-primary border-b-2 border-primary pb-1' : 'text-white/50 hover:text-white'}`}>
             Terminal
        </button>
        <button 
           onClick={() => setCurrentView('leaderboard')} 
           className={`transition-colors ${currentView === 'leaderboard' ? 'text-primary border-b-2 border-primary pb-1' : 'text-white/50 hover:text-white'}`}>
             Multiplayer
        </button>
        <button 
           onClick={() => setLogged(null)} 
           className="text-red-500 hover:text-red-400 absolute right-6 border-b border-transparent pb-1">
             Abort
        </button>
    </nav>
  );

  return (
    <div className={`min-h-screen font-sans selection:bg-primary selection:text-black ${shellTheme}`}>
        <Navbar />
        {currentView === 'leaderboard' ? (
            <Leaderboard />
        ) : (
      <div className={`p-4 sm:p-5 md:p-6`}>
        <div className={`mx-auto max-w-5xl px-2 py-5 sm:px-6 md:p-8 ${containerTheme}`}>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl uppercase">Fitness Tracker</h1>
              <p className="mt-2 text-sm text-primary md:text-base tracking-widest uppercase">System Online. Awaiting inputs.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <ProfileSettings />
              <button
                onClick={() => setLogged(null)}
                className="border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white transition duration-300 hover:bg-white/5 uppercase rounded-none"
              >
                Log out
              </button>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-sm text-white/50 uppercase">{dashboardMessage}</p>
            {loading && <p className="text-sm font-medium text-primary uppercase">Loading...</p>}
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className={`p-5 transition duration-300 hover:border-primary ${totalCardTheme}`}>
              <p className="text-sm uppercase tracking-[0.18em] text-primary">Total Calories</p>
              <p className="mt-3 text-3xl font-bold md:text-4xl">{totalCalories}</p>
            </div>
            <div className={`p-5 transition duration-300 hover:border-primary ${totalCardTheme}`}>
              <p className="text-sm uppercase tracking-[0.18em] text-primary">Total Duration</p>
              <p className="mt-3 text-3xl font-bold md:text-4xl">{totalDuration} min</p>
            </div>
            <div className={`p-5 transition duration-300 hover:border-primary ${totalCardTheme}`}>
              <p className="text-sm uppercase tracking-[0.18em] text-primary">Avg Calories</p>
              <p className="mt-3 text-3xl font-bold md:text-4xl">{avgCalories}</p>
            </div>
            <div className={`p-5 transition duration-300 hover:border-primary ${totalCardTheme}`}>
              <p className="text-sm uppercase tracking-[0.18em] text-primary">Best Workout</p>
              <p className="mt-3 text-xl font-bold md:text-2xl">{bestWorkout.exercise || 'N/A'}</p>
            </div>
          </div>

          <Dashboard workouts={filteredWorkouts} />
          <WorkoutForm />

          <div className={`mb-6 grid grid-cols-1 gap-3 border p-4 shadow-none md:grid-cols-[2fr_1fr_1fr] border-white/10 bg-black rounded-none`}>
            <input placeholder="Search exercise..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-3 text-white outline-none placeholder:text-white/30 focus:border-primary rounded-none" />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-3 text-white outline-none focus:border-primary rounded-none" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-3 text-white outline-none focus:border-primary rounded-none" />
          </div>

          <WorkoutList workouts={filteredWorkouts} />
        </div>
      </div>
     )}
    </div>
  )
}

export default App
