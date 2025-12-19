-- =============================================
-- PRISMA - Student Portfolio Platform
-- Supabase Database Schema
-- =============================================

-- =============================================
-- 1. ENUM TYPES
-- =============================================

-- Eliminar tipos existentes si existen (para migraciones idempotentes)
DROP TYPE IF EXISTS project_type CASCADE;
DROP TYPE IF EXISTS achievement_type CASCADE;
DROP TYPE IF EXISTS experience_type CASCADE;

-- Tipo de proyecto
CREATE TYPE project_type AS ENUM ('academic', 'startup', 'personal');

-- Tipo de logro
CREATE TYPE achievement_type AS ENUM ('award', 'certification', 'course_chair');

-- Tipo de experiencia
CREATE TYPE experience_type AS ENUM ('job', 'internship', 'volunteering', 'leadership');


-- =============================================
-- 2. LOOKUP TABLES (Tablas de Referencia)
-- =============================================

-- Eliminar tablas existentes si existen (en orden inverso de dependencias)
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.pivots CASCADE;
DROP TABLE IF EXISTS public.experiences CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.careers CASCADE;
DROP TABLE IF EXISTS public.universities CASCADE;

-- ---------------------------------------------
-- UNIVERSITIES
-- Tabla de referencia para universidades
-- ---------------------------------------------
CREATE TABLE public.universities (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

COMMENT ON TABLE public.universities IS 'Tabla de referencia para universidades - Solo lectura para usuarios';

-- ---------------------------------------------
-- CAREERS
-- Tabla de referencia para carreras
-- ---------------------------------------------
CREATE TABLE public.careers (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

COMMENT ON TABLE public.careers IS 'Tabla de referencia para carreras - Solo lectura para usuarios';


-- =============================================
-- 3. TABLES
-- =============================================

-- ---------------------------------------------
-- PROFILES
-- Tabla principal de perfiles vinculada a auth.users
-- ---------------------------------------------
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    headline TEXT,
    university_id INT REFERENCES public.universities(id) ON DELETE SET NULL,
    career_id INT REFERENCES public.careers(id) ON DELETE SET NULL,
    about TEXT,
    avatar_url TEXT,
    email TEXT,
    interests TEXT[] DEFAULT '{}',
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para búsquedas
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_university_id ON public.profiles(university_id);
CREATE INDEX idx_profiles_career_id ON public.profiles(career_id);

-- ---------------------------------------------
-- PROJECTS
-- Proyectos del portafolio
-- ---------------------------------------------
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    cover_image TEXT,
    skills TEXT[] DEFAULT '{}',
    is_startup BOOLEAN DEFAULT FALSE,
    type project_type NOT NULL DEFAULT 'personal',
    demo_url TEXT,
    repo_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índice para búsquedas por usuario
CREATE INDEX idx_projects_user_id ON public.projects(user_id);

-- ---------------------------------------------
-- ACHIEVEMENTS
-- Logros, certificaciones y premios
-- ---------------------------------------------
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    organization TEXT,
    date DATE,
    category achievement_type NOT NULL DEFAULT 'certification',
    professor_name TEXT,
    distinction TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índice para búsquedas por usuario
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);

-- ---------------------------------------------
-- EXPERIENCES
-- Experiencias laborales, pasantías, voluntariados
-- ---------------------------------------------
CREATE TABLE public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    type experience_type NOT NULL DEFAULT 'job',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índice para búsquedas por usuario
CREATE INDEX idx_experiences_user_id ON public.experiences(user_id);

-- ---------------------------------------------
-- PIVOTS
-- Tabla de resiliencia - desafíos y aprendizajes
-- ---------------------------------------------
CREATE TABLE public.pivots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge TEXT NOT NULL,
    learning TEXT NOT NULL,
    skills_learned TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índice para búsquedas por usuario
CREATE INDEX idx_pivots_user_id ON public.pivots(user_id);

-- ---------------------------------------------
-- TESTIMONIALS
-- Testimonios de otros usuarios
-- ---------------------------------------------
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_role TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índice para búsquedas por usuario
CREATE INDEX idx_testimonials_user_id ON public.testimonials(user_id);


-- =============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pivots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------
-- UNIVERSITIES POLICIES (Read-only para todos)
-- ---------------------------------------------

-- Cualquiera puede ver universidades
CREATE POLICY "Universities are viewable by everyone"
    ON public.universities
    FOR SELECT
    USING (true);

-- Nota: No hay políticas de INSERT/UPDATE/DELETE para usuarios normales
-- Solo service_role (admin) puede modificar esta tabla

-- ---------------------------------------------
-- CAREERS POLICIES (Read-only para todos)
-- ---------------------------------------------

-- Cualquiera puede ver carreras
CREATE POLICY "Careers are viewable by everyone"
    ON public.careers
    FOR SELECT
    USING (true);

-- Nota: No hay políticas de INSERT/UPDATE/DELETE para usuarios normales
-- Solo service_role (admin) puede modificar esta tabla

-- ---------------------------------------------
-- PROFILES POLICIES
-- ---------------------------------------------

-- Cualquiera puede ver perfiles públicos
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles
    FOR SELECT
    USING (true);

-- Solo el dueño puede insertar su perfil
CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Solo el dueño puede actualizar su perfil
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Solo el dueño puede eliminar su perfil
CREATE POLICY "Users can delete their own profile"
    ON public.profiles
    FOR DELETE
    USING (auth.uid() = id);

-- ---------------------------------------------
-- PROJECTS POLICIES
-- ---------------------------------------------

-- Cualquiera puede ver proyectos
CREATE POLICY "Projects are viewable by everyone"
    ON public.projects
    FOR SELECT
    USING (true);

-- Solo el dueño puede insertar proyectos
CREATE POLICY "Users can insert their own projects"
    ON public.projects
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede actualizar sus proyectos
CREATE POLICY "Users can update their own projects"
    ON public.projects
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede eliminar sus proyectos
CREATE POLICY "Users can delete their own projects"
    ON public.projects
    FOR DELETE
    USING (auth.uid() = user_id);

-- ---------------------------------------------
-- ACHIEVEMENTS POLICIES
-- ---------------------------------------------

-- Cualquiera puede ver logros
CREATE POLICY "Achievements are viewable by everyone"
    ON public.achievements
    FOR SELECT
    USING (true);

-- Solo el dueño puede insertar logros
CREATE POLICY "Users can insert their own achievements"
    ON public.achievements
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede actualizar sus logros
CREATE POLICY "Users can update their own achievements"
    ON public.achievements
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede eliminar sus logros
CREATE POLICY "Users can delete their own achievements"
    ON public.achievements
    FOR DELETE
    USING (auth.uid() = user_id);

-- ---------------------------------------------
-- EXPERIENCES POLICIES
-- ---------------------------------------------

-- Cualquiera puede ver experiencias
CREATE POLICY "Experiences are viewable by everyone"
    ON public.experiences
    FOR SELECT
    USING (true);

-- Solo el dueño puede insertar experiencias
CREATE POLICY "Users can insert their own experiences"
    ON public.experiences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede actualizar sus experiencias
CREATE POLICY "Users can update their own experiences"
    ON public.experiences
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede eliminar sus experiencias
CREATE POLICY "Users can delete their own experiences"
    ON public.experiences
    FOR DELETE
    USING (auth.uid() = user_id);

-- ---------------------------------------------
-- PIVOTS POLICIES
-- ---------------------------------------------

-- Cualquiera puede ver pivots
CREATE POLICY "Pivots are viewable by everyone"
    ON public.pivots
    FOR SELECT
    USING (true);

-- Solo el dueño puede insertar pivots
CREATE POLICY "Users can insert their own pivots"
    ON public.pivots
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede actualizar sus pivots
CREATE POLICY "Users can update their own pivots"
    ON public.pivots
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede eliminar sus pivots
CREATE POLICY "Users can delete their own pivots"
    ON public.pivots
    FOR DELETE
    USING (auth.uid() = user_id);

-- ---------------------------------------------
-- TESTIMONIALS POLICIES
-- ---------------------------------------------

-- Cualquiera puede ver testimonios
CREATE POLICY "Testimonials are viewable by everyone"
    ON public.testimonials
    FOR SELECT
    USING (true);

-- Solo el dueño puede insertar testimonios
CREATE POLICY "Users can insert their own testimonials"
    ON public.testimonials
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede actualizar sus testimonios
CREATE POLICY "Users can update their own testimonials"
    ON public.testimonials
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede eliminar sus testimonios
CREATE POLICY "Users can delete their own testimonials"
    ON public.testimonials
    FOR DELETE
    USING (auth.uid() = user_id);


-- =============================================
-- 5. FUNCTIONS & TRIGGERS
-- =============================================

-- ---------------------------------------------
-- Función para actualizar updated_at automáticamente
-- ---------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at en cada tabla
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_projects ON public.projects;
CREATE TRIGGER set_updated_at_projects
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_achievements ON public.achievements;
CREATE TRIGGER set_updated_at_achievements
    BEFORE UPDATE ON public.achievements
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_experiences ON public.experiences;
CREATE TRIGGER set_updated_at_experiences
    BEFORE UPDATE ON public.experiences
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_pivots ON public.pivots;
CREATE TRIGGER set_updated_at_pivots
    BEFORE UPDATE ON public.pivots
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_testimonials ON public.testimonials;
CREATE TRIGGER set_updated_at_testimonials
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ---------------------------------------------
-- Función para crear perfil automáticamente al registrarse
-- ---------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url, email)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)), ' ', '_')) || '_' || SUBSTR(NEW.id::text, 1, 8)
        ),
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se ejecuta después de insertar un nuevo usuario en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- =============================================
-- 6. STORAGE BUCKET (Opcional - para avatares e imágenes)
-- =============================================

-- Crear bucket para almacenar avatares (ejecutar solo si usarás Storage)
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('avatars', 'avatars', true);

-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('project-images', 'project-images', true);

-- Políticas de storage para avatares
-- CREATE POLICY "Avatar images are publicly accessible"
--     ON storage.objects FOR SELECT
--     USING (bucket_id = 'avatars');

-- CREATE POLICY "Users can upload their own avatar"
--     ON storage.objects FOR INSERT
--     WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can update their own avatar"
--     ON storage.objects FOR UPDATE
--     USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete their own avatar"
--     ON storage.objects FOR DELETE
--     USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);


-- =============================================
-- 7. SEED DATA (Datos de prueba)
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
-- SCHEMA COMPLETE! 🎓🚀
-- =============================================
