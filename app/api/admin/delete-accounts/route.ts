import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// Admin secret for authentication - REQUIRED in production
const ADMIN_SECRET = process.env.ADMIN_SECRET
if (!ADMIN_SECRET) {
    throw new Error('ADMIN_SECRET environment variable is required. Admin endpoints are disabled.')
}

export async function DELETE(request: Request) {
    // Simple admin authentication via Authorization header
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${ADMIN_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Get profiles ready for deletion (past 14 days grace period)
    const now = new Date()
    const gracePeriodCutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const { data: readyForDeletion, error: fetchError } = await supabase
        .from('profiles')
        .select('id, username, full_name, email, deletion_requested_at')
        .not('deletion_requested_at', 'is', null)
        .lte('deletion_requested_at', gracePeriodCutoff.toISOString())

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!readyForDeletion || readyForDeletion.length === 0) {
        return NextResponse.json({
            message: 'No accounts ready for deletion',
            deleted: 0
        })
    }

    const deletedAccounts: string[] = []
    const errors: { id: string; error: string }[] = []

    // Delete each account's data
    for (const profile of readyForDeletion) {
        try {
            // Delete related data (RLS should handle cascade, but being explicit)
            await Promise.all([
                supabase.from('projects').delete().eq('user_id', profile.id),
                supabase.from('experiences').delete().eq('user_id', profile.id),
                supabase.from('achievements').delete().eq('user_id', profile.id),
                supabase.from('testimonials').delete().eq('user_id', profile.id),
                supabase.from('languages').delete().eq('user_id', profile.id),
                supabase.from('user_careers').delete().eq('user_id', profile.id),
                supabase.from('connections').delete().or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`),
            ])

            // Delete the profile itself
            const { error: deleteError } = await supabase
                .from('profiles')
                .delete()
                .eq('id', profile.id)

            if (deleteError) {
                throw deleteError
            }

            // Note: To fully delete the auth user, you'd need to use service role
            // supabase.auth.admin.deleteUser(profile.id)
            // This requires the service role key which shouldn't be exposed in API routes

            deletedAccounts.push(profile.username!)
        } catch (error: any) {
            errors.push({ id: profile.id, error: error.message || 'Unknown error' })
        }
    }

    return NextResponse.json({
        message: `Deleted ${deletedAccounts.length} accounts`,
        deleted: deletedAccounts.length,
        deleted_usernames: deletedAccounts,
        errors: errors.length > 0 ? errors : undefined
    })
}
