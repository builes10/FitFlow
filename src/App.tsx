import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AssessmentPage } from '@/pages/AssessmentPage'
import { WorkoutPlanPage } from '@/pages/WorkoutPlanPage'
import { SelectPlanPage } from '@/pages/SelectPlanPage'
import { CustomizePlanPage } from '@/pages/CustomizePlanPage'
import { WorkoutHistoryPage } from '@/pages/WorkoutHistoryPage'
import { WorkoutDetailPage } from '@/pages/WorkoutDetailPage'
import { ProgressDashboardPage } from '@/pages/ProgressDashboardPage'
import { AuthProvider } from '@/contexts/AuthContext'

function App() {
  // FitFlow - Comprehensive Fitness Training Platform
  // Phase 5: Supabase Integration Complete
  // Deployed on Vercel with Production Database
  return (
    <Router>
      <AuthProvider>
        <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/select-plan" element={<SelectPlanPage />} />
        <Route path="/workout-plan" element={<WorkoutPlanPage />} />
        <Route path="/plan/customize" element={<CustomizePlanPage />} />
        <Route path="/history" element={<WorkoutHistoryPage />} />
        <Route path="/workout/:id" element={<WorkoutDetailPage />} />
        <Route path="/progress" element={<ProgressDashboardPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
