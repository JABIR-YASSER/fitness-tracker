import { useState } from 'react'
import toast from 'react-hot-toast'

const initialForm = {
  exercise: '',
  duration: '',
  calories: '',
  date: '',
}

export default function WorkoutForm({ onCreateWorkout, dark }) {
  const [form, setForm] = useState(initialForm)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.exercise || !form.duration || !form.calories || !form.date) {
      toast.error('Fill in every field before saving the workout.')
      return
    }

    try {
      await onCreateWorkout(form)
      setForm(initialForm)
      toast.success('Workout added 💪')
    } catch (error) {
      toast.error('Unable to save workout right now.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mb-6 rounded-3xl border p-5 shadow-lg backdrop-blur-md ${
        dark
          ? 'border-white/10 bg-white/8 shadow-black/40'
          : 'border-white/20 bg-white/18 shadow-black/15'
      }`}
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Add a workout</h2>
        <p className="mt-1 text-sm text-white/70">
          Log your session and keep the dashboard fresh.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          name="exercise"
          className="w-full rounded-xl bg-white/75 p-3 text-gray-900 outline-none transition duration-300 placeholder:text-gray-500 focus:bg-white"
          placeholder="Exercise"
          value={form.exercise}
          onChange={handleChange}
        />
        <input
          name="duration"
          className="w-full rounded-xl bg-white/75 p-3 text-gray-900 outline-none transition duration-300 placeholder:text-gray-500 focus:bg-white"
          placeholder="Duration (min)"
          value={form.duration}
          onChange={handleChange}
        />
        <input
          name="calories"
          className="w-full rounded-xl bg-white/75 p-3 text-gray-900 outline-none transition duration-300 placeholder:text-gray-500 focus:bg-white"
          placeholder="Calories"
          value={form.calories}
          onChange={handleChange}
        />
        <input
          name="date"
          type="date"
          className="w-full rounded-xl bg-white/75 p-3 text-gray-900 outline-none transition duration-300 focus:bg-white"
          value={form.date}
          onChange={handleChange}
        />
      </div>

      <button className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition duration-300 hover:scale-[1.01] hover:bg-indigo-700">
        Add Workout
      </button>
    </form>
  )
}
