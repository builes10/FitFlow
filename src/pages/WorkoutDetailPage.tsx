import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { WorkoutSession, WorkoutSessionExercise } from '@/types'
import { trackingService } from '@/services/trackingService'
import { exerciseService } from '@/services/exerciseService'

export const WorkoutDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [editingSetIndex, setEditingSetIndex] = useState<{ exIdx: number; setIdx: number } | null>(null)

  useEffect(() => {
    const loadSession = async () => {
      const user = JSON.parse(localStorage.getItem('fitflow_user') || '{}')
      if (user.id && id) {
        const foundSession = await trackingService.getSessionById(user.id, id)
        setSession(foundSession || null)
      }
    }
    loadSession()
  }, [id])

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">Workout Not Found</h1>
          <button onClick={() => navigate('/history')} className="btn-primary px-8 py-3">
            Back to History
          </button>
        </div>
      </div>
    )
  }

  const handleSetUpdate = async (exIdx: number, setIdx: number, reps: number, weight?: number) => {
    const updatedSession = { ...session }
    updatedSession.exercises[exIdx].sets[setIdx] = {
      reps,
      weight,
      completed: true,
      RPE: undefined,
    }
    setSession(updatedSession)
    await trackingService.saveSession(updatedSession)
  }

  const handleCompleteSession = async () => {
    await trackingService.completeSession(session)
    navigate('/history')
  }

  const totalCompletedSets = session.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  )
  const totalPlannedSets = session.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/history')}
            className="text-[#ff6b35] hover:text-[#ff8555] mb-4 inline-block bg-none border-none cursor-pointer"
          >
            ← Back to History
          </button>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-5xl font-black text-white mb-2">💪 Workout Session</h1>
              <p className="text-gray-400">
                {new Date(session.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            {session.completed && (
              <span className="bg-[#00ff88]/20 text-[#00ff88] px-4 py-2 rounded-lg font-bold">
                ✓ Completed
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-white font-bold">Progress</p>
              <p className="text-[#ff6b35] font-bold">
                {totalCompletedSets} / {totalPlannedSets} sets
              </p>
            </div>
            <div className="h-2 bg-[#1a1f3a] rounded-full overflow-hidden border border-[#2d3355]/50">
              <div
                className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8555] transition-all duration-300"
                style={{
                  width: totalPlannedSets > 0 ? `${(totalCompletedSets / totalPlannedSets) * 100}%` : '0%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          {session.exercises.map((exercise, exIdx) => {
            const exerciseInfo = exerciseService.getById(exercise.exerciseId)
            return (
              <div key={exIdx} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Exercise {exIdx + 1}</p>
                    <h3 className="text-2xl font-black text-white">{exercise.name}</h3>
                    {exerciseInfo && (
                      <p className="text-xs text-gray-500 mt-1">{exerciseInfo.muscleGroups.join(' • ')}</p>
                    )}
                  </div>
                  <span className="text-sm bg-[#ff6b35]/20 text-[#ff6b35] px-3 py-1 rounded font-bold">
                    {exercise.plannedSets}x{exercise.plannedReps}
                  </span>
                </div>

                {/* Sets */}
                <div className="space-y-2">
                  {exercise.sets.map((set, setIdx) => (
                    <div key={setIdx} className="bg-[#0a0e27] rounded-lg p-4 border border-[#2d3355]/50">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-white">Set {setIdx + 1}</p>
                        {set.completed && (
                          <span className="text-xs bg-[#00ff88]/20 text-[#00ff88] px-2 py-1 rounded">✓ Done</span>
                        )}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block font-bold">Reps</label>
                          <input
                            type="number"
                            value={set.reps || ''}
                            onChange={(e) =>
                              handleSetUpdate(
                                exIdx,
                                setIdx,
                                parseInt(e.target.value) || 0,
                                set.weight
                              )
                            }
                            placeholder="0"
                            className="input-field w-full"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block font-bold">Weight (kg)</label>
                          <input
                            type="number"
                            value={set.weight || ''}
                            onChange={(e) =>
                              handleSetUpdate(
                                exIdx,
                                setIdx,
                                set.reps,
                                e.target.value ? parseFloat(e.target.value) : undefined
                              )
                            }
                            placeholder="—"
                            className="input-field w-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                <div className="mt-4">
                  <textarea
                    value={exercise.notes || ''}
                    onChange={(e) => {
                      const updated = { ...session }
                      updated.exercises[exIdx].notes = e.target.value
                      setSession(updated)
                    }}
                    placeholder="Add notes for this exercise..."
                    className="input-field w-full h-20 text-sm resize-none"
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        {!session.completed && (
          <div className="mt-12">
            <button onClick={handleCompleteSession} className="btn-primary w-full py-4 text-lg font-bold">
              ✅ Mark Workout Complete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
