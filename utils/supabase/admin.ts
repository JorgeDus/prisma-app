import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

/**
 * Cliente de Supabase con service_role key para operaciones administrativas.
 * IMPORTANTE: Este cliente bypasses RLS — solo usar en Server Components,
 * Server Actions y Route Handlers. NUNCA exponerlo al cliente.
 */
export function createAdminClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
    }

    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
}
