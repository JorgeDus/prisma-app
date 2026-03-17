import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import UniversitySidebar from '@/components/university/UniversitySidebar'

export default async function UniversityLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/university/login')

    // Verificar rol 'university' en app_metadata
    const adminClient = createAdminClient()
    const { data: authUser } = await adminClient.auth.admin.getUserById(user.id)
    const meta = authUser?.user?.app_metadata
    if (meta?.role !== 'university') redirect('/university/login')

    // Cargar cuenta de universidad con datos de la institución
    const universityId = meta.university_id as number
    const { data: account } = await adminClient
        .from('university_accounts')
        .select(`
            id, role, full_name, position, is_active,
            universities(id, name, slug, logo_url)
        `)
        .eq('user_id', user.id)
        .eq('university_id', universityId)
        .single()

    if (!account || !account.is_active) redirect('/university/login')

    const university = (account as any).universities

    return (
        <div className="min-h-screen bg-slate-950 flex">
            <UniversitySidebar
                universityName={university?.name || 'Universidad'}
                universityLogoUrl={university?.logo_url || null}
                accountName={account.full_name}
                role={account.role}
            />
            <main className="flex-1 ml-64 p-8 bg-slate-50 min-h-screen">
                {children}
            </main>
        </div>
    )
}
