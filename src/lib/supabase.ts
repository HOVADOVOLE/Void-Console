import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Inicializace Supabase klienta.
 * Tento klient se používá pro autentizaci, RLS dotazy do databáze
 * a volání Edge funkcí.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper pro bezpečné volání NASA API skrze naši proxy (Edge Function).
 * @param endpoint - Cílový endpoint NASA API (např. 'planetary/apod')
 * @param params - Query parametry pro požadavek
 */
export const callNasaApi = async (endpoint: string, params: Record<string, string> = {}) => {
  const { data, error } = await supabase.functions.invoke('nasa-proxy', {
    body: { endpoint, params },
  });

  if (error) throw error;
  return data;
};
