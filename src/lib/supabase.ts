import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const remoteStorageFlag = (import.meta.env.VITE_USE_REMOTE_STORAGE || 'false').toLowerCase() === 'true'

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)
export const shouldUseRemoteStorage = remoteStorageFlag && hasSupabaseConfig

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

