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

      // Get additional profile data from profiles table
      let profileData = null
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
        console.log('Profile query result:', { profiles, error, userId: data.user.id })
        if (!error && profiles && profiles.length > 0) {
          profileData = profiles[0]
          console.log('Profile data loaded:', profileData)
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      }

      return {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || 'User',
        fitnessLevel: profileData?.fitness_level || data.user.user_metadata?.fitnessLevel || 'beginner',
        goals: profileData?.goals || data.user.user_metadata?.goals || [],
        injuries: profileData?.injuries || data.user.user_metadata?.injuries || [],
        daysPerWeek: profileData?.days_per_week || data.user.user_metadata?.daysPerWeek || 3,
        preferredTrainingTime: profileData?.preferred_training_time || data.user.user_metadata?.preferredTrainingTime || 'morning',
        assessmentCompleted: profileData?.assessment_completed || false,
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
      // Check if email already exists by attempting to sign in with a dummy password
      // If the error is about invalid password, the user exists
      // If the error is about invalid email/user, the user doesn't exist
      const { error: checkError } = await supabase.auth.signInWithPassword({
        email,
        password: '__check_if_exists__',
      })

      if (checkError && checkError.message && checkError.message.includes('Invalid login credentials')) {
        // User exists (invalid password), so email is already registered
        throw new Error('Email already registered')
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
        // Handle Supabase error messages for duplicate email
        if (
          error.message.includes('already registered') ||
          error.message.includes('User already exists') ||
          error.message.includes('duplicate key value')
        ) {
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

      let profileData = null
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
        if (!error && profiles && profiles.length > 0) {
          profileData = profiles[0]
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      }

      return {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || 'User',
        fitnessLevel: profileData?.fitness_level || data.user.user_metadata?.fitnessLevel || 'beginner',
        goals: profileData?.goals || data.user.user_metadata?.goals || [],
        injuries: profileData?.injuries || data.user.user_metadata?.injuries || [],
        daysPerWeek: profileData?.days_per_week || data.user.user_metadata?.daysPerWeek || 3,
        preferredTrainingTime: profileData?.preferred_training_time || data.user.user_metadata?.preferredTrainingTime || 'morning',
        assessmentCompleted: profileData?.assessment_completed || false,
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

      let profileData = null
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
        if (!error && profiles && profiles.length > 0) {
          profileData = profiles[0]
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      }

      return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || 'User',
        fitnessLevel: profileData?.fitness_level || user.user_metadata?.fitnessLevel || 'beginner',
        goals: profileData?.goals || user.user_metadata?.goals || [],
        injuries: profileData?.injuries || user.user_metadata?.injuries || [],
        daysPerWeek: profileData?.days_per_week || user.user_metadata?.daysPerWeek || 3,
        preferredTrainingTime: profileData?.preferred_training_time || user.user_metadata?.preferredTrainingTime || 'morning',
        assessmentCompleted: profileData?.assessment_completed || false,
        createdAt: new Date(user.created_at),
      }
    }

    const stored = localStorage.getItem('fitflow_user')
    return stored ? JSON.parse(stored) : null
  },
}
