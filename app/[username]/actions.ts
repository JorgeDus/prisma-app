'use server'

import { createClient } from '@/utils/supabase/server'

export async function recordProfileVisit(profileId: string, visitorId: string) {
    const supabase = await createClient()

    // 1. Check for existing visit from same visitor in last 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: existing } = await supabase
        .from('profile_visits')
        .select('id')
        .eq('profile_id', profileId)
        .eq('visitor_id', visitorId)
        .gte('visited_at', twentyFourHoursAgo)
        .limit(1)
        .maybeSingle()

    if (existing) return // Deduplicated — skip

    // 2. Get visitor's primary career name and university for anonymous display
    let careerName: string | null = null
    let universityName: string | null = null

    const { data: userCareer } = await supabase
        .from('user_careers')
        .select('career:careers(name), custom_career, institution')
        .eq('user_id', visitorId)
        .eq('is_primary', true)
        .maybeSingle()

    if (userCareer) {
        careerName = (userCareer as any).career?.name || userCareer.custom_career || null
        universityName = userCareer.institution || null
    }

    // Fallback to legacy career/university from profile
    if (!careerName || !universityName) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('careers(name), universities(name)')
            .eq('id', visitorId)
            .single()

        if (!careerName) {
            careerName = (profile as any)?.careers?.name || null
        }
        if (!universityName) {
            universityName = (profile as any)?.universities?.name || null
        }
    }

    // 3. Insert the visit
    const { error } = await supabase.from('profile_visits').insert({
        profile_id: profileId,
        visitor_id: visitorId,
        visitor_career: careerName,
        visitor_university: universityName,
    })

    if (error) {
        console.error('[recordProfileVisit] Insert failed:', error.message, error.details)
    }
}
