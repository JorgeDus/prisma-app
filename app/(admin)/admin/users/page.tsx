import { createAdminClient } from '@/utils/supabase/admin'
import AdminUsersClient from '@/components/admin/AdminUsersClient'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
    const adminClient = createAdminClient()

    const { data: profiles } = await adminClient
        .from('profiles')
        .select(`
            id,
            username,
            full_name,
            email,
            avatar_url,
            is_paused,
            paused_at,
            deletion_requested_at,
            created_at,
            universities(name)
        `)
        .order('created_at', { ascending: false })

    // Get content counts per user
    const userIds = profiles?.map(p => p.id) || []

    const [{ data: projectCounts }, { data: experienceCounts }] = await Promise.all([
        adminClient.from('projects').select('user_id').in('user_id', userIds),
        adminClient.from('experiences').select('user_id').in('user_id', userIds),
    ])

    const usersWithCounts = (profiles || []).map(profile => ({
        ...profile,
        university_name: (profile as any).universities?.name || null,
        project_count: projectCounts?.filter(p => p.user_id === profile.id).length || 0,
        experience_count: experienceCounts?.filter(e => e.user_id === profile.id).length || 0,
        status: profile.deletion_requested_at
            ? 'deletion_pending' as const
            : profile.is_paused
                ? 'paused' as const
                : 'active' as const,
    }))

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>
                <p className="text-sm text-slate-500 mt-1">
                    {usersWithCounts.length} usuario{usersWithCounts.length !== 1 ? 's' : ''} registrado{usersWithCounts.length !== 1 ? 's' : ''}
                </p>
            </div>

            <AdminUsersClient users={usersWithCounts} />
        </div>
    )
}
