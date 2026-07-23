import { useState } from 'react'

interface FlexibilityTestPageProps {
  onComplete: (sitReach: number) => void
}

export const FlexibilityTestPage = ({ onComplete }: FlexibilityTestPageProps) => {
  const [distance, setDistance] = useState('')
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm')

  const handleComplete = () => {
    if (distance) {
      onComplete(parseFloat(distance))
    }
  }

  const distanceCM = distance && unit === 'inches' ? parseFloat(distance) * 2.54 : parseFloat(distance) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🧘</div>
          <h1 className="text-5xl font-black text-white mb-3">Flexibility Test</h1>
          <p className="text-gray-400 text-lg">Sit and Reach Assessment</p>
        </div>

        <div className="stat-card space-y-8">
          <div className="bg-[#0a0e27] rounded-xl p-6 border border-[#2d3355]/50">
            <h2 className="text-xl font-bold text-white mb-4">How to Perform:</h2>
            <ol className="space-y-2 text-gray-300 text-sm">
              <li className="flex gap-2">
                <span className="font-black text-[#ff6b35]">•</span>
                <span>Sit on floor with legs extended</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-[#ff6b35]">•</span>
                <span>Place feet flat against box (or wall)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-[#ff6b35]">•</span>
                <span>Slowly reach forward with both hands</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-[#ff6b35]">•</span>
                <span>Measure distance from fingertips to feet baseline</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-[#ff6b35]">•</span>
                <span>Negative value = behind feet, Positive = past feet</span>
              </li>
            </ol>
          </div>

          <div className="bg-gradient-to-br from-[#ff6b35]/10 to-[#ff6b35]/5 rounded-xl p-4 border border-[#ff6b35]/20">
            <p className="text-gray-300 text-sm text-center">
              💡 <span className="font-bold">Example:</span> If your fingers reach 5cm beyond your toes, enter 5
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-white uppercase tracking-wide">
              Reach Distance
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="0"
                className="input-field flex-1 text-center text-3xl py-4 font-black"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'cm' | 'inches')}
                className="input-field w-24 text-center font-bold"
              >
                <option value="cm">cm</option>
                <option value="inches">in</option>
              </select>
            </div>

            {distance && (
              <div className="bg-[#0a0e27] rounded-xl p-4 border border-[#2d3355]/50 text-center">
                <p className="text-gray-500 text-sm mb-1">Converted to cm</p>
                <p className="text-2xl font-black text-[#ff6b35]">{distanceCM.toFixed(1)} cm</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleComplete}
              disabled={!distance}
              className="btn-primary w-full py-4 text-lg font-bold disabled:opacity-50"
            >
              ✅ Complete Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
