import { supabase } from '../lib/supabase';

export interface FavoriteItem {
  id: string;
  user_id: string;
  nasa_id: string;
  type: 'APOD' | 'NEO' | 'MARS' | 'EARTH' | 'SOLAR';
  metadata: any;
  created_at: string;
}

export const getFavorites = async (): Promise<FavoriteItem[]> => {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addFavorite = async (item: Omit<FavoriteItem, 'id' | 'user_id' | 'created_at'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('favorites')
    .insert([{ ...item, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeFavorite = async (id: string) => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

/**
 * Zkontroluje, zda je položka již v oblíbených (podle nasa_id).
 * Toto je pomocná funkce pro UI (abychom věděli, zda zobrazit "Save" nebo "Saved").
 */
export const checkIsFavorite = async (nasa_id: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('nasa_id', nasa_id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 znamená "žádné výsledky", což je OK
    console.error('Error checking favorite:', error);
  }
  
  return !!data;
};
