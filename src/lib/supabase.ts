import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars. Check your .env file against .env.example');
}

// ฝั่ง frontend ใช้ anon key เท่านั้น (ปลอดภัย เพราะ RLS policy ที่ตั้งไว้จะคุ้มครองข้อมูลอยู่แล้ว)
// ห้ามใช้ service role key ฝั่งนี้เด็ดขาด
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
