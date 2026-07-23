import { WorkoutPlan, WorkoutDay, ExerciseInWorkout, FitnessAssessment, User, FitnessLevel } from '@/types'
import { exerciseService } from './exerciseService'
import { databaseService } from './databaseService'

// Plan generation algorithm based on user assessment
export const workoutService = {
  // Generate personalized plan
  generatePlan: (assessment: FitnessAssessment, user: User, weeks: number = 12): WorkoutPlan => {
    const split = determineSplit(user.daysPerWeek)
    const schedule = buildSchedule(split, weeks, assessment, user)

    return {
      id: `plan_${Date.now()}`,
      userId: user.id,
      title: `${weeks}-Week Personalized Plan`,
      description: `Based on your assessment (Level: ${assessment.overallLevel})`,
      weeks,
      daysPerWeek: user.daysPerWeek,
      schedule,
      assessmentId: assessment.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedSessions: 0,
      totalPlannedSessions: weeks * user.daysPerWeek,
      isActive: true,
    }
  },

  // Save plan (with Supabase/localStorage fallback)
  savePlan: async (plan: WorkoutPlan): Promise<void> => {
    await databaseService.savePlan(plan)
  },

  // Delete plan (with localStorage fallback)
  deletePlan: async (userId: string, planId: string): Promise<void> => {
    try {
      const plans = JSON.parse(localStorage.getItem(`plans_${userId}`) || '[]')
      const filtered = plans.filter((p: WorkoutPlan) => p.id !== planId)
      localStorage.setItem(`plans_${userId}`, JSON.stringify(filtered))
    } catch (err) {
      console.warn('Failed to delete plan:', err)
    }
  },

  // Get active plan for user (with Supabase/localStorage fallback)
  getActivePlan: async (userId: string): Promise<WorkoutPlan | undefined> => {
    try {
      const stored = localStorage.getItem(`plans_${userId}`)
      const plans = stored ? JSON.parse(stored) : []
      return plans.find((p: WorkoutPlan) => p.isActive)
    } catch (err) {
      console.warn('Failed to get active plan:', err)
      return undefined
    }
  },
}

// Determine training split based on days per week
function determineSplit(daysPerWeek: number): string {
  if (daysPerWeek === 3) return 'full-body'
  if (daysPerWeek === 4) return 'upper-lower'
  if (daysPerWeek === 5) return 'ppl' // Push/Pull/Legs
  if (daysPerWeek === 6) return 'ppl-2x'
  return 'full-body'
}

// Build weekly schedule
function buildSchedule(split: string, weeks: number, assessment: FitnessAssessment, user: User): WorkoutDay[] {
  const templates = {
    'full-body': [
      { day: 'Monday' as const, focus: ['compound', 'lower'], intensity: 'high' },
      { day: 'Wednesday' as const, focus: ['compound', 'upper'], intensity: 'moderate' },
      { day: 'Friday' as const, focus: ['full', 'light'], intensity: 'moderate' },
    ],
    'upper-lower': [
      { day: 'Monday' as const, focus: ['upper'], intensity: 'high' },
      { day: 'Tuesday' as const, focus: ['lower'], intensity: 'high' },
      { day: 'Thursday' as const, focus: ['upper'], intensity: 'moderate' },
      { day: 'Friday' as const, focus: ['lower'], intensity: 'moderate' },
    ],
    'ppl': [
      { day: 'Monday' as const, focus: ['push'], intensity: 'high' },
      { day: 'Tuesday' as const, focus: ['pull'], intensity: 'high' },
      { day: 'Wednesday' as const, focus: ['legs'], intensity: 'high' },
      { day: 'Thursday' as const, focus: ['push'], intensity: 'moderate' },
      { day: 'Friday' as const, focus: ['pull'], intensity: 'moderate' },
    ],
    'ppl-2x': [
      { day: 'Monday' as const, focus: ['push'], intensity: 'high' },
      { day: 'Tuesday' as const, focus: ['pull'], intensity: 'high' },
      { day: 'Wednesday' as const, focus: ['legs'], intensity: 'high' },
      { day: 'Thursday' as const, focus: ['push'], intensity: 'moderate' },
      { day: 'Friday' as const, focus: ['pull'], intensity: 'moderate' },
      { day: 'Saturday' as const, focus: ['legs'], intensity: 'moderate' },
    ],
  }

  const template = templates[split as keyof typeof templates] || templates['full-body']

  // Repeat template for all weeks
  const schedule: WorkoutDay[] = []
  for (let week = 0; week < weeks; week++) {
    template.forEach((day) => {
      schedule.push(
        createWorkoutDay(day.day, day.focus, day.intensity, assessment.overallLevel, user.goals)
      )
    })
  }

  return schedule
}

// Create individual workout day
function createWorkoutDay(
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday',
  focus: string[],
  intensity: 'light' | 'moderate' | 'high',
  level: FitnessLevel,
  goals: any[]
): WorkoutDay {
  // Select exercises based on focus area
  const exercises = selectExercises(focus, level, goals)

  return {
    id: `day_${Date.now()}_${Math.random()}`,
    day,
    exercises,
    duration: intensity === 'high' ? 60 : intensity === 'moderate' ? 50 : 40,
    intensity,
  }
}

// Select appropriate exercises
function selectExercises(focus: string[], level: FitnessLevel, goals: any[]): ExerciseInWorkout[] {
  const categoryMap: Record<string, string> = {
    'compound': 'strength',
    'upper': 'strength',
    'lower': 'strength',
    'push': 'strength',
    'pull': 'strength',
    'legs': 'strength',
    'full': 'strength',
  }

  const category = categoryMap[focus[0]] || 'strength'
  const difficultyMap: Record<FitnessLevel, string> = {
    'untrained': 'beginner',
    'beginner': 'beginner',
    'intermediate': 'intermediate',
    'advanced': 'advanced',
    'elite': 'advanced',
  }

  const difficulty = difficultyMap[level]
  const exercises = exerciseService.filter({ category, difficulty })

  // Return 4-5 exercises for the day
  const count = focus.includes('light') ? 4 : 5
  const selected = exerciseService.getRandomExercises(count)

  return selected.slice(0, count).map((e) => ({
    exerciseId: e.id,
    sets: e.sets || 3,
    reps: e.reps || '8-12',
    rest: e.rest || 60,
  }))
}
