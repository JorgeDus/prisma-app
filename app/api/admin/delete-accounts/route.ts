import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function DELETE() {
    // Session-based admin authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const adminClient = createAdminClient()
    const { data: authUser } = await adminClient.auth.admin.getUserById(user.id)
    if (authUser?.user?.app_metadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get profiles ready for deletion (past 14 days grace period)
    const now = new Date()
    const gracePeriodCutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const { data: readyForDeletion, error: fetchError } = await adminClient
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

    for (const profile of readyForDeletion) {
        try {
            // Delete related data
            await Promise.all([
                adminClient.from('projects').delete().eq('user_id', profile.id),
                adminClient.from('experiences').delete().eq('user_id', profile.id),
                adminClient.from('achievements').delete().eq('user_id', profile.id),
                adminClient.from('testimonials').delete().eq('user_id', profile.id),
                adminClient.from('pivots').delete().eq('user_id', profile.id),
                adminClient.from('languages').delete().eq('user_id', profile.id),
                adminClient.from('user_careers').delete().eq('user_id', profile.id),
                adminClient.from('connections').delete().or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`),
            ])

            // Delete the profile
            const { error: deleteError } = await adminClient
                .from('profiles')
                .delete()
                .eq('id', profile.id)

            if (deleteError) throw deleteError

            // Delete the auth user (now possible with service_role)
            const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(profile.id)
            if (authDeleteError) {
                console.error(`Failed to delete auth user ${profile.id}:`, authDeleteError)
            }

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
