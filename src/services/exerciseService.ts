import exercisesRaw from '@/data/exercises.json'

interface SimpleExercise {
  id: string
  name: string
  category: 'strength' | 'cardio' | 'flexibility' | 'mobility'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  equipment: string
  instructions: string
  muscleGroups: string[]
  sets?: number
  reps?: string
  rest?: number
}

const exercises: SimpleExercise[] = exercisesRaw as SimpleExercise[]

export const exerciseService = {
  // Get all exercises
  getAll: (): SimpleExercise[] => exercises,

  // Get by category
  getByCategory: (category: string): SimpleExercise[] =>
    exercises.filter((e) => e.category === category),

  // Get by difficulty
  getByDifficulty: (difficulty: string): SimpleExercise[] =>
    exercises.filter((e) => e.difficulty === difficulty),

  // Get by muscle group
  getByMuscleGroup: (muscle: string): SimpleExercise[] =>
    exercises.filter((e) =>
      e.muscleGroups.map((m) => m.toLowerCase()).includes(muscle.toLowerCase())
    ),

  // Get by equipment
  getByEquipment: (equipment: string): SimpleExercise[] =>
    exercises.filter(
      (e) => e.equipment.toLowerCase() === equipment.toLowerCase()
    ),

  // Search exercises by name or muscle
  search: (query: string): SimpleExercise[] => {
    const q = query.toLowerCase()
    return exercises.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.muscleGroups.some((m) => m.toLowerCase().includes(q))
    )
  },

  // Get random exercises (for variety)
  getRandomExercises: (count: number): SimpleExercise[] => {
    const shuffled = [...exercises].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, shuffled.length))
  },

  // Get single exercise by ID
  getById: (id: string): SimpleExercise | undefined =>
    exercises.find((e) => e.id === id),

  // Get exercises for specific goal
  getByGoal: (goal: string): SimpleExercise[] => {
    const categoryMap: Record<string, string[]> = {
      strength: ['strength'],
      muscleGain: ['strength'],
      fatLoss: ['cardio', 'strength'],
      endurance: ['cardio'],
      flexibility: ['flexibility', 'mobility'],
      generalFitness: ['strength', 'cardio', 'flexibility'],
    }

    const categories = categoryMap[goal] || ['strength', 'cardio']
    return exercises.filter((e) => categories.includes(e.category))
  },

  // Get exercises filtered by multiple criteria
  filter: (options: {
    category?: string
    difficulty?: string
    equipment?: string
    muscleGroup?: string
  }): SimpleExercise[] => {
    let results = [...exercises]

    if (options.category)
      results = results.filter((e) => e.category === options.category)
    if (options.difficulty)
      results = results.filter((e) => e.difficulty === options.difficulty)
    if (options.equipment)
      results = results.filter(
        (e) =>
          e.equipment.toLowerCase() === options.equipment!.toLowerCase()
      )
    if (options.muscleGroup)
      results = results.filter((e) =>
        e.muscleGroups
          .map((m) => m.toLowerCase())
          .includes(options.muscleGroup!.toLowerCase())
      )

    return results
  },

  // Get statistics
  getStats: () => ({
    total: exercises.length,
    byCategory: exercises.reduce(
      (acc: Record<string, number>, e) => {
        acc[e.category] = (acc[e.category] || 0) + 1
        return acc
      },
      {}
    ),
    byDifficulty: exercises.reduce(
      (acc: Record<string, number>, e) => {
        acc[e.difficulty] = (acc[e.difficulty] || 0) + 1
        return acc
      },
      {}
    ),
    uniqueMuscleGroups: [
      ...new Set(exercises.flatMap((e) => e.muscleGroups)),
    ],
  }),
}
