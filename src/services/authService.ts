import { supabase, isSupabaseConfigured } from './supabaseClient'
import { User } from '@/types'

// Mock data para MVP sin Supabase
const mockUsers: Record<string, { password: string; user: User }> = {
  'test@fitflow.com': {
    password: 'password123',
    user: {
      id: '1',
      email: 'test@fitflow.com',
      name: 'Test User',
      fitnessLevel: 'intermediate',
      goals: ['strength'],
      injuries: [],
      daysPerWeek: 4,
      preferredTrainingTime: 'morning',
      createdAt: new Date(),
    },
  },
}

export const authService = {
  // Login
  async login(email: string, password: string): Promise<User> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data.user) {
        throw new Error('Login failed')
      }

      return {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || 'User',
        fitnessLevel: data.user.user_metadata?.fitnessLevel || 'beginner',
        goals: data.user.user_metadata?.goals || [],
        injuries: data.user.user_metadata?.injuries || [],
        daysPerWeek: data.user.user_metadata?.daysPerWeek || 3,
        preferredTrainingTime: data.user.user_metadata?.preferredTrainingTime || 'morning',
        createdAt: new Date(data.user.created_at),
      }
    } else {
      // Mock login
      const mockUser = mockUsers[email]
      if (!mockUser || mockUser.password !== password) {
        throw new Error('Invalid email or password')
      }
      return mockUser.user
    }
  },

  // Signup
  async signup(email: string, password: string, name: string): Promise<User> {
    if (isSupabaseConfigured()) {
      // Check if email already exists in profiles table
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single()

        if (existingProfile) {
          throw new Error('Email already registered')
        }
      } catch (err) {
        // If not a "no rows" error, it's a real error
        if (err instanceof Error && err.message === 'Email already registered') {
          throw err
        }
        // "No rows" error is expected, continue with signup
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('User already exists')) {
          throw new Error('Email already registered')
        }
        throw new Error(error.message)
      }

      if (!data.user) {
        throw new Error('Signup failed')
      }

      return {
        id: data.user.id,
        email: data.user.email || '',
        name: name,
        fitnessLevel: 'beginner',
        goals: [],
        injuries: [],
        daysPerWeek: 3,
        preferredTrainingTime: 'morning',
        createdAt: new Date(data.user.created_at),
      }
    } else {
      // Mock signup - check if email exists
      if (mockUsers[email]) {
        throw new Error('Email already registered')
      }

      const newUser: User = {
        id: Math.random().toString(),
        email,
        name,
        fitnessLevel: 'beginner',
        goals: [],
        injuries: [],
        daysPerWeek: 3,
        preferredTrainingTime: 'morning',
        createdAt: new Date(),
      }

      mockUsers[email] = {
        password,
        user: newUser,
      }

      return newUser
    }
  },

  // Logout
  async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    if (isSupabaseConfigured()) {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        return null
      }

      return {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || 'User',
        fitnessLevel: data.user.user_metadata?.fitnessLevel || 'beginner',
        goals: data.user.user_metadata?.goals || [],
        injuries: data.user.user_metadata?.injuries || [],
        daysPerWeek: data.user.user_metadata?.daysPerWeek || 3,
        preferredTrainingTime: data.user.user_metadata?.preferredTrainingTime || 'morning',
        createdAt: new Date(data.user.created_at),
      }
    }
    return null
  },

  // Get current session and return User data
  async getSession(): Promise<User | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session?.user) {
        return null
      }

      const user = data.session.user
      return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || 'User',
        fitnessLevel: user.user_metadata?.fitnessLevel || 'beginner',
        goals: user.user_metadata?.goals || [],
        injuries: user.user_metadata?.injuries || [],
        daysPerWeek: user.user_metadata?.daysPerWeek || 3,
        preferredTrainingTime: user.user_metadata?.preferredTrainingTime || 'morning',
        createdAt: new Date(user.created_at),
      }
    }

    const stored = localStorage.getItem('fitflow_user')
    return stored ? JSON.parse(stored) : null
  },
}
