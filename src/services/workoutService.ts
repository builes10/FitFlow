import { WorkoutPlan, WorkoutDay, WorkoutPhase, ExerciseInWorkout, FitnessAssessment, User, FitnessLevel } from '@/types'
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

  // Get available training plans from Supabase
  getAvailablePlans: async (): Promise<any[]> => {
    try {
      const { supabase } = await import('./supabaseClient')
      const { data: plans, error } = await supabase
        .from('training_plans')
        .select('*')
        .order('difficulty', { ascending: true })

      if (error) {
        console.error('❌ Error fetching plans:', error)
        return []
      }

      console.log('✅ Available plans:', plans)
      return plans || []
    } catch (err) {
      console.error('❌ Failed to fetch plans:', err)
      return []
    }
  },

  // Get plan with all details (days, phases, exercises)
  getPlanWithDetails: async (planId: string): Promise<any | null> => {
    try {
      const { supabase } = await import('./supabaseClient')
      const { data: plan, error } = await supabase
        .from('training_plans')
        .select(`
          *,
          training_plan_days(
            *,
            training_phases(
              *,
              training_phase_exercises(
                *,
                exercises(id, name, description, category, difficulty, primary_muscles, secondary_muscles, equipment, tags)
              )
            )
          )
        `)
        .eq('id', planId)
        .single()

      if (error) {
        console.error('❌ Error fetching plan details:', error)
        return null
      }

      console.log('✅ Plan with details:', plan)
      return plan
    } catch (err) {
      console.error('❌ Failed to fetch plan details:', err)
      return null
    }
  },

  // Get active plan for user (with Supabase/localStorage fallback)
  getActivePlan: async (userId: string): Promise<WorkoutPlan | undefined> => {
    try {
      // First try to get from Supabase
      const { supabase } = await import('./supabaseClient')
      const { data: plans, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)

      console.log('🔍 getActivePlan query result:', { plans, error, userId })

      if (error) {
        console.error('❌ Supabase error:', error)
      } else if (plans && plans.length > 0) {
        const plan = plans[0]
        console.log('✅ Plan found:', plan)
        // Parse schedule_json and convert to WorkoutDay array
        let schedule = []
        const scheduleData = typeof plan.schedule_json === 'string' ? JSON.parse(plan.schedule_json) : plan.schedule_json

        // Convert week1, week2, etc. structure to flat array with 3 phases
        if (scheduleData && typeof scheduleData === 'object') {
          const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          let dayIndex = 0

          // Iterate through all weeks
          for (const weekKey in scheduleData) {
            if (weekKey.startsWith('week')) {
              const week = scheduleData[weekKey]
              if (Array.isArray(week)) {
                for (const day of week) {
                  const exercises = (day.exercises || []).map((name: string) => ({
                    id: `ex_${name}`,
                    name,
                    sets: 3,
                    reps: '8-12',
                    rest: 60,
                    completed: false,
                  }))

                  // Split exercises into 3 phases
                  const warmupCount = Math.max(1, Math.floor(exercises.length / 4))
                  const wodCount = Math.max(1, Math.floor(exercises.length / 4))
                  const strengthCount = exercises.length - warmupCount - wodCount

                  const warmup = exercises.slice(0, warmupCount).map(ex => ({
                    ...ex,
                    sets: 2,
                    reps: '12-15',
                  }))
                  const strength = exercises.slice(warmupCount, warmupCount + strengthCount).map(ex => ({
                    ...ex,
                    sets: 4,
                    reps: '6-8',
                  }))
                  const wod = exercises.slice(warmupCount + strengthCount).map(ex => ({
                    ...ex,
                    sets: 3,
                    reps: '10-12',
                  }))

                  schedule.push({
                    id: `day_${dayIndex}`,
                    day: dayNames[dayIndex % 7],
                    phases: [
                      {
                        phase: 'warmup',
                        phaseTitle: '🔥 Calentamiento',
                        exercises: warmup,
                        duration: 10,
                      },
                      {
                        phase: 'strength',
                        phaseTitle: '💪 Fortalecimiento',
                        exercises: strength,
                        duration: 30,
                      },
                      {
                        phase: 'wod',
                        phaseTitle: '⚡ WOD Final',
                        exercises: wod,
                        duration: 10,
                      },
                    ],
                    totalDuration: 50,
                    intensity: 'moderate',
                  })
                  dayIndex++
                }
              }
            }
          }
        }

        return {
          ...plan,
          schedule,
        } as WorkoutPlan
      } else {
        console.warn('⚠️ No active plans found for user:', userId)
      }
    } catch (err) {
      console.error('❌ Failed to get active plan from Supabase:', err)
    }

    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(`plans_${userId}`)
      const plans = stored ? JSON.parse(stored) : []
      return plans.find((p: WorkoutPlan) => p.isActive)
    } catch (err) {
      console.warn('Failed to get active plan from localStorage:', err)
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

  // Split into 3 phases
  const warmupCount = Math.max(1, Math.floor(exercises.length / 4))
  const wodCount = Math.max(1, Math.floor(exercises.length / 4))
  const strengthCount = exercises.length - warmupCount - wodCount

  const warmup: ExerciseInWorkout[] = exercises.slice(0, warmupCount).map(ex => ({
    ...ex,
    sets: 2,
    reps: '12-15',
    rest: 45,
  }))
  const strength: ExerciseInWorkout[] = exercises.slice(warmupCount, warmupCount + strengthCount).map(ex => ({
    ...ex,
    sets: 4,
    reps: '6-8',
    rest: 90,
  }))
  const wod: ExerciseInWorkout[] = exercises.slice(warmupCount + strengthCount).map(ex => ({
    ...ex,
    sets: 3,
    reps: '10-12',
    rest: 60,
  }))

  const totalDuration = intensity === 'high' ? 60 : intensity === 'moderate' ? 50 : 40

  return {
    id: `day_${Date.now()}_${Math.random()}`,
    day,
    phases: [
      {
        phase: 'warmup',
        phaseTitle: '🔥 Calentamiento',
        exercises: warmup,
        duration: Math.floor(totalDuration * 0.2),
      },
      {
        phase: 'strength',
        phaseTitle: '💪 Fortalecimiento',
        exercises: strength,
        duration: Math.floor(totalDuration * 0.6),
      },
      {
        phase: 'wod',
        phaseTitle: '⚡ WOD Final',
        exercises: wod,
        duration: Math.floor(totalDuration * 0.2),
      },
    ],
    totalDuration,
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
    id: e.id,
    name: e.name,
    sets: e.sets || 3,
    reps: e.reps || '8-12',
    rest: e.rest || 60,
  }))
}
