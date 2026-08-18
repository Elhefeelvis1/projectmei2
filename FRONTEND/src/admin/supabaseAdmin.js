import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

/**
 * Admin-only Supabase client that uses the service role key.
 * This bypasses Row Level Security (RLS) for privileged admin mutations.
 *
 * ⚠️  WARNING: This key has full DB access. Only import this in admin-gated
 * components. Never expose it in user-facing pages.
 *
 * For production, consider moving admin mutations to a Supabase Edge Function
 * so the service key never ships to the browser.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        // Disable auto session persistence for the service client —
        // it should never manage user sessions.
        persistSession: false,
        autoRefreshToken: false,
    }
});
