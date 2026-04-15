import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import useWorkoutStore from '../store/useWorkoutStore';
import AITrainerCard from './AITrainerCard';
import RankBadge from './RankBadge';
import RoutinesPanel from './RoutinesPanel';
import AnatomyHeatmap from './AnatomyHeatmap';

const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Dashboard({ workouts }) {
  const profile = useWorkoutStore((state) => state.profile);

  const weeklyData = workouts.reduce((acc, workout) => {
    const day = new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short' })
    const existingDay = acc.find((item) => item.day === day)
    if (existingDay) existingDay.calories += Number(workout.calories)
    else acc.push({ day, calories: Number(workout.calories) })
    return acc
  }, [])

  const sortedWeeklyData = dayOrder.map(day => weeklyData.find((item) => item.day === day) ?? { day, calories: 0 })
  const progressData = [...workouts].sort((a, b) => new Date(a.date) - new Date(b.date)).map(workout => ({ date: workout.date, calories: Number(workout.calories) }))

  const chartStroke = 'rgba(255,255,255,0.1)'
  const tickColor = 'rgba(255,255,255,0.5)'
  const barColor = '#ccff00'
  const lineColor = '#ccff00'

  const weight = profile?.weight ? Number(profile.weight) : null;
  const height = profile?.height ? Number(profile.height) : null;
  const bmi = weight && height ? (weight / Math.pow(height / 100, 2)).toFixed(1) : 'N/A';

  const todayStr = new Date().toISOString().split('T')[0];
  const totalCaloriesToday = workouts.filter(w => w.date === todayStr).reduce((sum, w) => sum + Number(w.calories), 0);
  const calorieGoal = profile?.daily_calorie_goal || 2000;
  const calorieProgress = Math.min((totalCaloriesToday / calorieGoal) * 100, 100);

  return (
    <>
      <div className="mb-6">
        <RankBadge workoutsCount={workouts.length} xpPoints={profile?.xp_points} />
      </div>
      
      <RoutinesPanel />

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Goals & BMI */}
        <div className="col-span-1 md:col-span-2 grid grid-rows-2 gap-4">
            <Card className="rounded-none border border-white/10 bg-black shadow-none text-white h-full">
            <CardHeader>
                <CardTitle className="uppercase text-primary font-bold tracking-widest text-sm">Daily Goal & BMI</CardTitle>
                <CardDescription className="text-white/50 uppercase text-xs tracking-wider">Tracking your personal metrics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                <p className="text-sm font-medium mb-1 uppercase tracking-widest">Calories Today: {totalCaloriesToday} / {calorieGoal}</p>
                <div className="w-full bg-zinc-900 border border-white/10 h-3 flex">
                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${calorieProgress}%` }}></div>
                </div>
                </div>
                <div>
                <p className="text-sm font-medium uppercase tracking-widest">BMI: <span className="text-lg font-bold text-primary">{bmi}</span></p>
                </div>
            </CardContent>
            </Card>

            <AITrainerCard />
        </div>

        {/* AI Heatmap Card */}
        <div className="col-span-1 border-white/10">
            <AnatomyHeatmap />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="rounded-none border border-white/10 bg-black shadow-none text-white">
          <CardHeader>
            <CardTitle className="uppercase text-primary font-bold tracking-widest text-sm">Weekly Calories</CardTitle>
            <CardDescription className="text-white/50 uppercase text-xs tracking-wider">A quick view of how your training load is spread across the week.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedWeeklyData}>
                <CartesianGrid stroke={chartStroke} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: tickColor, fontSize: 12 }} />
                <YAxis tick={{ fill: tickColor, fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #ccff00', borderRadius: '0px', color: '#fff' }} cursor={{ fill: 'rgba(204,255,0,0.1)' }} />
                <Bar dataKey="calories" fill={barColor} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none border border-white/10 bg-black shadow-none text-white">
          <CardHeader>
            <CardTitle className="uppercase text-primary font-bold tracking-widest text-sm">Progress Over Time</CardTitle>
            <CardDescription className="text-white/50 uppercase text-xs tracking-wider">Follow your calorie trend over your workout timeline.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid stroke={chartStroke} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: tickColor, fontSize: 12 }} />
                <YAxis tick={{ fill: tickColor, fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #ccff00', borderRadius: '0px', color: '#fff' }} />
                <Line type="monotone" dataKey="calories" stroke={lineColor} strokeWidth={2} dot={{ r: 4, fill: '#000', stroke: lineColor, strokeWidth: 2 }} activeDot={{ r: 6, fill: lineColor }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
