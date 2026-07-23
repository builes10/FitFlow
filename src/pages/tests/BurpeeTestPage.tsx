import { useState, useEffect } from 'react'

interface BurpeeTestPageProps {
  onComplete: (reps: number, vo2Max: number) => void
}

export const BurpeeTestPage = ({ onComplete }: BurpeeTestPageProps) => {
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const [isActive, setIsActive] = useState(false)
  const [reps, setReps] = useState(0)
  const [testStarted, setTestStarted] = useState(false)

  useEffect(() => {
    if (!isActive || timeLeft === 0) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const handleStart = () => {
    setTestStarted(true)
    setIsActive(true)
  }

  const handleRepComplete = () => {
    if (isActive) {
      setReps(prev => prev + 1)
    }
  }

  const calculateVO2Max = (burpees: number) => {
    // VO2 Max estimation: approximately 0.2 * reps + base value
    // Average person: 35 ml/kg/min
    // This is a simplified formula
    return Math.min(60, 25 + (burpees * 0.15))
  }

  const handleComplete = () => {
    const vo2Max = calculateVO2Max(reps)
    onComplete(reps, vo2Max)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">💪</div>
            <h1 className="text-5xl font-black text-white mb-3">Burpee Test</h1>
            <p className="text-gray-400 text-lg">3-Minute Aerobic Fitness Assessment</p>
          </div>

          <div className="stat-card space-y-8">
            <div className="bg-[#0a0e27] rounded-xl p-6 border border-[#2d3355]/50">
              <h2 className="text-xl font-bold text-white mb-4">How It Works:</h2>
              <ol className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="font-black text-[#ff6b35]">1.</span>
                  <span>Click "START" to begin the 3-minute timer</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-black text-[#ff6b35]">2.</span>
                  <span>Perform full burpees (squat → plank → push-up → jump)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-black text-[#ff6b35]">3.</span>
                  <span>Click "COMPLETE REP" each time you finish one</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-black text-[#ff6b35]">4.</span>
                  <span>At 0:00, your VO2 Max will be calculated</span>
                </li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-[#ff6b35]/10 to-[#ff6b35]/5 rounded-xl p-6 border border-[#ff6b35]/20">
              <p className="text-gray-300 text-center">
                💡 <span className="font-bold">Tip:</span> Go at a steady, sustainable pace. Quality over speed!
              </p>
            </div>

            <button
              onClick={handleStart}
              className="btn-primary w-full py-4 text-xl font-bold"
            >
              🚀 START TEST (3 Minutes)
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Burpee Test</h1>
          <p className="text-gray-400">Keep going! Track your reps below</p>
        </div>

        <div className="stat-card space-y-8">
          {/* Timer Display */}
          <div className="bg-gradient-to-br from-[#ff6b35]/20 to-[#ff6b35]/5 rounded-2xl p-8 border-2 border-[#ff6b35]/50 text-center">
            <p className="text-gray-400 text-sm font-bold uppercase mb-3">Time Remaining</p>
            <div className="text-7xl font-black text-[#ff6b35] font-mono">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="mt-4 h-2 bg-[#0a0e27] rounded-full overflow-hidden border border-[#2d3355]/50">
              <div
                className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8555] transition-all duration-1000"
                style={{ width: `${((180 - timeLeft) / 180) * 100}%` }}
              />
            </div>
          </div>

          {/* Reps Display */}
          <div className="text-center">
            <p className="text-gray-400 text-sm font-bold uppercase mb-2">Total Reps</p>
            <p className="text-6xl font-black text-white">{reps}</p>
          </div>

          {/* Action Buttons */}
          {isActive && timeLeft > 0 && (
            <button
              onClick={handleRepComplete}
              className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] hover:from-[#00ff99] hover:to-[#00dd7a] text-black font-black py-4 px-8 rounded-xl text-xl transition transform hover:scale-105 shadow-2xl w-full"
            >
              ✓ COMPLETE REP
            </button>
          )}

          {!isActive && timeLeft === 0 && (
            <div className="space-y-4">
              <div className="bg-[#0a0e27] rounded-xl p-6 border border-[#2d3355]/50 text-center">
                <p className="text-gray-400 mb-2">Test Complete!</p>
                <p className="text-4xl font-black text-[#ff6b35]">{reps} Burpees</p>
              </div>
              <button
                onClick={handleComplete}
                className="btn-primary w-full py-4 text-lg font-bold"
              >
                ➜ Next Test
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
