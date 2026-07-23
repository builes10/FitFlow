import { useState } from 'react'
import { exerciseService } from '@/services/exerciseService'

interface Exercise {
  id: string
  name: string
  category: 'strength' | 'cardio' | 'flexibility' | 'mobility'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  muscleGroups: string[]
}

interface ExerciseSelectorProps {
  currentExerciseId: string
  onSelect: (exerciseId: string) => void
  onClose: () => void
}

export const ExerciseSelector = ({ currentExerciseId, onSelect, onClose }: ExerciseSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const allExercises = exerciseService.getAll()
  let filtered = allExercises

  if (searchQuery) {
    filtered = exerciseService.search(searchQuery)
  } else if (selectedCategory) {
    filtered = exerciseService.getByCategory(selectedCategory)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1f3a] rounded-2xl border border-[#ff6b35]/30 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-[#2d3355]/50 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black text-white">Select Exercise</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 text-2xl font-bold"
            >
              ✕
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full mb-3"
          />

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {['strength', 'cardio', 'flexibility', 'mobility'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(selectedCategory === cat ? null : cat)
                  setSearchQuery('')
                }}
                className={`px-3 py-1 rounded-lg text-sm font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-[#ff6b35] text-white'
                    : 'bg-[#0a0e27] text-gray-300 hover:bg-[#2d3355]'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className="overflow-y-auto flex-1 p-6 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No exercises found</p>
          ) : (
            filtered.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => {
                  onSelect(exercise.id)
                  onClose()
                }}
                className={`w-full text-left p-4 rounded-xl border-2 transition ${
                  currentExerciseId === exercise.id
                    ? 'border-[#ff6b35] bg-[#ff6b35]/10'
                    : 'border-[#2d3355]/50 bg-[#0a0e27] hover:border-[#ff6b35]/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-white">{exercise.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {exercise.muscleGroups.join(' • ')}
                    </p>
                  </div>
                  <span className="text-xs bg-[#1a1f3a] px-2 py-1 rounded text-gray-300">
                    {exercise.difficulty}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
