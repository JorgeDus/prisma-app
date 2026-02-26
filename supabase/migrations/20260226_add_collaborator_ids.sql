-- Add collaborator_ids column to projects table
-- Stores UUIDs of Prisma users who collaborated on the project
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS collaborator_ids uuid[] DEFAULT '{}';

-- Add collaborator_ids column to experiences table
-- Stores UUIDs of Prisma users who participated in the experience
ALTER TABLE experiences
ADD COLUMN IF NOT EXISTS collaborator_ids uuid[] DEFAULT '{}';
