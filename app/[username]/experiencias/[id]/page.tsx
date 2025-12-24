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
        <div className="min-h-screen bg-gray-50">
            {/* Simple Navbar */}
            <nav className="bg-white border-b sticky top-0 z-50 backdrop-blur-sm bg-white/90">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href={`/${params.username}`} className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium transition-colors">
                        <ArrowLeft size={20} />
                        <span>Volver al perfil</span>
                    </Link>
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo-prisma.png"
                            alt="Prisma Logo"
                            width={100}
                            height={34}
                            className="h-8 w-auto object-contain"
                        />
                    </Link>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">

                {/* Cover (Optional) */}
                {(experience.cover_image || (experience.gallery_images && experience.gallery_images.length > 0)) && (
                    <div className="mb-8">
                        <ProjectGallery
                            coverImage={experience.cover_image}
                            galleryImages={experience.gallery_images || []}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
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

                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">
                                {experience.title}
                            </h1>
                            <div className="flex items-center gap-2 text-xl text-gray-600 font-medium mb-8">
                                <Building2 size={24} className="text-gray-400" />
                                {experience.organization}
                            </div>

                            <div className="prose prose-lg prose-purple max-w-none text-gray-700 space-y-8">
                                <p className="text-xl text-gray-600 border-l-4 border-purple-200 pl-6 py-2 italic leading-relaxed">
                                    {experience.description || "Sin descripción."}
                                </p>

                                {/* Logros */}
                                {experience.achievements && (
                                    <section>
                                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-3">
                                            <span className="text-amber-500">🏆</span> Logros Clave
                                        </h3>
                                        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 text-gray-700 leading-relaxed whitespace-pre-line text-base">
                                            {experience.achievements}
                                        </div>
                                    </section>
                                )}

                                {/* Reflexión */}
                                {experience.value_reflection && (
                                    <section>
                                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-3">
                                            <span className="text-rose-500">❤️</span> Aprendizaje y Valor
                                        </h3>
                                        <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 text-gray-700 leading-relaxed whitespace-pre-line text-base">
                                            {experience.value_reflection}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Skills */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
                                <span className="text-purple-600">⚡</span> Skills Aplicadas
                            </h3>
                            {experience.skills && experience.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {experience.skills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No especificadas.</p>
                            )}
                        </div>

                        {/* Autor Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest text-center opacity-50">Sobre el protagonista</h3>
                            <Link href={`/${profile.username}`} className="group flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-white shadow-md overflow-hidden mb-3 group-hover:scale-105 transition-transform duration-300">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt={profile.full_name || ''} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-purple-600 bg-white">
                                            {(profile.full_name || profile.username).charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <span className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">
                                    {profile.full_name || profile.username}
                                </span>
                                <span className="text-xs text-gray-500 mt-1 uppercase font-semibold">Ver perfil completo</span>
                            </Link>
                        </div>
                    </aside>
                </div>
            </main >
        </div >
    )
}
