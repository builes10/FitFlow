import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '@/services/authService'

export const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const user = await authService.login(email, password)
      console.log('✅ Login successful:', user.name)
      localStorage.setItem('fitflow_user', JSON.stringify(user))
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-block mb-4">
            <div className="text-6xl">⚡</div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-3 tracking-tight">FitFlow</h1>
          <p className="text-gray-400 text-lg sm:text-xl font-medium">Your Personal Trainer</p>
          <div className="h-1.5 w-16 bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Form Card */}
        <div className="stat-card space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-white mb-3 uppercase tracking-wide">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field text-sm sm:text-base"
                required
              />
              <p className="text-xs text-gray-500 mt-2 font-medium">Demo: test@fitflow.com</p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-white mb-3 uppercase tracking-wide">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="input-field text-sm sm:text-base"
                required
              />
              <p className="text-xs text-gray-500 mt-2 font-medium">Demo: password123</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-700/50 text-red-300 px-5 py-3.5 rounded-xl text-sm font-bold">
                ⚠️ {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? '⏳ Logging in...' : '💪 Start Training'}
            </button>
          </form>

          {/* Signup Link */}
          <div className="text-center text-sm text-gray-400 pt-6 border-t border-[#2d3355]/50">
            New to FitFlow?{' '}
            <Link to="/signup" className="text-[#ff6b35] hover:text-[#ff8555] font-bold transition duration-300">
              Create Account
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-600 mt-10 font-medium">
          © 2026 FitFlow • Your Fitness Journey Starts Here
        </p>
      </div>
    </div>
  )
}
