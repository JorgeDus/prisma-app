-- Add has_completed_tour field to profiles table
-- This field tracks whether the user has completed the onboarding tour

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS has_completed_tour BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN profiles.has_completed_tour IS 'Tracks whether user has completed the dashboard onboarding tour';
