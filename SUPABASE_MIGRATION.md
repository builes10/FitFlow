# 📋 Supabase Migration Checklist

**Estado Actual**: MVP funcionando con **mock data** en localStorage  
**Objetivo**: Migrar a Supabase cuando esté listo

---

## 🗄️ TABLAS A CREAR EN SUPABASE

### 1. `users` (Autenticación + Perfil)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  profile_image TEXT,
  fitness_level TEXT CHECK (fitness_level IN ('untrained', 'beginner', 'intermediate', 'advanced', 'elite')),
  days_per_week INTEGER,
  preferred_training_time TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. `fitness_goals` (Metas de fitness del usuario)
```sql
CREATE TABLE fitness_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  goal TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. `injuries` (Historial de lesiones)
```sql
CREATE TABLE injuries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  injury_name TEXT NOT NULL,
  date TIMESTAMP,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. `fitness_assessments` (Resultados de pruebas)
```sql
CREATE TABLE fitness_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  test_type TEXT NOT NULL,
  result_value FLOAT,
  vo2_max FLOAT,
  fitness_level TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. `workouts` (Planes de entrenamiento)
```sql
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  exercises JSONB,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. `exercises` (Librería de ejercicios)
```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  muscle_groups TEXT[],
  equipment TEXT[],
  difficulty TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 CONFIGURACIÓN DE SEGURIDAD (RLS - Row Level Security)

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE injuries ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo ven sus propios datos
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Similar para otras tablas...
```

---

## 🔧 CAMBIOS DE CÓDIGO NECESARIOS

### En `src/services/authService.ts`:
- [ ] Cambiar de mock data a `supabase.auth.signInWithPassword()`
- [ ] Usar `supabase.from('users').select()` para obtener perfil
- [ ] Crear usuario en tabla `users` después del signup

### En `src/services/assessmentService.ts` (crear):
- [ ] Guardar resultados de assessment en `fitness_assessments`
- [ ] Guardar ejercicios en `workouts`

### En `.env.local`:
- [ ] Agregar `VITE_SUPABASE_URL`
- [ ] Agregar `VITE_SUPABASE_ANON_KEY`

---

## 📝 VARIABLES DE ENTORNO

```env
# .env.local
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

---

## ✅ PASOS PARA MIGRAR (cuando esté listo)

1. **Crear el proyecto en Supabase** ✅ (ya hecho)
2. **Ejecutar SQL para crear tablas** (script arriba)
3. **Configurar RLS policies**
4. **Actualizar authService.ts** para usar Supabase
5. **Llenar tabla `exercises`** con datos de ExerciseDB
6. **Actualizar `.env.local`** con credenciales reales
7. **Testear login con Supabase**
8. **Migrar datos de usuarios existentes** (si aplica)

---

## 🎯 ESTADO ACTUAL

| Feature | Mock Data | Supabase |
|---------|:---------:|:--------:|
| Login/Signup | ✅ | ⏳ |
| Dashboard | ✅ | ⏳ |
| Assessment Tests | ✅ | ⏳ |
| Workout Plans | ✅ | ⏳ |
| Persistencia | localStorage | DB |

---

**Creado el**: 2026-07-22  
**Última actualización**: 2026-07-22
