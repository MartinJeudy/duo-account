
import { createClient } from '@supabase/supabase-js';

/**
 * 🔑 CONFIGURATION :
 * 1. Allez dans Supabase > Settings (roue dentée en bas à gauche) > API
 * 2. Copiez "Project URL" et collez-le entre les ' ' ci-dessous
 * 3. Copiez "anon public" (la clé) et collez-la entre les ' ' ci-dessous
 */

// Remplacez l'URL ci-dessous par la vôtre
const supabaseUrl = 'https://qergugwazauinqlywbwe.supabase.co'; 

// Collez votre clé entre les deux apostrophes ci-dessous
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcmd1Z3dhemF1aW5xbHl3YndlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NzAyMDYsImV4cCI6MjA4NjA0NjIwNn0.nazSJD3elSdbe67JZ8240tI6Wb-RP6c8Ls8eEZh6q4Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const TABLE_NAME = 'expenses';
