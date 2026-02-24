'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

/**
 * Verify that the current user is an admin.
 * Must be called at the start of every admin server action.
 */
async function verifyAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const adminClient = createAdminClient()
    const { data: authUser } = await adminClient.auth.admin.getUserById(user.id)
    if (authUser?.user?.app_metadata?.role !== 'admin') {
        throw new Error('Not authorized')
    }

    return { adminClient, userId: user.id }
}

/**
 * Toggle pause state of a user account
 */
export async function toggleUserPause(targetUserId: string) {
    const { adminClient } = await verifyAdmin()

    // Get current pause state
    const { data: profile, error: fetchError } = await adminClient
        .from('profiles')
        .select('is_paused')
        .eq('id', targetUserId)
        .single()

    if (fetchError || !profile) {
        return { error: 'User not found' }
    }

    const newPausedState = !profile.is_paused

    const { error } = await adminClient
        .from('profiles')
        .update({
            is_paused: newPausedState,
            paused_at: newPausedState ? new Date().toISOString() : null,
        })
        .eq('id', targetUserId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/users')
    revalidatePath('/admin')
    return { success: true, is_paused: newPausedState }
}

/**
 * Delete a single user account completely (profile data + auth user)
 */
export async function deleteUserAccount(targetUserId: string) {
    const { adminClient } = await verifyAdmin()

    try {
        // 1. Delete all related data
        await Promise.all([
            adminClient.from('projects').delete().eq('user_id', targetUserId),
            adminClient.from('experiences').delete().eq('user_id', targetUserId),
            adminClient.from('achievements').delete().eq('user_id', targetUserId),
            adminClient.from('testimonials').delete().eq('user_id', targetUserId),
            adminClient.from('pivots').delete().eq('user_id', targetUserId),
            adminClient.from('languages').delete().eq('user_id', targetUserId),
            adminClient.from('user_careers').delete().eq('user_id', targetUserId),
            adminClient.from('connections').delete().or(
                `sender_id.eq.${targetUserId},receiver_id.eq.${targetUserId}`
            ),
        ])

        // 2. Delete the profile
        const { error: profileError } = await adminClient
            .from('profiles')
            .delete()
            .eq('id', targetUserId)

        if (profileError) throw profileError

        // 3. Delete the auth user (requires service_role)
        const { error: authError } = await adminClient.auth.admin.deleteUser(targetUserId)
        if (authError) {
            console.error('Failed to delete auth user (profile already deleted):', authError)
        }

        revalidatePath('/admin/users')
        revalidatePath('/admin/deletions')
        revalidatePath('/admin')
        return { success: true }
    } catch (error: any) {
        return { error: error.message || 'Failed to delete account' }
    }
}

/**
 * Execute all pending deletions that have passed the 14-day grace period
 */
export async function executePendingDeletions() {
    const { adminClient } = await verifyAdmin()

    const now = new Date()
    const gracePeriodCutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const { data: readyForDeletion, error: fetchError } = await adminClient
        .from('profiles')
        .select('id, username')
        .not('deletion_requested_at', 'is', null)
        .lte('deletion_requested_at', gracePeriodCutoff.toISOString())

    if (fetchError) {
        return { error: fetchError.message }
    }

    if (!readyForDeletion || readyForDeletion.length === 0) {
        return { success: true, deleted: 0, message: 'No accounts ready for deletion' }
    }

    const deleted: string[] = []
    const errors: string[] = []

    for (const profile of readyForDeletion) {
        const result = await deleteUserAccount(profile.id)
        if (result.success) {
            deleted.push(profile.username)
        } else {
            errors.push(`${profile.username}: ${result.error}`)
        }
    }

    revalidatePath('/admin/deletions')
    revalidatePath('/admin')
    return {
        success: true,
        deleted: deleted.length,
        deleted_usernames: deleted,
        errors: errors.length > 0 ? errors : undefined,
    }
}

/**
 * Toggle whether a user is hidden from the /explorar discovery page
 */
export async function toggleUserExploreVisibility(targetUserId: string) {
    const { adminClient } = await verifyAdmin()

    const { data: profile, error: fetchError } = await adminClient
        .from('profiles')
        .select('hidden_from_explore')
        .eq('id', targetUserId)
        .single()

    if (fetchError || !profile) {
        return { error: 'User not found' }
    }

    const newHiddenState = !profile.hidden_from_explore

    const { error } = await adminClient
        .from('profiles')
        .update({ hidden_from_explore: newHiddenState })
        .eq('id', targetUserId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true, hidden_from_explore: newHiddenState }
}
