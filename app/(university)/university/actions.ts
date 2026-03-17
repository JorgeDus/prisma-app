'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

/**
 * Verifica que el usuario actual es una cuenta de universidad válida.
 * Devuelve el adminClient, el userId y el universityId verificados.
 */
async function verifyUniversityAccount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const adminClient = createAdminClient()
    const { data: authUser } = await adminClient.auth.admin.getUserById(user.id)
    const meta = authUser?.user?.app_metadata
    if (meta?.role !== 'university') throw new Error('Not authorized')

    const universityId: number = meta.university_id
    if (!universityId) throw new Error('No university_id in app_metadata')

    return { adminClient, userId: user.id, universityId }
}

// ─────────────────────────────────────────────
// STATS PARA EL DASHBOARD
// ─────────────────────────────────────────────
export async function getUniversityStats(universityId: number) {
    const adminClient = createAdminClient()

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    // IDs de todos los perfiles de esta universidad
    const { data: profileRows } = await adminClient
        .from('profiles')
        .select('id')
        .eq('university_id', universityId)

    const profileIds = (profileRows || []).map(p => p.id)

    if (profileIds.length === 0) {
        return {
            totalStudents: 0,
            activeStudents: 0,
            newThisMonth: 0,
            totalProjects: 0,
            totalExperiences: 0,
            topSkills: [] as { skill: string; count: number }[],
            byCareer: [] as { career: string; count: number }[],
            recentStudents: [],
        }
    }

    const [
        { count: totalStudents },
        { count: activeStudents },
        { count: newThisMonth },
        { count: totalProjects },
        { count: totalExperiences },
        { data: projectSkillsData },
        { data: experienceSkillsData },
        { data: profilesWithCareers },
        { data: recentStudents },
    ] = await Promise.all([
        adminClient.from('profiles').select('*', { count: 'exact', head: true }).eq('university_id', universityId),
        adminClient.from('profiles').select('*', { count: 'exact', head: true }).eq('university_id', universityId).gte('updated_at', thirtyDaysAgo),
        adminClient.from('profiles').select('*', { count: 'exact', head: true }).eq('university_id', universityId).gte('created_at', startOfMonth),
        adminClient.from('projects').select('*', { count: 'exact', head: true }).in('user_id', profileIds),
        adminClient.from('experiences').select('*', { count: 'exact', head: true }).in('user_id', profileIds),
        // Skills de proyectos
        adminClient.from('projects').select('hard_skills, soft_skills').in('user_id', profileIds),
        // Skills de experiencias
        adminClient.from('experiences').select('hard_skills, soft_skills').in('user_id', profileIds),
        // Distribución por carrera
        adminClient.from('profiles').select('careers(name), custom_career').eq('university_id', universityId),
        // Students más recientes
        adminClient.from('profiles').select('id, username, full_name, avatar_url, created_at, careers(name)').eq('university_id', universityId).order('created_at', { ascending: false }).limit(5),
    ])

    // Agregar skills
    const skillCount: Record<string, number> = {}
    const addSkills = (arr: string[] | null) => {
        arr?.forEach(s => {
            const key = s.trim()
            if (key) skillCount[key] = (skillCount[key] || 0) + 1
        })
    }
    projectSkillsData?.forEach(p => { addSkills(p.hard_skills); addSkills(p.soft_skills) })
    experienceSkillsData?.forEach(e => { addSkills(e.hard_skills); addSkills(e.soft_skills) })

    const topSkills = Object.entries(skillCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([skill, count]) => ({ skill, count }))

    // Distribución por carrera
    const careerCount: Record<string, number> = {}
    profilesWithCareers?.forEach(p => {
        const name = (p as any).careers?.name || p.custom_career || 'Sin carrera'
        careerCount[name] = (careerCount[name] || 0) + 1
    })
    const byCareer = Object.entries(careerCount)
        .sort((a, b) => b[1] - a[1])
        .map(([career, count]) => ({ career, count }))

    return {
        totalStudents: totalStudents || 0,
        activeStudents: activeStudents || 0,
        newThisMonth: newThisMonth || 0,
        totalProjects: totalProjects || 0,
        totalExperiences: totalExperiences || 0,
        topSkills,
        byCareer,
        recentStudents: recentStudents || [],
    }
}

// ─────────────────────────────────────────────
// DIRECTORIO DE ESTUDIANTES
// ─────────────────────────────────────────────
export async function getUniversityStudents(universityId: number, careerFilter?: string) {
    const adminClient = createAdminClient()

    let query = adminClient
        .from('profiles')
        .select(`
            id,
            username,
            full_name,
            avatar_url,
            headline,
            careers(name),
            custom_career
        `)
        .eq('university_id', universityId)
        .order('full_name', { ascending: true })

    if (careerFilter) {
        // Filtrar por nombre de carrera via join
        query = query.eq('careers.name', careerFilter)
    }

    const { data: profiles } = await query

    if (!profiles || profiles.length === 0) return []

    const profileIds = profiles.map(p => p.id)

    // Counts en paralelo
    const [{ data: projects }, { data: experiences }, { data: skills }] = await Promise.all([
        adminClient.from('projects').select('user_id').in('user_id', profileIds),
        adminClient.from('experiences').select('user_id').in('user_id', profileIds),
        adminClient.from('projects').select('user_id, hard_skills, soft_skills').in('user_id', profileIds),
    ])

    return profiles.map(p => {
        const allSkills = new Set<string>()
        skills?.filter(s => s.user_id === p.id).forEach(s => {
            s.hard_skills?.forEach((sk: string) => allSkills.add(sk))
            s.soft_skills?.forEach((sk: string) => allSkills.add(sk))
        })
        return {
            ...p,
            careerName: (p as any).careers?.name || p.custom_career || null,
            projectCount: projects?.filter(pr => pr.user_id === p.id).length || 0,
            experienceCount: experiences?.filter(e => e.user_id === p.id).length || 0,
            skillCount: allSkills.size,
        }
    })
}

// ─────────────────────────────────────────────
// CARRERAS DISPONIBLES (para el filtro)
// ─────────────────────────────────────────────
export async function getUniversityCareers(universityId: number) {
    const adminClient = createAdminClient()

    const { data } = await adminClient
        .from('profiles')
        .select('careers(name), custom_career')
        .eq('university_id', universityId)

    const careers = new Set<string>()
    data?.forEach(p => {
        const name = (p as any).careers?.name || p.custom_career
        if (name) careers.add(name)
    })

    return Array.from(careers).sort()
}
