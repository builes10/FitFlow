interface VolumeAdjusterProps {
  sets: number
  reps: string
  rest: number
  onSetsChange: (sets: number) => void
  onRepsChange: (reps: string) => void
  onRestChange: (rest: number) => void
}

export const VolumeAdjuster = ({
  sets,
  reps,
  rest,
  onSetsChange,
  onRepsChange,
  onRestChange,
}: VolumeAdjusterProps) => {
  return (
    <div className="bg-[#0a0e27] rounded-xl p-4 border border-[#2d3355]/50 space-y-4">
      {/* Sets */}
      <div>
        <label className="block text-sm font-bold text-gray-400 mb-2">Sets</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSetsChange(Math.max(1, sets - 1))}
            className="bg-[#2d3355] hover:bg-[#ff6b35] text-white font-bold py-2 px-3 rounded transition"
          >
            −
          </button>
          <input
            type="number"
            value={sets}
            onChange={(e) => onSetsChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="input-field w-20 text-center"
            min="1"
            max="10"
          />
          <button
            onClick={() => onSetsChange(Math.min(10, sets + 1))}
            className="bg-[#2d3355] hover:bg-[#ff6b35] text-white font-bold py-2 px-3 rounded transition"
          >
            +
          </button>
          <span className="text-gray-400 text-sm">{sets}x</span>
        </div>
      </div>

      {/* Reps */}
      <div>
        <label className="block text-sm font-bold text-gray-400 mb-2">Reps</label>
        <input
          type="text"
          value={reps}
          onChange={(e) => onRepsChange(e.target.value)}
          placeholder="e.g., 8-12"
          className="input-field w-full"
        />
        <p className="text-xs text-gray-500 mt-1">Use format: "8" or "8-12"</p>
      </div>

      {/* Rest */}
      <div>
        <label className="block text-sm font-bold text-gray-400 mb-2">Rest (seconds)</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onRestChange(Math.max(30, rest - 15))}
            className="bg-[#2d3355] hover:bg-[#ff6b35] text-white font-bold py-2 px-3 rounded transition"
          >
            −
          </button>
          <input
            type="number"
            value={rest}
            onChange={(e) => onRestChange(Math.max(30, parseInt(e.target.value) || 60))}
            className="input-field w-24 text-center"
            step="15"
            min="30"
          />
          <button
            onClick={() => onRestChange(rest + 15)}
            className="bg-[#2d3355] hover:bg-[#ff6b35] text-white font-bold py-2 px-3 rounded transition"
          >
            +
          </button>
          <span className="text-gray-400 text-sm">sec</span>
        </div>
      </div>
    </div>
  )
}
