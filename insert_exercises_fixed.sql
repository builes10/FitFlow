-- ============================================================================
-- INSERT ALL 45+ EXERCISES INTO FITFLOW DATABASE
-- PostgreSQL Array Format (NOT JSON)
-- ============================================================================

-- CORE / ABDOMEN (9 ejercicios)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Abdomen Mariposa', 'core', 3, 'Movimiento de flexión de abdomen', '{abs}', '{hip_flexors}', '{bodyweight}', '{core,abs,functional}'),
  ('Leg Raises', 'core', 3, 'Sube y baja pierna', '{abs,hip_flexors}', '{core}', '{bodyweight}', '{core,lower_abs}'),
  ('Plancha', 'core', 2, 'Isométrica de core', '{core,shoulders}', '{back,triceps}', '{bodyweight}', '{core,stability}'),
  ('Superman', 'core', 2, 'Extensión de cadera', '{back,glutes}', '{core}', '{bodyweight}', '{back,glutes}'),
  ('Mountain Climbers', 'cardio', 3, 'Escaladores', '{core,hip_flexors}', '{chest,shoulders}', '{bodyweight}', '{cardio,core}'),
  ('Sit Ups', 'core', 2, 'Flexión de tronco', '{abs}', '{hip_flexors}', '{bodyweight}', '{core,abs}'),
  ('V Sit Ups', 'core', 4, 'Sit ups en V', '{abs}', '{hip_flexors}', '{bodyweight}', '{core,abs,advanced}'),
  ('Hollow Rock', 'functional', 3, 'Canoas', '{core}', '{shoulders,quads}', '{bodyweight}', '{gymnastic,core}'),
  ('Seated In Out', 'core', 2, 'Abdomen sentado', '{abs,hip_flexors}', '{core}', '{bodyweight}', '{core,abs}');

-- CARDIO (8 ejercicios)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Burpee', 'functional', 5, 'Full body explosive', '{chest,triceps,core,legs}', '{shoulders,back}', '{bodyweight}', '{cardio,HIIT,compound}'),
  ('Salto en Lazo', 'cardio', 2, 'Jump rope', '{calves,shoulders}', '{core,forearms}', '{jump_rope}', '{cardio,warmup}'),
  ('Jumping Jacks', 'cardio', 2, 'Saltos en payaso', '{glutes,quadriceps,calves}', '{shoulders,core}', '{bodyweight}', '{cardio,warmup}'),
  ('Knee Tucks', 'cardio', 3, 'Rodillas al pecho', '{hip_flexors,core}', '{abs}', '{bodyweight}', '{cardio,core,HIIT}'),
  ('High Knees', 'cardio', 3, 'Rodillas altas', '{hip_flexors}', '{core}', '{bodyweight}', '{cardio,warmup}'),
  ('Double Unders', 'cardio', 3, 'Salto lazo doble', '{calves,shoulders}', '{core}', '{jump_rope}', '{cardio}'),
  ('Skipping', 'cardio', 2, 'Trote con rodillas altas', '{hip_flexors,calves}', '{core,shoulders}', '{bodyweight}', '{cardio,warmup}'),
  ('Flutter Kicks', 'cardio', 3, 'Patadas alternas', '{hip_flexors,abs}', '{core}', '{bodyweight}', '{core,cardio}');

-- LOWER BODY / PIERNAS (10 ejercicios)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Sentadilla', 'strength', 3, 'Squat básico', '{quadriceps,glutes,hamstrings}', '{core,back}', '{bodyweight}', '{lower_body,compound}'),
  ('Lunges', 'strength', 3, 'Avanzadas', '{quadriceps,glutes}', '{hamstrings,core}', '{bodyweight}', '{lower_body,unilateral}'),
  ('Sentadilla Lateral', 'strength', 3, 'Lateral squat', '{glutes,adductors}', '{quadriceps,core}', '{bodyweight}', '{lower_body}'),
  ('Sentadilla Sumo', 'strength', 3, 'Sumo squat', '{glutes,adductors}', '{quadriceps}', '{bodyweight}', '{lower_body}'),
  ('Pistol Squat', 'strength', 5, 'Single leg squat', '{quadriceps,glutes}', '{hamstrings,core}', '{bodyweight}', '{lower_body,advanced}'),
  ('Step Up', 'strength', 3, 'Subir a escalón', '{quadriceps,glutes}', '{hamstrings}', '{bench,box,stairs}', '{lower_body}'),
  ('Bulgarian Split Squat', 'strength', 3, 'Sentadilla búlgara', '{quadriceps,glutes}', '{hamstrings}', '{bench,box}', '{lower_body}'),
  ('Glute Bridge', 'strength', 2, 'Elevación de glúteo', '{glutes}', '{hamstrings,core}', '{bodyweight}', '{glutes}'),
  ('Single Leg Bridge', 'strength', 3, 'Elevación unilateral', '{glutes}', '{hamstrings,core}', '{bodyweight}', '{glutes,unilateral}'),
  ('Wall Sit', 'strength', 3, 'Sentadilla isométrica', '{quadriceps}', '{glutes}', '{bodyweight,wall}', '{isometric}');

-- UPPER BODY / TREN SUPERIOR (12 ejercicios)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Push Up', 'strength', 3, 'Flexión de pecho', '{chest,triceps}', '{shoulders,core}', '{bodyweight}', '{upper_body}'),
  ('Bench Dips', 'strength', 3, 'Fondos en caja', '{triceps,shoulders}', '{chest,core}', '{bench,box}', '{triceps}'),
  ('Pike Push Up', 'strength', 4, 'Push up invertido', '{shoulders}', '{triceps,core}', '{bodyweight}', '{shoulders,advanced}'),
  ('Diamond Push Up', 'strength', 4, 'Manos en diamante', '{triceps}', '{chest,core}', '{bodyweight}', '{triceps}'),
  ('Push Up Negativo', 'strength', 3, 'Fase excéntrica', '{chest,triceps}', '{shoulders}', '{bodyweight}', '{chest}'),
  ('Push Up en Círculo', 'strength', 3, 'Circulares', '{chest,triceps}', '{shoulders}', '{bodyweight}', '{chest}'),
  ('Push Up con Rotación', 'functional', 4, 'Con rotación torso', '{chest,triceps,core}', '{obliques,shoulders}', '{bodyweight}', '{core,rotation}'),
  ('Hand Stand Push Ups', 'strength', 5, 'HSPU', '{shoulders,triceps}', '{core,back}', '{bodyweight,wall}', '{gymnastic,advanced}'),
  ('Low High Plank', 'functional', 3, 'Plank dinámico', '{shoulders,core}', '{chest,triceps}', '{bodyweight}', '{core,shoulders}'),
  ('Shoulder Taps', 'core', 3, 'Toques de hombro', '{core,shoulders}', '{chest}', '{bodyweight}', '{core,shoulders}'),
  ('Fly Push Ups', 'strength', 4, 'Brazos abiertos', '{chest}', '{triceps,shoulders}', '{bodyweight}', '{chest}'),
  ('Rocking Horse Push Ups', 'strength', 4, 'Push up meciéndose', '{chest,triceps}', '{shoulders,core}', '{bodyweight}', '{chest,advanced}');

-- FUNCTIONAL / MOVIMIENTOS COMPLEJOS (6 ejercicios)
INSERT INTO exercises (name, category, difficulty, description, primary_muscles, secondary_muscles, equipment, tags)
VALUES
  ('Inch Worms', 'functional', 3, 'Gusanos', '{hamstrings,shoulders,core}', '{chest,triceps}', '{bodyweight}', '{warmup,mobility}'),
  ('Half Burpee', 'functional', 3, 'Burpee media', '{chest,core,legs}', '{shoulders}', '{bodyweight}', '{cardio}'),
  ('Burpee Over Bar', 'functional', 4, 'Saltando barra', '{full_body}', '{}', '{bodyweight,bar}', '{cardio,explosive}'),
  ('Roll Sit Up Squat', 'functional', 4, 'Movimiento fluido', '{abs,quadriceps}', '{core,glutes}', '{bodyweight}', '{functional}'),
  ('Russian Twist', 'core', 3, 'Rotación torso', '{obliques,core}', '{abs}', '{bodyweight}', '{core,rotation}'),
  ('Crab Walk', 'functional', 3, 'Marcha invertida', '{shoulders,triceps,core}', '{chest,back}', '{bodyweight}', '{functional,shoulders}');

-- ============================================================================
-- Verify data insertion
-- ============================================================================
SELECT COUNT(*) as total_exercises FROM exercises;
