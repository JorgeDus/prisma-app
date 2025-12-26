import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Calendar, Building2, Award, Heart, Zap, Briefcase, GraduationCap, Dumbbell, Palette, HeartPulse, Star } from 'lucide-react'
import ExperienceDetailActions from '@/components/dashboard/ExperienceDetailActions'
import ProjectGallery from '@/components/projects/ProjectGallery'

// Tipos para props y params de Next.js
interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ExperienceDetailPage(props: PageProps) {
    const params = await props.params
    const supabase = await createClient()

    // 1. Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    // 2. Fetch Experience
    const { data: experience, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id) // Security check
        .single()

    if (error || !experience) {
        return notFound()
    }

    // Helper para fecha
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
        })
    }

    const getDateRange = () => {
        if (!experience.start_date) return 'Fecha no definida'
        const start = formatDate(experience.start_date)
        const end = experience.is_current ? 'Presente' : (experience.end_date ? formatDate(experience.end_date) : '')
        return `${start} - ${end}`
    }

    // Categorías y colores
    const categories: Record<string, { label: string, icon: any, color: string, bg: string, border: string }> = {
        'liderazgo': { label: 'Liderazgo', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        'social': { label: 'Social', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
        'emprendimiento': { label: 'Emprendimiento', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        'empleo_sustento': { label: 'Empleo', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        'academico': { label: 'Académico', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        'deportivo': { label: 'Deportivo', icon: Dumbbell, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        'creativo': { label: 'Creativo', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
        'cuidado_vida': { label: 'Cuidado y Vida', icon: HeartPulse, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
        'otro': { label: 'Otro', icon: Star, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100' },
    }

    const category = categories[experience.type] || categories['otro']
    const CategoryIcon = category.icon

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Actions & Navigation (Client Component) */}
            <ExperienceDetailActions experience={experience} userId={user.id} />

            <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 animate-fade-in">
                {/* 1. Project Gallery & Hero */}
                {(experience.cover_image || (experience.gallery_images && experience.gallery_images.length > 0)) && (
                    <section className="max-w-5xl mx-auto">
                        <ProjectGallery
                            coverImage={experience.cover_image}
                            galleryImages={experience.gallery_images || []}
                        />
                    </section>
                )}

                {/* 2. Header Information */}
                <header className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="flex flex-wrap items-center justify-center gap-3">
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
                        <h1 className="text-4xl md:text-6xl font-serif italic text-slate-900 leading-tight">
                            {experience.title}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-xl text-slate-500 font-medium">
                            <Building2 size={24} className="text-slate-400" />
                            {experience.organization}
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Description Section */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 shadow-sm space-y-12">
                            {/* Description */}
                            <section className="prose prose-lg prose-slate max-w-none">
                                <p className="text-xl text-slate-600 italic leading-relaxed font-medium border-l-4 border-indigo-100 pl-6">
                                    {experience.description || "Sin descripción disponible."}
                                </p>
                            </section>

                            <div className="grid grid-cols-1 gap-12 pt-12 border-t border-slate-50">
                                {/* Logros */}
                                {experience.achievements && (
                                    <section className="space-y-4">
                                        <h3 className="text-sm font-mono font-black tracking-widest uppercase text-slate-400 flex items-center gap-3">
                                            <span className="w-8 h-px bg-slate-200" />
                                            Logros Clave
                                        </h3>
                                        <div className="text-slate-700 leading-relaxed whitespace-pre-line text-lg pl-11">
                                            {experience.achievements}
                                        </div>
                                    </section>
                                )}

                                {/* Reflexión */}
                                {experience.value_reflection && (
                                    <section className="space-y-4">
                                        <h3 className="text-sm font-mono font-black tracking-widest uppercase text-slate-400 flex items-center gap-3">
                                            <span className="w-8 h-px bg-slate-200" />
                                            Impacto y Valor
                                        </h3>
                                        <div className="text-slate-700 leading-relaxed whitespace-pre-line text-lg pl-11">
                                            {experience.value_reflection}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Aside */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Skills Widget */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
                            <h3 className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-slate-500 mb-6 flex items-center gap-2">
                                <Zap size={14} className="text-indigo-500" />
                                Skills Aplicadas
                            </h3>
                            {experience.skills && experience.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {experience.skills.map((tag, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100 shadow-sm font-mono uppercase tracking-tighter">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic">No especificado.</p>
                            )}

                            {/* Divider and Owner Info */}
                            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                                <div className="flex items-center gap-3 text-amber-600 bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                                    <Star size={16} className="shrink-0" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed">
                                        Esta es la vista de gestión. Los cambios se reflejarán en tu perfil público automáticamente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
