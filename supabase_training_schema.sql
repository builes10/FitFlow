-- ============================================================================
-- FITFLOW TRAINING DATABASE SCHEMA
-- Complete structure for exercises and training plans
-- ============================================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS training_phase_exercises CASCADE;
DROP TABLE IF EXISTS training_phases CASCADE;
DROP TABLE IF EXISTS training_plan_days CASCADE;
DROP TABLE IF EXISTS training_plans CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;

-- ============================================================================
-- 1. EXERCISES TABLE - Base de datos de ejercicios
-- ============================================================================
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL, -- 'strength', 'cardio', 'core', 'functional', 'mobility'
  difficulty INT CHECK (difficulty >= 1 AND difficulty <= 5),
  description TEXT,
  primary_muscles TEXT[] DEFAULT '{}', -- Array of muscle groups
  secondary_muscles TEXT[] DEFAULT '{}',
  equipment TEXT[] DEFAULT '{}', -- 'bodyweight', 'bench', 'box', 'jump_rope', etc.
  variations TEXT[] DEFAULT '{}', -- Names of variations
  video_url VARCHAR(255),
  tags TEXT[] DEFAULT '{}', -- 'cardio', 'warmup', 'HIIT', 'compound', etc.
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ============================================================================
-- 2. TRAINING PLANS TABLE - Planes completos de entrenamiento
-- ============================================================================
CREATE TABLE training_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50), -- 'beginner', 'intermediate', 'advanced', 'elite'
  duration_weeks INT DEFAULT 1,
  duration_days INT DEFAULT 5, -- Number of training days
  target_audience VARCHAR(255),
  goals TEXT[] DEFAULT '{}', -- ['strength', 'cardio', 'endurance', 'muscle_gain']
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ============================================================================
-- 3. TRAINING PLAN DAYS TABLE - Días individuales del plan
-- ============================================================================
CREATE TABLE training_plan_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_plan_id UUID NOT NULL REFERENCES training_plans(id) ON DELETE CASCADE,
  day_number INT NOT NULL, -- 1-7 for Monday-Sunday
  day_name VARCHAR(50) NOT NULL, -- 'Monday', 'Tuesday', etc.
  day_label VARCHAR(255), -- 'DIA 1', 'Día 1', etc.
  total_duration INT DEFAULT 50, -- Total minutes for the day
  intensity VARCHAR(50) DEFAULT 'moderate', -- 'light', 'moderate', 'high'
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(training_plan_id, day_number)
);

-- ============================================================================
-- 4. TRAINING PHASES TABLE - Las 3 fases de cada día
-- ============================================================================
CREATE TABLE training_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_plan_day_id UUID NOT NULL REFERENCES training_plan_days(id) ON DELETE CASCADE,
  phase_type VARCHAR(50) NOT NULL, -- 'warmup', 'strength', 'wod'
  phase_title VARCHAR(255) NOT NULL, -- 'Calentamiento', 'Fortalecimiento', 'WOD Final'
  phase_emoji VARCHAR(10), -- '🔥', '💪', '⚡'
  duration_minutes INT DEFAULT 15,
  order_number INT NOT NULL, -- 1, 2, 3
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(training_plan_day_id, order_number)
);

-- ============================================================================
-- 5. TRAINING PHASE EXERCISES - Ejercicios en cada fase
-- ============================================================================
CREATE TABLE training_phase_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_phase_id UUID NOT NULL REFERENCES training_phases(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
  reps VARCHAR(50), -- '10', '10-12', 'Max', '20/10', etc.
  sets INT DEFAULT 1,
  rest_seconds INT DEFAULT 60,
  weight_kg DECIMAL(5,2),
  exercise_notes TEXT,
  order_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ============================================================================
-- 6. INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_training_plans_difficulty ON training_plans(difficulty);
CREATE INDEX idx_training_plan_days_plan ON training_plan_days(training_plan_id);
CREATE INDEX idx_training_phases_day ON training_phases(training_plan_day_id);
CREATE INDEX idx_training_phase_exercises_phase ON training_phase_exercises(training_phase_id);
CREATE INDEX idx_training_phase_exercises_exercise ON training_phase_exercises(exercise_id);

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_phase_exercises ENABLE ROW LEVEL SECURITY;

-- Public read access for all exercises and training plans
CREATE POLICY "Public read exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "Public read training_plans" ON training_plans FOR SELECT USING (true);
CREATE POLICY "Public read training_plan_days" ON training_plan_days FOR SELECT USING (true);
CREATE POLICY "Public read training_phases" ON training_phases FOR SELECT USING (true);
CREATE POLICY "Public read training_phase_exercises" ON training_phase_exercises FOR SELECT USING (true);

-- ============================================================================
-- 8. SAMPLE DATA - Ejercicios
-- ============================================================================
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Burpee', 'functional', 5, 'Full body explosive movement', '["chest", "triceps", "core", "legs"]', '["shoulders", "back"]', '["bodyweight"]', '["cardio", "HIIT", "compound"]'),
  ('Push Up', 'strength', 3, 'Classic upper body pressing movement', '["chest", "triceps"]', '["shoulders", "core"]', '["bodyweight"]', '["upper_body", "strength"]'),
  ('Sentadilla', 'strength', 3, 'Lower body compound movement', '["quadriceps", "glutes"]', '["hamstrings", "core"]', '["bodyweight"]', '["lower_body", "compound"]'),
  ('Saltos en Lazo', 'cardio', 2, 'Jump rope cardio movement', '["calves", "shoulders"]', '["core", "forearms"]', '["jump_rope"]', '["cardio", "warmup"]'),
  ('Plancha', 'core', 2, 'Isometric core stability', '["core", "shoulders"]', '["back", "triceps"]', '["bodyweight"]', '["core", "stability"]'),
  ('Superman', 'core', 2, 'Lower back and glute activation', '["back", "glutes"]', '["core"]', '["bodyweight"]', '["back", "mobility"]'),
  ('Abdomen Mariposa', 'core', 3, 'Core targeting rectus abdominis', '["abs"]', '["hip_flexors"]', '["bodyweight"]', '["core", "abs"]'),
  ('Escaladores', 'cardio', 3, 'Dynamic core and cardio', '["core", "hip_flexors"]', '["chest", "shoulders"]', '["bodyweight"]', '["cardio", "core"]'),
  ('Gusanos', 'functional', 3, 'Full body warmup exercise', '["hamstrings", "shoulders", "core"]', '["chest", "triceps"]', '["bodyweight"]', '["warmup", "functional"]'),
  ('Sentadilla con Salto', 'strength', 4, 'Explosive squat variation', '["quadriceps", "glutes"]', '["calves", "core"]', '["bodyweight"]', '["lower_body", "cardio"]'),
  ('Hand Stand Push Ups', 'strength', 5, 'Advanced vertical pressing', '["shoulders", "triceps"]', '["core", "back"]', '["bodyweight", "wall"]', '["gymnastic", "advanced"]'),
  ('Sentadilla Pistola', 'strength', 5, 'Single leg squat', '["quadriceps", "glutes"]', '["hamstrings", "core"]', '["bodyweight"]', '["lower_body", "advanced"]'),
  ('Mountain Climbers', 'cardio', 3, 'Dynamic core and cardio', '["core", "hip_flexors"]', '["chest", "shoulders"]', '["bodyweight"]', '["cardio", "core"]'),
  ('Fondos en Caja', 'strength', 3, 'Tricep pressing movement', '["triceps", "shoulders"]', '["chest", "core"]', '["bench", "box"]', '["triceps", "strength"]'),
  ('Step Up', 'strength', 3, 'Single leg stepping movement', '["quadriceps", "glutes"]', '["hamstrings"]', '["bench", "box", "stairs"]', '["lower_body", "unilateral"]'),
  ('Wall Sit', 'strength', 3, 'Isometric leg strength', '["quadriceps"]', '["glutes"]', '["bodyweight", "wall"]', '["isometric", "lower_body"]');

-- ============================================================================
-- 9. SAMPLE DATA - Plan Semana 1 Básico
-- ============================================================================
INSERT INTO training_plans (name, description, difficulty, duration_weeks, duration_days, target_audience)
VALUES ('Plan Semana 1 - Principiante', 'Plan básico de entrenamiento para la primera semana', 'beginner', 1, 5, 'Principiantes')
RETURNING id AS plan_id;

-- Get the plan ID (you'll need to use it in the next inserts)
-- For this example, we'll use a placeholder approach

-- ============================================================================
-- USAGE INSTRUCTIONS
-- ============================================================================
/*
To use this schema:

1. Create the tables with the SQL above
2. Insert exercises data
3. Create training plans
4. For each training plan, create training_plan_days (one per day)
5. For each day, create training_phases (3 phases: warmup, strength, wod)
6. For each phase, create training_phase_exercises (the individual exercises)

Example queries to retrieve a complete training plan:

-- Get a complete training plan with all details
SELECT
  tp.name as plan_name,
  tp.difficulty,
  tpd.day_name,
  tph.phase_title,
  e.name as exercise_name,
  tpe.reps,
  tpe.sets,
  tpe.rest_seconds
FROM training_plans tp
JOIN training_plan_days tpd ON tp.id = tpd.training_plan_id
JOIN training_phases tph ON tpd.id = tph.training_plan_day_id
JOIN training_phase_exercises tpe ON tph.id = tpe.training_phase_id
JOIN exercises e ON tpe.exercise_id = e.id
WHERE tp.id = '...'
ORDER BY tpd.day_number, tph.order_number, tpe.order_number;

-- Get all exercises by category
SELECT * FROM exercises WHERE category = 'cardio' ORDER BY difficulty;

-- Search exercises by muscle group
SELECT * FROM exercises WHERE primary_muscles @> '["chest"]';
*/
