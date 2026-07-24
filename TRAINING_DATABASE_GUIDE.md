# 🏋️ FitFlow - Guía de Base de Datos de Entrenamientos

## Resumen Ejecutivo

Se ha analizado **12+ planes de entrenamiento** y se han identificado **45+ ejercicios únicos** organizados en 3 dificultades (Básico, Intermedio, Avanzado).

---

## 📊 Ejercicios Identificados

### CORE / ABDOMEN (9 ejercicios)
- **Abdomen Mariposa** - Reps: 20-50, Dificultad: 3
- **Sube y Baja Pierna (Leg Raises)** - Reps: 20-50, Dificultad: 3
- **Plancha (Plank)** - Duración: 20-50 seg, Dificultad: 2
- **Superman/Back Extension** - Reps: 20-50, Dificultad: 2
- **Escaladores (Mountain Climbers)** - Reps: 20-50, Dificultad: 3
- **Sit Ups** - Reps: 20-50, Dificultad: 2
- **Abdomen en V (V Sit Ups)** - Reps: 10-30, Dificultad: 4
- **Hollow Rock (Canoas)** - Reps: Max/Tiempo, Dificultad: 3
- **Seated In Out** - Reps: Max/Tiempo, Dificultad: 2

### CARDIO (8 ejercicios)
- **Burpee** - Reps: 3-100, Dificultad: 5 ⭐
- **Saltos en Lazo (Jump Rope)** - Reps: 50-300, Dificultad: 2
- **Saltos en Payaso (Jumping Jacks)** - Reps: 50-200, Dificultad: 2
- **Rodillas al Pecho (Knee Tucks)** - Reps: 20-50, Dificultad: 3
- **High Knees** - Reps: 20, Dificultad: 3
- **Salto en Lazo Doble (Double Under)** - Reps: 50-100, Dificultad: 3
- **Jumping Squat (Sentadilla con Salto)** - Reps: 20-50, Dificultad: 4
- **Skipping** - Duración: 30-60 seg, Dificultad: 2

### LOWER BODY / PIERNAS (10 ejercicios)
- **Sentadilla (Squat)** - Reps: 20-350, Dificultad: 3
- **Avanzadas/Lunges** - Reps: 15-60, Dificultad: 3
- **Sentadilla Lateral (Lateral Squat)** - Reps: 15-20, Dificultad: 3
- **Sentadilla Sumo (Sumo Squat)** - Reps: 15, Dificultad: 3
- **Sentadilla Pistola (Pistol Squat)** - Reps: 3-10, Dificultad: 5 ⭐
- **Step Up** - Reps: 30-75, Dificultad: 3
- **Sentadilla Búlgara (Bulgarian Split Squat)** - Reps: 10-20, Dificultad: 3
- **Elevación de Glúteo (Glute Bridge)** - Reps: 10-20, Dificultad: 2
- **Single Leg Bridge** - Reps: Max, Dificultad: 3
- **Wall Sit** - Duración: 30 seg, Dificultad: 3

### UPPER BODY / TREN SUPERIOR (12 ejercicios)
- **Push Up (Flexiones)** - Reps: 5-100, Dificultad: 3
- **Bench Dips (Fondos)** - Reps: 10-80, Dificultad: 3
- **Pike Push Up** - Reps: 8-50, Dificultad: 4
- **Diamond Push Up** - Reps: 8, Dificultad: 4
- **Push Up Negativo** - Reps: 10, Dificultad: 3
- **Push Up en Círculo** - Reps: 100, Dificultad: 3
- **Push Up con Rotación de Torso** - Reps: 30, Dificultad: 4
- **Hand Stand Push Ups (HSPU)** - Reps: 3-100, Dificultad: 5 ⭐
- **Low High to Plank** - Reps: 40, Dificultad: 3
- **Shoulder Taps** - Reps: 50, Dificultad: 3
- **Fly Push Ups** - Reps: 15, Dificultad: 4
- **Rocking Horse Push Ups** - Reps: 30-50, Dificultad: 4

### FUNCTIONAL / MOVIMIENTOS COMPLEJOS (6 ejercicios)
- **Gusanos/Inch Worms** - Reps: 6-30, Dificultad: 3
- **Half Burpee** - Reps: 60, Dificultad: 3
- **Burpee Over the Bar** - Reps: 50, Dificultad: 4
- **Roll Sit Ups Squat** - Reps: 5, Dificultad: 4
- **Russian Twist** - Reps: 20-50, Dificultad: 3
- **Flutter Kicks** - Reps: 20-50, Dificultad: 3

---

## 📋 Tipos de Entrenamientos Encontrados

### 1. **AMRAP (As Many Rounds As Possible)**
Realizar la mayor cantidad de rondas en un tiempo determinado (10-30 min)
- Ejemplo: 15-20 min AMRAP con 10 push ups + 20 sentadillas + 50 abdominales

### 2. **EMOM (Every Minute On The Minute)**
Realizar movimientos cada minuto, descansando lo que sobre
- Ejemplo: EMOM 21 min - Min 1: Burpees, Min 2: Abdomen, Min 3: Descansa

### 3. **POR TIEMPO (For Time)**
Completar un número de reps en el menor tiempo posible
- Ejemplo: 50 Burpees + 40 Push Ups + 150 Sentadillas

### 4. **TABATA**
20 seg trabajo / 10 seg descanso x 8 rondas (4 min total)

### 5. **Escalera (Pyramid)**
Subir y bajar en reps: 10-20-30-40-50 / 40-30-20-10

---

## 🗄️ Estructura de Base de Datos

### Tablas Creadas en Supabase:

1. **exercises** - Catálogo de todos los ejercicios
2. **training_plans** - Planes principales (Semana 1, Semana 5, etc.)
3. **training_plan_days** - Días dentro de cada plan
4. **training_phases** - Las 3 fases (Warmup, Strength, WOD)
5. **training_phase_exercises** - Ejercicios individuales en cada fase

Ver: `supabase_training_schema.sql`

---

## 🚀 Pasos para Implementar en Supabase

### Paso 1: Crear el Schema
```sql
-- Ejecutar el archivo supabase_training_schema.sql en Supabase
```

### Paso 2: Insertar Ejercicios Base
```sql
INSERT INTO exercises (name, category, difficulty, primary_muscles, equipment, tags)
VALUES
  ('Burpee', 'functional', 5, '["chest","triceps","legs"]', '["bodyweight"]', '["cardio","HIIT"]'),
  ('Push Up', 'strength', 3, '["chest","triceps"]', '["bodyweight"]', '["upper_body"]'),
  -- ... más ejercicios
```

### Paso 3: Crear un Plan de Entrenamiento
```sql
INSERT INTO training_plans (name, description, difficulty, duration_weeks, duration_days)
VALUES ('Plan Semana 1 - Básico', 'Plan básico de 5 días', 'beginner', 1, 5)
RETURNING id;
```

### Paso 4: Agregar Días al Plan
```sql
INSERT INTO training_plan_days (training_plan_id, day_number, day_name, total_duration, intensity)
VALUES ('plan-id', 1, 'Monday', 50, 'moderate');
```

### Paso 5: Crear Fases para cada Día
```sql
INSERT INTO training_phases (training_plan_day_id, phase_type, phase_title, duration_minutes, order_number)
VALUES ('day-id', 'warmup', '🔥 Calentamiento', 10, 1);
```

### Paso 6: Agregar Ejercicios a cada Fase
```sql
INSERT INTO training_phase_exercises (training_phase_id, exercise_id, reps, sets, rest_seconds, order_number)
VALUES ('phase-id', 'exercise-id', '50', 1, 0, 1);
```

---

## 📱 Integración con la App

### Actualizar `workoutService.ts`:
```typescript
// Obtener un plan completo de Supabase
export const getCompletePlan = async (planId: string): Promise<WorkoutPlan> => {
  const { data } = await supabase
    .from('training_plans')
    .select(`
      *,
      training_plan_days(
        *,
        training_phases(
          *,
          training_phase_exercises(
            *,
            exercises(*)
          )
        )
      )
    `)
    .eq('id', planId);
  
  return transformToWorkoutPlan(data[0]);
}
```

### Transformar datos a estructura de la app:
```typescript
interface WorkoutDay {
  id: string
  day: string
  phases: WorkoutPhase[]
  totalDuration: number
  intensity: 'light' | 'moderate' | 'high'
}

interface WorkoutPhase {
  phase: 'warmup' | 'strength' | 'wod'
  phaseTitle: string
  exercises: ExerciseInWorkout[]
  duration: number
}
```

---

## 📊 Estadísticas de los Planes

| Métrica | Cantidad |
|---------|----------|
| **Planes Diferentes** | 12+ |
| **Semanas Cubiertas** | 1-13 |
| **Ejercicios Únicos** | 45+ |
| **Dificultades** | 5 (1-5) |
| **Tipos de Entrenamientos** | 6 (AMRAP, EMOM, For Time, Tabata, Ladder, Timed) |
| **Categorías** | 5 (Core, Cardio, Lower Body, Upper Body, Functional) |

---

## 🎯 Próximos Pasos

1. ✅ **Esquema SQL creado** → `supabase_training_schema.sql`
2. ✅ **45+ Ejercicios identificados** → `fitness_database.json`
3. ⏭️ **Insertar todos los ejercicios en Supabase** (Script Python/Node)
4. ⏭️ **Crear 3-5 planes completos de ejemplo**
5. ⏭️ **Conectar workoutService a la tabla training_plans**
6. ⏭️ **Permitir que usuarios seleccionen planes existentes vs generar nuevos**

---

## 💡 Sugerencias

- Los planes tienen **buenos patrones de progresión**: Básico → Intermedio → Avanzado
- Hay **variación en tipos de entrenamientos** (AMRAP, EMOM, etc.)
- Los **ejercicios se repiten** entre planes pero con diferentes reps
- Perfecto para crear un **sistema de templates reutilizables**

---

## 📎 Archivos Relacionados

- `supabase_training_schema.sql` - Schema de base de datos
- `fitness_database.json` - Ejercicios y planes en JSON
- `workoutService.ts` - Servicio para manejar planes
