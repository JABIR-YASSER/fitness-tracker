import { useState } from 'react'
import toast from 'react-hot-toast'
import useWorkoutStore from '../store/useWorkoutStore';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function WorkoutList({ workouts }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ id: '', exercise_id: '', duration: '', date: '', sets: '', reps: '', weight_lifted: '' })
  const updateWorkout = useWorkoutStore((state) => state.updateWorkout);
  const deleteWorkout = useWorkoutStore((state) => state.deleteWorkout);

  const exercises = useWorkoutStore((state) => state.exercises);
  const startEditing = (workout) => {
    setEditing(workout.id)
    setForm({ id: workout.id, exercise_id: workout.exercise_id, duration: workout.duration, date: workout.date, sets: workout.sets || '', reps: workout.reps || '', weight_lifted: workout.weight_lifted || '' })
  }

  const handleSave = async () => {
    if (!form.exercise_id || !form.date) {
      toast.error('Complete essential exercise fields before saving.')
      return
    }
    try {
      await updateWorkout(form)
      setEditing(null)
      toast.success('Workout updated ✨')
    } catch {
      toast.error('Unable to update workout right now.')
    }
  }

  if (workouts.length === 0) {
    return (
      <Card className="rounded-none border border-white/10 bg-black text-center p-8 shadow-none mt-4">
        <p className="text-lg font-bold text-primary uppercase tracking-widest">No workouts yet</p>
        <p className="mt-2 text-sm text-white/50 uppercase tracking-wider">Start by adding your first workout or adjusting your filters.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3 mt-4">
      {workouts.map((workout) => {
        const isStrength = workout.type === 'Strength';
        const volume = isStrength ? Number(workout.sets) * Number(workout.reps) * Number(workout.weight_lifted) : 0;
        const formIsStrength = exercises.find(ex => String(ex.id) === String(form.exercise_id))?.type === 'Strength';

        return (
          <Card key={workout.id} className="rounded-none border border-white/10 bg-black p-5 shadow-none hover:border-primary/50 transition-colors flex flex-col md:flex-row gap-4 items-center justify-between text-white">
            {editing === workout.id ? (
              <>
                <div className="grid flex-1 gap-2 md:grid-cols-4 w-full">
                  <select value={form.exercise_id} onChange={(e) => setForm({ ...form, exercise_id: e.target.value })} className="rounded-none border-white/10 bg-zinc-900 border p-2 focus-visible:ring-primary text-white">
                    <option value="" disabled>SELECT EXERCISE</option>
                    {exercises?.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                  </select>
                  
                  {formIsStrength ? (
                      <>
                        <Input value={form.sets} onChange={(e) => setForm({ ...form, sets: e.target.value })} placeholder="SETS" type="number" className="rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white" />
                        <Input value={form.reps} onChange={(e) => setForm({ ...form, reps: e.target.value })} placeholder="REPS" type="number" className="rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white" />
                        <Input value={form.weight_lifted} onChange={(e) => setForm({ ...form, weight_lifted: e.target.value })} placeholder="WEIGHT" type="number" step="0.5" className="rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white" />
                      </>
                  ) : (
                      <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="DURATION (MIN)" type="number" className="rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white col-span-2" />
                  )}
                  <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} type="date" className="rounded-none border-white/10 bg-zinc-900 focus-visible:ring-primary text-white" />
                </div>
                <div className="flex gap-2 self-start md:self-center w-full md:w-auto">
                  <Button onClick={handleSave} className="rounded-none bg-primary text-black hover:bg-primary/80 uppercase tracking-widest text-xs">Save</Button>
                  <Button variant="outline" onClick={() => setEditing(null)} className="rounded-none border-white/10 text-white hover:bg-white/10 uppercase tracking-widest text-xs">Cancel</Button>
                </div>
              </>
            ) : (
              <>
                <div className="w-full md:w-auto">
                  <h3 className="text-lg font-bold uppercase tracking-widest text-white">{workout.exercise}</h3>
                  {isStrength ? (
                     <p className="text-sm text-primary uppercase tracking-wider mt-1">{workout.sets} SETS | {workout.reps} REPS | {workout.weight_lifted} KG | VOL: {volume} KG</p>
                  ) : (
                     <p className="text-sm text-primary uppercase tracking-wider mt-1">{workout.duration} MIN | {workout.calories} CAL</p>
                  )}
                  <p className="text-xs text-white/50 tracking-widest mt-1">{workout.date}</p>
                </div>
              <div className="flex gap-2 self-start md:self-center">
                <Button variant="outline" onClick={() => startEditing(workout)} className="rounded-none border-primary text-primary hover:bg-primary hover:text-black uppercase tracking-widest text-xs transition-colors bg-transparent">Edit</Button>
                <Button variant="destructive" onClick={async () => {
                  try {
                    await deleteWorkout(workout.id)
                    toast('Workout deleted ❌')
                  } catch {
                    toast.error('Unable to delete workout right now.')
                  }
                }} className="rounded-none bg-red-600 hover:bg-red-700 text-white uppercase tracking-widest text-xs">Delete</Button>
              </div>
            </>
          )}
        </Card>
        );
      })}
    </div>
  )
}
