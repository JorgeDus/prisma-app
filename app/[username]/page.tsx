import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { recordProfileVisit } from './actions'
import { getAcceptedCollaborations } from '@/app/(app)/collaboration-actions'
import {
    Briefcase,
    FolderGit2,
    Trophy,
    MessageSquare,
    Mail,
    LayoutGrid,
    Calendar,
    Award,
    FileBadge,
    GraduationCap,
    Users,
    Sparkles,
    Heart,
    Zap,
    Dumbbell,
    Palette,
    HeartPulse,
    Star,
    Stethoscope,
    Lightbulb,
    Rocket
} from 'lucide-react'
import { DEFAULT_EXP_IMAGES, DEFAULT_PROJECT_IMAGES } from '@/constants/images'

// Nuevos Componentes Shared
import { NavRail } from '@/components/shared/NavRail'
import { ImpactHeader } from '@/components/shared/ImpactHeader'
import { BentoHighlights } from '@/components/shared/BentoHighlights'
import { BaseCard } from '@/components/shared/BaseCard'
import { EvidenceBadge } from '@/components/shared/EvidenceBadge'
import { EmptyState } from '@/components/shared/EmptyState'

import DashboardTrajectory from '@/components/dashboard/DashboardTrajectory'
import TestimonialSection from '@/components/dashboard/TestimonialSection'
import InterestsSection from '@/components/dashboard/InterestsSection'
import ContactSection from '@/components/public/ContactSection'
import AppNavbar from '@/components/layout/AppNavbar'
import { Metadata } from 'next'

interface PublicProfileProps {
    params: Promise<{ username: string }>
}

const CATEGORY_MAP: Record<string, string> = {
    certification: "Certificación",
    award: "Premio / Reconocimiento",
    course_chair: "Cátedra Destacada",
    academic_role: "Investigación"
}

const EXP_CATEGORY_MAP: Record<string, { label: string, color: string, bg: string, border: string, icon: any }> = {
    liderazgo: { label: 'Liderazgo', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    social: { label: 'Social', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    emprendimiento: { label: 'Emprendimiento', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    empleo_sustento: { label: 'Empleo', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    academico: { label: 'Académico', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    deportivo: { label: 'Deportivo', icon: Dumbbell, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    creativo: { label: 'Creativo', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
    cuidado_vida: { label: 'Cuidado y Vida', icon: HeartPulse, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
    practica: { label: 'Práctica Profesional y Pasantías', icon: Stethoscope, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
    otro: { label: 'Otro', icon: Star, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' }
}

const CATEGORY_ICON: Record<string, any> = {
    certification: FileBadge,
    award: Trophy,
    course_chair: GraduationCap,
    academic_role: Users
}


const CATEGORY_COLOR: Record<string, string> = {
    certification: "text-blue-500",
    award: "text-amber-500",
    course_chair: "text-indigo-500",
    academic_role: "text-cyan-500"
}

// Helper para formatear fechas (solo mes y año)
const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        timeZone: 'UTC'
    })
}

export async function generateMetadata(props: PublicProfileProps): Promise<Metadata> {
    const params = await props.params
    const supabase = await createClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('username', params.username)
        .single()

    if (!profile) return { title: 'Perfil no encontrado | Prisma' }

    return {
        title: `${profile.full_name || profile.username} | Prisma`,
        description: `Protocolo de validación académica y trayectoria profesional de ${profile.full_name || profile.username}.`
    }
}

export default async function PublicProfilePage(props: PublicProfileProps) {
    const params = await props.params
    const username = params.username
    const supabase = await createClient()

    // 1. Obtener datos del perfil
    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            *,
            universities(name, logo_url),
            careers(name)
        `)
        .eq('username', username)
        .single()

    if (!profile) notFound()

    // Check if profile is paused or deletion pending
    if (profile.is_paused || profile.deletion_requested_at) {
        return (
            <div className="bg-[#F9FAFB] min-h-screen flex items-center justify-center">
                <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo-prisma.png"
                                alt="Prisma Logo"
                                width={120}
                                height={32}
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                    </div>
                </nav>
                <div className="text-center space-y-4 px-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                        <Users size={32} className="text-slate-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Perfil No Disponible
                    </h1>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Este perfil no está disponible actualmente. Es posible que el usuario haya pausado su cuenta o esté en proceso de eliminación.
                    </p>
                    <Link href="/" className="inline-block mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        )
    }

    const socialLinks = typeof profile.social_links === 'string'
        ? JSON.parse(profile.social_links)
        : profile.social_links || {}

    // Check if the viewer is authenticated and connected
    let isViewerConnected = false
    let viewerUsername: string | null = null
    const { data: { user: viewer } } = await supabase.auth.getUser()
    if (viewer) {
        // Fetch viewer's username for AppNavbar
        const { data: viewerProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', viewer.id)
            .single()
        viewerUsername = viewerProfile?.username || null

        // Check if they're viewing their own profile
        if (viewer.id === profile.id) {
            isViewerConnected = true
        } else {
            // Check for accepted connection
            const { data: connection } = await supabase
                .from('connections')
                .select('id')
                .eq('status', 'accepted')
                .or(`and(sender_id.eq.${viewer.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${viewer.id})`)
                .limit(1)
                .maybeSingle()
            isViewerConnected = !!connection
        }

        // Record the visit (fire-and-forget, non-blocking, skip self-visits)
        if (viewer.id !== profile.id) {
            recordProfileVisit(profile.id, viewer.id).catch((err) => {
                console.error('[recordProfileVisit] Error:', err)
            })
        }
    }

    // 2. Obtener Datos Relacionados
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

    const { data: experiences } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', profile.id)
        .order('start_date', { ascending: false })

    const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', profile.id)
        .order('date', { ascending: false })

    const { data: testimonials } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

    const { data: languages } = await supabase
        .from('languages')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

    // Fetch user's careers
    const { data: userCareers } = await supabase
        .from('user_careers')
        .select('*, career:careers(id, name)')
        .eq('user_id', profile.id)
        .order('is_primary', { ascending: false })

    // Get primary career for header display
    const primaryCareer = userCareers?.find(uc => uc.is_primary) || userCareers?.[0] || null

    // Fetch accepted collaborations for this profile
    const { projects: collabProjects, experiences: collabExperiences } = await getAcceptedCollaborations(profile.id)

    // Filter out collaborations that the user has already cloned
    const clonedProjectIds = new Set((projects || []).map(p => p.original_project_id).filter(Boolean));
    const filteredCollabProjects = collabProjects.filter(p => !clonedProjectIds.has(p.id));
    
    const clonedExperienceIds = new Set((experiences || []).map(e => e.original_experience_id).filter(Boolean));
    const filteredCollabExperiences = collabExperiences.filter(e => !clonedExperienceIds.has(e.id));

    // Merge collaborations into own items
    const allProjects = [...(projects || []), ...filteredCollabProjects] as any[]
    const allExperiences = [...(experiences || []), ...filteredCollabExperiences] as any[]

    // 3. Fetch curated vitrina items if featured_items exists
    let curatedVitrinaItems: any[] = []
    if (profile.featured_items && Array.isArray(profile.featured_items) && profile.featured_items.length > 0) {
        const featuredItemsRef = profile.featured_items as { id: string; type: 'project' | 'experience' }[]

        // Separate IDs by type
        const projectIds = featuredItemsRef.filter(item => item.type === 'project').map(item => item.id)
        const experienceIds = featuredItemsRef.filter(item => item.type === 'experience').map(item => item.id)

        // Fetch in parallel
        const [projectsResult, experiencesResult] = await Promise.all([
            projectIds.length > 0
                ? supabase.from('projects').select('*').in('id', projectIds)
                : Promise.resolve({ data: [] }),
            experienceIds.length > 0
                ? supabase.from('experiences').select('*').in('id', experienceIds)
                : Promise.resolve({ data: [] })
        ])

        const fetchedProjects = projectsResult.data || []
        const fetchedExperiences = experiencesResult.data || []

        // Map back to original order, adding itemType for rendering logic
        curatedVitrinaItems = featuredItemsRef
            .map(ref => {
                if (ref.type === 'project') {
                    const project = fetchedProjects.find(p => p.id === ref.id)
                    return project ? { ...project, itemType: 'project' } : null
                } else {
                    const experience = fetchedExperiences.find(e => e.id === ref.id)
                    return experience ? { ...experience, itemType: 'experience' } : null
                }
            })
            .filter(Boolean)
    }

    // Preparar UI - prefer primaryCareer if available
    const baseCareerName = primaryCareer
        ? ((primaryCareer as any).career?.name || primaryCareer.custom_career || 'Carrera')
        : (profile.careers?.name || 'Carrera')
    const degreeType = primaryCareer ? (primaryCareer as any).degree_type : null;
    const careerName = degreeType && degreeType !== 'Carrera de Pregrado'
        ? `${degreeType} en ${baseCareerName}`
        : baseCareerName;
    const universityName = primaryCareer?.institution || profile.universities?.name || 'Universidad'

    const getAcademicStatus = () => {
        const today = new Date()

        // Check user_careers (new multi-career system) first
        if (primaryCareer) {
            if (!primaryCareer.is_current && primaryCareer.end_year) {
                return primaryCareer.end_year <= today.getFullYear() ? "EGRESADO" : `EGRESA ${primaryCareer.end_year}`
            }
            if (primaryCareer.is_current && primaryCareer.start_year) {
                const diffYears = today.getFullYear() - primaryCareer.start_year + 1
                return diffYears > 0 ? `${diffYears}º AÑO` : "EN CURSO"
            }
        }

        // Fallback to legacy profile fields
        if (profile.career_end_date && new Date(profile.career_end_date) <= today) return "EGRESADO"
        if (!profile.career_start_date) return "EN CURSO"

        const start = new Date(profile.career_start_date)
        const diffYears = today.getFullYear() - start.getFullYear() + 1
        return diffYears > 0 ? `${diffYears}º AÑO` : "EN CURSO"
    }

    const academicStatus = getAcademicStatus()

    // --- AGREGACIÓN DE SKILLS (sin duplicados) + CONTEO + EVIDENCIAS ---
    const hardSkillsSet = new Set<string>()
    const softSkillsSet = new Set<string>()
    const skillCounts: Record<string, number> = {}
    const skillEvidence: Record<string, { id: string; title: string; type: 'project' | 'experience' }[]> = {}

    // De proyectos: hard_skills y soft_skills
    allProjects?.forEach(proj => {
        const addSkill = (skill: string, set: Set<string>) => {
            if (!skill) return
            set.add(skill)
            skillCounts[skill] = (skillCounts[skill] || 0) + 1
            if (!skillEvidence[skill]) skillEvidence[skill] = []
            skillEvidence[skill].push({ id: proj.id, title: proj.title, type: 'project' })
        }
        proj.hard_skills?.forEach((s: string) => addSkill(s.trim(), hardSkillsSet))
        proj.soft_skills?.forEach((s: string) => addSkill(s.trim(), softSkillsSet))
    })

    // De experiencias: hard_skills y soft_skills
    allExperiences?.forEach(exp => {
        const addSkill = (skill: string, set: Set<string>) => {
            if (!skill) return
            set.add(skill)
            skillCounts[skill] = (skillCounts[skill] || 0) + 1
            if (!skillEvidence[skill]) skillEvidence[skill] = []
            skillEvidence[skill].push({ id: exp.id, title: exp.title, type: 'experience' })
        }
        exp.hard_skills?.forEach((s: string) => addSkill(s.trim(), hardSkillsSet))
        exp.soft_skills?.forEach((s: string) => addSkill(s.trim(), softSkillsSet))
    })

    const aggregatedHardSkills = Array.from(hardSkillsSet)
    const aggregatedSoftSkills = Array.from(softSkillsSet)

    // --- CONSTRUCCIÓN DE LA TRAYECTORIA UNIFICADA ---
    const hitosUnificados: any[] = []

    // 1. Experiencias
    allExperiences?.filter(exp => exp.show_in_timeline !== false).forEach(exp => {
        hitosUnificados.push({
            id: exp.id,
            title: exp.title,
            subtitle: exp.organization,
            date: exp.start_date || exp.created_at,
            type: 'experience',
            category: exp.type,
            description: exp.description,
            link: exp.isCollaboration && exp.ownerProfile
                ? `/${exp.ownerProfile.username}/experiencias/${exp.id}`
                : `/${username}/experiencias/${exp.id}`,
            isCollaboration: exp.isCollaboration
        })
    })

    // 2. Proyectos
    allProjects?.filter(proj => proj.show_in_timeline !== false).forEach(proj => {
        hitosUnificados.push({
            id: proj.id,
            title: proj.title,
            subtitle: proj.isCollaboration ? (proj.collaborationRole || 'Colaborador') : 'Proyecto',
            date: proj.created_at,
            type: 'project',
            category: proj.type,
            description: proj.description,
            link: proj.isCollaboration && proj.ownerProfile
                ? `/${proj.ownerProfile.username}/proyectos/${proj.id}`
                : `/${username}/proyectos/${proj.id}`,
            isCollaboration: proj.isCollaboration
        })
    })

    // 3. Logros (Achievements)
    achievements?.forEach(ach => {
        hitosUnificados.push({
            id: ach.id,
            title: ach.title,
            subtitle: ach.organization || 'Logro',
            date: ach.date || ach.created_at,
            type: 'achievement',
            category: ach.category,
            description: [
                ach.distinction,
                ach.professor_name ? `Prof. ${ach.professor_name}` : null
            ].filter(Boolean).join(' • ')
        })
    })

    // 4. Educación Universitaria (Hitos automáticos)
    if (profile.career_start_date) {
        hitosUnificados.push({
            id: `edu-start-${profile.id}`,
            title: `Inicio de ${careerName}`,
            subtitle: universityName,
            date: profile.career_start_date,
            type: 'education',
            category: 'academic'
        })
    }
    if (profile.career_end_date) {
        const isPast = new Date(profile.career_end_date) <= new Date()
        hitosUnificados.push({
            id: `edu-end-${profile.id}`,
            title: isPast ? `Egreso de ${careerName}` : `Fecha Estimada de Egreso`,
            subtitle: universityName,
            date: profile.career_end_date,
            type: 'education',
            category: 'academic'
        })
    }

    hitosUnificados.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const sections = [
        { id: "highlights", label: "Mi Vitrina" },
        { id: "logros", label: "Logros / Hitos" },
        { id: "experiencia", label: "Experiencias" },
        { id: "proyectos", label: "Proyectos" },
        ...(testimonials && testimonials.length > 0 ? [{ id: "testimonios", label: "Testimonios" }] : []),
        { id: "contacto", label: "Contacto" },
    ]

    return (
        <div className="bg-[#F9FAFB] min-h-screen pb-24 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Nav Rail (Scroll-spy) */}
            <NavRail sections={sections} />

            {/* Navigation */}
            {viewerUsername ? (
                <AppNavbar username={viewerUsername} />
            ) : (
                <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo-prisma.png"
                                alt="Prisma Logo"
                                width={120}
                                height={32}
                                className="h-8 w-auto object-contain"
                            />
                            <span className="font-mono text-xs font-bold tracking-tighter uppercase text-slate-800"> / {username}</span>
                        </Link>
                    </div>
                </nav>
            )}

            {/* Impact Header (Thesis) */}
            <div className="mt-16">
                <ImpactHeader
                    name={profile.full_name || username}
                    headline={profile.headline || undefined}
                    thesis={profile.about || "Transformando el conocimiento académico en impacto real a través de la evidencia dinámica."}
                    career={careerName}
                    university={universityName}
                    academicStatus={academicStatus}
                    avatarUrl={profile.avatar_url || undefined}
                    socialLinks={socialLinks}
                    hardSkills={aggregatedHardSkills}
                    softSkills={aggregatedSoftSkills}
                    interests={profile.interests || []}
                    skillCounts={skillCounts}
                    skillEvidence={skillEvidence}
                    username={username}
                    allCareers={userCareers || []}
                    pinnedSkills={profile.skills_order || []}
                />
                {/* Badge Universidad Aliada */}
                {(profile.universities as any)?.logo_url && (
                    <div className="flex justify-center mt-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                            <Image
                                src={(profile.universities as any).logo_url.startsWith('http') ? (profile.universities as any).logo_url : ((profile.universities as any).logo_url.startsWith('/') ? (profile.universities as any).logo_url : `/${(profile.universities as any).logo_url}`)}
                                alt={(profile.universities as any).name}
                                width={18}
                                height={18}
                                className="w-4 h-4 object-contain rounded-sm"
                            />
                            <span className="text-xs font-medium text-slate-600">
                                {(profile.universities as any).name}
                            </span>
                            <span className="text-[10px] font-mono text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-full font-bold">
                                Miembro Prisma
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <main className="max-w-7xl mx-auto px-6 space-y-32">

                {/* 1. highlights Bento Grid */}
                <section id="highlights" className="section-anchor">
                    <div className="space-y-8">
                        <div className="flex flex-col space-y-2">
                            {/* Section Divider */}
                            <div className="border-t border-slate-200" />
                            <div className="flex items-center justify-between py-2">
                                <h2 className="text-lg font-mono font-black tracking-widest uppercase text-slate-600">
                                    Mi Vitrina
                                </h2>
                                <div className="flex items-center gap-3">
                                    <EvidenceBadge label="Verificado por Prisma" />
                                </div>
                            </div>
                            <div className="border-b border-slate-200" />
                            <p className="text-xs font-mono text-slate-500 uppercase tracking-tight">Acceso directo a mis experiencias y proyectos de mayor impacto</p>
                        </div>
                        <BentoHighlights
                            items={[...allProjects, ...allExperiences]}
                            username={profile.username}
                            isEditable={false}
                            curatedItems={curatedVitrinaItems.length > 0 ? curatedVitrinaItems : undefined}
                        />
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Contenido Principal */}
                    <div className="lg:col-span-8 space-y-32">

                        {/* 2. Logros */}
                        <section id="logros" className="section-anchor space-y-8">
                            {/* Section Divider */}
                            <div>
                                <div className="border-t border-slate-200" />
                                <div className="flex items-center justify-between py-2">
                                    <h2 className="text-lg font-mono font-black tracking-widest uppercase text-slate-600">
                                        Logros / Hitos
                                    </h2>
                                    <Trophy size={18} className="text-amber-400" />
                                </div>
                                <div className="border-b border-slate-200" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {achievements?.map((ach) => (
                                    <BaseCard
                                        key={ach.id}
                                        title={ach.title}
                                        subtitle={ach.organization || ""}
                                        overline={
                                            <div className="flex items-center gap-2">
                                                {(() => {
                                                    const Icon = CATEGORY_ICON[ach.category] || Sparkles;
                                                    const colorClass = CATEGORY_COLOR[ach.category] || "text-slate-400";
                                                    return <Icon size={12} className={colorClass} strokeWidth={2.5} />;
                                                })()}
                                                <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.2em]">
                                                    {CATEGORY_MAP[ach.category] || ach.category}
                                                </span>
                                            </div>
                                        }
                                        dateRange={
                                            ach.category === 'academic_role' && ach.date
                                                ? `${formatDate(ach.date)} - ${ach.is_current ? 'Presente' : (ach.end_date ? formatDate(ach.end_date) : '')}`
                                                : (ach.date ? formatDate(ach.date) : "")
                                        }
                                        isEditable={false}
                                        className="h-full"
                                    >
                                        {(ach.professor_name || ach.distinction) && (
                                            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                                                {ach.professor_name && (
                                                    <p className="text-[10px] leading-relaxed">
                                                        <span className="font-mono font-bold text-slate-400 uppercase mr-1">Prof:</span>
                                                        <span className="text-slate-600">{ach.professor_name}</span>
                                                    </p>
                                                )}
                                                {ach.distinction && (
                                                    <p className="text-[10px] leading-relaxed">
                                                        <span className="font-mono font-bold text-slate-400 uppercase mr-1">Nota:</span>
                                                        <span className="text-slate-600">{ach.distinction}</span>
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </BaseCard>
                                ))}
                            </div>
                        </section>

                        {/* 3. Experiencia */}
                        <section id="experiencia" className="section-anchor space-y-8">
                            {/* Section Divider */}
                            <div>
                                <div className="border-t border-slate-200" />
                                <div className="flex items-center justify-between py-2">
                                    <h2 className="text-lg font-mono font-black tracking-widest uppercase text-slate-600">
                                        Experiencias
                                    </h2>
                                    <Sparkles size={18} className="text-purple-400" />
                                </div>
                                <div className="border-b border-slate-200" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {allExperiences?.length ? (
                                    allExperiences.map((exp) => {
                                        const isCollab = exp.isCollaboration || (exp.collaborator_ids && exp.collaborator_ids.length > 0) || exp.original_experience_id
                                        const cat = EXP_CATEGORY_MAP[exp.type || 'otro'] || EXP_CATEGORY_MAP.otro;
                                        const Icon = cat.icon;
                                        return (
                                            <BaseCard
                                                key={isCollab ? `collab-exp-${exp.id}` : exp.id}
                                                title={exp.title}
                                                subtitle={isCollab ? (exp.collaborationRole || exp.role || exp.organization || '') : (exp.role || exp.organization || '')}
                                                overline={
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${cat.bg} ${cat.color} ${cat.border}`}>
                                                            <Icon size={12} strokeWidth={2.5} />
                                                            {cat.label}
                                                        </span>
                                                        {isCollab && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-violet-50 text-violet-600 border border-violet-200">
                                                                <Users size={10} /> Collab
                                                            </span>
                                                        )}
                                                    </div>
                                                }
                                                description={exp.description || ""}
                                                imageUrl={exp.cover_image || DEFAULT_EXP_IMAGES[exp.type || 'otro'] || DEFAULT_EXP_IMAGES.otro}
                                                dateRange={exp.start_date ? `${formatDate(exp.start_date)} - ${exp.is_current ? 'Presente' : (exp.end_date ? formatDate(exp.end_date) : '')}` : ""}
                                                tags={[...(exp.hard_skills || []), ...(exp.soft_skills || [])]}
                                                href={isCollab && exp.ownerProfile ? `/${exp.ownerProfile.username}/experiencias/${exp.id}` : `/${username}/experiencias/${exp.id}`}
                                                isEditable={false}
                                            />
                                        )
                                    })
                                ) : (
                                    <p className="text-slate-400">No hay experiencias registradas aún por el usuario.</p>
                                )}
                            </div>
                        </section>

                        {/* 4. Proyectos */}
                        <section id="proyectos" className="section-anchor space-y-8">
                            {/* Section Divider */}
                            <div>
                                <div className="border-t border-slate-200" />
                                <div className="flex items-center justify-between py-2">
                                    <h2 className="text-lg font-mono font-black tracking-widest uppercase text-slate-600">
                                        Proyectos
                                    </h2>
                                    <Briefcase size={18} className="text-blue-400" />
                                </div>
                                <div className="border-b border-slate-200" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {allProjects?.length ? (
                                    allProjects.map((proj) => {
                                        const isCollab = proj.isCollaboration || (proj.collaborator_ids && proj.collaborator_ids.length > 0) || proj.original_project_id
                                        
                                        const PROJECT_LABELS: Record<string, string> = {
                                            academic: 'Portafolio Académico',
                                            startup: 'Emprendimiento',
                                            personal: 'Innovación Personal'
                                        }
                                        const PROJECT_STYLES: Record<string, { bg: string, color: string, border: string, icon: any }> = {
                                            academic: { bg: 'bg-indigo-50', color: 'text-indigo-600', border: 'border-indigo-100', icon: GraduationCap },
                                            startup: { bg: 'bg-blue-50', color: 'text-blue-600', border: 'border-blue-100', icon: Rocket },
                                            personal: { bg: 'bg-emerald-50', color: 'text-emerald-600', border: 'border-emerald-100', icon: Lightbulb }
                                        }
                                        
                                        const pType = proj.type || 'personal'
                                        const pStyle = PROJECT_STYLES[pType] || PROJECT_STYLES.personal
                                        const PIcon = pStyle.icon

                                        return (
                                            <BaseCard
                                                key={proj.isCollaboration ? `collab-proj-${proj.id}` : proj.id}
                                                title={proj.title}
                                                subtitle={proj.isCollaboration ? (proj.collaborationRole || 'Colaborador') : (proj.role || PROJECT_LABELS[pType] || pType)}
                                                overline={
                                                    <div className="flex items-center flex-wrap gap-2">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${pStyle.bg} ${pStyle.color} ${pStyle.border}`}>
                                                            <PIcon size={12} strokeWidth={2.5} />
                                                            {PROJECT_LABELS[pType] || pType}
                                                        </span>
                                                        {isCollab && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-violet-50 text-violet-600 border border-violet-200">
                                                                <Users size={10} /> Collab
                                                            </span>
                                                        )}
                                                    </div>
                                                }
                                                description={proj.description || ""}
                                                imageUrl={proj.cover_image || DEFAULT_PROJECT_IMAGES[proj.type] || DEFAULT_PROJECT_IMAGES.personal}
                                                tags={[...(proj.hard_skills || []), ...(proj.soft_skills || [])]}
                                                href={isCollab && proj.ownerProfile ? `/${proj.ownerProfile.username}/proyectos/${proj.id}` : `/${username}/proyectos/${proj.id}`}
                                                isEditable={false}
                                            />
                                        )
                                    })
                                ) : (
                                    <div className="col-span-2">
                                        <p className="text-slate-400 text-center">Sin artefactos de proyecto disponibles.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 5. Testimonios */}
                        {testimonials && testimonials.length > 0 && (
                            <section id="testimonios" className="section-anchor space-y-8">
                                {/* Section Divider */}
                                <div>
                                    <div className="border-t border-slate-200" />
                                    <div className="flex items-center justify-between py-2">
                                        <h2 className="text-lg font-mono font-black tracking-widest uppercase text-slate-600">
                                            Testimonios
                                        </h2>
                                        <MessageSquare size={18} className="text-emerald-400" />
                                    </div>
                                    <div className="border-b border-slate-200" />
                                </div>
                                <TestimonialSection testimonials={testimonials || []} userId={profile.id} isReadOnly={true} />
                            </section>
                        )}
                    </div>

                    {/* Sidebar / Trayectoria */}
                    <aside className="lg:col-span-4 space-y-12 h-fit lg:border-l lg:border-slate-100 lg:pl-8">
                        <section className="sticky top-24 space-y-8">
                            <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-thin space-y-8">
                                <h2 className="text-xs font-mono font-bold tracking-tight uppercase text-slate-500">Vista de Trayectoria</h2>
                                <DashboardTrajectory hitos={hitosUnificados} initialCount={5} />
                            </div>

                            {/* Languages Section */}
                            {languages && languages.length > 0 && (
                                <div className="pt-8 border-t border-slate-100 space-y-4">
                                    <h3 className="text-xs font-mono font-bold tracking-tight uppercase text-slate-500 flex items-center gap-2">
                                        <span className="text-indigo-500"></span> Idiomas
                                    </h3>
                                    <div className="space-y-2">
                                        {[...languages].sort((a, b) => {
                                            const levelOrder = ['Nativo / Bilingüe', 'Avanzado (C1-C2)', 'Intermedio (B1-B2)', 'Básico (A1-A2)']
                                            return levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level)
                                        }).map((lang) => (
                                            <div key={lang.id} className="flex items-center justify-between py-2 px-3 bg-white border border-slate-100 rounded-xl">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm text-slate-800">{lang.language}</span>
                                                    {lang.institution && (
                                                        <span className="text-[10px] text-slate-400">{lang.institution}</span>
                                                    )}
                                                </div>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${lang.level === 'Nativo / Bilingüe' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    lang.level === 'Avanzado (C1-C2)' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        lang.level === 'Intermedio (B1-B2)' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                            'bg-slate-50 text-slate-600 border-slate-200'
                                                    }`}>
                                                    {lang.level}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-8 border-t border-slate-100">
                                <InterestsSection interests={profile.interests} isReadOnly={true} />
                            </div>
                        </section>
                    </aside>
                </div>
            </main>

            {/* Dark Closing Section */}
            <div className="bg-slate-900 mt-32 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

                <main className="max-w-7xl mx-auto px-6">
                    {/* 6. Contacto */}
                    <section id="contacto" className="section-anchor pt-32 pb-48">
                        <div className="max-w-2xl mx-auto space-y-12 text-center">
                            <h2 className="text-sm font-mono font-black tracking-[0.2em] uppercase text-indigo-400 flex items-center justify-center gap-2">
                                <Mail size={18} />
                                Contacto
                            </h2>
                            <p className="text-4xl font-bold text-white leading-tight">
                                ¿Buscas establecer una conexión profesional?
                            </p>
                            <ContactSection
                                profileEmail={profile.email}
                                profileName={profile.full_name || username}
                                linkedinUrl={socialLinks.linkedin}
                                isConnected={isViewerConnected}
                            />
                        </div>
                    </section>
                </main>

                <footer className="border-t border-slate-800 py-12 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2 grayscale invert opacity-80">
                            <Image
                                src="/logo-prisma.png"
                                alt="Prisma Logo"
                                width={120}
                                height={32}
                                className="h-8 w-auto object-contain"
                            />
                        </div>
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em]">
                            © 2025 Somos Prisma
                        </p>
                        <div className="flex gap-8 font-mono text-[10px] uppercase font-bold text-slate-400">
                            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
                        </div>
                    </div>
                </footer>
            </div >
        </div >
    )
}
