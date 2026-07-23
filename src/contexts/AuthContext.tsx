import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'
import { supabase, isSupabaseConfigured } from '@/services/supabaseClient'
import { authService } from '@/services/authService'

interface AuthContextType {
  currentUser: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (isSupabaseConfigured()) {
          const session = await authService.getSession()
          if (session) {
            setCurrentUser(session)
          }
        } else {
          const stored = localStorage.getItem('fitflow_user')
          if (stored) {
            setCurrentUser(JSON.parse(stored))
          }
        }
      } catch (err) {
        console.warn('Session restoration failed:', err)
        const stored = localStorage.getItem('fitflow_user')
        if (stored) {
          setCurrentUser(JSON.parse(stored))
        }
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()

    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
        if (session?.user) {
          try {
            const user = await authService.getSession()
            if (user) {
              setCurrentUser(user)
              localStorage.setItem('fitflow_user', JSON.stringify(user))
            }
          } catch (err) {
            console.warn('Failed to get session on auth state change:', err)
          }
        } else {
          setCurrentUser(null)
          localStorage.removeItem('fitflow_user')
        }
      })

      return () => {
        data?.subscription.unsubscribe()
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
