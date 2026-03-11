'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { createNotification } from './notification-actions'

/**
 * Syncs collaborator_ids array from the project form into project_collaborations table.
 * Creates new pending rows and notifications for newly added collaborators.
 * Removes rows for collaborators that were removed from the array.
 */
export async function syncProjectCollaborators(
    projectId: string,
    ownerId: string,
    collaboratorIds: string[]
) {
    const supabase = await createClient()

    // Get current collaboration rows for this project
    const { data: existing } = await supabase
        .from('project_collaborations')
        .select('id, collaborator_id')
        .eq('project_id', projectId)

    const existingIds = (existing || []).map(e => e.collaborator_id)

    // New collaborators to add
    const toAdd = collaboratorIds.filter(id => !existingIds.includes(id))
    // Collaborators to remove
    const toRemove = (existing || []).filter(e => !collaboratorIds.includes(e.collaborator_id))

    // Get owner's name for notification
    let ownerName = 'Alguien'
    if (toAdd.length > 0) {
        const { data: ownerProfile } = await supabase
            .from('profiles')
            .select('full_name, username')
            .eq('id', ownerId)
            .single()
        if (ownerProfile) {
            ownerName = ownerProfile.full_name || ownerProfile.username
        }
    }

    // Get project title for notification
    let projectTitle = 'un proyecto'
    if (toAdd.length > 0) {
        const { data: project } = await supabase
            .from('projects')
            .select('title')
            .eq('id', projectId)
            .single()
        if (project) {
            projectTitle = project.title
        }
    }

    // Insert new collaborations + notifications
    for (const collabId of toAdd) {
        await supabase.from('project_collaborations').insert({
            project_id: projectId,
            owner_id: ownerId,
            collaborator_id: collabId,
            status: 'pending'
        })

        // Get owner's username for the action_url
        const { data: ownerProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', ownerId)
            .single()

        await createNotification(
            collabId,
            'project_collaboration',
            `${ownerName} te añadió como colaborador`,
            `En el proyecto "${projectTitle}"`,
            { project_id: projectId, sender_id: ownerId, sender_name: ownerName },
            ownerProfile ? `/${ownerProfile.username}/proyectos/${projectId}` : undefined
        )
    }

    // Remove collaborations that were un-selected
    for (const row of toRemove) {
        await supabase
            .from('project_collaborations')
            .delete()
            .eq('id', row.id)
    }
}

/**
 * Syncs collaborator_ids array from the experience form into experience_collaborations table.
 * Creates new pending rows and notifications for newly added collaborators.
 * Removes rows for collaborators that were removed from the array.
 */
export async function syncExperienceCollaborators(
    experienceId: string,
    ownerId: string,
    collaboratorIds: string[]
) {
    const supabase = await createClient()

    // Get current collaboration rows for this experience
    const { data: existing } = await supabase
        .from('experience_collaborations')
        .select('id, collaborator_id')
        .eq('experience_id', experienceId)

    const existingIds = (existing || []).map(e => e.collaborator_id)

    // New collaborators to add
    const toAdd = collaboratorIds.filter(id => !existingIds.includes(id))
    // Collaborators to remove
    const toRemove = (existing || []).filter(e => !collaboratorIds.includes(e.collaborator_id))

    // Get owner's name for notification
    let ownerName = 'Alguien'
    if (toAdd.length > 0) {
        const { data: ownerProfile } = await supabase
            .from('profiles')
            .select('full_name, username')
            .eq('id', ownerId)
            .single()
        if (ownerProfile) {
            ownerName = ownerProfile.full_name || ownerProfile.username
        }
    }

    // Get experience title for notification
    let experienceTitle = 'una experiencia'
    if (toAdd.length > 0) {
        const { data: experience } = await supabase
            .from('experiences')
            .select('title')
            .eq('id', experienceId)
            .single()
        if (experience) {
            experienceTitle = experience.title
        }
    }

    // Insert new collaborations + notifications
    for (const collabId of toAdd) {
        await supabase.from('experience_collaborations').insert({
            experience_id: experienceId,
            owner_id: ownerId,
            collaborator_id: collabId,
            status: 'pending'
        })

        // Get owner's username for the action_url
        const { data: ownerProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', ownerId)
            .single()

        await createNotification(
            collabId,
            'experience_collaboration',
            `${ownerName} te añadió como colaborador`,
            `En la experiencia "${experienceTitle}"`,
            { experience_id: experienceId, sender_id: ownerId, sender_name: ownerName },
            ownerProfile ? `/${ownerProfile.username}/experiencias/${experienceId}` : undefined
        )
    }

    // Remove collaborations that were un-selected
    for (const row of toRemove) {
        await supabase
            .from('experience_collaborations')
            .delete()
            .eq('id', row.id)
    }
}

/**
 * Respond to a collaboration invite (accept or reject)
 */
export async function respondToCollaboration(
    collaborationId: string,
    type: 'project' | 'experience',
    accept: boolean
) {
    if (!accept) {
        // If rejecting, completely remove the collaboration and remove from parent array
        await removeCollaboration(collaborationId, type)
        return
    }

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const table = type === 'project' ? 'project_collaborations' : 'experience_collaborations'

    const { error } = await supabase
        .from(table)
        .update({
            status: 'accepted',
            show_in_profile: true,
            show_in_timeline: true,
            updated_at: new Date().toISOString()
        })
        .eq('id', collaborationId)
        .eq('collaborator_id', user.id)

    if (error) throw error
}

/**
 * Update collaboration details (custom role, learnings, skills, visibility)
 */
export async function updateCollaborationDetails(
    collaborationId: string,
    type: 'project' | 'experience',
    details: {
        customRole?: string
        customLearnings?: string
        customHardSkills?: string[]
        customSoftSkills?: string[]
        showInProfile?: boolean
        showInTimeline?: boolean
    }
) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const table = type === 'project' ? 'project_collaborations' : 'experience_collaborations'

    const updateData: Record<string, any> = {
        updated_at: new Date().toISOString()
    }
    if (details.customRole !== undefined) updateData.custom_role = details.customRole || null
    if (details.customLearnings !== undefined) updateData.custom_learnings = details.customLearnings || null
    if (details.customHardSkills !== undefined) updateData.custom_hard_skills = details.customHardSkills
    if (details.customSoftSkills !== undefined) updateData.custom_soft_skills = details.customSoftSkills
    if (details.showInProfile !== undefined) updateData.show_in_profile = details.showInProfile
    if (details.showInTimeline !== undefined) updateData.show_in_timeline = details.showInTimeline

    const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', collaborationId)
        .eq('collaborator_id', user.id)

    if (error) throw error
}

/**
 * Get all pending collaborations for the authenticated user
 */
export async function getPendingCollaborations() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { projects: [], experiences: [] }

    // Fetch pending project collaborations
    const { data: projectCollabs } = await supabase
        .from('project_collaborations')
        .select('id, project_id, owner_id, status, custom_role, custom_learnings, custom_hard_skills, custom_soft_skills, show_in_profile, show_in_timeline, created_at')
        .eq('collaborator_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    // Fetch pending experience collaborations
    const { data: expCollabs } = await supabase
        .from('experience_collaborations')
        .select('id, experience_id, owner_id, status, custom_role, custom_learnings, custom_hard_skills, custom_soft_skills, show_in_profile, show_in_timeline, created_at')
        .eq('collaborator_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    // Enrich with project/experience data (including skills) and owner profiles
    const enrichedProjects = []
    for (const collab of (projectCollabs || [])) {
        const [projectRes, ownerRes] = await Promise.all([
            supabase.from('projects').select('title, type, cover_image, hard_skills, soft_skills').eq('id', collab.project_id).single(),
            supabase.from('profiles').select('full_name, username, avatar_url').eq('id', collab.owner_id).single()
        ])
        enrichedProjects.push({
            ...collab,
            type: 'project' as const,
            project: projectRes.data,
            owner: ownerRes.data
        })
    }

    const enrichedExperiences = []
    for (const collab of (expCollabs || [])) {
        const [expRes, ownerRes] = await Promise.all([
            supabase.from('experiences').select('title, type, cover_image, hard_skills, soft_skills').eq('id', collab.experience_id).single(),
            supabase.from('profiles').select('full_name, username, avatar_url').eq('id', collab.owner_id).single()
        ])
        enrichedExperiences.push({
            ...collab,
            type: 'experience' as const,
            experience: expRes.data,
            owner: ownerRes.data
        })
    }

    return { projects: enrichedProjects, experiences: enrichedExperiences }
}

/**
 * Get accepted collaborations for a given user.
 * Returns enriched project and experience data for display on profiles.
 * Does NOT require the caller to be the collaboration owner.
 */
export async function getAcceptedCollaborations(userId: string) {
    const supabase = await createClient()

    // Fetch accepted project collaborations with show_in_profile=true
    const { data: projectCollabs } = await supabase
        .from('project_collaborations')
        .select('id, project_id, owner_id, custom_role, custom_learnings, custom_hard_skills, custom_soft_skills, show_in_profile, show_in_timeline, created_at')
        .eq('collaborator_id', userId)
        .eq('status', 'accepted')
        .eq('show_in_profile', true)
        .order('created_at', { ascending: false })

    // Fetch accepted experience collaborations with show_in_profile=true
    const { data: expCollabs } = await supabase
        .from('experience_collaborations')
        .select('id, experience_id, owner_id, custom_role, custom_learnings, custom_hard_skills, custom_soft_skills, show_in_profile, show_in_timeline, created_at')
        .eq('collaborator_id', userId)
        .eq('status', 'accepted')
        .eq('show_in_profile', true)
        .order('created_at', { ascending: false })

    // Enrich with full project/experience data and owner profile
    const enrichedProjects = []
    for (const collab of (projectCollabs || [])) {
        const [projectRes, ownerRes] = await Promise.all([
            supabase.from('projects').select('*').eq('id', collab.project_id).single(),
            supabase.from('profiles').select('full_name, username, avatar_url').eq('id', collab.owner_id).single()
        ])
        if (projectRes.data) {
            enrichedProjects.push({
                ...projectRes.data,
                isCollaboration: true,
                collaborationId: collab.id,
                collaborationRole: collab.custom_role,
                collaborationLearnings: collab.custom_learnings,
                hard_skills: collab.custom_hard_skills?.length ? collab.custom_hard_skills : projectRes.data.hard_skills,
                soft_skills: collab.custom_soft_skills?.length ? collab.custom_soft_skills : projectRes.data.soft_skills,
                show_in_timeline: collab.show_in_timeline,
                ownerProfile: ownerRes.data
            })
        }
    }

    const enrichedExperiences = []
    for (const collab of (expCollabs || [])) {
        const [expRes, ownerRes] = await Promise.all([
            supabase.from('experiences').select('*').eq('id', collab.experience_id).single(),
            supabase.from('profiles').select('full_name, username, avatar_url').eq('id', collab.owner_id).single()
        ])
        if (expRes.data) {
            enrichedExperiences.push({
                ...expRes.data,
                isCollaboration: true,
                collaborationId: collab.id,
                collaborationRole: collab.custom_role,
                collaborationLearnings: collab.custom_learnings,
                hard_skills: collab.custom_hard_skills?.length ? collab.custom_hard_skills : expRes.data.hard_skills,
                soft_skills: collab.custom_soft_skills?.length ? collab.custom_soft_skills : expRes.data.soft_skills,
                show_in_timeline: collab.show_in_timeline,
                ownerProfile: ownerRes.data
            })
        }
    }

    return { projects: enrichedProjects, experiences: enrichedExperiences }
}

/**
 * Remove yourself as a collaborator. Deletes the row so the owner can re-add you later.
 */
export async function removeCollaboration(
    collaborationId: string,
    type: 'project' | 'experience'
) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const table = type === 'project' ? 'project_collaborations' : 'experience_collaborations'

    // Use .select() to verify the delete actually removed a row
    const { data, error } = await supabase
        .from(table)
        .delete()
        .eq('id', collaborationId)
        .eq('collaborator_id', user.id)
        .select()

    if (error) throw error
    if (!data || data.length === 0) {
        throw new Error('No se pudo eliminar la colaboración. Verifica los permisos en la base de datos.')
    }

    // Also remove the collaborator from the parent array so the owner can re-add them
    const parentTable = type === 'project' ? 'projects' : 'experiences'
    const parentIdField = type === 'project' ? 'project_id' : 'experience_id'
    const parentId = (data[0] as any)[parentIdField]

    if (parentId) {
        // Use admin client to bypass RLS since the collaborator doesn't have update rights on the parent record
        const adminSupabase = createAdminClient()

        // Get current array
        const { data: parentData } = await adminSupabase
            .from(parentTable)
            .select('collaborator_ids')
            .eq('id', parentId)
            .single()

        if (parentData && parentData.collaborator_ids) {
            const newIds = parentData.collaborator_ids.filter((id: string) => id !== user.id)
            await adminSupabase
                .from(parentTable)
                .update({ collaborator_ids: newIds })
                .eq('id', parentId)
        }
    }
}
