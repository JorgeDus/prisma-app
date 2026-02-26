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
            hidden_from_explore,
            universities(name)
        `)
        .order('created_at', { ascending: false })

    // Get content counts per user
    const userIds = profiles?.map(p => p.id) || []

    const [{ data: projectCounts }, { data: experienceCounts }, { data: userCareers }] = await Promise.all([
        adminClient.from('projects').select('user_id').in('user_id', userIds),
        adminClient.from('experiences').select('user_id').in('user_id', userIds),
        // Fetch primary careers (new system) to get institution for users without legacy university
        adminClient
            .from('user_careers')
            .select('user_id, institution')
            .in('user_id', userIds)
            .eq('is_primary', true),
    ])

    // Map user_id → institution from new user_careers system
    const userCareerInstitutionMap = new Map(
        (userCareers || []).map(uc => [uc.user_id, uc.institution || null])
    )

    // Get last_sign_in_at from auth.users (requires service_role)
    const { data: authUsersData } = await adminClient.auth.admin.listUsers({ perPage: 1000 })
    const authUsersMap = new Map(
        (authUsersData?.users || []).map(u => [u.id, u.last_sign_in_at ?? null])
    )

    const usersWithCounts = (profiles || []).map(profile => ({
        ...profile,
        // Prefer legacy university name, fall back to user_careers institution
        university_name: (profile as any).universities?.name || userCareerInstitutionMap.get(profile.id) || null,
        project_count: projectCounts?.filter(p => p.user_id === profile.id).length || 0,
        experience_count: experienceCounts?.filter(e => e.user_id === profile.id).length || 0,
        last_sign_in_at: authUsersMap.get(profile.id) ?? null,
        hidden_from_explore: profile.hidden_from_explore ?? false,
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
