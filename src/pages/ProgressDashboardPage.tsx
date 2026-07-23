import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { trackingService } from '@/services/trackingService'
import { exerciseService } from '@/services/exerciseService'

export const ProgressDashboardPage = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const loadStats = async () => {
      const user = JSON.parse(localStorage.getItem('fitflow_user') || '{}')
      if (user.id) {
        const userStats = await trackingService.getUserStats(user.id)
        setStats(userStats)
      }
    }
    loadStats()
  }, [])

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  const completionRate =
    stats.totalWorkoutsCompleted > 0 ? Math.round((stats.totalWorkoutsCompleted / 48) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[#ff6b35] hover:text-[#ff8555] mb-4 inline-block bg-none border-none cursor-pointer"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-5xl font-black text-white mb-2">📈 Progress Dashboard</h1>
          <p className="text-gray-400">Track your fitness journey over time</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Workouts Completed */}
          <div className="card p-6 text-center">
            <p className="text-4xl font-black text-[#ff6b35] mb-2">
              {stats.totalWorkoutsCompleted}
            </p>
            <p className="text-gray-400 text-sm font-bold">Workouts Completed</p>
            <p className="text-xs text-gray-500 mt-2">Out of 48 planned</p>
          </div>

          {/* Completion Rate */}
          <div className="card p-6 text-center">
            <p className="text-4xl font-black text-[#ff6b35] mb-2">{completionRate}%</p>
            <p className="text-gray-400 text-sm font-bold">Completion Rate</p>
            <div className="mt-3 h-1 bg-[#1a1f3a] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8555]"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Consistency Streak */}
          <div className="card p-6 text-center">
            <p className="text-4xl font-black text-[#ff6b35] mb-2">
              {stats.consistencyStreak}
            </p>
            <p className="text-gray-400 text-sm font-bold">Day Streak</p>
            <p className="text-xs text-gray-500 mt-2">Keep it going! 🔥</p>
          </div>

          {/* Total Volume */}
          <div className="card p-6 text-center">
            <p className="text-4xl font-black text-[#ff6b35] mb-2">
              {stats.totalVolumeLifted}
            </p>
            <p className="text-gray-400 text-sm font-bold">Total Reps</p>
            <p className="text-xs text-gray-500 mt-2">All exercises</p>
          </div>
        </div>

        {/* Favorite Exercises */}
        {stats.favoriteExercises.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-black text-white mb-6">⭐ Top Exercises</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.favoriteExercises.slice(0, 6).map((exId: string, idx: number) => {
                const ex = exerciseService.getById(exId)
                return (
                  <div key={idx} className="bg-[#0a0e27] rounded-lg p-4 border border-[#2d3355]/50">
                    <p className="text-2xl font-black text-[#ff6b35] mb-1">#{idx + 1}</p>
                    <p className="font-bold text-white">{ex?.name || exId}</p>
                    <p className="text-xs text-gray-500 mt-1">{ex?.muscleGroups.join(', ')}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Workout History Link */}
        <div className="card p-8 text-center">
          <h3 className="text-xl font-black text-white mb-3">View Detailed History</h3>
          <p className="text-gray-400 mb-6">Check all your completed and pending workouts</p>
          <button
            onClick={() => navigate('/history')}
            className="btn-primary px-8 py-3 inline-block"
          >
            📚 Go to Workout History
          </button>
        </div>

        {/* Motivational Message */}
        {stats.totalWorkoutsCompleted === 0 && (
          <div className="card p-8 text-center mt-8 border-2 border-[#ff6b35]/30">
            <p className="text-2xl font-black text-white mb-3">Get Started! 🚀</p>
            <p className="text-gray-400 mb-6">Complete your first workout to start tracking progress</p>
            <button
              onClick={() => navigate('/workout-plan')}
              className="btn-primary px-8 py-3 inline-block"
            >
              Start First Workout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
