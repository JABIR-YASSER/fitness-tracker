import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Dashboard({ workouts, dark }) {
  const weeklyData = workouts.reduce((acc, workout) => {
    const day = new Date(workout.date).toLocaleDateString('en-US', {
      weekday: 'short',
    })
    const existingDay = acc.find((item) => item.day === day)

    if (existingDay) {
      existingDay.calories += Number(workout.calories)
    } else {
      acc.push({ day, calories: Number(workout.calories) })
    }

    return acc
  }, [])

  const sortedWeeklyData = dayOrder.map(
    (day) =>
      weeklyData.find((item) => item.day === day) ?? { day, calories: 0 },
  )

  const progressData = [...workouts]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((workout) => ({
      date: workout.date,
      calories: Number(workout.calories),
    }))

  const chartStroke = dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.18)'
  const tickColor = dark ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.88)'
  const barColor = dark ? '#38bdf8' : '#818cf8'
  const lineColor = dark ? '#f59e0b' : '#f472b6'

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="rounded-3xl border border-white/20 bg-white/18 p-5 shadow-lg shadow-black/15 backdrop-blur-md dark:border-white/10 dark:bg-white/8 dark:shadow-black/40">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Weekly Calories
        </h2>
        <p className="mb-4 text-sm text-white/70">
          A quick view of how your training load is spread across the week.
        </p>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedWeeklyData}>
              <CartesianGrid
                stroke={chartStroke}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis dataKey="day" tick={{ fill: tickColor, fontSize: 12 }} />
              <YAxis tick={{ fill: tickColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  color: '#fff',
                }}
                cursor={{ fill: 'rgba(255,255,255,0.08)' }}
              />
              <Bar dataKey="calories" fill={barColor} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl border border-white/20 bg-white/18 p-5 shadow-lg shadow-black/15 backdrop-blur-md dark:border-white/10 dark:bg-white/8 dark:shadow-black/40">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Progress Over Time
        </h2>
        <p className="mb-4 text-sm text-white/70">
          Follow your calorie trend over your workout timeline.
        </p>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <CartesianGrid
                stroke={chartStroke}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis dataKey="date" tick={{ fill: tickColor, fontSize: 12 }} />
              <YAxis tick={{ fill: tickColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="calories"
                stroke={lineColor}
                strokeWidth={3}
                dot={{ r: 4, fill: lineColor }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
