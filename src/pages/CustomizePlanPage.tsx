import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { WorkoutPlan, WorkoutDay, ExerciseInWorkout } from '@/types'
import { workoutService } from '@/services/workoutService'
import { exerciseService } from '@/services/exerciseService'
import { ExerciseSelector } from '@/components/ExerciseSelector'
import { VolumeAdjuster } from '@/components/VolumeAdjuster'

export const CustomizePlanPage = () => {
  const navigate = useNavigate()
  const [plan, setPlan] = useState<WorkoutPlan | null>(null)
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null)
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null)
  const [showExerciseSelector, setShowExerciseSelector] = useState(false)
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const loadPlan = async () => {
      const user = JSON.parse(localStorage.getItem('fitflow_user') || '{}')
      if (user.id) {
        const activePlan = await workoutService.getActivePlan(user.id)
        if (activePlan) {
          setPlan(activePlan)
          setSelectedDay(activePlan.schedule[0] || null)
        }
      }
    }
    loadPlan()
  }, [])

  if (!plan || !selectedDay) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">No Plan Found</h1>
          <button
            onClick={() => navigate('/workout-plan')}
            className="btn-primary px-8 py-3"
          >
            Back to Plan
          </button>
        </div>
      </div>
    )
  }

  const handleExerciseSwap = (dayId: string, exerciseIndex: number, newExerciseId: string) => {
    if (!plan) return

    const updatedSchedule = plan.schedule.map((day) => {
      if (day.id === dayId) {
        const updatedExercises = [...day.exercises]
        updatedExercises[exerciseIndex] = {
          ...updatedExercises[exerciseIndex],
          exerciseId: newExerciseId,
        }
        return { ...day, exercises: updatedExercises }
      }
      return day
    })

    const updatedPlan = { ...plan, schedule: updatedSchedule, updatedAt: new Date() }
    setPlan(updatedPlan)
    setSelectedDay(updatedPlan.schedule.find((d) => d.id === dayId) || null)
    setShowExerciseSelector(false)
    setHasChanges(true)
  }

  const handleVolumeChange = (
    dayId: string,
    exerciseIndex: number,
    updates: Partial<ExerciseInWorkout>
  ) => {
    if (!plan) return

    const updatedSchedule = plan.schedule.map((day) => {
      if (day.id === dayId) {
        const updatedExercises = [...day.exercises]
        updatedExercises[exerciseIndex] = {
          ...updatedExercises[exerciseIndex],
          ...updates,
        }
        return { ...day, exercises: updatedExercises }
      }
      return day
    })

    const updatedPlan = { ...plan, schedule: updatedSchedule, updatedAt: new Date() }
    setPlan(updatedPlan)
    setSelectedDay(updatedPlan.schedule.find((d) => d.id === dayId) || null)
    setHasChanges(true)
  }

  const handleSavePlan = async () => {
    if (plan) {
      await workoutService.savePlan(plan)
      setHasChanges(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/workout-plan')}
            className="text-[#ff6b35] hover:text-[#ff8555] mb-4 inline-block"
          >
            ← Back to Plan
          </button>
          <h1 className="text-5xl font-black text-white mb-2">⚙️ Customize Plan</h1>
          <p className="text-gray-400">Modify exercises, sets, reps, and rest periods</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Day Selector */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-black text-white mb-4">Select Day</h3>
            <div className="space-y-2">
              {plan.schedule.slice(0, plan.daysPerWeek).map((day) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day)}
                  className={`w-full p-3 rounded-lg text-left font-bold transition ${
                    selectedDay.id === day.id
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-[#1a1f3a] text-gray-300 hover:bg-[#2d3355] border border-[#2d3355]/50'
                  }`}
                >
                  {day.day}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Editor */}
          <div className="lg:col-span-3">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-white">
                  📋 {selectedDay?.day} Workout
                </h2>
                <span className="text-sm bg-[#ff6b35]/20 text-[#ff6b35] px-3 py-1 rounded font-bold">
                  {selectedDay?.exercises.length} exercises • {selectedDay?.duration} min
                </span>
              </div>

              {/* Exercises */}
              <div className="space-y-4">
                {selectedDay?.exercises.map((exercise, idx) => {
                  const exerciseInfo = exerciseService.getById(exercise.exerciseId)
                  return (
                    <div key={idx} className="bg-[#0a0e27] rounded-xl p-4 border border-[#2d3355]/50">
                      {/* Exercise Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-400 mb-1">Exercise {idx + 1}</p>
                          <button
                            onClick={() => {
                              setEditingExerciseIndex(idx)
                              setEditingExerciseId(exercise.exerciseId)
                              setShowExerciseSelector(true)
                            }}
                            className="text-lg font-black text-white hover:text-[#ff6b35] transition text-left"
                          >
                            {exerciseInfo?.name || 'Unknown Exercise'}
                          </button>
                          {exerciseInfo && (
                            <p className="text-xs text-gray-500 mt-1">
                              {exerciseInfo.muscleGroups.join(' • ')}
                            </p>
                          )}
                        </div>
                        <span className="text-xs bg-[#ff6b35]/20 text-[#ff6b35] px-2 py-1 rounded font-bold">
                          {exercise.sets}x{exercise.reps}
                        </span>
                      </div>

                      {/* Volume Adjuster */}
                      <VolumeAdjuster
                        sets={exercise.sets}
                        reps={exercise.reps}
                        rest={exercise.rest}
                        onSetsChange={(newSets) =>
                          handleVolumeChange(selectedDay.id, idx, { sets: newSets })
                        }
                        onRepsChange={(newReps) =>
                          handleVolumeChange(selectedDay.id, idx, { reps: newReps })
                        }
                        onRestChange={(newRest) =>
                          handleVolumeChange(selectedDay.id, idx, { rest: newRest })
                        }
                      />
                    </div>
                  )
                })}
              </div>

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-[#2d3355]/50">
                <button
                  onClick={handleSavePlan}
                  disabled={!hasChanges}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition ${
                    hasChanges
                      ? 'btn-primary'
                      : 'bg-[#2d3355] text-gray-400 cursor-not-allowed'
                  }`}
                >
                  💾 Save Changes
                </button>
                {hasChanges && (
                  <p className="text-sm text-[#ff6b35] mt-3 text-center">
                    You have unsaved changes
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Selector Modal */}
        {showExerciseSelector && editingExerciseIndex !== null && (
          <ExerciseSelector
            currentExerciseId={editingExerciseId || ''}
            onSelect={(exerciseId) =>
              handleExerciseSwap(selectedDay.id, editingExerciseIndex, exerciseId)
            }
            onClose={() => setShowExerciseSelector(false)}
          />
        )}
      </div>
    </div>
  )
}
