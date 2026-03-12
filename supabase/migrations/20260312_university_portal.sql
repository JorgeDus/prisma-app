-- Migration: Portal de Universidad MVP

-- 1. Ampliar la tabla 'universities' existente
ALTER TABLE public.universities
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS domain TEXT,
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- 2. Crear la tabla de cuentas de universidad ('university_accounts')
CREATE TABLE IF NOT EXISTS public.university_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    university_id INT NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'viewer', -- roles posibles: 'owner', 'admin', 'viewer'
    full_name TEXT NOT NULL,
    position TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    UNIQUE(user_id, university_id) -- Un usuario auth solo puede tener una cuenta por universidad
);

-- Comentarios explicativos
COMMENT ON TABLE public.university_accounts IS 'Cuentas administrativas vinculadas a una universidad específica';

-- 3. Row Level Security (RLS) para 'university_accounts'
ALTER TABLE public.university_accounts ENABLE ROW LEVEL SECURITY;

-- Política de lectura: Un usuario solo puede ver su propio registro de cuenta de universidad
CREATE POLICY "Users can view their own university accounts"
    ON public.university_accounts
    FOR SELECT
    USING (auth.uid() = user_id);

-- Opcional: Permitir que un usuario vea otras cuentas de su misma universidad
-- CREATE POLICY "Users can view accounts from their own university"
--     ON public.university_accounts
--     FOR SELECT
--     USING (university_id IN (SELECT university_id FROM public.university_accounts WHERE user_id = auth.uid()));

-- Nota: No agregamos políticas de INSERT/UPDATE/DELETE.
-- Por ahora (MVP), la gestión de estas cuentas se hará vía el admin panel principal (service_role),
-- por lo que no necesitamos dar permisos de escritura al cliente directamente.

-- 4. Triggers (Opcional, para updated_at si lo agregamos más adelante, o si es necesario reusar la función de updated_at)
-- En este caso mantenemos la tabla simple.
