import { WorkoutSession, WorkoutSessionExercise } from '@/types'
import { databaseService } from './databaseService'

export const trackingService = {
  // Get all sessions for a user (with Supabase/localStorage fallback)
  getUserSessions: async (userId: string): Promise<WorkoutSession[]> => {
    return await databaseService.getAllSessions(userId)
  },

  // Save a workout session (with Supabase/localStorage fallback)
  saveSession: async (session: WorkoutSession): Promise<void> => {
    await databaseService.saveSession(session)
  },

  // Get session by ID (with Supabase/localStorage fallback)
  getSessionById: async (userId: string, sessionId: string): Promise<WorkoutSession | null> => {
    return await databaseService.getSession(userId, sessionId)
  },

  // Get stats (with Supabase/localStorage fallback)
  getUserStats: async (userId: string) => {
    const sessions = await databaseService.getAllSessions(userId)
    const completedSessions = sessions.filter((s) => s.completed)

    // Calculate total volume (simple estimation)
    let totalVolume = 0
    completedSessions.forEach((session) => {
      session.exercises.forEach((ex) => {
        const totalReps = ex.sets.reduce((sum, set) => sum + set.reps, 0)
        totalVolume += totalReps
      })
    })

    // Get last workout date
    const lastWorkout = completedSessions.length > 0 ? completedSessions[completedSessions.length - 1].date : undefined

    // Calculate consistency streak
    let streak = 0
    if (completedSessions.length > 0) {
      const sortedByDate = [...completedSessions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (const session of sortedByDate) {
        const sessionDate = new Date(session.date)
        sessionDate.setHours(0, 0, 0, 0)
        const dayDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
        if (dayDiff <= streak) streak++
        else break
      }
    }

    return {
      userId,
      totalWorkoutsCompleted: completedSessions.length,
      totalVolumeLifted: totalVolume,
      favoriteExercises: getFavoriteExercises(completedSessions),
      personalRecords: [], // TODO: implement PR tracking
      consistencyStreak: streak,
      lastWorkoutDate: lastWorkout,
    }
  },

  // Create new session from plan day
  createSessionFromDay: (userId: string, planId: string, dayId: string, dayName: string, exercises: any[]) => {
    const session: WorkoutSession = {
      id: `session_${Date.now()}`,
      userId,
      planId,
      workoutDayId: dayId,
      date: new Date(),
      exercises: exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        name: ex.name || ex.exerciseId,
        plannedSets: ex.sets,
        plannedReps: ex.reps,
        sets: Array(ex.sets)
          .fill(null)
          .map(() => ({ reps: 0, weight: undefined, completed: false })),
        notes: '',
      })),
      totalDuration: 0,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return session
  },

  // Mark session as completed
  completeSession: async (session: WorkoutSession): Promise<void> => {
    session.completed = true
    session.updatedAt = new Date()
    await trackingService.saveSession(session)
  },
}

// Helper: Get favorite exercises
function getFavoriteExercises(sessions: WorkoutSession[]): string[] {
  const exerciseCount: Record<string, number> = {}

  sessions.forEach((session) => {
    session.exercises.forEach((ex) => {
      exerciseCount[ex.exerciseId] = (exerciseCount[ex.exerciseId] || 0) + 1
    })
  })

  return Object.entries(exerciseCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id]) => id)
}
