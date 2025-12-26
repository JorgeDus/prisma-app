import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
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
    Star
} from 'lucide-react'

// Nuevos Componentes Shared
import { NavRail } from '@/components/shared/NavRail'
import { ImpactHeader } from '@/components/shared/ImpactHeader'
import { BentoHighlights } from '@/components/shared/BentoHighlights'
import { BaseCard } from '@/components/shared/BaseCard'
import { EvidenceBadge } from '@/components/shared/EvidenceBadge'
import { EmptyState } from '@/components/shared/EmptyState'

import DashboardTrajectory from '@/components/dashboard/DashboardTrajectory'
import SkillsSection from '@/components/dashboard/SkillsSection'
import TestimonialSection from '@/components/dashboard/TestimonialSection'
import InterestsSection from '@/components/dashboard/InterestsSection'
import ContactSection from '@/components/public/ContactSection'
import { Metadata } from 'next'

interface PublicProfileProps {
    params: Promise<{ username: string }>
}

const CATEGORY_MAP: Record<string, string> = {
    certification: "Certificación",
    award: "Premio / Reconocimiento",
    course_chair: "Cátedra Destacada",
    academic_role: "Ayudantía / Investigación"
}

const EXP_CATEGORY_MAP: Record<string, { label: string, color: string, bg: string, border: string, icon: any }> = {
    liderazgo: { label: 'Liderazgo', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    social: { label: 'Social', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    emprendimiento: { label: 'Emprendimiento', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    empleo_sustento: { label: 'Trayectoria', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    academico: { label: 'Académico', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    deportivo: { label: 'Deportivo', icon: Dumbbell, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    creativo: { label: 'Creativo', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
    cuidado_vida: { label: 'Cuidado y Vida', icon: HeartPulse, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
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
        title: `${profile.full_name || profile.username} | Portafolio de Evidencia`,
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
            universities(name),
            careers(name)
        `)
        .eq('username', username)
        .single()

    if (!profile) notFound()

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

    const { data: testimonials } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

    // Preparar UI
    const universityName = profile.universities?.name || 'Universidad'
    const careerName = profile.careers?.name || 'Carrera'

    const getAcademicStatus = () => {
        const today = new Date()
        if (profile.career_end_date && new Date(profile.career_end_date) <= today) return "EGRESADO"
        if (!profile.career_start_date) return "EN CURSO"

        const start = new Date(profile.career_start_date)
        const diffYears = today.getFullYear() - start.getFullYear() + 1
        return diffYears > 0 ? `${diffYears}º AÑO` : "EN CURSO"
    }

    const academicStatus = getAcademicStatus()

    // --- CONSTRUCCIÓN DE LA TRAYECTORIA UNIFICADA ---
    const hitosUnificados: any[] = []

    // 1. Experiencias
    experiences?.filter(exp => exp.show_in_timeline !== false).forEach(exp => {
        hitosUnificados.push({
            id: exp.id,
            title: exp.title,
            subtitle: exp.organization,
            date: exp.start_date || exp.created_at,
            type: 'experience',
            category: exp.type,
            description: exp.description,
            link: `/${username}/experiencias/${exp.id}`
        })
    })

    // 2. Proyectos
    projects?.filter(proj => proj.show_in_timeline !== false).forEach(proj => {
        hitosUnificados.push({
            id: proj.id,
            title: proj.title,
            subtitle: 'Proyecto',
            date: proj.created_at,
            type: 'project',
            category: proj.type,
            description: proj.description,
            link: `/${username}/proyectos/${proj.id}`
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
        { id: "highlights", label: "Highlights" },
        { id: "experiencia", label: "Experiencia" },
        { id: "proyectos", label: "Proyectos" },
        { id: "logros", label: "Logros" },
        ...(testimonials && testimonials.length > 0 ? [{ id: "testimonios", label: "Testimonios" }] : []),
        { id: "contacto", label: "Contacto" },
    ]

    return (
        <div className="bg-[#F9FAFB] min-h-screen pb-24 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Nav Rail (Scroll-spy) */}
            <NavRail sections={sections} />

            {/* Top Navigation Bar */}
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
                        <span className="font-mono text-xs font-bold tracking-tighter uppercase text-slate-900"> / {username}</span>
                    </Link>
                    <Link href="/" className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors">
                        Protocolo de Validación →
                    </Link>
                </div>
            </nav>

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
                />
            </div>

            <main className="max-w-7xl mx-auto px-6 space-y-32">

                {/* 1. highlights Bento Grid */}
                <section id="highlights" className="section-anchor">
                    <div className="space-y-8">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-mono font-black tracking-widest uppercase text-slate-500">01 / Experiencias Destacadas</h2>
                                <EvidenceBadge label="Verificado por Prisma" />
                            </div>
                            <p className="text-xs font-mono text-slate-500 uppercase tracking-tight">Acceso directo a mis experiencias de mayor impacto</p>
                        </div>
                        <BentoHighlights items={[...(projects || []), ...(experiences || [])]} username={profile.username} isEditable={false} />
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Contenido Principal */}
                    <div className="lg:col-span-8 space-y-32">

                        {/* 2. Experiencia */}
                        <section id="experiencia" className="section-anchor space-y-8">
                            <h2 className="text-sm font-mono font-black tracking-widest uppercase text-slate-500">02 / Trayectoria Personal</h2>
                            <div className="space-y-6">
                                {experiences?.length ? (
                                    experiences.map((exp) => (
                                        <BaseCard
                                            key={exp.id}
                                            title={exp.title}
                                            subtitle={exp.organization}
                                            overline={
                                                (() => {
                                                    const cat = EXP_CATEGORY_MAP[exp.type || 'otro'] || EXP_CATEGORY_MAP.otro;
                                                    const Icon = cat.icon;
                                                    return (
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${cat.bg} ${cat.color} ${cat.border}`}>
                                                            <Icon size={12} strokeWidth={2.5} />
                                                            {cat.label}
                                                        </span>
                                                    )
                                                })()
                                            }
                                            description={exp.description || ""}
                                            imageUrl={exp.cover_image || undefined}
                                            dateRange={exp.start_date ? `${exp.start_date} - ${exp.end_date || 'Presente'}` : ""}
                                            tags={exp.skills || []}
                                            href={`/${username}/experiencias/${exp.id}`}
                                            isEditable={false}
                                        />
                                    ))
                                ) : (
                                    <p className="text-slate-400 font-serif italic">No hay experiencias registradas bajo este protocolo.</p>
                                )}
                            </div>
                        </section>

                        {/* 3. Proyectos */}
                        <section id="proyectos" className="section-anchor space-y-8">
                            <h2 className="text-sm font-mono font-black tracking-widest uppercase text-slate-500">03 / Portafolio de Proyectos</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects?.length ? (
                                    projects.map((proj) => (
                                        <BaseCard
                                            key={proj.id}
                                            title={proj.title}
                                            subtitle={proj.role || proj.type}
                                            description={proj.description || ""}
                                            imageUrl={proj.cover_image || undefined}
                                            tags={proj.skills || []}
                                            href={`/${username}/proyectos/${proj.id}`}
                                            isEditable={false}
                                            is_featured={proj.is_featured}
                                        // is_learning_artifact={proj.is_learning_artifact} // Pendiente de migración o lógica
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-2">
                                        <p className="text-slate-400 font-serif italic text-center">Sin artefactos de proyecto disponibles.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 4. Logros */}
                        <section id="logros" className="section-anchor space-y-8">
                            <h2 className="text-sm font-mono font-black tracking-widest uppercase text-slate-500">04 / Logros</h2>
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
                                        dateRange={ach.date || ""}
                                        isEditable={false}
                                        className="h-full"
                                    >
                                        {(ach.professor_name || ach.distinction) && (
                                            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                                                {ach.professor_name && (
                                                    <p className="text-[10px] leading-relaxed">
                                                        <span className="font-mono font-bold text-slate-400 uppercase mr-1">Prof:</span>
                                                        <span className="font-serif italic text-slate-600">{ach.professor_name}</span>
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

                        {/* 5. Testimonios */}
                        {testimonials && testimonials.length > 0 && (
                            <section id="testimonios" className="section-anchor space-y-8">
                                <h2 className="text-sm font-mono font-black tracking-widest uppercase text-slate-500">05 / Red de Testimonios</h2>
                                <TestimonialSection testimonials={testimonials || []} userId={profile.id} isReadOnly={true} />
                            </section>
                        )}
                    </div>

                    {/* Sidebar / Trayectoria */}
                    <aside className="lg:col-span-4 space-y-12 h-fit sticky top-24">
                        <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 rounded-full" />

                            <h2 className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-indigo-600/60 pb-4 border-b border-slate-200">
                                Cronología de Impacto
                            </h2>
                            <div className="relative z-10">
                                <DashboardTrajectory hitos={hitosUnificados} initialCount={10} />
                            </div>

                            <div className="pt-8 border-t border-slate-200 space-y-8">
                                <SkillsSection projects={projects || []} />
                                <div className="border-t border-slate-100 pt-8">
                                    <InterestsSection interests={profile.interests} isReadOnly={true} />
                                </div>
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
                            <h2 className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-indigo-400">06 / Establecer Conexión</h2>
                            <p className="text-4xl font-serif italic text-white leading-tight">
                                ¿Buscas establecer una conexión profesional?
                            </p>
                            <ContactSection
                                profileEmail={profile.email}
                                profileName={profile.full_name || username}
                                linkedinUrl={socialLinks.linkedin}
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
                            <Link href="/about" className="hover:text-white transition-colors">Rigor</Link>
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">Términos</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
