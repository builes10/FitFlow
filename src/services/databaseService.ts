import { supabase, isSupabaseConfigured } from './supabaseClient'
import { User, WorkoutPlan, WorkoutSession } from '@/types'

// Database abstraction layer - works with Supabase or localStorage
export const databaseService = {
  // ============ USERS ============
  async getUser(userId: string): Promise<User | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) {
          console.warn('Supabase user fetch failed, using localStorage')
          return getLocalUser()
        }
        return data || null
      } catch (err) {
        console.warn('Supabase error, falling back to localStorage', err)
        return getLocalUser()
      }
    }
    return getLocalUser(userId)
  },

  async updateUser(user: User): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('users')
          .upsert([user])

        if (error) throw error
        return true
      } catch (err) {
        console.warn('Supabase update failed, saving to localStorage')
        saveLocalUser(user)
        return false
      }
    }
    saveLocalUser(user)
    return false
  },

  // ============ WORKOUT PLANS ============
  async getPlan(userId: string, planId: string): Promise<WorkoutPlan | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('workout_plans')
          .select('*')
          .eq('id', planId)
          .eq('user_id', userId)
          .single()

        if (error) throw error
        return data ? JSON.parse(data.schedule_json) : null
      } catch (err) {
        console.warn('Supabase plan fetch failed, using localStorage')
        return getLocalPlan(userId, planId)
      }
    }
    return getLocalPlan(userId, planId)
  },

  async savePlan(plan: WorkoutPlan): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('workout_plans')
          .upsert([
            {
              id: plan.id,
              user_id: plan.userId,
              title: plan.title,
              description: plan.description,
              weeks: plan.weeks,
              days_per_week: plan.daysPerWeek,
              schedule_json: JSON.stringify(plan.schedule),
              completed_sessions: plan.completedSessions,
              total_sessions: plan.totalPlannedSessions,
              is_active: plan.isActive,
              created_at: plan.createdAt,
              updated_at: plan.updatedAt,
            },
          ])

        if (error) throw error
        return true
      } catch (err) {
        console.warn('Supabase plan save failed, saving to localStorage')
        saveLocalPlan(plan)
        return false
      }
    }
    saveLocalPlan(plan)
    return false
  },

  // ============ WORKOUT SESSIONS ============
  async getSession(userId: string, sessionId: string): Promise<WorkoutSession | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('user_id', userId)
          .single()

        if (error) throw error
        return data ? JSON.parse(data.exercises_json) : null
      } catch (err) {
        console.warn('Supabase session fetch failed, using localStorage')
        return getLocalSession(userId, sessionId)
      }
    }
    return getLocalSession(userId, sessionId)
  },

  async saveSession(session: WorkoutSession): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('workout_sessions')
          .upsert([
            {
              id: session.id,
              user_id: session.userId,
              plan_id: session.planId,
              workout_day_id: session.workoutDayId,
              date: session.date,
              exercises_json: JSON.stringify(session.exercises),
              total_duration: session.totalDuration,
              completed: session.completed,
              created_at: session.createdAt,
              updated_at: session.updatedAt,
            },
          ])

        if (error) throw error
        return true
      } catch (err) {
        console.warn('Supabase session save failed, saving to localStorage')
        saveLocalSession(session)
        return false
      }
    }
    saveLocalSession(session)
    return false
  },

  async getAllSessions(userId: string): Promise<WorkoutSession[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })

        if (error) throw error
        return data
          ? data.map((row: any) => ({
              ...row,
              exercises: JSON.parse(row.exercises_json),
            }))
          : []
      } catch (err) {
        console.warn('Supabase sessions fetch failed, using localStorage')
        return getLocalSessions(userId)
      }
    }
    return getLocalSessions(userId)
  },
}

// ============ LOCAL STORAGE HELPERS ============
function getLocalUser(): User | null {
  const stored = localStorage.getItem('fitflow_user')
  return stored ? JSON.parse(stored) : null
}

function saveLocalUser(user: User): void {
  localStorage.setItem('fitflow_user', JSON.stringify(user))
}

function getLocalPlan(userId: string, planId: string): WorkoutPlan | null {
  const stored = localStorage.getItem(`plans_${userId}`)
  if (!stored) return null
  const plans = JSON.parse(stored)
  return plans.find((p: WorkoutPlan) => p.id === planId) || null
}

function saveLocalPlan(plan: WorkoutPlan): void {
  const plans = JSON.parse(localStorage.getItem(`plans_${plan.userId}`) || '[]')
  const index = plans.findIndex((p: WorkoutPlan) => p.id === plan.id)
  if (index >= 0) plans[index] = plan
  else plans.push(plan)
  localStorage.setItem(`plans_${plan.userId}`, JSON.stringify(plans))
}

function getLocalSession(userId: string, sessionId: string): WorkoutSession | null {
  const stored = localStorage.getItem(`sessions_${userId}`)
  if (!stored) return null
  const sessions = JSON.parse(stored)
  return sessions.find((s: WorkoutSession) => s.id === sessionId) || null
}

function saveLocalSession(session: WorkoutSession): void {
  const sessions = JSON.parse(localStorage.getItem(`sessions_${session.userId}`) || '[]')
  const index = sessions.findIndex((s: WorkoutSession) => s.id === session.id)
  if (index >= 0) sessions[index] = session
  else sessions.push(session)
  localStorage.setItem(`sessions_${session.userId}`, JSON.stringify(sessions))
}

function getLocalSessions(userId: string): WorkoutSession[] {
  const stored = localStorage.getItem(`sessions_${userId}`)
  return stored ? JSON.parse(stored) : []
}
