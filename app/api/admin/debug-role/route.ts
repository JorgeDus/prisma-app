import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

/**
 * TEMPORARY DEBUG ENDPOINT — remove after verifying admin setup
 * GET /api/admin/debug-role
 */
export async function GET() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return NextResponse.json({ error: 'Not authenticated', details: error?.message })
    }

    const adminClient = createAdminClient()
    const { data: authUser, error: adminError } = await adminClient.auth.admin.getUserById(user.id)

    return NextResponse.json({
        user_id: user.id,
        email: user.email,
        app_metadata: authUser?.user?.app_metadata || null,
        role: authUser?.user?.app_metadata?.role || 'none',
        is_admin: authUser?.user?.app_metadata?.role === 'admin',
        admin_error: adminError?.message || null,
    })
}
