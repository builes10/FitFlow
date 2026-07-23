🚀 **FITFLOW - WEB APP REACT**

# ⚡ Inicio Rápido (3 Pasos)

## ✅ Paso 1: Instala Dependencias

Abre PowerShell y ve a la carpeta FitFlow:

```powershell
cd C:\Users\Alejandro\Desktop\CLAUDE\FitFlow
npm install
```

⏱️ Esto toma ~2-3 minutos (descarga React, Tailwind, etc)

---

## ✅ Paso 2: Archivo .env (Opcional para MVP)

**Para MVP con mock data**, puedes ignorar este paso. La app funciona perfectamente sin Supabase.

Si quieres conectar Supabase después, crea `.env.local`:

```
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

**Ver**: `SUPABASE_MIGRATION.md` para instrucciones completas de Supabase

---

## ✅ Paso 3: Inicia el Servidor

```powershell
npm run dev
```

¡La app se abrirá automáticamente en `http://localhost:3000`! 🎉

---

# 🧪 Prueba la App

### Login de Prueba

- Email: `test@fitflow.com`
- Password: `password123`

Click "Login" y verás el Dashboard.

### O Crea una Cuenta

Click "Sign Up" y crea tu propia cuenta (datos locales, se guardan en el navegador).

---

# 📁 Estructura del Proyecto

```
FitFlow/
├── src/
│   ├── pages/              # Pantallas principales
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   └── DashboardPage.tsx
│   ├── services/           # Lógica (auth, datos)
│   │   ├── authService.ts
│   │   └── supabaseClient.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── styles/             # CSS (Tailwind)
│   ├── App.tsx             # Rutas principales
│   └── main.tsx            # Entrada
├── package.json            # Dependencias
├── vite.config.ts          # Config Vite
├── tailwind.config.js      # Config Tailwind
└── index.html              # HTML base
```

---

# 🎯 Lo que Funciona Ahora

## ✅ SPRINT 1 - COMPLETADO
✅ **Login/Signup** - Crear cuenta, guardar usuario  
✅ **Dashboard** - Ver perfil, información de usuario  
✅ **Persistencia** - Datos se guardan en localStorage  
✅ **Responsive** - Funciona en PC, tablet, iPhone  
✅ **Tailwind CSS** - Estilos modernos incluidos  

## ✅ SPRINT 2 - COMPLETADO (2026-07-22)
✅ **Assessment Wizard** - 3 tests interactivos  
✅ **Burpee Test** - Timer de 3 minutos con contador en tiempo real  
✅ **Strength Test** - Push-ups y squats máximos  
✅ **Flexibility Test** - Sit and Reach con conversión de unidades  
✅ **Cálculos** - VO2 Max, reps, conversiones automáticas  
✅ **Integración** - Botón "Start Assessment" en dashboard  

**Prueba el Assessment Wizard:**
1. Login con test@fitflow.com / password123
2. En Dashboard, click "Complete Your Assessment"
3. Click "Start Assessment"
4. Completa los 3 tests y ve tus resultados

---

# 🔄 Próximo: SPRINT 3

En el siguiente sprint añadiremos:
- Generador de planes de entrenamiento personalizados
- Librería de 150+ ejercicios
- Seguimiento de progreso
- Supabase integration para persistencia real

---

# ❓ Problemas Comunes

### "npm: command not found"
→ Node.js no está instalado. Descárgalo: https://nodejs.org/

### "Port 3000 is already in use"
→ Otro app está usando ese puerto. Mata el proceso:
```powershell
npx kill-port 3000
```

### "Module not found '@/...'"
→ Reinicia el dev server (Ctrl+C, luego `npm run dev`)

### Cambios no se ven
→ Hard refresh: Ctrl+Shift+R (o Cmd+Shift+R en Mac)

---

# 🚀 Comandos Útiles

```powershell
# Inicia dev server
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview

# Chequea tipos TypeScript
npm run type-check
```

---

# 📱 Deploy (Gratis)

Cuando esté listo para producción:

### Opción 1: Vercel (Recomendado - GRATIS)
1. Ve a https://vercel.com
2. Conecta tu GitHub (sube el repo)
3. Click "Deploy"
4. ¡Listo! Tu app está en línea

### Opción 2: Netlify
1. Ve a https://netlify.com
2. Conecta tu GitHub
3. Selecciona repo FitFlow
4. Click "Deploy site"

---

# 💡 Próximas Mejoras

- [ ] Conectar a Supabase (base de datos real)
- [x] Assessment Wizard ✅ COMPLETO
- [x] Cálculos de fitness ✅ COMPLETO
- [ ] Generador de planes (SPRINT 3)
- [ ] Tracking de progreso (SPRINT 3)
- [ ] Librería de ejercicios (SPRINT 3)

---

**¡Listo! ¿Necesitas ayuda?**

Cualquier problema, avísame. Estoy aquí para ayudarte. 👊

¡A codear! 🚀
