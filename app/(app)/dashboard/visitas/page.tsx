import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import VisitHistoryClient from './VisitHistoryClient'

export const dynamic = 'force-dynamic'

export default async function VisitasPage() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) redirect('/login')

    return <VisitHistoryClient />
}
