/**
 * Supabase configuration guard.
 *
 * The app must run without keys (fresh clone, CI, previews before Cat wires
 * the projects) — auth surfaces render a friendly "not configured" note
 * instead of crashing. See docs/SETUP.md for provisioning steps.
 */
export function getSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}
