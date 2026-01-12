-- Migration: Add end_date and is_current to achievements table
-- This enables date ranges for academic_role (Ayudantía/Investigación) achievements

ALTER TABLE achievements 
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN achievements.end_date IS 'End date for academic_role achievements (Ayudantía/Investigación)';
COMMENT ON COLUMN achievements.is_current IS 'Whether the user is currently in this role (for academic_role)';
