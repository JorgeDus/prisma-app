import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// Admin secret for authentication - REQUIRED in production
const ADMIN_SECRET = process.env.ADMIN_SECRET
if (!ADMIN_SECRET) {
    throw new Error('ADMIN_SECRET environment variable is required. Admin endpoints are disabled.')
}

export async function GET(request: Request) {
    // Simple admin authentication via Authorization header
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${ADMIN_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Get profiles with pending deletion
    const { data: pendingDeletions, error } = await supabase
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

    // Separate ready vs pending
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
