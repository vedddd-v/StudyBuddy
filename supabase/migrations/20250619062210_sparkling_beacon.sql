/*
  # Update profiles table for email authentication

  1. Changes
    - Replace phone column with email column
    - Update existing data structure

  2. Security
    - Maintain existing RLS policies
*/

-- Add email column and make phone nullable temporarily
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;

-- Update phone column to be nullable
ALTER TABLE profiles ALTER COLUMN phone DROP NOT NULL;

-- Add unique constraint on email
ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);