'use server'

import { createClient } from '@/utils/supabase/server'

const PAGE_SIZE = 20

export async function getVisitsPage(page: number = 1) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { visits: [], totalCount: 0 }

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const [{ data, count }, _] = await Promise.all([
        supabase
            .from('profile_visits')
            .select('id, visitor_career, visitor_university, visited_at, seen_at', { count: 'exact' })
            .eq('profile_id', user.id)
            .order('visited_at', { ascending: false })
            .range(from, to),
        // Mark unseen visits as seen when viewing history
        supabase
            .from('profile_visits')
            .update({ seen_at: new Date().toISOString() })
            .eq('profile_id', user.id)
            .is('seen_at', null)
    ])

    return {
        visits: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / PAGE_SIZE),
        currentPage: page,
    }
}
