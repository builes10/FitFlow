import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BurpeeTestPage } from './tests/BurpeeTestPage'
import { StrengthTestPage } from './tests/StrengthTestPage'
import { FlexibilityTestPage } from './tests/FlexibilityTestPage'
import { workoutService } from '@/services/workoutService'

type AssessmentStep = 'start' | 'burpee' | 'strength' | 'flexibility' | 'results'

interface AssessmentResults {
  burpeeReps: number
  vo2Max: number
  pushups: number
  squats: number
  sitReach: number
}

export const AssessmentPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<AssessmentStep>('start')
  const [results, setResults] = useState<AssessmentResults>({
    burpeeReps: 0,
    vo2Max: 0,
    pushups: 0,
    squats: 0,
    sitReach: 0,
  })

  const handleBurpeeComplete = (reps: number, vo2: number) => {
    setResults(prev => ({ ...prev, burpeeReps: reps, vo2Max: vo2 }))
    setStep('strength')
  }

  const handleStrengthComplete = (pushups: number, squats: number) => {
    setResults(prev => ({ ...prev, pushups, squats }))
    setStep('flexibility')
  }

  const handleFlexibilityComplete = (sitReach: number) => {
    setResults(prev => ({ ...prev, sitReach }))
    setStep('results')
  }

  const handleFinish = () => {
    // Save assessment results
    localStorage.setItem('fitflow_assessment', JSON.stringify(results))

    // Get current user and mark assessment as completed
    const user = JSON.parse(localStorage.getItem('fitflow_user') || '{}')
    user.assessmentCompleted = true
    localStorage.setItem('fitflow_user', JSON.stringify(user))

    // Generate workout plan
    const mockAssessment = {
      id: `assessment_${Date.now()}`,
      userId: user.id,
      date: new Date(),
      aerobicTest: {
        testType: 'burpee' as const,
        totalReps: results.burpeeReps,
        totalTimeSeconds: 180,
        repsPerMinute: Math.round((results.burpeeReps / 3) * 60),
        vo2MaxEstimated: results.vo2Max,
        level: determineLevel(results.vo2Max),
        percentile: 50,
      },
      strengthTests: {
        pushupTest: {
          maxReps: results.pushups,
          percentile: 50,
          level: determineLevel(results.pushups),
          estimatedChestPress1RM: 0,
        },
        squatTest: {
          maxRepsBodyweight: results.squats,
          testType: 'bodybodyweightOnly' as const,
          estimated1RM: 0,
          percentile: 50,
          level: determineLevel(results.squats),
        },
      },
      flexibilityTest: {
        sitReachCM: results.sitReach,
        percentile: 50,
        level: 'intermediate' as const,
      },
      trainingPreferences: {
        mainGoal: user.goals[0] || 'generalFitness',
        preferredStyles: ['functional', 'bodybuilding'],
        availableEquipment: ['bodyweight', 'dumbbell'],
        additionalNotes: '',
      },
      medicalHistory: {
        surgeries: [],
        injuries: [],
        medicalConditions: [],
      },
      overallLevel: determineLevel(results.vo2Max),
    }

    const plan = workoutService.generatePlan(mockAssessment, user, 12)
    workoutService.savePlan(plan)

    // Navigate to workout plan
    navigate('/workout-plan')
  }

  const determineLevel = (value: number) => {
    if (value >= 50) return 'elite'
    if (value >= 40) return 'advanced'
    if (value >= 30) return 'intermediate'
    if (value >= 20) return 'beginner'
    return 'untrained'
  }

  if (step === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">📋</div>
            <h1 className="text-5xl font-black text-white mb-3 tracking-tight">Fitness Assessment</h1>
            <p className="text-gray-400 text-lg">Complete 3 quick tests to generate your personalized plan</p>
          </div>

          <div className="stat-card space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#0a0e27] rounded-xl border border-[#2d3355]/50">
                <div className="text-4xl">💪</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">Burpee Test</h3>
                  <p className="text-gray-500 text-sm">3-minute aerobic fitness test (VO2 Max calculation)</p>
                </div>
                <div className="text-sm font-bold text-[#ff6b35]">3 min</div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#0a0e27] rounded-xl border border-[#2d3355]/50">
                <div className="text-4xl">🏋️</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">Strength Test</h3>
                  <p className="text-gray-500 text-sm">Push-ups & Squats (1RM & strength level)</p>
                </div>
                <div className="text-sm font-bold text-[#ff6b35]">5 min</div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#0a0e27] rounded-xl border border-[#2d3355]/50">
                <div className="text-4xl">🧘</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">Flexibility Test</h3>
                  <p className="text-gray-500 text-sm">Sit and Reach (flexibility range)</p>
                </div>
                <div className="text-sm font-bold text-[#ff6b35]">2 min</div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#2d3355]/50">
              <p className="text-gray-400 text-sm mb-6 text-center">
                ⏱️ Total time: ~10 minutes
              </p>
              <button
                onClick={() => setStep('burpee')}
                className="btn-primary w-full py-4 text-lg font-bold"
              >
                🚀 Start Assessment
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 hover:text-gray-300 text-sm font-medium transition"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'burpee') return <BurpeeTestPage onComplete={handleBurpeeComplete} />
  if (step === 'strength') return <StrengthTestPage onComplete={handleStrengthComplete} />
  if (step === 'flexibility') return <FlexibilityTestPage onComplete={handleFlexibilityComplete} />

  // Results page
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">Assessment Complete!</h1>
          <p className="text-gray-400 text-lg">Your personalized training plan is ready</p>
        </div>

        <div className="stat-card space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a0e27] rounded-xl p-4 border border-[#2d3355]/50">
              <p className="text-gray-500 text-sm font-bold uppercase">VO2 Max</p>
              <p className="text-3xl font-black text-[#ff6b35] mt-2">{results.vo2Max.toFixed(1)}</p>
              <p className="text-gray-600 text-xs mt-1">ml/kg/min</p>
            </div>
            <div className="bg-[#0a0e27] rounded-xl p-4 border border-[#2d3355]/50">
              <p className="text-gray-500 text-sm font-bold uppercase">Burpees</p>
              <p className="text-3xl font-black text-[#ff6b35] mt-2">{results.burpeeReps}</p>
              <p className="text-gray-600 text-xs mt-1">in 3 minutes</p>
            </div>
            <div className="bg-[#0a0e27] rounded-xl p-4 border border-[#2d3355]/50">
              <p className="text-gray-500 text-sm font-bold uppercase">Push-ups</p>
              <p className="text-3xl font-black text-[#ff6b35] mt-2">{results.pushups}</p>
              <p className="text-gray-600 text-xs mt-1">max reps</p>
            </div>
            <div className="bg-[#0a0e27] rounded-xl p-4 border border-[#2d3355]/50">
              <p className="text-gray-500 text-sm font-bold uppercase">Squats</p>
              <p className="text-3xl font-black text-[#ff6b35] mt-2">{results.squats}</p>
              <p className="text-gray-600 text-xs mt-1">max reps</p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#2d3355]/50">
            <button
              onClick={handleFinish}
              className="btn-primary w-full py-4 text-lg font-bold"
            >
              ✅ View My Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
