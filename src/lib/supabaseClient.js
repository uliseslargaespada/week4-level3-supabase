
/**
 * Supabase client initialization.
 *
 * This file creates a single shared Supabase client for the entire app.
 * We read the project URL and anon key from Vite environment variables.
 */

import { createClient } from '@supabase/supabase-js';

// Read values from environment variables.
// In Vite, only variables prefixed with "VITE_" are exposed to the client.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Basic safety check – helps catch misconfigured env vars during development.
if (!supabaseUrl || !supabasePublishableKey) {
  console.error(
    "Missing Supabase configuration. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY."
  );
}

/**
 * Single Supabase client instance used by the React app.
 * The publishable key is safe to use in the browser. Row Level Security
 * policies protect the data returned through this client.
 */
export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
);
