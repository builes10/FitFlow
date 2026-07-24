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
