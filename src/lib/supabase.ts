import { createClient } from '@supabase/supabase-js';
import type { Block } from '@blocknote/core';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Document type (team-based, not user-based)
export interface Document {
  id: string;
  team_id: string;
  title: string;
  content: Block[]; // BlockNote document structure
  created_at: string;
  updated_at: string; // Server-controlled via trigger
}

// Team context - configured for your two-person team
export async function getUserTeamId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Query team_members table to get user's team
  const { data, error } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .single();
  
  if (error || !data) {
    console.error('Failed to get team_id:', error);
    return null;
  }
  
  return data.team_id;
}
