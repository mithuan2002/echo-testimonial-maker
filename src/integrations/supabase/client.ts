
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zryzmamiastvtvvsjhtt.supabase.co' ;

const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyeXptYW1pYXN0dnR2dnNqaHR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTIxODkwOSwiZXhwIjoyMDYwNzk0OTA5fQ.m6O4tgGC0nYtwAljNULVlMufOY9-aJrah-4zZ31O1L0';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
