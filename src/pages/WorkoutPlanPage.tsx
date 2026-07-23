import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { WorkoutPlan } from '@/types'
import { workoutService } from '@/services/workoutService'
import { exerciseService } from '@/services/exerciseService'

export const WorkoutPlanPage = () => {
  const navigate = useNavigate()
  const [plan, setPlan] = useState<WorkoutPlan | null>(null)
  const [expandedDay, setExpandedDay] = useState<string | null>(null)

  useEffect(() => {
    const loadPlan = async () => {
      const user = JSON.parse(localStorage.getItem('fitflow_user') || '{}')
      if (user.id) {
        const activePlan = await workoutService.getActivePlan(user.id)
        setPlan(activePlan || null)
      }
    }
    loadPlan()
  }, [])

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">No Active Plan</h1>
          <p className="text-gray-400 mb-8">Complete your assessment to generate a personalized plan</p>
          <button
            onClick={() => navigate('/assessment')}
            className="btn-primary px-8 py-3 inline-block"
          >
            Start Assessment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[#ff6b35] hover:text-[#ff8555] mb-4 inline-block bg-none border-none cursor-pointer"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-5xl font-black text-white mb-2">📋 {plan.title}</h1>
          <p className="text-gray-400">{plan.description}</p>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="text-gray-300">
              <span className="font-bold text-[#ff6b35]">{plan.weeks}</span> weeks
            </div>
            <div className="text-gray-300">
              <span className="font-bold text-[#ff6b35]">{plan.daysPerWeek}</span> days/week
            </div>
            <div className="text-gray-300">
              <span className="font-bold text-[#ff6b35]">{plan.totalPlannedSessions}</span> total sessions
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black text-white">Progress</h2>
            <span className="text-[#ff6b35] font-bold">
              {plan.completedSessions} / {plan.totalPlannedSessions}
            </span>
          </div>
          <div className="h-2 bg-[#1a1f3a] rounded-full overflow-hidden border border-[#2d3355]/50">
            <div
              className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8555] transition-all duration-300"
              style={{
                width: `${(plan.completedSessions / plan.totalPlannedSessions) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white mb-6">Weekly Schedule</h2>

          {plan.schedule.slice(0, plan.daysPerWeek).map((day) => {
            const exerciseDetails = day.exercises.map((ex) => ({
              ...ex,
              name: exerciseService.getById(ex.exerciseId)?.name || ex.exerciseId,
            }))

            return (
              <div
                key={day.id}
                className="card cursor-pointer hover:border-[#ff6b35] transition"
                onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">💪</span>
                    <div>
                      <h3 className="text-lg font-black text-white">{day.day}</h3>
                      <p className="text-sm text-gray-400">{day.exercises.length} exercises</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#ff6b35]">{day.duration} min</p>
                    <p className="text-xs text-gray-400 capitalize">{day.intensity}</p>
                  </div>
                </div>

                {/* Expanded Exercises */}
                {expandedDay === day.id && (
                  <div className="mt-4 pt-4 border-t border-[#2d3355]/50 space-y-3">
                    {exerciseDetails.map((ex, idx) => (
                      <div
                        key={idx}
                        className="bg-[#0a0e27] rounded-lg p-3 border border-[#2d3355]/50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white">{ex.name}</h4>
                          <span className="text-xs bg-[#ff6b35]/20 text-[#ff6b35] px-2 py-1 rounded">
                            {ex.sets}x{ex.reps}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Rest: {ex.rest}s {ex.weight && `• Weight: ${ex.weight}kg`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-12">
          <button className="btn-primary flex-1 py-3">
            🚀 Start Today's Workout
          </button>
          <button
            onClick={() => navigate('/plan/customize')}
            className="btn-secondary flex-1 py-3"
          >
            ⚙️ Customize Plan
          </button>
        </div>
      </div>
    </div>
  )
}
