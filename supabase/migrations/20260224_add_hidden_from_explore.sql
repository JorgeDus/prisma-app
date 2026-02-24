-- Add hidden_from_explore flag to profiles
-- Allows admins to hide specific users from the Explore tab without deleting or pausing the account.

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS hidden_from_explore boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN profiles.hidden_from_explore IS 'When true, this profile is excluded from the /explorar discovery page for other users. Set by admins only.';
