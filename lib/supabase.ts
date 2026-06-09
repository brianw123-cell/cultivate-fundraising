import { createClient } from "@supabase/supabase-js";

// Public values. The anon key is safe to expose (RLS governs access). For this
// demo, RLS allows read + insert on demo tables so the clickable flow works
// without auth. In production you'd lock RLS down and use a service role for
// writes. Hardcoded fallbacks let the app run on Vercel without env config.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://icqveiprwsjvjvekvcel.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcXZlaXByd3Nqdmp2ZWt2Y2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NjMwMjUsImV4cCI6MjA5NjUzOTAyNX0.HEl0CKJ_XHaaXcxA9RYe64JHaCpi8gOlRJq63X_HaWo";

export function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
