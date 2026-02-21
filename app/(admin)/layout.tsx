import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // 1. Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    // 2. Verify admin role via app_metadata
    const adminClient = createAdminClient()
    const { data: authUser } = await adminClient.auth.admin.getUserById(user.id)
    const isAdmin = authUser?.user?.app_metadata?.role === 'admin'

    if (!isAdmin) redirect('/dashboard')

    return (
        <div className="min-h-screen bg-slate-950 flex">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 bg-slate-50 min-h-screen">
                {children}
            </main>
        </div>
    )
}
