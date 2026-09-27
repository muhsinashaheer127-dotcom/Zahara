import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://pfafkiztoqkrvsagvacz.supabase.co'

// Support both naming conventions used in this project
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_nIhMtlwqDDHGzecph6wzCw_msmAlTFN'

if (!supabaseAnonKey) {
  console.warn('[Supabase] Missing VITE_SUPABASE_ANON_KEY / VITE_SUPABASE_PUBLISHABLE_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export default supabase
