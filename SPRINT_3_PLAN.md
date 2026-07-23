# 🚀 SPRINT 3: Workout Plan Generation & Exercise Library

**Status**: 🔄 IN PROGRESS  
**Start Date**: 2026-07-22  
**Target Completion**: 2026-08-05  
**Philosophy**: Ponytail (Lazy Senior Dev) + Clean Architecture

---

## 📋 Sprint Overview

SPRINT 3 transforms FitFlow from a testing platform into a complete personalized fitness solution. Users complete assessment → receive personalized workout plan → can track progress.

### Epic Goals
1. ✅ Exercise Library (150+ exercises, searchable)
2. ✅ Workout Plan Generator (AI-powered personalization)
3. ✅ Plan Customization UI (user can modify)
4. ✅ Workout Tracking (history + progress)
5. ✅ Supabase Integration (real data persistence)

---

## 🏗️ Architecture Plan

### New Pages
```
/workout-plan          → WorkoutPlanPage (view generated plan)
/plan/customize        → CustomizePlanPage (edit plan)
/workout/:id           → WorkoutDetailPage (single workout)
/history               → WorkoutHistoryPage (past workouts)
/progress              → ProgressDashboardPage (stats)
```

### New Services
```
src/services/
├── workoutService.ts       (plan CRUD)
├── exerciseService.ts      (exercise library)
├── calculationService.ts   (personalization logic)
└── supabaseService.ts      (Supabase integration)
```

### New Components
```
src/components/
├── ExerciseCard.tsx        (exercise display)
├── WorkoutDay.tsx          (day view)
├── PlanSummary.tsx         (plan overview)
├── ProgressChart.tsx       (stats visualization)
└── ExerciseSelector.tsx    (for customization)
```

### New Types
```typescript
interface Exercise {
  id: string
  name: string
  category: 'strength' | 'cardio' | 'flexibility' | 'mobility'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  equipment: 'bodyweight' | 'dumbbells' | 'barbell' | 'cable' | 'machine'
  instructions: string
  imageUrl: string
  videoUrl?: string
  muscleGroups: string[]
  sets?: number
  reps?: string
  rest?: number (seconds)
}

interface WorkoutDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  exercises: ExerciseWithProgram[]
  duration: number (minutes)
  intensity: 'light' | 'moderate' | 'high'
}

interface WorkoutPlan {
  id: string
  userId: string
  title: string
  description: string
  weeks: number
  schedule: WorkoutDay[]
  assessmentBased: FitnessAssessment
  createdAt: Date
  completedSessions: number
  totalSessions: number
}
```

---

## 📊 Phase Breakdown

### Phase 1: Exercise Library (Days 1-2)
**Goal**: Create 150+ exercise database

#### Tasks
1. **Exercise Data Structure**
   - Define Exercise interface (already above)
   - Create exercise catalog JSON (150+ exercises)
   - Categorize by: strength, cardio, flexibility, mobility
   - Filter by: difficulty, equipment, muscle groups

2. **Exercise Service**
   ```typescript
   // src/services/exerciseService.ts
   export const exerciseService = {
     getAll: () => exercises,
     getByGoal: (goal: FitnessGoal) => filtered,
     getByDifficulty: (level: FitnessLevel) => filtered,
     search: (query: string) => filtered,
     getRandomExercises: (count: number) => random,
   }
   ```

3. **ExerciseCard Component**
   - Display exercise name, category, difficulty
   - Show instructions
   - Optional: video embed (YouTube)
   - Click to view details

**Ponytail Check**: Use native HTML/CSS, no external library for modals

---

### Phase 2: Workout Plan Generator (Days 3-4)
**Goal**: AI-powered personalized recommendations

#### Algorithm (Personalization Engine)
```typescript
// Input: FitnessAssessment + User preferences
// Output: WorkoutPlan (4-12 weeks)

1. Determine training split based on daysPerWeek:
   - 3x/week: Upper/Lower/Full
   - 4x/week: Upper/Lower/Upper/Lower
   - 5x/week: Push/Pull/Legs/Upper/Lower
   - 6x/week: Push/Pull/Legs x2

2. Select exercises based on assessment:
   - Weak areas: More volume
   - Strong areas: Maintenance volume
   - VO2 Max: Cardio frequency
   - Flexibility: Mobility days

3. Progressive overload:
   - Week 1-2: Technique focus (lighter weight)
   - Week 3-6: Hypertrophy (8-12 reps)
   - Week 7-10: Strength (3-6 reps)
   - Week 11-12: Deload (recovery)

4. Randomize exercises within category:
   - Avoid same exercise 2x in a row
   - Balance compound + isolation
   - Keep rest periods appropriate
```

#### Implementation
```typescript
// src/services/workoutService.ts
export const generatePlan = (
  assessment: FitnessAssessment,
  user: User
): WorkoutPlan => {
  const split = determineSplit(user.daysPerWeek)
  const weeks = calculateDuration(assessment.vo2Max)
  const exercises = selectExercises(assessment, user.goals)
  const schedule = buildSchedule(split, weeks, exercises)
  return createPlanObject(schedule, assessment, user)
}
```

#### Factors
- **Goal-based**: Strength → compound heavy, Endurance → high volume
- **Level-based**: Beginner → simple, Advanced → complex
- **Time-based**: Available time affects volume
- **Recovery**: Rest days based on intensity

**Ponytail Check**: Simple algorithm, no ML/AI, use assessment data only

---

### Phase 3: Plan Customization UI (Days 5)
**Goal**: Let users modify their plan

#### Features
1. **Swap Exercises**
   - Click exercise → open selector
   - Filter by muscle group/difficulty
   - Select replacement
   - Update plan

2. **Adjust Volume**
   - Increase/decrease sets
   - Adjust reps range
   - Modify rest periods

3. **Modify Schedule**
   - Reorder workout days
   - Add rest days
   - Extend/shorten plan

4. **Save Changes**
   - Update locally or in Supabase
   - Show summary of changes

**UI Components**:
- `CustomizePlanPage.tsx` - Main editor
- `ExerciseSelector.tsx` - Modal for exercise swaps
- `VolumeAdjuster.tsx` - Simple +/- buttons

**Ponytail Check**: Reuse existing card components, no new CSS

---

### Phase 4: Workout Tracking (Days 6)
**Goal**: Record completed workouts

#### Features
1. **Start Workout**
   - Load selected workout day
   - Show exercises one by one
   - Input sets completed + weight/reps
   - Mark complete

2. **Workout History**
   - List all past workouts
   - Filter by date range
   - Show stats (total volume, PRs)

3. **Progress Dashboard**
   - Progress chart (volume over time)
   - Stats (total workouts, favorite exercises)
   - Achievement badges

#### Data Model
```typescript
interface WorkoutSession {
  id: string
  userId: string
  planId: string
  dayId: string
  date: Date
  exercises: {
    exerciseId: string
    sets: { reps: number, weight: number, completed: boolean }[]
    notes?: string
  }[]
  duration: number
  completed: boolean
}
```

**Ponytail Check**: Reuse existing stat cards for charts

---

### Phase 5: Supabase Integration (Days 7)
**Goal**: Real data persistence

#### Tables to Create
1. `exercises` - Exercise library
2. `workout_plans` - User plans
3. `workout_sessions` - Completed workouts
4. `user_progress` - Stats aggregation

#### RLS Policies
- Users can only see their own plans/sessions
- Admins can read all exercises

#### Implementation
```typescript
// src/services/supabaseService.ts
export const supabase = {
  // Exercise operations
  exercises: {
    getAll: () => select(),
    search: (query) => filter(),
  },
  
  // Plan operations
  plans: {
    create: (plan) => insert(),
    update: (id, plan) => update(),
    delete: (id) => delete(),
    getByUser: (userId) => select().eq('user_id', userId),
  },
  
  // Session operations
  sessions: {
    create: (session) => insert(),
    getByUser: (userId) => select(),
    getStats: (userId) => aggregate(),
  },
}
```

**Ponytail Check**: Keep queries simple, use Supabase conventions

---

## 🎯 Success Criteria

### Code Quality
- [ ] 100% TypeScript coverage
- [ ] No console errors
- [ ] All types exported
- [ ] <300KB bundle size
- [ ] <20ms avg render time

### Features
- [ ] All 150+ exercises loadable
- [ ] Plan generation <2s
- [ ] Customization saves immediately
- [ ] History displays correctly
- [ ] Progress chart updates real-time

### Testing
- [ ] Manual test all pages
- [ ] Test on mobile (375px)
- [ ] Test on desktop (1280px)
- [ ] Test all navigation flows
- [ ] Test with and without Supabase

### UX
- [ ] Clear, professional design
- [ ] Consistent with SPRINT 2
- [ ] Responsive on all devices
- [ ] Loading states visible
- [ ] Error messages helpful

---

## 📁 Files to Create

### Pages (5 files)
```
src/pages/
├── WorkoutPlanPage.tsx           (main plan view)
├── CustomizePlanPage.tsx         (edit plan)
├── WorkoutDetailPage.tsx         (single workout)
├── WorkoutHistoryPage.tsx        (past workouts)
└── ProgressDashboardPage.tsx     (stats)
```

### Services (3 files)
```
src/services/
├── exerciseService.ts            (library)
├── workoutService.ts             (CRUD + generation)
└── supabaseService.ts            (real backend)
```

### Components (4 files)
```
src/components/
├── ExerciseCard.tsx
├── WorkoutDay.tsx
├── PlanSummary.tsx
└── ProgressChart.tsx
```

### Data (1 file)
```
src/data/
└── exercises.json                (150+ exercises)
```

### Types (1 update)
```
src/types/
└── index.ts                      (add new interfaces)
```

### Routes (1 update)
```
src/App.tsx                       (add 5 new routes)
```

---

## 🔄 Development Workflow

### Day 1-2: Exercise Library
```bash
1. Define Exercise interface
2. Create exercises.json (150+ items)
3. Create exerciseService.ts
4. Test with console.log
```

### Day 3-4: Plan Generator
```bash
1. Create workoutService.ts
2. Implement generatePlan() function
3. Test with sample assessment data
4. Create WorkoutPlanPage
```

### Day 5: Customization
```bash
1. Create CustomizePlanPage
2. Add ExerciseSelector component
3. Add edit functionality
4. Test swapping exercises
```

### Day 6: Tracking
```bash
1. Create WorkoutHistoryPage
2. Create ProgressDashboardPage
3. Add WorkoutDetailPage
4. Test recording workouts
```

### Day 7: Supabase
```bash
1. Set up Supabase tables
2. Create supabaseService.ts
3. Migrate data operations
4. Test persistence
```

---

## 🎨 UI/UX Updates

### New Color Usage
- Status indicators: Keep using primary orange
- Charts: Use orange for primary data, gray for secondary
- Cards: Maintain consistent dark theme
- No new colors

### New Components Styling
- All new components use existing `.card`, `.btn-primary`, `.stat-card`
- Responsive: sm:, md:, lg: prefixes for mobile
- Consistent padding: p-4, p-6, p-8
- Consistent typography: text-sm to text-2xl

---

## 🚨 Risk Mitigation

### Risk 1: Exercise Data Size
- **Problem**: 150+ exercises = large JSON
- **Solution**: Load on demand, use virtual scrolling

### Risk 2: Plan Generation Performance
- **Problem**: Algorithm too slow
- **Solution**: Cache plans, generate async

### Risk 3: Supabase Not Ready
- **Problem**: User's Supabase project not set up
- **Solution**: Keep localStorage as fallback

### Risk 4: Over-complexity
- **Problem**: Too many features = scope creep
- **Solution**: Ponytail philosophy - keep it simple

---

## ✅ Rollback Plan

If something breaks:
1. Revert last commit
2. Test SPRINT 2 still works
3. Investigate issue
4. Fix and re-deploy

All changes will be committed regularly (daily).

---

## 📞 Communication

- No weekly standups needed (autonomous development)
- All code follows CLAUDE.md guidelines
- Git commits document all changes
- Documentation updated with each feature

---

## 🎉 Success Looks Like

- User completes assessment
- User sees personalized 12-week plan
- User can customize exercises
- User tracks first workout
- User sees progress over time

All with <300KB bundle, TypeScript safety, and professional design.

---

**Ready to build the best fitness app ever. 💪**

*Following Ponytail Philosophy: "He says nothing. He writes one line. It works."*
