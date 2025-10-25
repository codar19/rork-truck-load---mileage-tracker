import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export type Database = {
  public: {
    Tables: {
      loads: {
        Row: {
          id: string;
          pickup_location: string;
          delivery_location: string;
          pickup_date: string;
          delivery_date: string;
          cargo_weight: number;
          cargo_type: string;
          rate: number;
          distance: number;
          status: string;
          driver_id: string | null;
          odometer_dispatch: number | null;
          odometer_pickup: number | null;
          odometer_delivery: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pickup_location: string;
          delivery_location: string;
          pickup_date: string;
          delivery_date: string;
          cargo_weight: number;
          cargo_type: string;
          rate: number;
          distance: number;
          status?: string;
          driver_id?: string | null;
          odometer_dispatch?: number | null;
          odometer_pickup?: number | null;
          odometer_delivery?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pickup_location?: string;
          delivery_location?: string;
          pickup_date?: string;
          delivery_date?: string;
          cargo_weight?: number;
          cargo_type?: string;
          rate?: number;
          distance?: number;
          status?: string;
          driver_id?: string | null;
          odometer_dispatch?: number | null;
          odometer_pickup?: number | null;
          odometer_delivery?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: string;
          created_at?: string;
        };
      };
      offers: {
        Row: {
          id: string;
          load_id: string;
          driver_id: string;
          offered_rate: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          load_id: string;
          driver_id: string;
          offered_rate: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          load_id?: string;
          driver_id?: string;
          offered_rate?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
