import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'
import { useAuth } from '@/contexts/AuthContext'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { currentUser: user, isLoading } = useAuth()

  const handleLogout = async () => {
    await authService.logout()
    localStorage.removeItem('fitflow_user')
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#ff6b35] border-t-[#ffed4e]"></div>
          <p className="text-gray-400 mt-4 text-lg font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      {/* Header */}
      <div className="bg-[#1a1f3a] border-b-2 border-[#ff6b35] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Welcome, <span className="text-[#ff6b35]">{user.name}</span>! 👋
              </h1>
              <p className="text-gray-500 text-base">Your FitFlow Dashboard</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto bg-[#ff6b35] hover:bg-[#ff8555] text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Fitness Level Card */}
          <div className="card hover:shadow-2xl hover:shadow-[#ff6b35]/50 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Fitness Level</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-3">
                  {user.fitnessLevel.charAt(0).toUpperCase() + user.fitnessLevel.slice(1)}
                </p>
              </div>
              <div className="text-5xl sm:text-6xl group-hover:scale-125 transition">💪</div>
            </div>
          </div>

          {/* Days Per Week Card */}
          <div className="card hover:shadow-2xl hover:shadow-[#ff6b35]/50 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Training Days</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-3">{user.daysPerWeek}x/week</p>
              </div>
              <div className="text-5xl sm:text-6xl group-hover:scale-125 transition">📅</div>
            </div>
          </div>

          {/* Preferred Time Card */}
          <div className="card hover:shadow-2xl hover:shadow-[#ff6b35]/50 group sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Preferred Time</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-3">
                  {user.preferredTrainingTime.charAt(0).toUpperCase() +
                    user.preferredTrainingTime.slice(1)}
                </p>
              </div>
              <div className="text-5xl sm:text-6xl group-hover:scale-125 transition">⏰</div>
            </div>
          </div>
        </div>

        {/* Assessment Status */}
        <div className="card p-8 sm:p-12 text-center hover:shadow-2xl hover:shadow-[#ff6b35]/30 border-2 border-[#ff6b35]/30">
          <div className="mb-8">
            <div className="text-7xl sm:text-8xl mb-6">📋</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {user.assessmentCompleted ? '✅ Assessment Complete' : 'Complete Your Assessment'}
            </h2>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
              {user.assessmentCompleted
                ? 'Your personalized plan is ready! View and start training.'
                : 'Take the fitness assessment to generate your personalized training plan'}
            </p>
          </div>

          {user.assessmentCompleted ? (
            <button
              onClick={() => navigate('/workout-plan')}
              className="btn-primary w-full sm:w-auto py-4 px-10 text-lg font-bold inline-block"
            >
              View My Plan
            </button>
          ) : (
            <button
              onClick={() => navigate('/assessment')}
              className="btn-primary w-full sm:w-auto py-4 px-10 text-lg font-bold inline-block"
            >
              Start Assessment
            </button>
          )}
        </div>

        {/* Tracking Section */}
        {user.assessmentCompleted && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/progress')}
              className="card p-6 hover:shadow-2xl hover:shadow-[#ff6b35]/30 transition text-left"
            >
              <p className="text-3xl mb-3">📈</p>
              <h3 className="font-bold text-lg text-white mb-2">Progress</h3>
              <p className="text-gray-400 text-sm">View your stats and achievements</p>
            </button>
            <button
              onClick={() => navigate('/history')}
              className="card p-6 hover:shadow-2xl hover:shadow-[#ff6b35]/30 transition text-left"
            >
              <p className="text-3xl mb-3">📚</p>
              <h3 className="font-bold text-lg text-white mb-2">History</h3>
              <p className="text-gray-400 text-sm">Track your completed workouts</p>
            </button>
          </div>
        )}

        {/* User Info */}
        <div className="mt-8 card border-2 border-[#ff6b35]/30 hover:border-[#ff6b35] transition">
          <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
            👤 Your Profile
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base">
            <div className="pb-4 border-b border-[#2d3355]">
              <dt className="text-gray-500 font-semibold text-sm uppercase tracking-wide">Email</dt>
              <dd className="text-white mt-2 break-all">{user.email}</dd>
            </div>
            <div className="pb-4 border-b border-[#2d3355]">
              <dt className="text-gray-500 font-semibold text-sm uppercase tracking-wide">Goals</dt>
              <dd className="text-[#ff6b35] mt-2 font-semibold">{user.goals.join(', ') || 'Not set'}</dd>
            </div>
            <div className="pb-4 border-b border-[#2d3355]">
              <dt className="text-gray-500 font-semibold text-sm uppercase tracking-wide">Member Since</dt>
              <dd className="text-white mt-2 font-semibold">{new Date(user.createdAt).toLocaleDateString()}</dd>
            </div>
            <div className="pb-4 border-b border-[#2d3355]">
              <dt className="text-gray-500 font-semibold text-sm uppercase tracking-wide">Injuries</dt>
              <dd className="text-white mt-2 font-semibold">
                {user.injuries.length === 0 ? 'None reported' : user.injuries.join(', ')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
