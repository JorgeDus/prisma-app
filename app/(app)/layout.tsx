import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import AppNavbar from '@/components/layout/AppNavbar'
import { getUnseenVisitCount } from './visit-actions'

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // Verify authentication and get username for navbar
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

    if (!profile) redirect('/onboarding')

    // Fetch unseen visit count for notification badge
    const unseenVisitCount = await getUnseenVisitCount()

    return (
        <div className="min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
            <AppNavbar username={profile.username} unseenVisitCount={unseenVisitCount} />
            {children}
        </div>
    )
}

