import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers
 * Uso: En componentes de servidor, actions y API routes
 */
export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // El método `setAll` fue llamado desde un Server Component.
                        // Esto puede ser ignorado si tienes middleware que refresca
                        // las sesiones de usuario.
                    }
                },
            },
        }
    )
}
