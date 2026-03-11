'use server'

import { createClient } from '@/utils/supabase/server'

export async function getRecentNotifications() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

    return data || []
}

export async function getUnseenNotificationCount() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    const { count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .is('seen_at', null)

    return count || 0
}

export async function markNotificationsAsSeen() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
        .from('notifications')
        .update({ seen_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .is('seen_at', null)
}

export async function createNotification(
    userId: string,
    type: string,
    title: string,
    body?: string,
    metadata?: Record<string, any>,
    actionUrl?: string
) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('notifications')
        .insert({
            user_id: userId,
            type,
            title,
            body: body || null,
            metadata: metadata || {},
            action_url: actionUrl || null
        })

    if (error) {
        console.error('Error creating notification:', error)
    }
}
