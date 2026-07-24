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
-- ============================================================================
-- INSERT ALL 45+ EXERCISES INTO FITFLOW DATABASE
-- Execute this in Supabase SQL Editor
-- ============================================================================

-- CORE / ABDOMEN (9 ejercicios)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Abdomen Mariposa', 'core', 3, 'Movimiento de flexión de abdomen', '["abs"]', '["hip_flexors"]', '["bodyweight"]', '["core","abs","functional"]'),
  ('Leg Raises', 'core', 3, 'Sube y baja pierna - trabaja abdomen inferior', '["abs","hip_flexors"]', '["core"]', '["bodyweight"]', '["core","lower_abs"]'),
  ('Plancha', 'core', 2, 'Isométrica de core - stabilidad estática', '["core","shoulders"]', '["back","triceps"]', '["bodyweight"]', '["core","stability","iso"]'),
  ('Superman', 'core', 2, 'Extensión de cadera y espalda baja', '["back","glutes"]', '["core"]', '["bodyweight"]', '["back","glutes","mobility"]'),
  ('Mountain Climbers', 'cardio', 3, 'Escaladores - cardio y core dinámico', '["core","hip_flexors"]', '["chest","shoulders"]', '["bodyweight"]', '["cardio","core"]'),
  ('Sit Ups', 'core', 2, 'Flexión de tronco - clásico', '["abs"]', '["hip_flexors"]', '["bodyweight"]', '["core","abs","basic"]'),
  ('V Sit Ups', 'core', 4, 'Sit ups avanzados en V', '["abs"]', '["hip_flexors"]', '["bodyweight"]', '["core","abs","advanced"]'),
  ('Hollow Rock', 'functional', 3, 'Canoas - movimiento de core avanzado', '["core"]', '["shoulders","quads"]', '["bodyweight"]', '["gymnastic","core","advanced"]'),
  ('Seated In Out', 'core', 2, 'Abdomen sentado - tucked position', '["abs","hip_flexors"]', '["core"]', '["bodyweight"]', '["core","abs"]');

-- CARDIO (8 ejercicios)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Burpee', 'functional', 5, 'Movimiento explosivo full body', '["chest","triceps","core","legs"]', '["shoulders","back"]', '["bodyweight"]', '["cardio","HIIT","compound","functional"]'),
  ('Salto en Lazo', 'cardio', 2, 'Jump rope cardio y coordinación', '["calves","shoulders"]', '["core","forearms"]', '["jump_rope"]', '["cardio","warmup","coordination"]'),
  ('Jumping Jacks', 'cardio', 2, 'Saltos en payaso - cardio básico', '["glutes","quadriceps","calves"]', '["shoulders","core"]', '["bodyweight"]', '["cardio","warmup"]'),
  ('Knee Tucks', 'cardio', 3, 'Rodillas al pecho - dinámico', '["hip_flexors","core"]', '["abs"]', '["bodyweight"]', '["cardio","core","HIIT"]'),
  ('High Knees', 'cardio', 3, 'Rodillas altas corriendo', '["hip_flexors"]', '["core"]', '["bodyweight"]', '["cardio","warmup"]'),
  ('Double Unders', 'cardio', 3, 'Salto en lazo doble', '["calves","shoulders"]', '["core","coordination"]', '["jump_rope"]', '["cardio","coordination"]'),
  ('Skipping', 'cardio', 2, 'Trote elevando rodillas', '["hip_flexors","calves"]', '["core","shoulders"]', '["bodyweight"]', '["cardio","warmup"]'),
  ('Flutter Kicks', 'cardio', 3, 'Patadas alternas recostado', '["hip_flexors","abs"]', '["core"]', '["bodyweight"]', '["core","cardio"]');

-- LOWER BODY / PIERNAS (10 ejercicios)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Sentadilla', 'strength', 3, 'Squat básico - ejercicio compuesto', '["quadriceps","glutes","hamstrings"]', '["core","back"]', '["bodyweight"]', '["lower_body","compound","strength"]'),
  ('Lunges', 'strength', 3, 'Avanzadas - movimiento unilateral', '["quadriceps","glutes"]', '["hamstrings","core"]', '["bodyweight"]', '["lower_body","unilateral"]'),
  ('Sentadilla Lateral', 'strength', 3, 'Lateral squat - adductores', '["glutes","adductors"]', '["quadriceps","core"]', '["bodyweight"]', '["lower_body","unilateral"]'),
  ('Sentadilla Sumo', 'strength', 3, 'Wide stance squat', '["glutes","adductors"]', '["quadriceps"]', '["bodyweight"]', '["lower_body","glutes"]'),
  ('Pistol Squat', 'strength', 5, 'Sentadilla pistola - avanzado', '["quadriceps","glutes"]', '["hamstrings","core"]', '["bodyweight"]', '["lower_body","advanced","unilateral"]'),
  ('Step Up', 'strength', 3, 'Subir a un escalón', '["quadriceps","glutes"]', '["hamstrings"]', '["bench","box","stairs"]', '["lower_body","unilateral"]'),
  ('Bulgarian Split Squat', 'strength', 3, 'Sentadilla búlgara', '["quadriceps","glutes"]', '["hamstrings"]', '["bench","box"]', '["lower_body","unilateral"]'),
  ('Glute Bridge', 'strength', 2, 'Elevación de glúteo', '["glutes"]', '["hamstrings","core"]', '["bodyweight"]', '["glutes","lower_body"]'),
  ('Single Leg Bridge', 'strength', 3, 'Elevación de glúteo una pierna', '["glutes"]', '["hamstrings","core"]', '["bodyweight"]', '["glutes","unilateral"]'),
  ('Wall Sit', 'strength', 3, 'Sentadilla isométrica contra pared', '["quadriceps"]', '["glutes"]', '["bodyweight","wall"]', '["isometric","lower_body"]');

-- UPPER BODY / TREN SUPERIOR (12 ejercicios)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Push Up', 'strength', 3, 'Flexión de pecho - clásico', '["chest","triceps"]', '["shoulders","core"]', '["bodyweight"]', '["upper_body","strength","basic"]'),
  ('Bench Dips', 'strength', 3, 'Fondos en caja', '["triceps","shoulders"]', '["chest","core"]', '["bench","box"]', '["triceps","upper_body"]'),
  ('Pike Push Up', 'strength', 4, 'Push up invertido - énfasis en hombros', '["shoulders"]', '["triceps","core"]', '["bodyweight"]', '["shoulders","strength","advanced"]'),
  ('Diamond Push Up', 'strength', 4, 'Flexión con manos en diamante', '["triceps"]', '["chest","core"]', '["bodyweight"]', '["triceps","chest"]'),
  ('Push Up Negativo', 'strength', 3, 'Fase excéntrica del push up', '["chest","triceps"]', '["shoulders"]', '["bodyweight"]', '["chest","triceps","eccentric"]'),
  ('Push Up en Círculo', 'strength', 3, 'Push ups de forma circular', '["chest","triceps"]', '["shoulders"]', '["bodyweight"]', '["chest","triceps","functional"]'),
  ('Push Up con Rotación', 'functional', 4, 'Push up con rotación de torso', '["chest","triceps","core"]', '["obliques","shoulders"]', '["bodyweight"]', '["core","chest","rotation"]'),
  ('Hand Stand Push Ups', 'strength', 5, 'HSPU - press vertical avanzado', '["shoulders","triceps"]', '["core","back"]', '["bodyweight","wall"]', '["gymnastic","shoulders","advanced"]'),
  ('Low High Plank', 'functional', 3, 'Alternancia plank bajo y alto', '["shoulders","core"]', '["chest","triceps"]', '["bodyweight"]', '["core","shoulders","dynamic"]'),
  ('Shoulder Taps', 'core', 3, 'Toques de hombro en plank', '["core","shoulders"]', '["chest"]', '["bodyweight"]', '["core","shoulders","stability"]'),
  ('Fly Push Ups', 'strength', 4, 'Flexiones con brazos abiertos', '["chest"]', '["triceps","shoulders"]', '["bodyweight"]', '["chest","strength"]'),
  ('Rocking Horse Push Ups', 'strength', 4, 'Push up meciéndose', '["chest","triceps"]', '["shoulders","core"]', '["bodyweight"]', '["chest","triceps","advanced"]');

-- FUNCTIONAL / MOVIMIENTOS COMPLEJOS (6 ejercicios)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Inch Worms', 'functional', 3, 'Gusanos - movilidad y fortaleza', '["hamstrings","shoulders","core"]', '["chest","triceps"]', '["bodyweight"]', '["warmup","mobility","functional"]'),
  ('Half Burpee', 'functional', 3, 'Burpee media - versión modificada', '["chest","core","legs"]', '["shoulders"]', '["bodyweight"]', '["cardio","functional"]'),
  ('Burpee Over Bar', 'functional', 4, 'Burpee saltando sobre barra', '["full_body"]', '[]', '["bodyweight","bar"]', '["cardio","explosive","advanced"]'),
  ('Roll Sit Up Squat', 'functional', 4, 'Movimiento fluido complejo', '["abs","quadriceps"]', '["core","glutes"]', '["bodyweight"]', '["functional","core","advanced"]'),
  ('Russian Twist', 'core', 3, 'Rotación de torso con peso', '["obliques","core"]', '["abs"]', '["bodyweight"]', '["core","rotation","obliques"]'),
  ('Crab Walk', 'functional', 3, 'Marcha hacia atrás en plank invertido', '["shoulders","triceps","core"]', '["chest","back"]', '["bodyweight"]', '["functional","shoulders","mobility"]');

-- ============================================================================
-- INSERT SAMPLE TRAINING PLAN: SEMANA 1 BÁSICO
-- ============================================================================

-- Create the training plan
INSERT INTO training_plans (name, description, difficulty, duration_weeks, duration_days, target_audience, goals)
VALUES (
  'Plan Semana 1 - Principiante',
  'Plan básico de entrenamiento de 5 días con 3 fases por día',
  'beginner',
  1,
  5,
  'Principiantes',
  '["cardio","endurance","functional_fitness"]'
)
RETURNING id AS plan_id;

-- NOTE: After inserting the plan, you'll get a plan_id. Use it for the next inserts.
-- For this example, let's assume the plan_id is stored and we use it.

-- MONDAY
INSERT INTO training_plan_days (training_plan_id, day_number, day_name, day_label, total_duration, intensity)
SELECT id, 1, 'Monday', 'DIA 1', 50, 'moderate'
FROM training_plans WHERE name = 'Plan Semana 1 - Principiante'
RETURNING id AS day_id;

-- TUESDAY
INSERT INTO training_plan_days (training_plan_id, day_number, day_name, day_label, total_duration, intensity)
SELECT id, 2, 'Tuesday', 'DIA 2', 50, 'moderate'
FROM training_plans WHERE name = 'Plan Semana 1 - Principiante';

-- WEDNESDAY
INSERT INTO training_plan_days (training_plan_id, day_number, day_name, day_label, total_duration, intensity)
SELECT id, 3, 'Wednesday', 'DIA 3', 50, 'moderate'
FROM training_plans WHERE name = 'Plan Semana 1 - Principiante';

-- THURSDAY
INSERT INTO training_plan_days (training_plan_id, day_number, day_name, day_label, total_duration, intensity)
SELECT id, 4, 'Thursday', 'DIA 4', 50, 'moderate'
FROM training_plans WHERE name = 'Plan Semana 1 - Principiante';

-- FRIDAY
INSERT INTO training_plan_days (training_plan_id, day_number, day_name, day_label, total_duration, intensity)
SELECT id, 5, 'Friday', 'DIA 5', 50, 'moderate'
FROM training_plans WHERE name = 'Plan Semana 1 - Principiante';

-- ============================================================================
-- VERIFY DATA INSERTION
-- ============================================================================

-- Count all exercises
SELECT COUNT(*) as total_exercises FROM exercises;

-- Count all training plans
SELECT COUNT(*) as total_plans FROM training_plans;

-- Count all training days
SELECT COUNT(*) as total_days FROM training_plan_days;

-- View sample exercises
SELECT name, category, difficulty FROM exercises ORDER BY difficulty LIMIT 10;

-- View training plans
SELECT name, difficulty, duration_weeks FROM training_plans;
