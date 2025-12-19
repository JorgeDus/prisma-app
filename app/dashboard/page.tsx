import Link from 'next/link'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import { Github, Linkedin, Globe, MessageCircle, MapPin, Code, FolderGit2, Users, CheckCircle2, BookOpen, Trophy, Rocket } from 'lucide-react'
import DashboardTrajectory from '@/components/dashboard/DashboardTrajectory'
import DashboardCourseCard from '@/components/dashboard/DashboardCourseCard'
import EditProfileButton from '@/components/dashboard/EditProfileButton'
import ProjectList from '@/components/dashboard/ProjectList'
import OverviewProjects from '@/components/dashboard/OverviewProjects'
import AchievementList from '@/components/achievements/AchievementList'
import SkillsSection from '@/components/dashboard/SkillsSection'
import TestimonialSection from '@/components/dashboard/TestimonialSection'
import InterestsSection from '@/components/dashboard/InterestsSection'
import ContactSettings from '@/components/dashboard/ContactSettings'

// Force dynamic rendering required for server components using cookies
export const dynamic = 'force-dynamic'


// Definir tipos para searchParams y tabs
type TabType = 'overview' | 'proyectos' | 'credenciales' | 'contacto'

export default async function DashboardPage(props: {
    searchParams: Promise<{ tab?: string }>
}) {
    const searchParams = await props.searchParams
    const activeTab = (searchParams.tab as TabType) || 'overview'

    const supabase = await createClient()

    // 1. Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        redirect('/login')
    }

    // 2. Obtener datos del perfil y relacionados
    const { data: profile } = await supabase
        .from('profiles')
        .select(`
      *,
      universities(name),
      careers(name)
    `)
        .eq('id', user.id)
        .single()

    if (!profile) {
        // Si usuario autenticado pero sin perfil en DB, redirigir a onboarding
        redirect('/onboarding')
    }

    // Parsear social_links si es JSON
    const socialLinks = typeof profile.social_links === 'string'
        ? JSON.parse(profile.social_links)
        : profile.social_links || {}

    // 3. Obtener Proyectos
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // 4. Obtener Trayectoria (Experiencias)
    const { data: experiences } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false })

    // 5. Obtener Logros (Catedras y otros)
    const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

    // 6. Obtener Testimonios
    const { data: testimonials } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // --- CONSTRUCCIÓN DE LA TRAYECTORIA UNIFICADA ---
    const hitosUnificados: any[] = []

    // A. Experiencias Laborales/Voluntariado
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

    // B. Proyectos
    projects?.forEach(proj => {
        hitosUnificados.push({
            id: proj.id,
            title: proj.title,
            subtitle: `Proyecto ${proj.type === 'academic' ? 'Académico' : proj.type === 'startup' ? 'Startup' : 'Personal'}`,
            date: proj.created_at,
            type: 'project',
            category: proj.type,
            description: proj.description,
            link: `/dashboard/project/${proj.id}`
        })
    })

    // C. Logros / Credenciales
    achievements?.forEach(ach => {
        hitosUnificados.push({
            id: ach.id,
            title: ach.title,
            subtitle: ach.organization || 'Logro/Certificación',
            date: ach.date || ach.created_at,
            type: 'achievement',
            description: ach.category === 'course_chair' ? `Ayudantía con Prof. ${ach.professor_name}` : undefined,
            link: '/dashboard?tab=credenciales'
        })
    })

    // D. Educación Automática
    const universityName = (profile.universities?.name.toLowerCase().includes('otro') || profile.universities?.name.toLowerCase().includes('no listada'))
        ? profile.custom_university || 'Otra Universidad'
        : profile.universities?.name || 'Universidad'

    const careerName = (profile.careers?.name.toLowerCase().includes('otro') || profile.careers?.name.toLowerCase().includes('no listada'))
        ? profile.custom_career || 'Otra Carrera'
        : profile.careers?.name || 'Carrera'

    if (profile.career_start_date && profile.careers) {
        // Hito Inicio
        hitosUnificados.push({
            id: `edu-start-${profile.id}`,
            title: `Ingreso a ${careerName}`,
            subtitle: universityName,
            date: profile.career_start_date,
            type: 'education'
        })

        // Hito Fin (Solo si ya egresó)
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

    // Ordenar todo por fecha desc
    hitosUnificados.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Filtrar catedras destacadas
    const catedrasDestacadas = achievements?.filter(a => a.category === 'course_chair') || []

    // Calcular skills desde proyectos (solo para mostrar contador por ahora)
    const allSkills = new Set<string>()
    projects?.forEach(p => {
        p.skills?.forEach(s => allSkills.add(s))
    })

    // Configuración de visualización
    const defaultGradient = "from-purple-400 via-pink-400 to-rose-400"

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar Simple */}
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
                        <form action="/auth/signout" method="post">
                            <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                Cerrar Sesión
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            {/* HEADER */}
            <header>
                {/* Banner */}
                <div className="h-48 md:h-64 relative overflow-hidden bg-gray-900">
                    <div className={`w-full h-full bg-gradient-to-r ${defaultGradient} opacity-80`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Profile Card */}
                <div className="container mx-auto px-4 -mt-20 md:-mt-24 relative z-10 pb-6">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-5 md:gap-6">

                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${defaultGradient} flex items-center justify-center border-4 border-white shadow-xl overflow-hidden`}>
                                    {profile.avatar_url ? (
                                        <img
                                            src={profile.avatar_url}
                                            alt={profile.full_name || 'Avatar'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl md:text-5xl font-bold text-white">
                                            {(profile.full_name || profile.username).charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                            {profile.full_name || profile.username || 'Usuario Sin Nombre'}
                                        </h1>
                                        <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full">
                                            <CheckCircle2 size={14} />
                                            <span className="text-xs font-semibold">User</span>
                                        </div>
                                    </div>

                                    {/* Info Académica Principal */}
                                    <div className="flex flex-wrap items-center gap-2 mb-1 text-gray-900 font-medium">
                                        <span>{careerName}</span>

                                        {profile.universities && (
                                            <>
                                                <span className="text-gray-300">•</span>
                                                <span>{universityName}</span>
                                            </>
                                        )}

                                        {profile.career_start_date && (
                                            <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                {(() => {
                                                    const start = new Date(profile.career_start_date)
                                                    const now = new Date()
                                                    const isGraduated = profile.career_end_date && new Date(profile.career_end_date) < now

                                                    if (isGraduated) return 'Egresado'

                                                    const yearNum = Math.max(1, now.getFullYear() - start.getFullYear() + 1)
                                                    return `${yearNum}° Año`
                                                })()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Headline Secundario */}
                                    {profile.headline && (
                                        <p className="text-gray-500 text-sm mb-3">
                                            {profile.headline}
                                        </p>
                                    )}

                                    <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-4">
                                        <MapPin size={14} className="text-purple-500" />
                                        Chile
                                    </p>

                                    {/* Stats */}
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                            <Code size={16} className="text-purple-500" />
                                            <span><strong className="text-gray-900">{allSkills.size}</strong> Skills</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                            <FolderGit2 size={16} className="text-purple-500" />
                                            <span><strong className="text-gray-900">{projects?.length || 0}</strong> Proyectos</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                            <Trophy size={16} className="text-amber-500" />
                                            <span><strong className="text-gray-900">{achievements?.length || 0}</strong> Logros</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="flex items-center gap-2 md:gap-3 pt-2 md:pt-0">
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
                                    {socialLinks.website && (
                                        <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-purple-100 flex items-center justify-center transition-colors">
                                            <Globe size={20} className="text-purple-600" />
                                        </a>
                                    )}
                                    <EditProfileButton profile={profile} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b sticky top-[57px] z-40 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex gap-1 md:gap-2 overflow-x-auto">
                        <Link
                            href={`/dashboard?tab=overview`}
                            className={`px-4 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'overview'
                                ? 'text-purple-600 border-b-2 border-purple-600 font-semibold'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Overview
                        </Link>
                        <Link
                            href={`/dashboard?tab=proyectos`}
                            className={`px-4 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'proyectos'
                                ? 'text-purple-600 border-b-2 border-purple-600 font-semibold'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Proyectos ({projects?.length || 0})
                        </Link>
                        <Link
                            href={`/dashboard?tab=credenciales`}
                            className={`px-4 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'credenciales'
                                ? 'text-purple-600 border-b-2 border-purple-600 font-semibold'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Logros ({achievements?.length || 0})
                        </Link>
                        <Link
                            href={`/dashboard?tab=contacto`}
                            className={`px-4 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'contacto'
                                ? 'text-purple-600 border-b-2 border-purple-600 font-semibold'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Contacto
                        </Link>
                    </div>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL - RENDERIZADO CONDICIONAL */}
            <div className="container mx-auto px-4 py-8">

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT COL */}
                        <main className="lg:col-span-8 space-y-8">

                            {/* Sobre mí */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                                    <span className="text-2xl">👋</span> Sobre mí
                                </h2>
                                {profile.about ? (
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{profile.about}</p>
                                ) : (
                                    <div className="text-gray-400 italic">
                                        Cuéntale al mundo sobre ti. Ve a editar perfil para agregar tu biografía.
                                    </div>
                                )}
                            </section>

                            {/* Proyectos Destacados (Overview) */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                                    <span className="text-2xl">⭐</span> Proyectos Destacados
                                </h2>
                                <OverviewProjects projects={projects || []} />
                            </section>


                            {/* Habilidades calculadas */}
                            <SkillsSection projects={projects || []} />

                            {/* Testimonios (Mi Vitrina) */}
                            <TestimonialSection
                                testimonials={testimonials || []}
                                userId={user.id}
                            />

                            {/* Intereses */}
                            <InterestsSection interests={profile.interests} profileId={user.id} />

                        </main>

                        {/* RIGHT COL - Sidebar */}
                        <aside className="lg:col-span-4 space-y-6">
                            {/* Trayectoria Unificada */}
                            <DashboardTrajectory hitos={hitosUnificados} initialCount={5} />
                        </aside>
                    </div>
                )}

                {activeTab === 'proyectos' && (
                    <ProjectList initialProjects={projects || []} userId={user.id} />
                )}

                {activeTab === 'credenciales' && (
                    <AchievementList initialAchievements={achievements || []} userId={user.id} />
                )}

                {activeTab === 'contacto' && (
                    <ContactSettings profile={profile} userId={user.id} />
                )}

            </div>

        </div>
    )
}

