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
        <div className="min-h-screen bg-white">
            {/* Actions & Navigation (Client Component) */}
            <ExperienceDetailActions experience={experience} userId={user.id} />

            <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">
                {/* Gallery & Hero */}
                {(experience.cover_image || (experience.gallery_images && experience.gallery_images.length > 0)) && (
                    <div className="mb-12">
                        <ProjectGallery
                            coverImage={experience.cover_image}
                            galleryImages={experience.gallery_images || []}
                        />
                    </div>
                )}

                {/* Header Information */}
                <header className="mb-12">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-[0.2em] border flex items-center gap-2 ${category.bg} ${category.color} ${category.border}`}>
                            <CategoryIcon size={12} />
                            {category.label}
                        </span>
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-gray-50">
                            <Calendar size={12} className="text-purple-400" />
                            <span>{getDateRange()}</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                                {experience.title}
                            </h1>
                            <div className="flex items-center gap-2 text-xl text-gray-600 font-medium">
                                <Building2 size={24} className="text-gray-400" />
                                {experience.organization}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Description */}
                        <section className="prose prose-lg prose-purple max-w-none">
                            <p className="text-xl text-gray-600 italic leading-relaxed font-medium border-l-4 border-purple-100 pl-6">
                                {experience.description || "Sin descripción."}
                            </p>
                        </section>

                        {/* Logros */}
                        {experience.achievements && (
                            <section>
                                <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="text-amber-500">🏆</span> Logros Clave
                                </h3>
                                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                    {experience.achievements}
                                </div>
                            </section>
                        )}

                        {/* Reflexión */}
                        {experience.value_reflection && (
                            <section>
                                <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="text-rose-500">❤️</span> Aprendizaje y Valor
                                </h3>
                                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                    {experience.value_reflection}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Aside */}
                    <aside className="lg:col-span-4 space-y-10">
                        {/* Skills */}
                        <div>
                            <h3 className="font-black text-gray-400 mb-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="text-purple-400">⚡</span>
                                Skills Aplicadas
                            </h3>
                            {experience.skills && experience.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {experience.skills.map((tag, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100 shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 italic">No especificado.</p>
                            )}
                        </div>

                        {/* Warning/Info for owner */}
                        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                            <h4 className="text-amber-800 font-bold text-xs uppercase tracking-widest mb-2">Vista Previa de Dueño</h4>
                            <p className="text-amber-700 text-xs leading-relaxed">
                                Esta es la página detallada de tu experiencia. Los cambios se guardan y reflejan aquí.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
