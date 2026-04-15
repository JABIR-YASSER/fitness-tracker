import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import useWorkoutStore from '../store/useWorkoutStore';
import toast from 'react-hot-toast'

// Changed exercise to exercise_id, removed calories as backend automates it
const initialForm = { exercise_id: '', duration: '', date: '', sets: '', reps: '', weight_lifted: '' }

export default function WorkoutForm() {
  const [form, setForm] = useState(initialForm)
  const [openCombo, setOpenCombo] = useState(false)
  const exercises = useWorkoutStore((state) => state.exercises);
  const addWorkout = useWorkoutStore((state) => state.addWorkout);
  const fetchProfile = useWorkoutStore((state) => state.fetchProfile); // To update XP immediately

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const selectedEx = exercises.find((el) => String(el.id) === String(form.exercise_id));
  const isStrength = selectedEx?.type === 'Strength';

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.exercise_id || !form.date) {
      toast.error('Select an exercise and a date.')
      return
    }
    if (isStrength && (!form.sets || !form.reps || !form.weight_lifted)) {
      toast.error('Complete Sets, Reps and Weight for Strength training.')
      return
    }
    if (!isStrength && !form.duration) {
      toast.error('Complete Duration for Cardio training.')
      return
    }

    try {
      await addWorkout(form)
      setForm(initialForm)
      toast.success('Workout logged! 💪')
      fetchProfile() // Refresh XP
    } catch {
      toast.error('Unable to save workout right now.')
    }
  }

  return (
    <Card className="mb-6 rounded-none border border-white/10 bg-black shadow-none text-white overflow-visible z-10">
      <CardHeader>
        <CardTitle className="uppercase text-primary font-bold tracking-widest text-sm">Add a workout</CardTitle>
        <CardDescription className="text-white/50 uppercase text-xs tracking-wider">Strength or Cardio dynamically adapted.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className={`grid grid-cols-1 md:grid-cols-${isStrength ? '5' : '3'} gap-3`}>
            
            <Popover open={openCombo} onOpenChange={setOpenCombo}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombo}
                  className="rounded-none border border-white/10 bg-zinc-900 justify-between text-white uppercase tracking-widest hover:bg-zinc-800 hover:text-white"
                >
                  {form.exercise_id
                    ? exercises.find((el) => String(el.id) === String(form.exercise_id))?.name
                    : "Select Catalog..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0 rounded-none border border-primary bg-black text-white">
                <Command>
                  <CommandInput placeholder="Search catalog..." />
                  <CommandList>
                    <CommandEmpty>No exercise found.</CommandEmpty>
                    <CommandGroup>
                      {exercises.map((el) => (
                        <CommandItem
                          key={el.id}
                          value={el.name}
                          onSelect={() => {
                            setForm((curr) => ({ ...curr, exercise_id: el.id }))
                            setOpenCombo(false)
                          }}
                          className="hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer"
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${String(form.exercise_id) === String(el.id) ? "opacity-100 text-primary" : "opacity-0"}`}
                          />
                          {el.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {isStrength ? (
              <>
                <Input name="sets" placeholder="SETS" type="number" value={form.sets} onChange={handleChange} className="rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white placeholder:text-white/30" />
                <Input name="reps" placeholder="REPS" type="number" value={form.reps} onChange={handleChange} className="rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white placeholder:text-white/30" />
                <Input name="weight_lifted" placeholder="WEIGHT" type="number" step="0.5" value={form.weight_lifted} onChange={handleChange} className="rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white placeholder:text-white/30" />
              </>
            ) : (
                <Input name="duration" placeholder="DURATION (MIN)" type="number" value={form.duration} onChange={handleChange} className="rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white placeholder:text-white/30" />
            )}

            <Input name="date" type="date" value={form.date} onChange={handleChange} className="rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white" />
          </div>
          <Button type="submit" className="w-full rounded-none bg-primary text-black hover:bg-primary/80 uppercase tracking-widest font-bold">Add Workout</Button>
        </form>
      </CardContent>
    </Card>
  )
}
