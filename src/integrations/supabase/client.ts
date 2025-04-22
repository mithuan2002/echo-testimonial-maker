import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zryzmamiastvtvvsjhtt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyeXptYW1pYXN0dnR2dnNqaHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMTg5MDksImV4cCI6MjA2MDc5NDkwOX0.jrBa1OqedPbZEJmOodlniWeW8Nj0w9Ha1sYMb_0V2Fk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});