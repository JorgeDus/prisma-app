-- Migration: Add sector and professor_name to experiences table
ALTER TABLE experiences 
ADD COLUMN sector text,
ADD COLUMN professor_name text;

-- Add comments for documentation
COMMENT ON COLUMN experiences.sector IS 'Sector de la experiencia: Público o Privado';
COMMENT ON COLUMN experiences.professor_name IS 'Nombre del profesor a cargo en caso de Ayudantías';
