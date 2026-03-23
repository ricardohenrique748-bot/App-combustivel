import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rlewaornzuxnadoyxfof.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_fKXdF9TgYm7g37L0zmyt4w_vWDMpuzj';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
