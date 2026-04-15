import { useMemo } from 'react';
import useWorkoutStore from '../store/useWorkoutStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Activity } from 'lucide-react';

export default function AnatomyHeatmap() {
  const workouts = useWorkoutStore((state) => state.workouts);
  const exercises = useWorkoutStore((state) => state.exercises);

  const muscleHits = useMemo(() => {
    const hits = { 'Chest': 0, 'Back': 0, 'Legs': 0, 'Arms': 0, 'Core': 0, 'Shoulders': 0 };
    // Filter last 7 days
    const aWeekAgo = new Date();
    aWeekAgo.setDate(aWeekAgo.getDate() - 7);
    const dateLimit = aWeekAgo.toISOString().split('T')[0];

    workouts.forEach(w => {
      if (w.date >= dateLimit) {
        const ex = exercises.find(e => String(e.id) === String(w.exercise_id));
        if (ex && ex.target_muscle && hits[ex.target_muscle] !== undefined) {
          hits[ex.target_muscle] += (w.sets ? Number(w.sets) : 1);
        }
      }
    });
    return hits;
  }, [workouts, exercises]);

  const maxHits = Math.max(...Object.values(muscleHits), 1);

  // Helper to get fill color with opacity mapped to intensity
  const getFill = (muscle) => {
    const intensity = muscleHits[muscle] / maxHits;
    if (intensity === 0) return '#18181b'; // zinc-900 baseline
    return `rgba(204, 255, 0, ${Math.max(0.2, intensity)})`;
  };

  return (
    <Card className="rounded-none border border-white/10 bg-black shadow-none text-white h-full relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="uppercase text-primary font-bold tracking-widest text-sm flex items-center gap-2">
            <Activity className="w-4 h-4" /> Cyber-Anatomy
        </CardTitle>
        <CardDescription className="text-white/50 uppercase text-xs tracking-wider">7-Day Muscular Stress Heatmap</CardDescription>
      </CardHeader>
      <CardContent className="h-64 flex items-center justify-center relative">
        <svg viewBox="0 0 200 300" width="100%" height="100%" className="max-h-[250px] drop-shadow-2xl">
          {/* A Cybernetic Abstract Humanoid SVG */}
          <g id="Head" fill="#27272a" stroke="#ccff00" strokeWidth="0.5" opacity="0.3">
             <circle cx="100" cy="30" r="15" />
          </g>
          
          <g id="Shoulders">
             <rect x="55" y="55" width="25" height="20" rx="3" fill={getFill('Shoulders')} stroke="#3f3f46" />
             <rect x="120" y="55" width="25" height="20" rx="3" fill={getFill('Shoulders')} stroke="#3f3f46" />
          </g>
          
          <g id="Chest">
             <path d="M70,80 L130,80 L125,120 L75,120 Z" fill={getFill('Chest')} stroke="#3f3f46" />
          </g>
          
          <g id="Core">
             <path d="M75,125 L125,125 L120,165 L80,165 Z" fill={getFill('Core')} stroke="#3f3f46" />
          </g>

          <g id="Arms">
             <rect x="50" y="80" width="18" height="60" rx="5" fill={getFill('Arms')} stroke="#3f3f46" />
             <rect x="132" y="80" width="18" height="60" rx="5" fill={getFill('Arms')} stroke="#3f3f46" />
          </g>
          
          <g id="Back" opacity="0">
             {/* Back overlaps chest visually in a 2D front view, usually represented via distinct toggle, we map it as an outline or background layer */}
          </g>
          <g id="Back-Indicators" transform="translate(0, 10)">
              {/* Floating back nodes to indicate back engagement behind chest */}
             <circle cx="65" cy="100" r="4" fill={getFill('Back')} />
             <circle cx="135" cy="100" r="4" fill={getFill('Back')} />
          </g>

          <g id="Legs">
             <rect x="80" y="170" width="18" height="80" rx="4" fill={getFill('Legs')} stroke="#3f3f46" />
             <rect x="102" y="170" width="18" height="80" rx="4" fill={getFill('Legs')} stroke="#3f3f46" />
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute right-4 bottom-4 flex flex-col gap-1 text-[10px] font-mono uppercase tracking-widest text-white/50">
            {Object.keys(muscleHits).map(m => (
                <div key={m} className={`flex items-center gap-2 ${muscleHits[m] > 0 ? 'text-white' : ''}`}>
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: getFill(m), border: '1px solid #3f3f46' }}></div>
                    {m} : {muscleHits[m]}
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
