import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import {
    Github,
    Linkedin,
    Globe,
    MapPin,
    Code,
    FolderGit2,
    Users,
    CheckCircle2,
    BookOpen,
    Trophy,
    Mail,
    ExternalLink
} from 'lucide-react'
import DashboardTrajectory from '@/components/dashboard/DashboardTrajectory'
import DashboardCourseCard from '@/components/dashboard/DashboardCourseCard'
import ProjectList from '@/components/dashboard/ProjectList'
import OverviewProjects from '@/components/dashboard/OverviewProjects'
import AchievementList from '@/components/achievements/AchievementList'
import SkillsSection from '@/components/dashboard/SkillsSection'
import TestimonialSection from '@/components/dashboard/TestimonialSection'
import InterestsSection from '@/components/dashboard/InterestsSection'
import ContactSection from '@/components/public/ContactSection'
import { Metadata } from 'next'

// Definir tipos para searchParams y tabs
type TabType = 'overview' | 'proyectos' | 'credenciales' | 'contacto'

interface PublicProfileProps {
    params: Promise<{ username: string }>
    searchParams: Promise<{ tab?: string }>
}

// Metadata Dinámica
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
        description: `Conoce el portafolio y trayectoria de ${profile.full_name || profile.username} en Prisma.`
    }
}

export default async function PublicProfilePage(props: PublicProfileProps) {
    const params = await props.params
    const searchParams = await props.searchParams
    const activeTab = (searchParams.tab as TabType) || 'overview'
    const username = params.username

    const supabase = await createClient()

    // 1. Obtener datos del perfil por username
    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            *,
            universities(name),
            careers(name)
        `)
        .eq('username', username)
        .single()

    if (!profile) {
        notFound()
    }

    // Parsear social_links
    const socialLinks = typeof profile.social_links === 'string'
        ? JSON.parse(profile.social_links)
        : profile.social_links || {}

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

    // 6. Obtener Testimonios
    const { data: testimonials } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

    // --- CONSTRUCCIÓN DE LA TRAYECTORIA UNIFICADA ---
    const hitosUnificados: any[] = []

    experiences?.forEach(exp => {
        hitosUnificados.push({
            id: exp.id,
            title: exp.role,
            subtitle: exp.company,
            date: exp.start_date,
            type: 'experience',
            category: exp.type,
            description: exp.description
        })
    })

    const universityName = (profile.universities?.name.toLowerCase().includes('otro') || profile.universities?.name.toLowerCase().includes('no listada'))
        ? profile.custom_university || 'Otra Universidad'
        : profile.universities?.name || 'Universidad'

    const careerName = (profile.careers?.name.toLowerCase().includes('otro') || profile.careers?.name.toLowerCase().includes('no listada'))
        ? profile.custom_career || 'Otra Carrera'
        : profile.careers?.name || 'Carrera'

    projects?.forEach(proj => {
        hitosUnificados.push({
            id: proj.id,
            title: proj.title,
            subtitle: `Proyecto ${proj.type === 'academic' ? 'Académico' : proj.type === 'startup' ? 'Startup' : 'Personal'}`,
            date: proj.created_at,
            type: 'project',
            category: proj.type,
            description: proj.description,
            link: `/${username}/proyectos/${proj.id}`
        })
    })

    achievements?.forEach(ach => {
        hitosUnificados.push({
            id: ach.id,
            title: ach.title,
            subtitle: ach.organization || 'Logro/Certificación',
            date: ach.date || ach.created_at,
            type: 'achievement',
            description: ach.category === 'course_chair' ? `Ayudantía con Prof. ${ach.professor_name}` : undefined,
            link: `/${username}?tab=credenciales`
        })
    })

    if (profile.career_start_date && profile.careers) {
        hitosUnificados.push({
            id: `edu-start-${profile.id}`,
            title: `Ingreso a ${careerName}`,
            subtitle: universityName,
            date: profile.career_start_date,
            type: 'education'
        })

        const now = new Date()
        const endDate = profile.career_end_date ? new Date(profile.career_end_date) : null
        const isGraduated = endDate && endDate <= now

        if (isGraduated) {
            hitosUnificados.push({
                id: `edu-end-${profile.id}`,
                title: `Egreso de ${careerName}`,
                subtitle: universityName,
                date: profile.career_end_date as string,
                type: 'education'
            })
        }
    }

    hitosUnificados.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Preparar LinkedIn o Mail para contacto
    const contactMethod = socialLinks.linkedin
        ? socialLinks.linkedin
        : (socialLinks.email ? `mailto:${socialLinks.email}` : null)

    const defaultGradient = "from-purple-400 via-pink-400 to-rose-400"
    const catedrasDestacadas = achievements?.filter(a => a.category === 'course_chair') || []

    const allSkills = new Set<string>()
    projects?.forEach(p => p.skills?.forEach(s => allSkills.add(s)))

    // Calcular estado académico (Badge)
    const now = new Date()
    const endDate = profile.career_end_date ? new Date(profile.career_end_date) : null
    const isGraduated = endDate && endDate <= now

    let academicStatus = ""
    if (isGraduated) {
        academicStatus = "🎓 Egresado"
    } else if (profile.career_start_date) {
        const startYear = new Date(profile.career_start_date).getFullYear()
        const currentYear = now.getFullYear()
        const yearNumber = (currentYear - startYear) + 1
        academicStatus = `📚 ${yearNumber > 0 ? `${yearNumber}° Año` : 'Primer Año'}`
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar Público */}
            <nav className="bg-white border-b sticky top-0 z-50 backdrop-blur-sm bg-white/90">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo-prisma.png"
                            alt="Prisma Logo"
                            width={120}
                            height={40}
                            className="h-8 w-auto object-contain"
                        />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm font-semibold text-purple-600 hover:text-purple-700">
                            Crea tu perfil
                        </Link>
                    </div>
                </div>
            </nav>

            <header>
                <div className="h-48 md:h-64 relative overflow-hidden bg-gray-900">
                    <div className={`w-full h-full bg-gradient-to-r ${defaultGradient} opacity-80`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="container mx-auto px-4 -mt-20 md:-mt-24 relative z-10 pb-6">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-5 md:gap-6">

                            <div className="flex-shrink-0">
                                <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${defaultGradient} flex items-center justify-center border-4 border-white shadow-xl overflow-hidden`}>
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt={profile.full_name || 'Avatar'} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl md:text-5xl font-bold text-white">
                                            {(profile.full_name || profile.username).charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                                        {profile.full_name || profile.username}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-900 font-medium">
                                        <span>{careerName}</span>
                                        {profile.universities && (
                                            <>
                                                <span className="text-gray-300">•</span>
                                                <div className="flex items-center gap-2">
                                                    <span>{universityName}</span>
                                                    {academicStatus && (
                                                        <span className="text-[10px] md:text-xs font-bold px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg whitespace-nowrap">
                                                            {academicStatus}
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {profile.headline && <p className="text-gray-500 text-sm leading-tight">{profile.headline}</p>}

                                    <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1 mb-4">
                                        <MapPin size={14} className="text-purple-500" />
                                        Chile
                                    </p>

                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                            <Code size={16} className="text-purple-500" />
                                            <span><strong>{allSkills.size}</strong> Skills</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                            <FolderGit2 size={16} className="text-purple-500" />
                                            <span><strong>{projects?.length || 0}</strong> Proyectos</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                            <Trophy size={16} className="text-amber-500" />
                                            <span><strong>{achievements?.length || 0}</strong> Logros</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2 md:pt-0">
                                    {socialLinks.github && (
                                        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                                            <Github size={20} className="text-gray-700" />
                                        </a>
                                    )}
                                    {socialLinks.linkedin && (
                                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors">
                                            <Linkedin size={20} className="text-blue-600" />
                                        </a>
                                    )}
                                    {contactMethod && (
                                        <a
                                            href={contactMethod}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-10 px-6 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-100"
                                        >
                                            {socialLinks.linkedin ? <Linkedin size={18} /> : <Mail size={18} />}
                                            Contactar
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="bg-white border-b sticky top-[57px] z-40 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex gap-2 overflow-x-auto">
                        <Link
                            href={`/${username}?tab=overview`}
                            className={`px-4 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Overview
                        </Link>
                        <Link
                            href={`/${username}?tab=proyectos`}
                            className={`px-4 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'proyectos' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Proyectos ({projects?.length || 0})
                        </Link>
                        <Link
                            href={`/${username}?tab=credenciales`}
                            className={`px-4 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'credenciales' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Logros ({achievements?.length || 0})
                        </Link>
                        <Link
                            href={`/${username}?tab=contacto`}
                            className={`px-4 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'contacto' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Contacto
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <main className="lg:col-span-8 space-y-8">
                            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">👋 Sobre mí</h2>
                                {profile.about ? (
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{profile.about}</p>
                                ) : (
                                    <p className="text-gray-400 italic">Este usuario aún no ha agregado una biografía.</p>
                                )}
                            </section>

                            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">⭐ Proyecto Destacado</h2>
                                <OverviewProjects projects={projects || []} isReadOnly={true} username={username} />
                            </section>


                            {/* Habilidades calculadas */}
                            <SkillsSection projects={projects || []} />

                            {/* Testimonios (Mi Vitrina) */}
                            <TestimonialSection
                                testimonials={testimonials || []}
                                userId={profile.id}
                                isReadOnly={true}
                            />

                            {/* Intereses */}
                            <InterestsSection interests={profile.interests} isReadOnly={true} />
                        </main>
                        <aside className="lg:col-span-4">
                            <h2 className="sr-only">📊 Trayectoria</h2>
                            <DashboardTrajectory hitos={hitosUnificados} initialCount={5} />
                        </aside>
                    </div>
                )}

                {activeTab === 'proyectos' && (
                    <ProjectList initialProjects={projects || []} userId={profile.id} isReadOnly={true} username={username} />
                )}

                {activeTab === 'credenciales' && (
                    <AchievementList initialAchievements={achievements || []} userId={profile.id} isReadOnly={true} />
                )}

                {activeTab === 'contacto' && (
                    <ContactSection
                        profileEmail={profile.email}
                        profileName={profile.full_name || profile.username}
                        linkedinUrl={socialLinks.linkedin}
                    />
                )}
            </div>
        </div>
    )
}
