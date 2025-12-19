-- =============================================
-- PRISMA - Student Portfolio Platform
-- Migration: Lookup Tables (Universities & Careers)
-- =============================================

-- =============================================
-- 1. LOOKUP TABLES (Tablas de Referencia)
-- =============================================

-- ---------------------------------------------
-- UNIVERSITIES
-- Tabla de referencia para universidades
-- ---------------------------------------------
CREATE TABLE public.universities (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Comentario descriptivo
COMMENT ON TABLE public.universities IS 'Tabla de referencia para universidades - Solo lectura para usuarios';

-- ---------------------------------------------
-- CAREERS
-- Tabla de referencia para carreras
-- ---------------------------------------------
CREATE TABLE public.careers (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Comentario descriptivo
COMMENT ON TABLE public.careers IS 'Tabla de referencia para carreras - Solo lectura para usuarios';


-- =============================================
-- 2. ROW LEVEL SECURITY (RLS) - LOOKUP TABLES
-- =============================================

-- Habilitar RLS en tablas de referencia
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------
-- UNIVERSITIES POLICIES (Read-only para todos)
-- ---------------------------------------------

-- Cualquiera puede ver universidades
CREATE POLICY "Universities are viewable by everyone"
    ON public.universities
    FOR SELECT
    USING (true);

-- Solo service_role (admin) puede insertar (no hay política para usuarios normales)
-- Las inserciones se harán directamente desde el dashboard o con service_role key

-- ---------------------------------------------
-- CAREERS POLICIES (Read-only para todos)
-- ---------------------------------------------

-- Cualquiera puede ver carreras
CREATE POLICY "Careers are viewable by everyone"
    ON public.careers
    FOR SELECT
    USING (true);

-- Solo service_role (admin) puede insertar (no hay política para usuarios normales)
-- Las inserciones se harán directamente desde el dashboard o con service_role key


-- =============================================
-- 3. MODIFY PROFILES TABLE
-- Migrar de TEXT a Foreign Keys
-- =============================================

-- Agregar nuevas columnas con Foreign Keys
ALTER TABLE public.profiles
    ADD COLUMN university_id INT REFERENCES public.universities(id) ON DELETE SET NULL,
    ADD COLUMN career_id INT REFERENCES public.careers(id) ON DELETE SET NULL;

-- Crear índices para mejorar performance en JOINs
CREATE INDEX idx_profiles_university_id ON public.profiles(university_id);
CREATE INDEX idx_profiles_career_id ON public.profiles(career_id);

-- Eliminar columnas antiguas de texto libre
ALTER TABLE public.profiles
    DROP COLUMN IF EXISTS university,
    DROP COLUMN IF EXISTS degree;

-- Comentarios descriptivos
COMMENT ON COLUMN public.profiles.university_id IS 'FK a universities.id - Universidad del estudiante';
COMMENT ON COLUMN public.profiles.career_id IS 'FK a careers.id - Carrera del estudiante';


-- =============================================
-- 4. SEED DATA (Datos de prueba)
-- =============================================

-- ---------------------------------------------
-- Universidades principales de Chile
-- ---------------------------------------------
INSERT INTO public.universities (name) VALUES
    ('Universidad de Chile'),
    ('Pontificia Universidad Católica de Chile'),
    ('Universidad de Concepción'),
    ('Universidad de Santiago de Chile'),
    ('Universidad Adolfo Ibáñez');

-- ---------------------------------------------
-- Carreras comunes
-- ---------------------------------------------
INSERT INTO public.careers (name) VALUES
    ('Derecho'),
    ('Ingeniería Civil'),
    ('Periodismo'),
    ('Psicología'),
    ('Diseño');


-- =============================================
-- 5. UPDATE HANDLE_NEW_USER FUNCTION
-- Actualizar función para no incluir campos eliminados
-- =============================================

-- Recrear la función sin los campos university y degree
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)), ' ', '_')) || '_' || SUBSTR(NEW.id::text, 1, 8)
        ),
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =============================================
-- MIGRATION COMPLETE! 🎓
-- =============================================
