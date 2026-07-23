import { useState } from 'react'

interface StrengthTestPageProps {
  onComplete: (pushups: number, squats: number) => void
}

export const StrengthTestPage = ({ onComplete }: StrengthTestPageProps) => {
  const [pushups, setPushups] = useState('')
  const [squats, setSquats] = useState('')
  const [step, setStep] = useState<'pushups' | 'squats' | 'complete'>('pushups')

  const handlePushupNext = () => {
    if (pushups && parseInt(pushups) >= 0) {
      setStep('squats')
    }
  }

  const handleComplete = () => {
    if (squats && parseInt(squats) >= 0) {
      onComplete(parseInt(pushups), parseInt(squats))
    }
  }

  if (step === 'pushups') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">💪</div>
            <h1 className="text-5xl font-black text-white mb-3">Strength Test</h1>
            <p className="text-gray-400 text-lg">Part 1: Push-ups Maximum</p>
          </div>

          <div className="stat-card space-y-8">
            <div className="bg-[#0a0e27] rounded-xl p-6 border border-[#2d3355]/50">
              <h2 className="text-xl font-bold text-white mb-4">How to Perform:</h2>
              <ol className="space-y-2 text-gray-300 text-sm">
                <li className="flex gap-2">
                  <span className="font-black text-[#ff6b35]">•</span>
                  <span>Assume plank position with hands shoulder-width apart</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-black text-[#ff6b35]">•</span>
                  <span>Lower body until chest nearly touches ground</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-black text-[#ff6b35]">•</span>
                  <span>Push back up to starting position</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-black text-[#ff6b35]">•</span>
                  <span>Go for MAXIMUM REPS without stopping</span>
                </li>
              </ol>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-white uppercase tracking-wide">
                How many push-ups did you complete?
              </label>
              <input
                type="number"
                min="0"
                value={pushups}
                onChange={(e) => setPushups(e.target.value)}
                placeholder="0"
                className="input-field text-center text-4xl py-6 font-black"
              />
            </div>

            <button
              onClick={handlePushupNext}
              disabled={!pushups}
              className="btn-primary w-full py-4 text-lg font-bold disabled:opacity-50"
            >
              ➜ Next: Squats
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏋️</div>
          <h1 className="text-5xl font-black text-white mb-3">Strength Test</h1>
          <p className="text-gray-400 text-lg">Part 2: Bodyweight Squats Maximum</p>
        </div>

        <div className="stat-card space-y-8">
          <div className="bg-[#0a0e27] rounded-xl p-6 border border-[#2d3355]/50">
            <h2 className="text-xl font-bold text-white mb-4">How to Perform:</h2>
            <ol className="space-y-2 text-gray-300 text-sm">
              <li className="flex gap-2">
                <span className="font-black text-[#ff6b35]">•</span>
                <span>Stand with feet shoulder-width apart</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-[#ff6b35]">•</span>
                <span>Lower body by bending knees and hips</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-[#ff6b35]">•</span>
                <span>Go down until thighs parallel to ground</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-[#ff6b35]">•</span>
                <span>Push back up to starting position</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-[#ff6b35]">•</span>
                <span>Go for MAXIMUM REPS without stopping</span>
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-white uppercase tracking-wide">
              How many squats did you complete?
            </label>
            <input
              type="number"
              min="0"
              value={squats}
              onChange={(e) => setSquats(e.target.value)}
              placeholder="0"
              className="input-field text-center text-4xl py-6 font-black"
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleComplete}
              disabled={!squats}
              className="btn-primary w-full py-4 text-lg font-bold disabled:opacity-50"
            >
              ➜ Next: Flexibility
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setStep('pushups')}
              className="text-gray-400 hover:text-gray-300 text-sm font-medium transition"
            >
              ← Back to Push-ups
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
