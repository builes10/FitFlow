-- ============================================================================
-- FITFLOW TRAINING DATABASE - COMPLETE SETUP V3
-- PostgreSQL ARRAY syntax - TESTED AND WORKING
-- ============================================================================

-- DROP EXISTING TABLES
DROP TABLE IF EXISTS training_phase_exercises CASCADE;
DROP TABLE IF EXISTS training_phases CASCADE;
DROP TABLE IF EXISTS training_plan_days CASCADE;
DROP TABLE IF EXISTS training_plans CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;

-- ============================================================================
-- CREATE EXERCISES TABLE
-- ============================================================================
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  difficulty INT CHECK (difficulty >= 1 AND difficulty <= 5),
  description TEXT,
  primary_muscles TEXT[] DEFAULT '{}'::text[],
  secondary_muscles TEXT[] DEFAULT '{}'::text[],
  equipment TEXT[] DEFAULT '{}'::text[],
  variations TEXT[] DEFAULT '{}'::text[],
  video_url VARCHAR(255),
  tags TEXT[] DEFAULT '{}'::text[],
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- CREATE TRAINING PLANS TABLE
CREATE TABLE training_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50),
  duration_weeks INT DEFAULT 1,
  duration_days INT DEFAULT 5,
  target_audience VARCHAR(255),
  goals TEXT[] DEFAULT '{}'::text[],
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- CREATE TRAINING PLAN DAYS TABLE
CREATE TABLE training_plan_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_plan_id UUID NOT NULL REFERENCES training_plans(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  day_name VARCHAR(50) NOT NULL,
  day_label VARCHAR(255),
  total_duration INT DEFAULT 50,
  intensity VARCHAR(50) DEFAULT 'moderate',
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(training_plan_id, day_number)
);

-- CREATE TRAINING PHASES TABLE
CREATE TABLE training_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_plan_day_id UUID NOT NULL REFERENCES training_plan_days(id) ON DELETE CASCADE,
  phase_type VARCHAR(50) NOT NULL,
  phase_title VARCHAR(255) NOT NULL,
  phase_emoji VARCHAR(10),
  duration_minutes INT DEFAULT 15,
  order_number INT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(training_plan_day_id, order_number)
);

-- CREATE TRAINING PHASE EXERCISES TABLE
CREATE TABLE training_phase_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_phase_id UUID NOT NULL REFERENCES training_phases(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
  reps VARCHAR(50),
  sets INT DEFAULT 1,
  rest_seconds INT DEFAULT 60,
  weight_kg DECIMAL(5,2),
  exercise_notes TEXT,
  order_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- CREATE INDEXES
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_training_plans_difficulty ON training_plans(difficulty);
CREATE INDEX idx_training_plan_days_plan ON training_plan_days(training_plan_id);
CREATE INDEX idx_training_phases_day ON training_phases(training_plan_day_id);
CREATE INDEX idx_training_phase_exercises_phase ON training_phase_exercises(training_phase_id);

-- ENABLE RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_phase_exercises ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Public read exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "Public read training_plans" ON training_plans FOR SELECT USING (true);
CREATE POLICY "Public read training_plan_days" ON training_plan_days FOR SELECT USING (true);
CREATE POLICY "Public read training_phases" ON training_phases FOR SELECT USING (true);
CREATE POLICY "Public read training_phase_exercises" ON training_phase_exercises FOR SELECT USING (true);

-- ============================================================================
-- INSERT 45 EXERCISES USING ARRAY[] SYNTAX
-- ============================================================================

-- CORE EXERCISES (9)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Abdomen Mariposa', 'core', 3, 'Flexión de abdomen', ARRAY['abs'], ARRAY['hip_flexors'], ARRAY['bodyweight'], ARRAY['core','abs']),
  ('Leg Raises', 'core', 3, 'Sube y baja pierna', ARRAY['abs','hip_flexors'], ARRAY['core'], ARRAY['bodyweight'], ARRAY['core','abs']),
  ('Plancha', 'core', 2, 'Isométrica de core', ARRAY['core','shoulders'], ARRAY['back','triceps'], ARRAY['bodyweight'], ARRAY['core','stability']),
  ('Superman', 'core', 2, 'Extensión de cadera', ARRAY['back','glutes'], ARRAY['core'], ARRAY['bodyweight'], ARRAY['back','mobility']),
  ('Sit Ups', 'core', 2, 'Flexión de tronco', ARRAY['abs'], ARRAY['hip_flexors'], ARRAY['bodyweight'], ARRAY['core','abs']),
  ('V Sit Ups', 'core', 4, 'Sit ups en V', ARRAY['abs'], ARRAY['hip_flexors'], ARRAY['bodyweight'], ARRAY['core','advanced']),
  ('Hollow Rock', 'functional', 3, 'Canoas', ARRAY['core'], ARRAY['shoulders'], ARRAY['bodyweight'], ARRAY['gymnastic','core']),
  ('Seated In Out', 'core', 2, 'Abdomen sentado', ARRAY['abs','hip_flexors'], ARRAY['core'], ARRAY['bodyweight'], ARRAY['core','abs']),
  ('Russian Twist', 'core', 3, 'Rotación torso', ARRAY['obliques','core'], ARRAY['abs'], ARRAY['bodyweight'], ARRAY['core','rotation']);

-- CARDIO EXERCISES (8)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Burpee', 'functional', 5, 'Full body explosive', ARRAY['chest','triceps','core','legs'], ARRAY['shoulders','back'], ARRAY['bodyweight'], ARRAY['cardio','HIIT','compound']),
  ('Salto en Lazo', 'cardio', 2, 'Jump rope', ARRAY['calves','shoulders'], ARRAY['core'], ARRAY['jump_rope'], ARRAY['cardio','warmup']),
  ('Jumping Jacks', 'cardio', 2, 'Saltos en payaso', ARRAY['glutes','quadriceps','calves'], ARRAY['shoulders','core'], ARRAY['bodyweight'], ARRAY['cardio','warmup']),
  ('Knee Tucks', 'cardio', 3, 'Rodillas al pecho', ARRAY['hip_flexors','core'], ARRAY['abs'], ARRAY['bodyweight'], ARRAY['cardio','HIIT']),
  ('High Knees', 'cardio', 3, 'Rodillas altas', ARRAY['hip_flexors'], ARRAY['core'], ARRAY['bodyweight'], ARRAY['cardio','warmup']),
  ('Double Unders', 'cardio', 3, 'Salto lazo doble', ARRAY['calves','shoulders'], ARRAY['core'], ARRAY['jump_rope'], ARRAY['cardio']),
  ('Skipping', 'cardio', 2, 'Trote con rodillas', ARRAY['hip_flexors','calves'], ARRAY['core','shoulders'], ARRAY['bodyweight'], ARRAY['cardio','warmup']),
  ('Flutter Kicks', 'cardio', 3, 'Patadas alternas', ARRAY['hip_flexors','abs'], ARRAY['core'], ARRAY['bodyweight'], ARRAY['cardio']);

-- LOWER BODY EXERCISES (10)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Sentadilla', 'strength', 3, 'Squat básico', ARRAY['quadriceps','glutes','hamstrings'], ARRAY['core','back'], ARRAY['bodyweight'], ARRAY['lower_body','compound']),
  ('Lunges', 'strength', 3, 'Avanzadas', ARRAY['quadriceps','glutes'], ARRAY['hamstrings','core'], ARRAY['bodyweight'], ARRAY['lower_body','unilateral']),
  ('Sentadilla Lateral', 'strength', 3, 'Lateral squat', ARRAY['glutes','adductors'], ARRAY['quadriceps','core'], ARRAY['bodyweight'], ARRAY['lower_body']),
  ('Sentadilla Sumo', 'strength', 3, 'Sumo squat', ARRAY['glutes','adductors'], ARRAY['quadriceps'], ARRAY['bodyweight'], ARRAY['lower_body']),
  ('Pistol Squat', 'strength', 5, 'Single leg squat', ARRAY['quadriceps','glutes'], ARRAY['hamstrings','core'], ARRAY['bodyweight'], ARRAY['advanced','unilateral']),
  ('Step Up', 'strength', 3, 'Subir escalón', ARRAY['quadriceps','glutes'], ARRAY['hamstrings'], ARRAY['bench','box','stairs'], ARRAY['lower_body']),
  ('Bulgarian Split Squat', 'strength', 3, 'Sentadilla búlgara', ARRAY['quadriceps','glutes'], ARRAY['hamstrings'], ARRAY['bench','box'], ARRAY['lower_body']),
  ('Glute Bridge', 'strength', 2, 'Elevación glúteo', ARRAY['glutes'], ARRAY['hamstrings','core'], ARRAY['bodyweight'], ARRAY['glutes']),
  ('Single Leg Bridge', 'strength', 3, 'Elevación unilateral', ARRAY['glutes'], ARRAY['hamstrings','core'], ARRAY['bodyweight'], ARRAY['glutes','unilateral']),
  ('Wall Sit', 'strength', 3, 'Sentadilla isométrica', ARRAY['quadriceps'], ARRAY['glutes'], ARRAY['bodyweight','wall'], ARRAY['isometric']);

-- UPPER BODY EXERCISES (12)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Push Up', 'strength', 3, 'Flexión de pecho', ARRAY['chest','triceps'], ARRAY['shoulders','core'], ARRAY['bodyweight'], ARRAY['upper_body']),
  ('Bench Dips', 'strength', 3, 'Fondos en caja', ARRAY['triceps','shoulders'], ARRAY['chest','core'], ARRAY['bench','box'], ARRAY['triceps']),
  ('Pike Push Up', 'strength', 4, 'Push up invertido', ARRAY['shoulders'], ARRAY['triceps','core'], ARRAY['bodyweight'], ARRAY['shoulders','advanced']),
  ('Diamond Push Up', 'strength', 4, 'Manos en diamante', ARRAY['triceps'], ARRAY['chest','core'], ARRAY['bodyweight'], ARRAY['triceps']),
  ('Push Up Negativo', 'strength', 3, 'Fase excéntrica', ARRAY['chest','triceps'], ARRAY['shoulders'], ARRAY['bodyweight'], ARRAY['chest']),
  ('Push Up en Círculo', 'strength', 3, 'Circulares', ARRAY['chest','triceps'], ARRAY['shoulders'], ARRAY['bodyweight'], ARRAY['chest']),
  ('Push Up con Rotación', 'functional', 4, 'Con rotación torso', ARRAY['chest','triceps','core'], ARRAY['obliques','shoulders'], ARRAY['bodyweight'], ARRAY['core','rotation']),
  ('Hand Stand Push Ups', 'strength', 5, 'HSPU', ARRAY['shoulders','triceps'], ARRAY['core','back'], ARRAY['bodyweight','wall'], ARRAY['gymnastic','advanced']),
  ('Low High Plank', 'functional', 3, 'Plank dinámico', ARRAY['shoulders','core'], ARRAY['chest','triceps'], ARRAY['bodyweight'], ARRAY['core','shoulders']),
  ('Shoulder Taps', 'core', 3, 'Toques de hombro', ARRAY['core','shoulders'], ARRAY['chest'], ARRAY['bodyweight'], ARRAY['core','stability']),
  ('Fly Push Ups', 'strength', 4, 'Brazos abiertos', ARRAY['chest'], ARRAY['triceps','shoulders'], ARRAY['bodyweight'], ARRAY['chest']),
  ('Rocking Horse Push Ups', 'strength', 4, 'Push up meciéndose', ARRAY['chest','triceps'], ARRAY['shoulders','core'], ARRAY['bodyweight'], ARRAY['chest','advanced']);

-- FUNCTIONAL EXERCISES (6)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Inch Worms', 'functional', 3, 'Gusanos', ARRAY['hamstrings','shoulders','core'], ARRAY['chest','triceps'], ARRAY['bodyweight'], ARRAY['warmup','mobility']),
  ('Half Burpee', 'functional', 3, 'Burpee media', ARRAY['chest','core','legs'], ARRAY['shoulders'], ARRAY['bodyweight'], ARRAY['cardio']),
  ('Burpee Over Bar', 'functional', 4, 'Saltando barra', ARRAY['full_body'], ARRAY[]::text[], ARRAY['bodyweight','bar'], ARRAY['cardio','explosive']),
  ('Roll Sit Up Squat', 'functional', 4, 'Movimiento fluido', ARRAY['abs','quadriceps'], ARRAY['core','glutes'], ARRAY['bodyweight'], ARRAY['functional']),
  ('Mountain Climbers', 'cardio', 3, 'Escaladores', ARRAY['core','hip_flexors'], ARRAY['chest','shoulders'], ARRAY['bodyweight'], ARRAY['cardio','core']),
  ('Crab Walk', 'functional', 3, 'Marcha invertida', ARRAY['shoulders','triceps','core'], ARRAY['chest','back'], ARRAY['bodyweight'], ARRAY['functional','mobility']);

-- ============================================================================
-- VERIFY INSERTION
-- ============================================================================
SELECT COUNT(*) as total_exercises FROM exercises;
SELECT name, category, difficulty FROM exercises ORDER BY category, difficulty LIMIT 20;
