import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function loadData(key) {
  const { data, error } = await supabase
    .from('app_data')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  if (error) console.error('[supabase] loadData:', error.message)
  return data?.value ?? null
}

export async function saveData(key, value) {
  const { error } = await supabase
    .from('app_data')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) console.error('[supabase] saveData:', error.message)
}

export function subscribeData(key, callback) {
  return supabase
    .channel(`realtime_${key}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'app_data', filter: `key=eq.${key}` },
      payload => callback(payload.new.value)
    )
    .subscribe()
}
