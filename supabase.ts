/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { Database } from './types_supabase'; // You can generate this later or define it manually if needed

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Variáveis de ambiente do Supabase não encontradas. Certifique-se de configurar o arquivo .env.local');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);
