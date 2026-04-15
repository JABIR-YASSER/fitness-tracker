import { useState } from 'react'
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { loginUser } from '../services/api'
import useWorkoutStore from '../store/useWorkoutStore';
import toast from 'react-hot-toast'

export default function Login({ setAuthPage }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const setLogged = useWorkoutStore(state => state.setLogged);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await loginUser(form)
      if (response.data.status === 'success') {
        toast.success('Welcome back 👋')
        // Met à jour explicitement le store qui va nous envoyer au dashboard
        setLogged({
          id: response.data.userId,
          email: form.email,
          token: response.data.token,
        })
      } else {
        toast.error('Wrong credentials')
      }
    } catch {
       // L'intercepteur affiche déjà le Toast pour l'erreur 401 ou le network
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
      <Card className="w-full max-w-md rounded-none border border-white/10 bg-black p-8 shadow-none text-white">
        <CardHeader className="p-0 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            System Auth
            </p>
            <CardTitle className="text-3xl font-extrabold uppercase tracking-tight text-white">
            Connection
            </CardTitle>
            <CardDescription className="text-white/50 text-xs tracking-widest uppercase mt-2">
            Enter credentials to access terminal
            </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                name="email"
                type="email"
                placeholder="EMAIL"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white placeholder:text-white/30"
            />
            <Input
                name="password"
                type="password"
                placeholder="PASSWORD"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white placeholder:text-white/30"
            />

            <Button
                type="submit"
                className="w-full rounded-none bg-primary text-black hover:bg-primary/80 uppercase tracking-widest font-bold mt-2"
            >
                Login
            </Button>
            </form>

            <Button
                variant="outline"
                onClick={() => setAuthPage('register')}
                className="mt-6 w-full rounded-none border-white/10 text-white hover:bg-white/10 uppercase tracking-widest text-xs h-10 bg-transparent transition-colors"
                >
            Need an account? Register
            </Button>
        </CardContent>
      </Card>
    </div>
  )
}
