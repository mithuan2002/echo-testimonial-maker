
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const supabase = createClient<Database>(
  "https://zryzmamiastvtvvsjhtt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyeXptYW1pYXN0dnR2dnNqaHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMTg5MDksImV4cCI6MjA2MDc5NDkwOX0.jrBa1OqedPbZEJmOodlniWeW8Nj0w9Ha1sYMb_0V2Fk"
);
