-- =============================================
-- Migration: Portal Universidad v2 (complementaria)
-- Mejoras sobre 20260312_university_portal.sql
-- =============================================

-- 1. ENUM para roles de universidad
-- Evita valores de texto libre en el campo 'role'
-- -----------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'university_role') THEN
        CREATE TYPE public.university_role AS ENUM ('owner', 'admin', 'viewer');
    END IF;
END;
$$;

-- Migrar la columna 'role' de TEXT a ENUM
-- Paso 1: Dropear el default antes (no se puede castear automáticamente)
ALTER TABLE public.university_accounts
    ALTER COLUMN role DROP DEFAULT;

-- Paso 2: Cambiar el tipo de la columna con cast explícito
ALTER TABLE public.university_accounts
    ALTER COLUMN role TYPE public.university_role
    USING role::public.university_role;

-- Paso 3: Restaurar el default con el tipo correcto
ALTER TABLE public.university_accounts
    ALTER COLUMN role SET DEFAULT 'viewer'::public.university_role;


-- 2. Agregar updated_at a university_accounts
-- -----------------------------------------------
ALTER TABLE public.university_accounts
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Trigger para updated_at (reutiliza la función handle_updated_at() del schema inicial)
DROP TRIGGER IF EXISTS set_updated_at_university_accounts ON public.university_accounts;
CREATE TRIGGER set_updated_at_university_accounts
    BEFORE UPDATE ON public.university_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();


-- 3. Segunda política RLS: ver colegas de la misma universidad
-- Necesario cuando haya más de una cuenta por institución
-- -----------------------------------------------
DROP POLICY IF EXISTS "Users can view accounts from their own university"
    ON public.university_accounts;

CREATE POLICY "Users can view accounts from their own university"
    ON public.university_accounts
    FOR SELECT
    USING (
        university_id IN (
            SELECT university_id
            FROM public.university_accounts
            WHERE user_id = auth.uid()
              AND is_active = true
        )
    );


-- 4. Índice en university_id para queries de directorio
-- El query más frecuente es "dame todos los usuarios de la universidad X"
-- -----------------------------------------------
CREATE INDEX IF NOT EXISTS idx_university_accounts_university_id
    ON public.university_accounts(university_id);


-- 5. CHECK en universities.domain para prevenir formato '@udp.cl'
-- -----------------------------------------------
ALTER TABLE public.universities
    DROP CONSTRAINT IF EXISTS universities_domain_no_at_sign;

ALTER TABLE public.universities
    ADD CONSTRAINT universities_domain_no_at_sign
    CHECK (domain IS NULL OR domain NOT LIKE '@%');
