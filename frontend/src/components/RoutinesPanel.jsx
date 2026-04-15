import { useState } from 'react';
import useWorkoutStore from '../store/useWorkoutStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { logRoutine } from '../services/api';
import toast from 'react-hot-toast';
import { Zap } from 'lucide-react';

export default function RoutinesPanel() {
  const routines = useWorkoutStore((state) => state.routines);
  const fetchWorkouts = useWorkoutStore((state) => state.fetchWorkouts);
  const fetchProfile = useWorkoutStore((state) => state.fetchProfile);
  const [loadingId, setLoadingId] = useState(null);

  if (!routines || routines.length === 0) return null;

  const handleLogRoutine = async (routineId) => {
    setLoadingId(routineId);
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await logRoutine({ routine_id: routineId, date: today });
      
      if (res.data?.status === 'success') {
          toast.success('Routine Bulk Logged! 🔥');
          await fetchWorkouts();
          await fetchProfile(); // for XP refresh
      } else {
          throw new Error('Fallback error trigger');
      }
    } catch {
      toast.error('Failed to log routine.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card className="rounded-none border border-white/10 bg-black shadow-none text-white mb-6">
      <CardHeader>
        <CardTitle className="uppercase text-primary font-bold tracking-widest text-sm flex items-center gap-2">
            <Zap className="w-4 h-4" /> Quick Templates
        </CardTitle>
        <CardDescription className="text-white/50 uppercase text-xs tracking-wider">Deploy complex regimens instantly.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
            {routines.map((routine) => (
                <Button 
                    key={routine.id}
                    onClick={() => handleLogRoutine(routine.id)}
                    disabled={loadingId === routine.id}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-black rounded-none uppercase tracking-widest font-bold"
                >
                    {loadingId === routine.id ? 'Logging...' : routine.name}
                </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
