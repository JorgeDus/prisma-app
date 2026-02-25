-- Add degree_type column to user_careers table
ALTER TABLE user_careers 
ADD COLUMN degree_type TEXT DEFAULT 'Carrera de Pregrado' CHECK (degree_type IN ('Carrera de Pregrado', 'Magíster', 'Doctorado'));
