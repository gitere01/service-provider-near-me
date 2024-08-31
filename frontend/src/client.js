import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://znqrwquuydaqibjucllz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucXJ3cXV1eWRhcWlianVjbGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg1OTU0NjcsImV4cCI6MjAyNDE3MTQ2N30.y3OB0WvCiKssPHwtzHyngHpnnXZ3jiLIh9Y0skCNztU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

