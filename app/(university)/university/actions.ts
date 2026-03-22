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
// HELPER PARA OBTENER CARRERA (Soporta perfiles reales y de demo)
// ─────────────────────────────────────────────
function getPrimaryCareerName(profile: any): string {
    if (profile.user_careers && profile.user_careers.length > 0) {
        const primary = profile.user_careers.find((uc: any) => uc.is_primary) || profile.user_careers[0]
        return primary?.career?.name || primary?.custom_career || 'Sin carrera'
    }
    return (profile as any).careers?.name || profile.custom_career || 'Sin carrera'
}

// ─────────────────────────────────────────────
// STATS PARA EL DASHBOARD
// ─────────────────────────────────────────────
export async function getUniversityStats(universityId: number, filterCareer?: string, filterCohort?: string) {
    const adminClient = createAdminClient()

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString()
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    // 1. Obtener todos los perfiles de la universidad
    let profilesQueryBuilder = adminClient
        .from('profiles')
        .select('id, username, full_name, avatar_url, headline, created_at, updated_at, gender, career_start_date, careers!inner(name), custom_career')
        .eq('university_id', universityId)

    if (filterCareer) {
        // En supabase, filtrar por tabla foreign requiere sintaxis especial o join. Usaremos un filtro in-memory abajo para que soporte "custom_career" también de forma fácil.
    }

    const { data: profilesQuery } = await adminClient
        .from('profiles')
        .select(`
            id, username, full_name, avatar_url, headline, created_at, updated_at, gender, career_start_date,
            careers(name), custom_career,
            user_careers(is_primary, custom_career, career:careers(name))
        `)
        .eq('university_id', universityId)

    let profiles = profilesQuery || []
    
    // Obtener array de TODAS las carreras/cohortes antes de filtrar, para poblar los dropdowns!
    const allCareersSet = new Set<string>()
    const allCohortsSet = new Set<string>()
    
    profiles.forEach(p => {
        const c = getPrimaryCareerName(p)
        const cohort = p.career_start_date ? p.career_start_date.substring(0, 4) : 'Sin cohorte'
        allCareersSet.add(c)
        allCohortsSet.add(cohort)
    })
    
    // Filtrar localmente
    if (filterCareer) {
        profiles = profiles.filter(p => getPrimaryCareerName(p) === filterCareer)
    }
    if (filterCohort) {
        profiles = profiles.filter(p => (p.career_start_date ? p.career_start_date.substring(0, 4) : 'Sin cohorte') === filterCohort)
    }

    if (profiles.length === 0) {
        return {
            totalStudents: 0,
            activeStudents: 0,
            activeStudentsDetail: { last30: 0, last60: 0, last90: 0 },
            newThisMonth: 0,
            incompleteProfiles: 0,
            totalProjects: 0,
            totalExperiences: 0,
            totalAchievements: 0,
            topSkills: [] as { skill: string; count: number }[],
            byCareer: [] as { career: string; count: number }[],
            demographics: { gender: [], cohort: [], career: [] },
            projects: { total: 0, byGender: {}, byCohort: {}, byCareer: {} },
            experiences: { total: 0, byGender: {}, byCohort: {}, byCareer: {} },
            achievements: { total: 0, byGender: {}, byCohort: {}, byCareer: {} },
            skills: { 
                hard: { total: 0, top: [] }, 
                soft: { total: 0, top: [] } 
            },
            recentStudents: [],
            filterOptions: { careers: Array.from(allCareersSet).sort(), cohorts: Array.from(allCohortsSet).sort() }
        }
    }

    const profileIds = profiles.map(p => p.id)

    // 2. Fetch Projects, Experiences, y Achievements
    const [
        { data: projectsData },
        { data: experiencesData },
        { data: achievementsData }
    ] = await Promise.all([
        adminClient.from('projects').select('id, user_id, hard_skills, soft_skills').in('user_id', profileIds),
        adminClient.from('experiences').select('id, user_id, hard_skills, soft_skills').in('user_id', profileIds),
        adminClient.from('achievements').select('id, user_id').in('user_id', profileIds)
    ])

    const projects = projectsData || []
    const experiences = experiencesData || []
    const achievements = achievementsData || []

    // 3. Procesar datos
    const userDict: Record<string, { gender: string, cohort: string, career: string }> = {}
    
    let active30 = 0, active60 = 0, active90 = 0
    let incompleteCount = 0
    let newMonthCount = 0

    const genderCount: Record<string, number> = {}
    const cohortCount: Record<string, number> = {}
    const careerCount: Record<string, number> = {}

    profiles.forEach(p => {
        // Tiempos
        if (p.updated_at >= thirtyDaysAgo) active30++
        if (p.updated_at >= sixtyDaysAgo) active60++
        if (p.updated_at >= ninetyDaysAgo) active90++
        if (p.created_at >= startOfMonth) newMonthCount++

        // Incompleto (Criterio: falta avatar, headline o género)
        if (!p.avatar_url || !p.headline || !p.gender) incompleteCount++

        // Atributos normalizados
        const gender = p.gender || 'No especificado'
        const cohortMatch = p.career_start_date ? p.career_start_date.substring(0, 4) : 'Sin cohorte'
        const career = getPrimaryCareerName(p)

        userDict[p.id] = { gender, cohort: cohortMatch, career }

        genderCount[gender] = (genderCount[gender] || 0) + 1
        cohortCount[cohortMatch] = (cohortCount[cohortMatch] || 0) + 1
        careerCount[career] = (careerCount[career] || 0) + 1
    })

    // Helper para cruces
    const createCrossStats = () => ({
        total: 0,
        byGender: {} as Record<string, number>,
        byCohort: {} as Record<string, number>,
        byCareer: {} as Record<string, number>,
    })

    const projectStats = createCrossStats()
    const expStats = createCrossStats()
    const achStats = createCrossStats()

    const hardSkillCount: Record<string, number> = {}
    const softSkillCount: Record<string, number> = {}
    let totalHardSkills = 0
    let totalSoftSkills = 0

    const processItem = (item: { user_id: string }, stats: ReturnType<typeof createCrossStats>) => {
        const u = userDict[item.user_id]
        if (!u) return
        stats.total++
        stats.byGender[u.gender] = (stats.byGender[u.gender] || 0) + 1
        stats.byCohort[u.cohort] = (stats.byCohort[u.cohort] || 0) + 1
        stats.byCareer[u.career] = (stats.byCareer[u.career] || 0) + 1
    }

    const processSkills = (item: any) => {
        item.hard_skills?.forEach((s: string) => {
            const key = s.trim(); if(key){ hardSkillCount[key] = (hardSkillCount[key] || 0) + 1; totalHardSkills++ }
        })
        item.soft_skills?.forEach((s: string) => {
            const key = s.trim(); if(key){ softSkillCount[key] = (softSkillCount[key] || 0) + 1; totalSoftSkills++ }
        })
    }

    projects.forEach(p => { processItem(p, projectStats); processSkills(p) })
    experiences.forEach(e => { processItem(e, expStats); processSkills(e) })
    achievements.forEach(a => processItem(a, achStats))

    const formatTop = (dict: Record<string, number>, limit: number = 10) => 
        Object.entries(dict).sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([skill, count]) => ({ skill, count }))

    const toSortedArray = (dict: Record<string, number>, keyName: string) => 
        Object.entries(dict).sort((a,b)=>b[1]-a[1]).map(([k, count]) => ({ [keyName]: k, count }))

    // Diccionario unificado para la UI antigua
    const mixedSkills: Record<string, number> = {}
    Object.entries(hardSkillCount).forEach(([k,v]) => mixedSkills[k] = (mixedSkills[k] || 0) + v)
    Object.entries(softSkillCount).forEach(([k,v]) => mixedSkills[k] = (mixedSkills[k] || 0) + v)

    return {
        // Retrocompatibilidad
        totalStudents: profiles.length,
        activeStudents: active30,
        newThisMonth: newMonthCount,
        totalProjects: projectStats.total,
        totalExperiences: expStats.total,
        topSkills: formatTop(mixedSkills, 12),
        byCareer: toSortedArray(careerCount, 'career'),
        recentStudents: profiles
            .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0,5),

        // Nuevas métricas hiper-detalladas
        activeStudentsDetail: {
            last30: active30,
            last60: active60,
            last90: active90
        },
        incompleteProfiles: incompleteCount,
        totalAchievements: achStats.total,
        
        demographics: {
            gender: toSortedArray(genderCount, 'gender'),
            cohort: toSortedArray(cohortCount, 'cohort'),
            career: toSortedArray(careerCount, 'career'),
        },
        
        projects: projectStats,
        experiences: expStats,
        achievements: achStats,
        
        skills: {
            hard: { total: totalHardSkills, top: formatTop(hardSkillCount, 12) },
            soft: { total: totalSoftSkills, top: formatTop(softSkillCount, 12) }
        },
        filterOptions: { careers: Array.from(allCareersSet).sort(), cohorts: Array.from(allCohortsSet).sort() }
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
            custom_career,
            user_careers(is_primary, custom_career, career:careers(name))
        `)
        .eq('university_id', universityId)
        .order('full_name', { ascending: true })

    const { data: rawProfiles } = await query

    let profiles = rawProfiles || []
    if (careerFilter) {
        // Filtrar en memoria por la carrera principal para soporte multi-flujo
        profiles = profiles.filter(p => getPrimaryCareerName(p) === careerFilter)
    }

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
            careerName: getPrimaryCareerName(p),
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
        .select(`
            careers(name),
            custom_career,
            user_careers(is_primary, custom_career, career:careers(name))
        `)
        .eq('university_id', universityId)

    const careers = new Set<string>()
    data?.forEach(p => {
        const name = getPrimaryCareerName(p)
        if (name && name !== 'Sin carrera') careers.add(name)
    })

    return Array.from(careers).sort()
}
