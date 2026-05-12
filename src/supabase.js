import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isConfigured = !!(SUPABASE_URL && SUPABASE_KEY)

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null

export async function loadData(key) {
  if (!isConfigured) return null
  try {
    const { data, error } = await supabase
      .from('app_data')
      .select('value')
      .eq('key', key)
      .maybeSingle()
    if (error) throw error
    return data?.value ?? null
  } catch (e) {
    console.error('[supabase] loadData:', e.message)
    return null
  }
}

export async function saveData(key, value) {
  if (!isConfigured) return
  try {
    const { error } = await supabase
      .from('app_data')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    if (error) throw error
  } catch (e) {
    console.error('[supabase] saveData:', e.message)
  }
}

export function subscribeData(key, callback) {
  if (!isConfigured) return null
  return supabase
    .channel(`realtime_${key}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'app_data', filter: `key=eq.${key}` },
      payload => callback(payload.new.value)
    )
    .subscribe()
}
