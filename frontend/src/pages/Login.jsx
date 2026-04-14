import { useState } from 'react'
import toast from 'react-hot-toast'
import { loginUser, registerUser } from '../services/api'

const initialForm = { email: '', password: '' }

export default function Login({ setLogged }) {
  const [form, setForm] = useState(initialForm)
  const [mode, setMode] = useState('login')
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (mode === 'register') {
      const response = await registerUser(form)

      if (response.data.status === 'registered') {
        setMessage('Account created. You can log in now.')
        setMode('login')
        setForm(initialForm)
        toast.success('Account created successfully')
        return
      }

      setMessage(
        response.data.status === 'exists'
          ? 'This email is already registered.'
          : 'Registration failed. Please try again.',
      )
      return
    }

    const response = await loginUser(form)

    if (response.data.status === 'success') {
      toast.success('Welcome back 👋')
      setLogged({
        id: response.data.userId,
        email: form.email,
      })
      return
    }

    setMessage('Wrong credentials')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_transparent_30%),linear-gradient(135deg,_#1d4ed8_0%,_#7c3aed_48%,_#db2777_100%)] p-6">
      <div className="w-full max-w-md rounded-[2rem] border border-white/20 bg-white/12 p-8 shadow-2xl shadow-indigo-950/35 backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
          Fitness Tracker
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-2 text-sm text-white/75">
          {mode === 'login'
            ? 'Log in to manage your workouts and progress.'
            : 'Register once, then start tracking your sessions.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl bg-white/75 p-3 text-gray-900 outline-none transition duration-300 placeholder:text-gray-500 focus:bg-white"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl bg-white/75 p-3 text-gray-900 outline-none transition duration-300 placeholder:text-gray-500 focus:bg-white"
          />

          {message ? <p className="text-sm text-white/80">{message}</p> : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition duration-300 hover:scale-[1.01] hover:bg-indigo-700"
          >
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setMessage('')
            setForm(initialForm)
          }}
          className="mt-4 text-sm font-medium text-white/85 transition hover:text-white"
        >
          {mode === 'login'
            ? 'Need an account? Register'
            : 'Already registered? Log in'}
        </button>
      </div>
    </div>
  )
}
