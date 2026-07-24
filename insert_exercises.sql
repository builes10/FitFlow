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
