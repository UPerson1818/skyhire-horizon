
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdxzzexvclftxkejnsky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1keHp6ZXh2Y2xmdHhrZWpuc2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMzYxNDMsImV4cCI6MjA1NTcxMjE0M30.R7UIWfzZCyN3uLp03XwnFtDOFPwzgUFlnyUbALJetnE';

export const supabase = createClient(supabaseUrl, supabaseKey);
