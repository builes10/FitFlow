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
-- INSERT EXERCISES - SIMPLE FORMAT (NO ARRAYS IN VALUES)
-- ============================================================================

-- First, create exercises with simpler data
INSERT INTO exercises (name, category, difficulty, description)
VALUES
  ('Abdomen Mariposa', 'core', 3, 'Movimiento de flexión de abdomen'),
  ('Leg Raises', 'core', 3, 'Sube y baja pierna'),
  ('Plancha', 'core', 2, 'Isométrica de core'),
  ('Superman', 'core', 2, 'Extensión de cadera'),
  ('Mountain Climbers', 'cardio', 3, 'Escaladores'),
  ('Sit Ups', 'core', 2, 'Flexión de tronco'),
  ('V Sit Ups', 'core', 4, 'Sit ups en V'),
  ('Hollow Rock', 'functional', 3, 'Canoas'),
  ('Seated In Out', 'core', 2, 'Abdomen sentado'),
  ('Burpee', 'functional', 5, 'Full body explosive'),
  ('Salto en Lazo', 'cardio', 2, 'Jump rope'),
  ('Jumping Jacks', 'cardio', 2, 'Saltos en payaso'),
  ('Knee Tucks', 'cardio', 3, 'Rodillas al pecho'),
  ('High Knees', 'cardio', 3, 'Rodillas altas'),
  ('Double Unders', 'cardio', 3, 'Salto lazo doble'),
  ('Skipping', 'cardio', 2, 'Trote con rodillas altas'),
  ('Flutter Kicks', 'cardio', 3, 'Patadas alternas'),
  ('Sentadilla', 'strength', 3, 'Squat básico'),
  ('Lunges', 'strength', 3, 'Avanzadas'),
  ('Sentadilla Lateral', 'strength', 3, 'Lateral squat'),
  ('Sentadilla Sumo', 'strength', 3, 'Sumo squat'),
  ('Pistol Squat', 'strength', 5, 'Single leg squat'),
  ('Step Up', 'strength', 3, 'Subir a escalón'),
  ('Bulgarian Split Squat', 'strength', 3, 'Sentadilla búlgara'),
  ('Glute Bridge', 'strength', 2, 'Elevación de glúteo'),
  ('Single Leg Bridge', 'strength', 3, 'Elevación unilateral'),
  ('Wall Sit', 'strength', 3, 'Sentadilla isométrica'),
  ('Push Up', 'strength', 3, 'Flexión de pecho'),
  ('Bench Dips', 'strength', 3, 'Fondos en caja'),
  ('Pike Push Up', 'strength', 4, 'Push up invertido'),
  ('Diamond Push Up', 'strength', 4, 'Manos en diamante'),
  ('Push Up Negativo', 'strength', 3, 'Fase excéntrica'),
  ('Push Up en Círculo', 'strength', 3, 'Circulares'),
  ('Push Up con Rotación', 'functional', 4, 'Con rotación torso'),
  ('Hand Stand Push Ups', 'strength', 5, 'HSPU'),
  ('Low High Plank', 'functional', 3, 'Plank dinámico'),
  ('Shoulder Taps', 'core', 3, 'Toques de hombro'),
  ('Fly Push Ups', 'strength', 4, 'Brazos abiertos'),
  ('Rocking Horse Push Ups', 'strength', 4, 'Push up meciéndose'),
  ('Inch Worms', 'functional', 3, 'Gusanos'),
  ('Half Burpee', 'functional', 3, 'Burpee media'),
  ('Burpee Over Bar', 'functional', 4, 'Saltando barra'),
  ('Roll Sit Up Squat', 'functional', 4, 'Movimiento fluido'),
  ('Russian Twist', 'core', 3, 'Rotación torso'),
  ('Crab Walk', 'functional', 3, 'Marcha invertida');

-- ============================================================================
-- NOW UPDATE WITH ARRAYS (PostgreSQL format with {})
-- ============================================================================

UPDATE exercises SET primary_muscles = ARRAY['abs'] WHERE name = 'Abdomen Mariposa';
UPDATE exercises SET secondary_muscles = ARRAY['hip_flexors'], equipment = ARRAY['bodyweight'], tags = ARRAY['core','abs','functional'] WHERE name = 'Abdomen Mariposa';

UPDATE exercises SET primary_muscles = ARRAY['abs','hip_flexors'], secondary_muscles = ARRAY['core'], equipment = ARRAY['bodyweight'], tags = ARRAY['core','lower_abs'] WHERE name = 'Leg Raises';

UPDATE exercises SET primary_muscles = ARRAY['core','shoulders'], secondary_muscles = ARRAY['back','triceps'], equipment = ARRAY['bodyweight'], tags = ARRAY['core','stability'] WHERE name = 'Plancha';

UPDATE exercises SET primary_muscles = ARRAY['back','glutes'], secondary_muscles = ARRAY['core'], equipment = ARRAY['bodyweight'], tags = ARRAY['back','glutes'] WHERE name = 'Superman';

UPDATE exercises SET primary_muscles = ARRAY['core','hip_flexors'], secondary_muscles = ARRAY['chest','shoulders'], equipment = ARRAY['bodyweight'], tags = ARRAY['cardio','core'] WHERE name = 'Mountain Climbers';

UPDATE exercises SET primary_muscles = ARRAY['abs'], secondary_muscles = ARRAY['hip_flexors'], equipment = ARRAY['bodyweight'], tags = ARRAY['core','abs'] WHERE name = 'Sit Ups';

UPDATE exercises SET primary_muscles = ARRAY['abs'], secondary_muscles = ARRAY['hip_flexors'], equipment = ARRAY['bodyweight'], tags = ARRAY['core','abs','advanced'] WHERE name = 'V Sit Ups';

UPDATE exercises SET primary_muscles = ARRAY['core'], secondary_muscles = ARRAY['shoulders','quads'], equipment = ARRAY['bodyweight'], tags = ARRAY['gymnastic','core'] WHERE name = 'Hollow Rock';

UPDATE exercises SET primary_muscles = ARRAY['abs','hip_flexors'], secondary_muscles = ARRAY['core'], equipment = ARRAY['bodyweight'], tags = ARRAY['core','abs'] WHERE name = 'Seated In Out';

UPDATE exercises SET primary_muscles = ARRAY['chest','triceps','core','legs'], secondary_muscles = ARRAY['shoulders','back'], equipment = ARRAY['bodyweight'], tags = ARRAY['cardio','HIIT','compound'] WHERE name = 'Burpee';

UPDATE exercises SET primary_muscles = ARRAY['calves','shoulders'], secondary_muscles = ARRAY['core','forearms'], equipment = ARRAY['jump_rope'], tags = ARRAY['cardio','warmup'] WHERE name = 'Salto en Lazo';

UPDATE exercises SET primary_muscles = ARRAY['glutes','quadriceps','calves'], secondary_muscles = ARRAY['shoulders','core'], equipment = ARRAY['bodyweight'], tags = ARRAY['cardio','warmup'] WHERE name = 'Jumping Jacks';

UPDATE exercises SET primary_muscles = ARRAY['hip_flexors','core'], secondary_muscles = ARRAY['abs'], equipment = ARRAY['bodyweight'], tags = ARRAY['cardio','core','HIIT'] WHERE name = 'Knee Tucks';

UPDATE exercises SET primary_muscles = ARRAY['hip_flexors'], secondary_muscles = ARRAY['core'], equipment = ARRAY['bodyweight'], tags = ARRAY['cardio','warmup'] WHERE name = 'High Knees';

UPDATE exercises SET primary_muscles = ARRAY['calves','shoulders'], secondary_muscles = ARRAY['core'], equipment = ARRAY['jump_rope'], tags = ARRAY['cardio'] WHERE name = 'Double Unders';

UPDATE exercises SET primary_muscles = ARRAY['hip_flexors','calves'], secondary_muscles = ARRAY['core','shoulders'], equipment = ARRAY['bodyweight'], tags = ARRAY['cardio','warmup'] WHERE name = 'Skipping';

UPDATE exercises SET primary_muscles = ARRAY['hip_flexors','abs'], secondary_muscles = ARRAY['core'], equipment = ARRAY['bodyweight'], tags = ARRAY['core','cardio'] WHERE name = 'Flutter Kicks';

UPDATE exercises SET primary_muscles = ARRAY['quadriceps','glutes','hamstrings'], secondary_muscles = ARRAY['core','back'], equipment = ARRAY['bodyweight'], tags = ARRAY['lower_body','compound'] WHERE name = 'Sentadilla';

UPDATE exercises SET primary_muscles = ARRAY['quadriceps','glutes'], secondary_muscles = ARRAY['hamstrings','core'], equipment = ARRAY['bodyweight'], tags = ARRAY['lower_body','unilateral'] WHERE name = 'Lunges';

UPDATE exercises SET primary_muscles = ARRAY['glutes','adductors'], secondary_muscles = ARRAY['quadriceps','core'], equipment = ARRAY['bodyweight'], tags = ARRAY['lower_body'] WHERE name = 'Sentadilla Lateral';

UPDATE exercises SET primary_muscles = ARRAY['glutes','adductors'], secondary_muscles = ARRAY['quadriceps'], equipment = ARRAY['bodyweight'], tags = ARRAY['lower_body'] WHERE name = 'Sentadilla Sumo';

UPDATE exercises SET primary_muscles = ARRAY['quadriceps','glutes'], secondary_muscles = ARRAY['hamstrings','core'], equipment = ARRAY['bodyweight'], tags = ARRAY['lower_body','advanced'] WHERE name = 'Pistol Squat';

UPDATE exercises SET primary_muscles = ARRAY['quadriceps','glutes'], secondary_muscles = ARRAY['hamstrings'], equipment = ARRAY['bench','box','stairs'], tags = ARRAY['lower_body'] WHERE name = 'Step Up';

UPDATE exercises SET primary_muscles = ARRAY['quadriceps','glutes'], secondary_muscles = ARRAY['hamstrings'], equipment = ARRAY['bench','box'], tags = ARRAY['lower_body'] WHERE name = 'Bulgarian Split Squat';

UPDATE exercises SET primary_muscles = ARRAY['glutes'], secondary_muscles = ARRAY['hamstrings','core'], equipment = ARRAY['bodyweight'], tags = ARRAY['glutes'] WHERE name = 'Glute Bridge';

UPDATE exercises SET primary_muscles = ARRAY['glutes'], secondary_muscles = ARRAY['hamstrings','core'], equipment = ARRAY['bodyweight'], tags = ARRAY['glutes','unilateral'] WHERE name = 'Single Leg Bridge';

UPDATE exercises SET primary_muscles = ARRAY['quadriceps'], secondary_muscles = ARRAY['glutes'], equipment = ARRAY['bodyweight','wall'], tags = ARRAY['isometric'] WHERE name = 'Wall Sit';

UPDATE exercises SET primary_muscles = ARRAY['chest','triceps'], secondary_muscles = ARRAY['shoulders','core'], equipment = ARRAY['bodyweight'], tags = ARRAY['upper_body'] WHERE name = 'Push Up';

UPDATE exercises SET primary_muscles = ARRAY['triceps','shoulders'], secondary_muscles = ARRAY['chest','core'], equipment = ARRAY['bench','box'], tags = ARRAY['triceps'] WHERE name = 'Bench Dips';

UPDATE exercises SET primary_muscles = ARRAY['shoulders'], secondary_muscles = ARRAY['triceps','core'], equipment = ARRAY['bodyweight'], tags = ARRAY['shoulders','advanced'] WHERE name = 'Pike Push Up';

UPDATE exercises SET primary_muscles = ARRAY['triceps'], secondary_muscles = ARRAY['chest','core'], equipment = ARRAY['bodyweight'], tags = ARRAY['triceps'] WHERE name = 'Diamond Push Up';

UPDATE exercises SET primary_muscles = ARRAY['chest','triceps'], secondary_muscles = ARRAY['shoulders'], equipment = ARRAY['bodyweight'], tags = ARRAY['chest'] WHERE name = 'Push Up Negativo';

UPDATE exercises SET primary_muscles = ARRAY['chest','triceps'], secondary_muscles = ARRAY['shoulders'], equipment = ARRAY['bodyweight'], tags = ARRAY['chest'] WHERE name = 'Push Up en Círculo';

UPDATE exercises SET primary_muscles = ARRAY['chest','triceps','core'], secondary_muscles = ARRAY['obliques','shoulders'], equipment = ARRAY['bodyweight'], tags = ARRAY['core','rotation'] WHERE name = 'Push Up con Rotación';

UPDATE exercises SET primary_muscles = ARRAY['shoulders','triceps'], secondary_muscles = ARRAY['core','back'], equipment = ARRAY['bodyweight','wall'], tags = ARRAY['gymnastic','advanced'] WHERE name = 'Hand Stand Push Ups';

UPDATE exercises SET primary_muscles = ARRAY['shoulders','core'], secondary_muscles = ARRAY['chest','triceps'], equipment = ARRAY['bodyweight'], tags = ARRAY['core','shoulders'] WHERE name = 'Low High Plank';

UPDATE exercises SET primary_muscles = ARRAY['core','shoulders'], secondary_muscles = ARRAY['chest'], equipment = ARRAY['bodyweight'], tags = ARRAY['core','shoulders'] WHERE name = 'Shoulder Taps';

UPDATE exercises SET primary_muscles = ARRAY['chest'], secondary_muscles = ARRAY['triceps','shoulders'], equipment = ARRAY['bodyweight'], tags = ARRAY['chest'] WHERE name = 'Fly Push Ups';

UPDATE exercises SET primary_muscles = ARRAY['chest','triceps'], secondary_muscles = ARRAY['shoulders','core'], equipment = ARRAY['bodyweight'], tags = ARRAY['chest','advanced'] WHERE name = 'Rocking Horse Push Ups';

UPDATE exercises SET primary_muscles = ARRAY['hamstrings','shoulders','core'], secondary_muscles = ARRAY['chest','triceps'], equipment = ARRAY['bodyweight'], tags = ARRAY['warmup','mobility'] WHERE name = 'Inch Worms';

UPDATE exercises SET primary_muscles = ARRAY['chest','core','legs'], secondary_muscles = ARRAY['shoulders'], equipment = ARRAY['bodyweight'], tags = ARRAY['cardio'] WHERE name = 'Half Burpee';

UPDATE exercises SET primary_muscles = ARRAY['full_body'], secondary_muscles = ARRAY[]::text[], equipment = ARRAY['bodyweight','bar'], tags = ARRAY['cardio','explosive'] WHERE name = 'Burpee Over Bar';

UPDATE exercises SET primary_muscles = ARRAY['abs','quadriceps'], secondary_muscles = ARRAY['core','glutes'], equipment = ARRAY['bodyweight'], tags = ARRAY['functional'] WHERE name = 'Roll Sit Up Squat';

UPDATE exercises SET primary_muscles = ARRAY['obliques','core'], secondary_muscles = ARRAY['abs'], equipment = ARRAY['bodyweight'], tags = ARRAY['core','rotation'] WHERE name = 'Russian Twist';

UPDATE exercises SET primary_muscles = ARRAY['shoulders','triceps','core'], secondary_muscles = ARRAY['chest','back'], equipment = ARRAY['bodyweight'], tags = ARRAY['functional','shoulders'] WHERE name = 'Crab Walk';

-- ============================================================================
-- VERIFY
-- ============================================================================
SELECT COUNT(*) as total_exercises FROM exercises;
SELECT name, category, difficulty FROM exercises LIMIT 10;
