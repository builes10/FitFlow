# 🎯 FitFlow Development Guidelines

**Last Updated**: 2026-07-22  
**Philosophy**: Ponytail (Lazy Senior Dev) + Clean Architecture

---

## 🧭 Development Philosophy

### Ponytail Principles
1. **Does it need to exist?** → If no, skip it (YAGNI)
2. **Already in codebase?** → Reuse it, don't rewrite
3. **Stdlib does it?** → Use standard library
4. **Native platform feature?** → Use native feature
5. **Already installed?** → Use installed dependency
6. **One line?** → Write one line

### Clean Code Rules
- **No comments** unless WHY is non-obvious
- **TypeScript required** for all code
- **Tailwind CSS only** for styling
- **React hooks** for state management
- **No premature abstractions** (3 similar lines = abstraction)
- **Type safety first** (100% TypeScript coverage)

---

## 📁 Project Structure (IMMUTABLE)

```
FitFlow/
├── src/
│   ├── pages/              # Page components (routable)
│   ├── services/           # Business logic (auth, api, calculations)
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   ├── styles/             # Global CSS + Tailwind
│   ├── utils/              # Helper functions
│   ├── App.tsx             # Router configuration
│   └── main.tsx            # Entry point
├── package.json            # Dependencies (frozen)
├── vite.config.ts          # Bundler config
├── tailwind.config.js      # Tailwind config
├── tsconfig.json           # TypeScript config
└── .env.local              # Environment variables
```

---

## 🎨 Design System (LOCKED)

### Color Palette
- **Primary**: #ff6b35 (Orange) - for CTAs, highlights
- **Secondary**: #ff8555 (Light Orange) - for hover states
- **Background**: #0a0e27 (Dark Navy)
- **Card**: #1a1f3a (Navy)
- **Border**: #2d3355 (Dark Blue)
- **Text**: #e0e0e0 (Light Gray)
- **Text Secondary**: #9ca3af (Medium Gray)
- **Success**: #00ff88 (Green)

**Rule**: No other colors. Period.

### Typography
- **Font**: Inter (system fallback)
- **Headers**: font-black (900)
- **Body**: font-medium to font-bold
- **No custom CSS classes** (Tailwind utility classes only)

### Components Library
- ✅ `.btn-primary` - Orange gradient button
- ✅ `.btn-secondary` - Gray button
- ✅ `.card` - Dark gradient card
- ✅ `.input-field` - Dark input with orange focus
- ✅ `.stat-card` - Gradient card for stats

---

## 🔧 Technology Stack (FINAL)

### Frontend
- React 18.3.1
- TypeScript 5.x
- Vite (dev server + bundler)
- Tailwind CSS 3.x
- React Router 6.x
- React Hooks (useState, useEffect, useCallback, useRef, useContext)

### State Management
- React Context API (for user/auth)
- localStorage (for persistence)
- URL search params (for filtering)
- Component props (for composition)

**Rule**: No Redux, Zustand, or MobX. React hooks only.

### Backend (Ready for SPRINT 3+)
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Real-time subscriptions (future)

### Dev Tools
- ESLint (code quality)
- TypeScript (type safety)
- Prettier (formatting)
- Vite (hot reload)

---

## 📊 Data Models

### User (from localStorage/Supabase)
```typescript
interface User {
  id: string
  email: string
  name: string
  fitnessLevel: 'untrained' | 'beginner' | 'intermediate' | 'advanced' | 'elite'
  goals: FitnessGoal[]
  injuries: string[]
  daysPerWeek: number (1-7)
  preferredTrainingTime: 'morning' | 'afternoon' | 'evening'
  createdAt: Date
  assessmentCompleted: boolean
}
```

### FitnessAssessment
```typescript
interface FitnessAssessment {
  id: string
  userId: string
  burpeeReps: number
  vo2Max: number
  pushups: number
  squats: number
  sitReach: number (cm, can be negative)
  completedAt: Date
}
```

### Workout Plan (SPRINT 3)
```typescript
interface WorkoutPlan {
  id: string
  userId: string
  title: string
  description: string
  durationWeeks: number
  daysPerWeek: number
  exercises: WorkoutExercise[]
  createdAt: Date
}
```

---

## ✅ Coding Standards

### TypeScript
```typescript
// ✅ Good: Explicit types
const calculateVO2Max = (burpees: number): number => {
  return Math.min(60, 25 + (burpees * 0.15))
}

// ❌ Bad: Missing types
const calculateVO2Max = (burpees) => {
  return Math.min(60, 25 + (burpees * 0.15))
}
```

### React Components
```typescript
// ✅ Good: Functional, hooks-based, minimal
export const BurpeeTest = ({ onComplete }: Props) => {
  const [reps, setReps] = useState(0)
  return <button onClick={() => setReps(r => r + 1)}>{reps}</button>
}

// ❌ Bad: Class component, over-complex
class BurpeeTest extends React.Component { ... }
```

### Styling
```tsx
// ✅ Good: Tailwind utilities only
<div className="bg-[#0a0e27] rounded-xl p-4 border border-[#ff6b35]/20">

// ❌ Bad: Custom CSS classes
<div className="custom-card">  // defined in index.css
```

### Comments
```typescript
// ✅ Good: Explain WHY (non-obvious constraint)
// VO2 Max capped at 60 because values above indicate measurement error
return Math.min(60, 25 + (burpees * 0.15))

// ❌ Bad: Explain WHAT (already obvious from code)
// Add 25 to burpees times 0.15
return Math.min(60, 25 + (burpees * 0.15))
```

---

## 🚀 Development Workflow

### Before Writing Code
1. Check Ponytail ladder: Does it NEED to exist?
2. Search codebase: Is it already here?
3. Check stdlib: Does it already exist?
4. Check dependencies: Is it installed?
5. Then code: Keep it simple

### File Naming
- Pages: `PascalCase.tsx` (e.g., `LoginPage.tsx`)
- Components: `PascalCase.tsx` (e.g., `Button.tsx`)
- Services: `camelCase.ts` (e.g., `authService.ts`)
- Types: `camelCase.ts` (e.g., `index.ts`)
- Utils: `camelCase.ts` (e.g., `calculations.ts`)

### Commit Messages
```
<type>(<scope>): <subject>

<body (optional)>

<footer (optional)>
```

Types: feat, fix, refactor, docs, test, chore  
Subject: lowercase, imperative, max 50 chars  
Body: explain WHY, not WHAT

---

## 🧪 Testing Strategy

### Manual Testing
- Test every page in browser (dev server)
- Test on mobile viewport (375px width)
- Test on desktop viewport (1280px width)
- Test all forms (empty, valid, invalid)
- Test all navigation paths

### Automated Testing (Future)
- Unit tests for calculations (Vitest)
- Component tests for UI (React Testing Library)
- E2E tests for workflows (Playwright)

---

## ⚠️ Safety Rules

### Authentication
- ✅ localStorage for user session
- ✅ Email validation on signup
- ✅ Password requirements
- ❌ No plain-text passwords in code
- ❌ No passwords in localStorage

### Data Validation
- ✅ Type validation (TypeScript)
- ✅ Range validation (inputs 0-180)
- ✅ Format validation (email, dates)
- ❌ No unvalidated user input in calculations

### Security
- ✅ Sanitize user input (no HTML injection)
- ✅ Validate URL parameters
- ✅ Validate API responses
- ❌ No secrets in .env.local (it's .gitignored)

---

## 📊 Performance Guidelines

### Bundle Size
- Target: <300KB (after compression)
- Monitor: Each library addition must justify its size
- Rule: Prefer native APIs over libraries

### Render Performance
- Target: <16ms per frame (60fps)
- Avoid: Unnecessary re-renders (use useCallback, useMemo sparingly)
- Optimize: Large lists (virtualization if >100 items)

### Network Performance
- Dev Server: <1s hot reload
- Build: <3s total time
- API calls: <500ms response time

---

## 🔮 SPRINT 3 Scope

### Must Have (Core)
- [ ] Workout plan generator (based on assessment)
- [ ] Exercise library (150+ exercises minimum)
- [ ] Plan customization UI
- [ ] Workout tracking page

### Should Have (Important)
- [ ] Progress dashboard
- [ ] Supabase integration
- [ ] User preferences refinement

### Nice to Have (Optional)
- [ ] Social sharing
- [ ] Mobile app
- [ ] Offline mode

---

## ✅ Sign-Off

**Developer**: Claude Code  
**Philosophy**: Ponytail (Simple > Complex)  
**Quality**: TypeScript + Tailwind CSS  
**Safety**: 100% validated, no shortcuts  
**Performance**: Under 300KB bundle  

Ready to build the best fitness app with the least code.

---

**"He says nothing. He writes one line. It works."** — Ponytail Philosophy
