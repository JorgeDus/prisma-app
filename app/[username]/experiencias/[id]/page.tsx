import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Calendar, Building2, ArrowLeft, Globe, Award, Heart, Zap, Briefcase, GraduationCap, Dumbbell, Palette, HeartPulse, Star, Stethoscope } from 'lucide-react'
import ProjectGallery from '@/components/projects/ProjectGallery'
import { DEFAULT_EXP_IMAGES } from '@/constants/images'
import { SkillsDetailTabs } from '@/components/shared/SkillsDetailTabs'
import BackButton from '@/components/shared/BackButton'

interface ExperiencePageProps {
    params: Promise<{ username: string; id: string }>
}

export default async function PublicExperienceDetailPage(props: ExperiencePageProps) {
    const params = await props.params
    const supabase = await createClient()

    // 1. Fetch Profile and Experience in parallel
    const [profileRes, experienceRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('username', params.username).single(),
        supabase.from('experiences').select('*').eq('id', params.id).single()
    ])

    const profile = profileRes.data
    const experience = experienceRes.data

    if (!profile || !experience || experience.user_id !== profile.id) {
        return notFound()
    }

    // 2. Fetch collaborator profiles if any
    let collaborators: { id: string; username: string; full_name: string | null; avatar_url: string | null; headline: string | null }[] = []
    if (experience.collaborator_ids && experience.collaborator_ids.length > 0) {
        // Only fetch profiles that haven't rejected the invite
        const { data: activeCollabs } = await supabase
            .from('experience_collaborations')
            .select('collaborator_id')
            .eq('experience_id', experience.id)
            .neq('status', 'rejected')

        const activeIds = activeCollabs?.map(c => c.collaborator_id) || []
        
        if (activeIds.length > 0) {
            const { data } = await supabase
                .from('profiles')
                .select('id, username, full_name, avatar_url, headline')
                .in('id', activeIds)
            collaborators = data || []
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            timeZone: 'UTC'
        })
    }

    const getDateRange = () => {
        if (!experience.start_date) return 'Sin fecha'
        const start = formatDate(experience.start_date)
        const end = experience.is_current ? 'Actualidad' : (experience.end_date ? formatDate(experience.end_date) : '')
        return `${start} — ${end}`
    }

    const categories: Record<string, { label: string, icon: any, color: string, bg: string, border: string }> = {
        'liderazgo': { label: 'Liderazgo', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        'social': { label: 'Social', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
        'emprendimiento': { label: 'Emprendimiento', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        'empleo_sustento': { label: 'Trayectoria', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        'academico': { label: 'Académico', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        'deportivo': { label: 'Deportivo', icon: Dumbbell, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        'creativo': { label: 'Creativo', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
        'cuidado_vida': { label: 'Cuidado y Vida', icon: HeartPulse, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
        'practica': { label: 'Práctica Profesional', icon: Stethoscope, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
        'otro': { label: 'General', icon: Star, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' },
    }

    const category = categories[experience.type] || categories['otro']
    const CategoryIcon = category.icon

    return (
        <div className="min-h-screen bg-[#F9FAFB] selection:bg-indigo-100">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <BackButton fallbackHref={`/${params.username}`} />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <span className="font-mono text-xs font-bold tracking-tighter uppercase text-slate-900 truncate max-w-[120px]">
                            / {params.username}
                        </span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-32">
                {/* 1. Experience Gallery & Hero */}
                <section className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-slate-100 bg-white p-2 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <ProjectGallery
                        coverImage={experience.cover_image || DEFAULT_EXP_IMAGES[experience.type || 'otro'] || DEFAULT_EXP_IMAGES.otro}
                        galleryImages={experience.gallery_images || []}
                    />
                </section>


                {/* 2. Header Information - full width, fuera del grid */}
                <header className="max-w-4xl space-y-8 mb-16">
                    <div className="flex items-center gap-4">
                        <span className={`text-[10px] px-3 py-1 rounded-full font-mono font-bold uppercase tracking-[0.2em] border flex items-center gap-2 ${category.bg} ${category.color} ${category.border}`}>
                            <CategoryIcon size={12} />
                            {category.label}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200 bg-white">
                            <Calendar size={12} className="text-indigo-400" />
                            <span>{getDateRange()}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight text-left">
                            {experience.title}
                        </h1>
                        {experience.role && (
                            <p className="text-2xl font-semibold text-indigo-600 text-left">
                                {experience.role}
                            </p>
                        )}
                        {experience.organization && (
                            <div className="flex items-center gap-2 text-xl text-slate-500 font-medium border-l-2 border-slate-200 pl-6 text-left">
                                <Building2 size={24} className="text-slate-400" />
                                {experience.organization}
                            </div>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Column: Content */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* 3. Text Content in Premium Card */}

                        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 shadow-sm space-y-16">
                            {/* Description */}
                            <section className="space-y-6">
                                <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2">
                                    <Star size={14} className="text-indigo-500" /> Resumen
                                </h2>
                                <p className="text-xl text-slate-600 leading-relaxed font-medium border-l-4 border-indigo-100 pl-6">
                                    {experience.description || "Esta experiencia detalla una fase clave en el desarrollo profesional y de impacto."}
                                </p>
                            </section>

                            {/* Logros */}
                            {experience.achievements && (
                                <section className="space-y-6">
                                    <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2">
                                        <Award size={14} className="text-amber-500" /> Logros y Resultados
                                    </h2>
                                    <div className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
                                        {experience.achievements}
                                    </div>
                                </section>
                            )}

                            {/* Reflexión */}
                            {experience.value_reflection && (
                                <section className="space-y-6">
                                    <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2">
                                        <Heart size={14} className="text-rose-500" /> Impacto y Aprendizaje
                                    </h2>
                                    <div className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
                                        {experience.value_reflection}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <aside className="lg:col-span-4 space-y-12">
                        <section className="sticky top-24 space-y-12">
                            {/* Competencias */}
                            <SkillsDetailTabs
                                hardSkills={experience.hard_skills}
                                softSkills={experience.soft_skills}
                            />

                            {/* Collaborators */}
                            {collaborators.length > 0 && (
                                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-4">
                                    <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 text-center">Equipo en Prisma</h4>
                                    <div className="space-y-3">
                                        {collaborators.map(collab => (
                                            <a
                                                key={collab.id}
                                                href={`/${collab.username}`}
                                                className="flex items-center gap-3 group hover:bg-slate-50 rounded-xl p-2 transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                                                    {collab.avatar_url ? (
                                                        <img src={collab.avatar_url} alt={collab.full_name || ''} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-base font-bold text-slate-400">
                                                            {(collab.full_name || collab.username).charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                                        {collab.full_name || collab.username}
                                                    </p>
                                                    {collab.headline && (
                                                        <p className="text-[10px] text-slate-400 truncate">{collab.headline}</p>
                                                    )}
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Author Card */}
                            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-6">
                                <div className="space-y-2">
                                    <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 overflow-hidden mx-auto">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt={profile.full_name || ''} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400">
                                                {(profile.full_name || profile.username).charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg text-slate-900 leading-tight">{profile.full_name || profile.username}</p>
                                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">Protagonista de la Experiencia</p>
                                    </div>
                                </div>
                                <Link href={`/${profile.username}`} className="w-full py-3 border border-slate-900 text-slate-900 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                    Ver Perfil Completo
                                </Link>
                            </div>
                        </section>
                    </aside>
                </div>
            </main>
        </div>
    )
}
