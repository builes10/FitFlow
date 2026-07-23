import { createClient } from '@supabase/supabase-js'

// NOTA: Reemplaza con tus valores de Supabase
const SUPABASE_URL = (import.meta.env as any).VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = (import.meta.env as any).VITE_SUPABASE_ANON_KEY || ''

const isConfigured = !!SUPABASE_URL && !!SUPABASE_ANON_KEY

if (!isConfigured) {
  console.warn('⚠️ Supabase credentials not configured. Using mock data.')
}

// Create client only if configured, otherwise create a dummy client
export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : ({} as any) // Dummy client when not configured

// Helper para verificar si Supabase está configurado
export const isSupabaseConfigured = () => isConfigured
