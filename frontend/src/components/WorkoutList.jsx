import { useState } from 'react'
import toast from 'react-hot-toast'

export default function WorkoutList({
  workouts,
  onDeleteWorkout,
  onUpdateWorkout,
  dark,
}) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    id: '',
    exercise: '',
    duration: '',
    calories: '',
    date: '',
  })

  const startEditing = (workout) => {
    setEditing(workout.id)
    setForm({
      id: workout.id,
      exercise: workout.exercise,
      duration: workout.duration,
      calories: workout.calories,
      date: workout.date,
    })
  }

  const handleSave = async () => {
    if (!form.exercise || !form.duration || !form.calories || !form.date) {
      toast.error('Complete all workout fields before saving.')
      return
    }

    try {
      await onUpdateWorkout(form)
      setEditing(null)
      toast.success('Workout updated ✨')
    } catch (error) {
      toast.error('Unable to update workout right now.')
    }
  }

  if (workouts.length === 0) {
    return (
      <div
        className={`rounded-3xl border p-8 text-center shadow-lg backdrop-blur-md ${
          dark
            ? 'border-white/10 bg-white/8 text-white/80 shadow-black/40'
            : 'border-white/20 bg-white/18 text-white/80 shadow-black/15'
        }`}
      >
        <p className="text-lg font-semibold">No workouts yet 😢</p>
        <p className="mt-2 text-sm opacity-70">
          Start by adding your first workout or adjusting your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className={`flex flex-col gap-4 rounded-2xl border p-5 shadow-lg backdrop-blur-md transition duration-300 hover:scale-[1.02] md:flex-row md:items-center md:justify-between ${
            dark
              ? 'border-white/10 bg-white/8 shadow-black/40'
              : 'border-white/20 bg-white/18 shadow-black/15'
          }`}
        >
          {editing === workout.id ? (
            <>
              <div className="grid flex-1 gap-2 md:grid-cols-2">
                <input
                  value={form.exercise}
                  onChange={(event) =>
                    setForm({ ...form, exercise: event.target.value })
                  }
                  className="rounded-xl bg-white/75 p-3 text-gray-900 outline-none transition duration-300 placeholder:text-gray-500 focus:bg-white"
                  placeholder="Exercise"
                />
                <input
                  value={form.duration}
                  onChange={(event) =>
                    setForm({ ...form, duration: event.target.value })
                  }
                  className="rounded-xl bg-white/75 p-3 text-gray-900 outline-none transition duration-300 placeholder:text-gray-500 focus:bg-white"
                  placeholder="Duration"
                />
                <input
                  value={form.calories}
                  onChange={(event) =>
                    setForm({ ...form, calories: event.target.value })
                  }
                  className="rounded-xl bg-white/75 p-3 text-gray-900 outline-none transition duration-300 placeholder:text-gray-500 focus:bg-white"
                  placeholder="Calories"
                />
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm({ ...form, date: event.target.value })
                  }
                  className="rounded-xl bg-white/75 p-3 text-gray-900 outline-none transition duration-300 focus:bg-white"
                />
              </div>

              <div className="flex gap-2 self-start md:self-center">
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition duration-300 hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-lg bg-white/70 px-4 py-2 font-medium text-gray-800 transition duration-300 hover:bg-white"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {workout.exercise}
                </h3>
                <p className="text-sm text-white/80">
                  {workout.duration} min | {workout.calories} cal
                </p>
                <p className="text-sm text-white/65">{workout.date}</p>
              </div>

              <div className="flex gap-2 self-start md:self-center">
                <button
                  onClick={() => startEditing(workout)}
                  className="mr-2 rounded-lg bg-yellow-500 px-3 py-2 font-medium text-white transition duration-300 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    try {
                      await onDeleteWorkout(workout.id)
                      toast('Workout deleted ❌')
                    } catch (error) {
                      toast.error('Unable to delete workout right now.')
                    }
                  }}
                  className="rounded-lg bg-red-500 px-3 py-2 font-medium text-white transition duration-300 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
