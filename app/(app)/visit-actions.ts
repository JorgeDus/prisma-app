'use server'

import { createClient } from '@/utils/supabase/server'

export async function getRecentVisits() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data } = await supabase
        .from('profile_visits')
        .select('id, visitor_career, visitor_university, visited_at, seen_at')
        .eq('profile_id', user.id)
        .gte('visited_at', thirtyDaysAgo)
        .order('visited_at', { ascending: false })
        .limit(10)

    return data || []
}

export async function markVisitsAsSeen() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
        .from('profile_visits')
        .update({ seen_at: new Date().toISOString() })
        .eq('profile_id', user.id)
        .is('seen_at', null)
}

export async function getUnseenVisitCount() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    const { count } = await supabase
        .from('profile_visits')
        .select('id', { count: 'exact', head: true })
        .eq('profile_id', user.id)
        .is('seen_at', null)

    return count || 0
}
