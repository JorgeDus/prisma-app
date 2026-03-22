-- Add original_project_id to projects to support the "Fork/Clone" collaboration model
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS original_project_id uuid REFERENCES projects(id) ON DELETE SET NULL;

-- Add original_experience_id to experiences to support the "Fork/Clone" collaboration model
ALTER TABLE experiences
ADD COLUMN IF NOT EXISTS original_experience_id uuid REFERENCES experiences(id) ON DELETE SET NULL;
