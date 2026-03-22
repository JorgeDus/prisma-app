import { getUniversityStats } from './actions'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import DashboardInteractive from '@/components/university/DashboardInteractive'

interface SearchParams {
    career?: string;
    cohort?: string;
}

export default async function UniversityDashboardPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const params = await searchParams;
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const adminClient = createAdminClient()
    const { data: authUser } = await adminClient.auth.admin.getUserById(user!.id)
    const universityId = authUser?.user?.app_metadata?.university_id as number

    // Datos de la universidad
    const { data: university } = await adminClient
        .from('universities')
        .select('name, logo_url')
        .eq('id', universityId)
        .single()

    const stats = await getUniversityStats(universityId, params.career, params.cohort)

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <DashboardInteractive university={university} stats={stats} />
        </div>
    )
}
