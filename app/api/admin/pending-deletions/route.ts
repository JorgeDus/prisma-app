import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
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

    // Get profiles with pending deletion
    const { data: pendingDeletions, error } = await adminClient
        .from('profiles')
        .select('id, username, full_name, email, deletion_requested_at')
        .not('deletion_requested_at', 'is', null)
        .order('deletion_requested_at', { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate which accounts are ready for deletion (past 14 days)
    const now = new Date()
    const accountsWithStatus = pendingDeletions?.map(account => {
        const requestedAt = new Date(account.deletion_requested_at!)
        const deletionDate = new Date(requestedAt.getTime() + 14 * 24 * 60 * 60 * 1000)
        const daysRemaining = Math.ceil((deletionDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))

        return {
            ...account,
            deletion_date: deletionDate.toISOString(),
            days_remaining: daysRemaining,
            ready_for_deletion: daysRemaining <= 0
        }
    }) || []

    const readyForDeletion = accountsWithStatus.filter(a => a.ready_for_deletion)
    const pendingGracePeriod = accountsWithStatus.filter(a => !a.ready_for_deletion)

    return NextResponse.json({
        summary: {
            total_pending: accountsWithStatus.length,
            ready_for_deletion: readyForDeletion.length,
            in_grace_period: pendingGracePeriod.length
        },
        ready_for_deletion: readyForDeletion,
        in_grace_period: pendingGracePeriod
    })
}
