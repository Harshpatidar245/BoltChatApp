import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          room_id: string;
          username: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          username: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          username?: string;
          content?: string;
          created_at?: string;
        };
      };
    };
  };
};
