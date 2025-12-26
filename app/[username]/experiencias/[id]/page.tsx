import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Calendar, Building2, ArrowLeft, Globe, Award, Heart, Zap, Briefcase, GraduationCap, Dumbbell, Palette, HeartPulse, Star } from 'lucide-react'
import ProjectGallery from '@/components/projects/ProjectGallery'

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
        })
    }

    const getDateRange = () => {
        if (!experience.start_date) return 'Sin fecha'
        const start = formatDate(experience.start_date)
        const end = experience.is_current ? 'Actualidad' : (experience.end_date ? formatDate(experience.end_date) : '')
        return `${start} — ${end}`
    }

    const categories: Record<string, { label: string, icon: any }> = {
        'liderazgo': { label: 'Liderazgo', icon: Award },
        'social': { label: 'Social', icon: Heart },
        'emprendimiento': { label: 'Emprendimiento', icon: Zap },
        'empleo_sustento': { label: 'Trayectoria', icon: Briefcase },
        'academico': { label: 'Académico', icon: GraduationCap },
        'deportivo': { label: 'Deportivo', icon: Dumbbell },
        'creativo': { label: 'Creativo', icon: Palette },
        'cuidado_vida': { label: 'Cuidado y Vida', icon: HeartPulse },
        'otro': { label: 'General', icon: Star },
    }

    const category = categories[experience.type] || categories['otro']
    const CategoryIcon = category.icon

    return (
        <div className="min-h-screen bg-[#F9FAFB] selection:bg-indigo-100">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href={`/${params.username}`} className="flex items-center gap-2 group">
                        <ArrowLeft size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 group-hover:text-slate-900 transition-colors">Volver</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-serif text-lg">P</span>
                        </div>
                        <span className="font-mono text-xs font-bold tracking-tighter uppercase text-slate-900 truncate max-w-[120px]">
                            / {params.username}
                        </span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Left Column: Content */}
                    <div className="lg:col-span-8 space-y-20">

                        {/* Header */}
                        <header className="space-y-8">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-2">
                                    <CategoryIcon size={12} />
                                    {category.label}
                                </span>
                                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">
                                    {getDateRange()}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-7xl font-serif italic text-slate-900 leading-[1.1] tracking-tight">
                                    {experience.title}
                                </h1>
                                <p className="text-2xl font-serif text-slate-500 italic">
                                    en {experience.organization}
                                </p>
                            </div>
                        </header>

                        {/* Gallery / Cover */}
                        {(experience.cover_image || (experience.gallery_images && experience.gallery_images.length > 0)) && (
                            <div className="rounded-3xl overflow-hidden border border-slate-100 bg-white p-2">
                                <ProjectGallery
                                    coverImage={experience.cover_image}
                                    galleryImages={experience.gallery_images || []}
                                />
                            </div>
                        )}

                        {/* Content Body */}
                        <div className="space-y-24">
                            {/* Description */}
                            <section className="space-y-6">
                                <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">01 / Resumen de Función</h2>
                                <p className="text-2xl font-serif text-slate-800 leading-relaxed italic border-l-2 border-indigo-100 pl-8 py-2">
                                    {experience.description || "Esta experiencia detalla una fase clave en el desarrollo profesional y de impacto."}
                                </p>
                            </section>

                            {/* Logros */}
                            {experience.achievements && (
                                <section className="space-y-8 bg-white border border-slate-100 p-10 rounded-[2.5rem]">
                                    <div className="space-y-2">
                                        <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-600">02 / Logros Consolidados</h2>
                                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Evidencia de impacto ejecutable</p>
                                    </div>
                                    <div className="text-lg font-serif text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
                                        {experience.achievements}
                                    </div>
                                </section>
                            )}

                            {/* Reflexión */}
                            {experience.value_reflection && (
                                <section className="space-y-6">
                                    <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">03 / Aprendizaje y Valor</h2>
                                    <div className="text-lg font-serif italic text-slate-600 leading-relaxed whitespace-pre-line">
                                        {experience.value_reflection}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <aside className="lg:col-span-4 space-y-12">
                        <section className="sticky top-24 space-y-12">

                            {/* Skills */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">Skills en Ejecución</h3>
                                {experience.skills && experience.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {experience.skills.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-white border border-slate-100 text-slate-900 rounded-lg text-[10px] font-mono font-bold uppercase">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[10px] font-mono text-slate-400 italic">No especificadas.</p>
                                )}
                            </div>

                            {/* Author Card */}
                            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-6">
                                <div className="space-y-2">
                                    <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 overflow-hidden mx-auto">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt={profile.full_name || ''} className="w-full h-full object-cover grayscale" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl font-serif text-slate-400">
                                                {(profile.full_name || profile.username).charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-serif text-lg text-slate-900 italic leading-tight">{profile.full_name || profile.username}</p>
                                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">Protagonista de la Fase</p>
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
