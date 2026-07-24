// MARK: - User Types
export type FitnessLevel = 'untrained' | 'beginner' | 'intermediate' | 'advanced' | 'elite'
export type FitnessGoal = 'strength' | 'muscleGain' | 'fatLoss' | 'endurance' | 'flexibility' | 'generalFitness'
export type TrainingTime = 'morning' | 'midday' | 'afternoon' | 'evening'
export type TrainingStyle = 'functional' | 'kettlebell' | 'crossfit' | 'bodybuilding' | 'calisthenics' | 'powerlifting'
export type TrainingLocation = 'home' | 'gym' | 'both'
export type Equipment = 'bodyweight' | 'dumbbell' | 'kettlebell' | 'barbell' | 'resistanceBand' | 'pullupBar' | 'cable' | 'machine'
export type SpaceCategory = 'small' | 'normal' | 'large'

export interface User {
  id: string
  email: string
  name: string
  profileImage?: string
  fitnessLevel: FitnessLevel
  goals: FitnessGoal[]
  injuries: string[]
  daysPerWeek: number
  preferredTrainingTime: TrainingTime
  createdAt: Date
  assessmentCompleted?: boolean
}

export interface UserPreferences {
  trainingStyles: TrainingStyle[]
  availableEquipment: Equipment[]
  spaceAvailable: SpaceCategory
  preferredLocation: TrainingLocation
}

// MARK: - Assessment Types
export type AerobicTestType = 'burpee' | 'beep' | 'cooper'
export type SquatTestType = 'bodybodyweightOnly' | 'withWeights' | 'both'
export type Joint = 'knee' | 'shoulder' | 'hip' | 'ankle' | 'back' | 'neck' | 'elbow' | 'wrist'
export type RecoveryStatus = 'fullyRecovered' | 'mostlyRecovered' | 'stillRecovering'
export type InjuryStatus = 'healed' | 'chronicPain' | 'recurring'
export type Severity = 'mild' | 'moderate' | 'severe'
export type RestrictionLevel = 'avoid' | 'caution' | 'modify'

export interface AerobicTest {
  testType: AerobicTestType
  totalReps: number
  totalTimeSeconds: number
  repsPerMinute: number
  vo2MaxEstimated: number
  level: FitnessLevel
  percentile: number
}

export interface PushupTest {
  maxReps: number
  percentile: number
  level: FitnessLevel
  estimatedChestPress1RM: number
}

export interface SquatTest {
  maxRepsBodyweight: number
  testType: SquatTestType
  weightTested?: number
  repsAtWeight: number
  estimated1RM: number
  percentile: number
  level: FitnessLevel
}

export interface FlexibilityTest {
  sitReachCM: number
  percentile: number
  level: FitnessLevel
}

export interface StrengthTests {
  pushupTest: PushupTest
  squatTest: SquatTest
}

export interface ExerciseRestriction {
  restriction: RestrictionLevel
  reason: string
  cautionDetails?: string
}

export interface Surgery {
  id: string
  joint: Joint
  surgeryType: string
  dateOfSurgery: Date
  recoveryStatus: RecoveryStatus
  monthsSinceSurgery: number
  complications?: string
  restrictions: ExerciseRestriction[]
}

export interface InjuryHistory {
  id: string
  joint: Joint
  injuryType: string
  dateOfInjury: Date
  status: InjuryStatus
  severity: Severity
  currentPain?: number
  restrictions: ExerciseRestriction[]
}

export interface MedicalCondition {
  id: string
  condition: string
  severity: string
  medications: string[]
  restrictions: ExerciseRestriction[]
  notes?: string
}

export interface MedicalHistory {
  surgeries: Surgery[]
  injuries: InjuryHistory[]
  medicalConditions: MedicalCondition[]
}

export interface TrainingPreferences {
  mainGoal: FitnessGoal
  preferredStyles: TrainingStyle[]
  availableEquipment: Equipment[]
  additionalNotes: string
}

export interface FitnessAssessment {
  id: string
  userId: string
  date: Date
  aerobicTest: AerobicTest
  strengthTests: StrengthTests
  flexibilityTest: FlexibilityTest
  trainingPreferences: TrainingPreferences
  medicalHistory: MedicalHistory
  overallLevel: FitnessLevel
}

// MARK: - Exercise Types
export type ExerciseCategory = 'strength' | 'kettlebell' | 'barbell' | 'dumbbell' | 'calisthenics' | 'functional' | 'cardio' | 'flexibility' | 'mobility' | 'core'
export type VariantType = 'withHeavyLoad' | 'withLightLoad' | 'bodyweight' | 'modified' | 'advanced' | 'isometric'

export interface Exercise {
  id: string
  name: string
  description: string
  category: ExerciseCategory
  difficulty: number // 1-5
  primaryMuscles: string[]
  secondaryMuscles: string[]
  equipment: Equipment[]
  instructions: string[]
  commonMistakes: string[]
  videoURL?: string
  variations?: Exercise[]
  tags: string[]
}

export interface ExerciseVariant {
  id: string
  exerciseId: string
  name: string
  variantType: VariantType
  equipment_required: Equipment[]
  difficulty: number
  rom_description: string
  suggested_load?: string
  suggested_reps_range: [number, number]
  suggested_sets: number
  suggested_rest_seconds: number
  form_cues: string[]
  common_mistakes: string[]
  equivalence_note?: string
  restrictions: ExerciseRestriction[]
}

// MARK: - Equipment Profile
export interface HomeEquipment {
  kettlebells: number[]
  dumbbells: { min: number; max: number }
  barbell: boolean
  resistanceBands: number
  pullupBar: boolean
  parallettes: boolean
  trx: boolean
  medicineBall: boolean
  floor: boolean
  stairs: boolean
  chair: boolean
  other: string[]
}

export interface GymEquipment {
  machines: boolean
  freeWeights: boolean
  cables: boolean
  dumbellRange: { min: number; max: number }
  barbellTypes: string[]
}

export interface EquipmentProfile {
  userId: string
  trainingLocation: TrainingLocation
  homeEquipment: HomeEquipment
  gymEquipment: GymEquipment
  availableSpace: SpaceCategory
  preferredLocation: TrainingLocation
}

// MARK: - Workout Plan Types (SPRINT 3)
export interface ExerciseInWorkout {
  id: string
  name: string
  sets: number
  reps: string
  rest: number // seconds
  weight?: number
  notes?: string
  completed?: boolean
}

export interface WorkoutPhase {
  phase: 'warmup' | 'strength' | 'wod'
  phaseTitle: string
  exercises: ExerciseInWorkout[]
  duration: number // minutes
}

export interface WorkoutDay {
  id: string
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  phases: WorkoutPhase[]
  totalDuration: number // minutes
  intensity: 'light' | 'moderate' | 'high'
}

export interface WorkoutPlan {
  id: string
  userId: string
  title: string
  description: string
  weeks: number
  daysPerWeek: number
  schedule: WorkoutDay[]
  assessmentId: string
  createdAt: Date
  updatedAt: Date
  completedSessions: number
  totalPlannedSessions: number
  isActive: boolean
}

export interface WorkoutSet {
  reps: number
  weight?: number
  completed: boolean
  RPE?: number // Rate of Perceived Exertion (1-10)
}

export interface WorkoutSessionExercise {
  exerciseId: string
  name: string
  plannedSets: number
  plannedReps: string
  sets: WorkoutSet[]
  notes?: string
  startTime?: Date
  endTime?: Date
}

export interface WorkoutSession {
  id: string
  userId: string
  planId: string
  workoutDayId: string
  date: Date
  exercises: WorkoutSessionExercise[]
  totalDuration: number // minutes
  completed: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserProgress {
  userId: string
  totalWorkoutsCompleted: number
  totalVolumeLifted: number // kg
  favoriteExercises: string[]
  personalRecords: {
    exerciseId: string
    weight: number
    reps: number
    date: Date
  }[]
  consistencyStreak: number // days
  lastWorkoutDate?: Date
}
