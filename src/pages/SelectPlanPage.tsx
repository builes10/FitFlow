import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { workoutService } from '@/services/workoutService'
import { useAuth } from '@/contexts/AuthContext'

export const SelectPlanPage = () => {
  const navigate = useNavigate()
  const { currentUser, isLoading } = useAuth()
  const [plans, setPlans] = useState<any[]>([])
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null)
  const [loadingPlans, setLoadingPlans] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true)
      const availablePlans = await workoutService.getAvailablePlans()
      setPlans(availablePlans)
      setLoadingPlans(false)
    }
    fetchPlans()
  }, [])

  if (isLoading || loadingPlans) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#ff6b35] border-t-[#ffed4e]"></div>
      </div>
    )
  }

  const handleSelectPlan = async (plan: any) => {
    setSelectedPlan(plan)
    // Aquí puedes agregar lógica para guardar el plan seleccionado
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[#ff6b35] hover:text-[#ff8555] mb-4 inline-block bg-none border-none cursor-pointer"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-5xl font-black text-white mb-2">📋 Select Your Plan</h1>
          <p className="text-gray-400">Choose from our available training programs</p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.length > 0 ? (
            plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handleSelectPlan(plan)}
                className={`card cursor-pointer transition transform hover:scale-105 ${
                  selectedPlan?.id === plan.id ? 'border-[#ff6b35] border-2' : 'hover:border-[#ff6b35]'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">{plan.name}</h2>
                    <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
                  </div>
                  <span className="bg-[#ff6b35]/20 text-[#ff6b35] px-3 py-1 rounded-full text-xs font-bold capitalize">
                    {plan.difficulty}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 my-6 py-6 border-y border-[#2d3355]/50">
                  <div className="text-center">
                    <p className="text-[#ff6b35] font-black text-2xl">{plan.duration_weeks}</p>
                    <p className="text-gray-400 text-xs">Weeks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#ff6b35] font-black text-2xl">{plan.duration_days}</p>
                    <p className="text-gray-400 text-xs">Days/Week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#ff6b35] font-black text-2xl">{plan.duration_weeks * plan.duration_days}</p>
                    <p className="text-gray-400 text-xs">Total Sessions</p>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 rounded-lg font-black transition ${
                    selectedPlan?.id === plan.id
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-[#ff6b35]/20 text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white'
                  }`}
                >
                  {selectedPlan?.id === plan.id ? '✅ Selected' : 'Select Plan'}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-400 text-lg">No training plans available yet</p>
              <p className="text-gray-500 text-sm mt-2">Check back later for new programs</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {selectedPlan && (
          <div className="flex gap-4 mt-12">
            <button
              onClick={() => navigate('/plan', { state: { planId: selectedPlan.id } })}
              className="btn-primary flex-1 py-3"
            >
              🚀 Start Selected Plan
            </button>
            <button
              onClick={() => setSelectedPlan(null)}
              className="btn-secondary flex-1 py-3"
            >
              ↻ Choose Again
            </button>
          </div>
        )}

        {!selectedPlan && plans.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-400">Select a plan to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
