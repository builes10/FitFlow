import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { WorkoutSession } from '@/types'
import { trackingService } from '@/services/trackingService'
import { exerciseService } from '@/services/exerciseService'

export const WorkoutHistoryPage = () => {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('completed')

  useEffect(() => {
    const loadSessions = async () => {
      const user = JSON.parse(localStorage.getItem('fitflow_user') || '{}')
      if (user.id) {
        const allSessions = await trackingService.getUserSessions(user.id)
        setSessions(allSessions)
      }
    }
    loadSessions()
  }, [])

  const filteredSessions = sessions.filter((session) => {
    if (filter === 'completed') return session.completed
    if (filter === 'pending') return !session.completed
    return true
  })

  const sortedSessions = [...filteredSessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[#ff6b35] hover:text-[#ff8555] mb-4 inline-block bg-none border-none cursor-pointer"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-5xl font-black text-white mb-2">📚 Workout History</h1>
          <p className="text-gray-400">Track your completed and pending workouts</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-8">
          {(['all', 'completed', 'pending'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                filter === f
                  ? 'bg-[#ff6b35] text-white'
                  : 'bg-[#1a1f3a] text-gray-300 hover:bg-[#2d3355] border border-[#2d3355]/50'
              }`}
            >
              {f === 'all' ? '📊 All' : f === 'completed' ? '✅ Completed' : '⏳ Pending'}
            </button>
          ))}
          <div className="flex-1 text-right text-gray-400 text-sm pt-2">
            {sortedSessions.length} workout{sortedSessions.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {sortedSessions.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-400 text-lg mb-4">No workouts yet</p>
              <p className="text-gray-500 text-sm">Complete your first workout to see it here</p>
            </div>
          ) : (
            sortedSessions.map((session) => (
              <div
                key={session.id}
                className="card p-6 hover:shadow-lg hover:shadow-[#ff6b35]/20 transition cursor-pointer"
                onClick={() => navigate(`/workout/${session.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black text-white">
                        {session.exercises.length} Exercises
                      </h3>
                      {session.completed && (
                        <span className="bg-[#00ff88]/20 text-[#00ff88] px-3 py-1 rounded text-xs font-bold">
                          ✓ Completed
                        </span>
                      )}
                      {!session.completed && (
                        <span className="bg-[#ff6b35]/20 text-[#ff6b35] px-3 py-1 rounded text-xs font-bold">
                          ⏳ Pending
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {new Date(session.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at{' '}
                      {new Date(session.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#ff6b35] font-bold">{session.totalDuration} min</p>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                </div>

                {/* Exercises Preview */}
                <div className="flex flex-wrap gap-2">
                  {session.exercises.slice(0, 3).map((ex, idx) => (
                    <span key={idx} className="text-xs bg-[#0a0e27] text-gray-300 px-2 py-1 rounded">
                      {ex.name}
                    </span>
                  ))}
                  {session.exercises.length > 3 && (
                    <span className="text-xs text-gray-500 px-2 py-1">+{session.exercises.length - 3} more</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Summary */}
        {sessions.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card text-center p-6">
              <p className="text-3xl font-black text-[#ff6b35] mb-1">
                {sessions.filter((s) => s.completed).length}
              </p>
              <p className="text-gray-400 text-sm">Completed</p>
            </div>
            <div className="card text-center p-6">
              <p className="text-3xl font-black text-[#ff6b35] mb-1">
                {Math.round((sessions.filter((s) => s.completed).length / sessions.length) * 100)}%
              </p>
              <p className="text-gray-400 text-sm">Completion Rate</p>
            </div>
            <div className="card text-center p-6">
              <p className="text-3xl font-black text-[#ff6b35] mb-1">
                {sessions.reduce((sum, s) => sum + s.totalDuration, 0)}
              </p>
              <p className="text-gray-400 text-sm">Total Minutes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
