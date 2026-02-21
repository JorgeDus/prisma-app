import { createAdminClient } from '@/utils/supabase/admin'
import AdminDeletionsClient from '@/components/admin/AdminDeletionsClient'

export const dynamic = 'force-dynamic'

export default async function AdminDeletionsPage() {
    const adminClient = createAdminClient()

    const { data: pendingProfiles } = await adminClient
        .from('profiles')
        .select('id, username, full_name, email, deletion_requested_at')
        .not('deletion_requested_at', 'is', null)
        .order('deletion_requested_at', { ascending: true })

    const now = new Date()
    const accounts = (pendingProfiles || []).map(profile => {
        const requestedAt = new Date(profile.deletion_requested_at!)
        const deletionDate = new Date(requestedAt.getTime() + 14 * 24 * 60 * 60 * 1000)
        const daysRemaining = Math.ceil((deletionDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))

        return {
            ...profile,
            deletion_date: deletionDate.toISOString(),
            days_remaining: daysRemaining,
            ready_for_deletion: daysRemaining <= 0,
        }
    })

    const readyForDeletion = accounts.filter(a => a.ready_for_deletion)
    const inGracePeriod = accounts.filter(a => !a.ready_for_deletion)

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Cola de Eliminaciones</h1>
                <p className="text-sm text-slate-500 mt-1">
                    {accounts.length} cuenta{accounts.length !== 1 ? 's' : ''} con eliminación solicitada
                </p>
            </div>

            <AdminDeletionsClient
                readyForDeletion={readyForDeletion}
                inGracePeriod={inGracePeriod}
            />
        </div>
    )
}
