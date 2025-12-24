-- Migración para agregar columna show_in_timeline a experiences y projects
-- Esta columna permite que los usuarios decidan qué experiencias y proyectos
-- aparecen en la sección de Trayectoria del perfil

-- Agregar columna a experiences
ALTER TABLE public.experiences
ADD COLUMN IF NOT EXISTS show_in_timeline BOOLEAN DEFAULT true;

-- Agregar columna a projects
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS show_in_timeline BOOLEAN DEFAULT true;

-- Actualizar registros existentes para que muestren en timeline por default
UPDATE public.experiences SET show_in_timeline = true WHERE show_in_timeline IS NULL;
UPDATE public.projects SET show_in_timeline = true WHERE show_in_timeline IS NULL;
