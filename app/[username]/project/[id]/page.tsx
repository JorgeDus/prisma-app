import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Calendar, Github, ExternalLink, ArrowLeft, Globe, MapPin, Code, FolderGit2 } from 'lucide-react'
import { DEFAULT_PROJECT_IMAGES } from '@/constants/images'
import ProjectGallery from '@/components/projects/ProjectGallery'
import { SkillsDetailTabs } from '@/components/shared/SkillsDetailTabs'

interface ProjectPageProps {
    params: Promise<{ username: string; id: string }>
}

export default async function PublicProjectDetailPage(props: ProjectPageProps) {
    const params = await props.params
    const supabase = await createClient()

    // 1. Fetch Profile and Project in parallel
    const [profileRes, projectRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('username', params.username).single(),
        supabase.from('projects').select('*').eq('id', params.id).single()
    ])

    const profile = profileRes.data
    const project = projectRes.data

    if (!profile || !project || project.user_id !== profile.id) {
        return notFound()
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

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

                {/* Hero / Cover */}
                <div className="rounded-3xl overflow-hidden border border-slate-100 bg-white p-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <ProjectGallery
                        coverImage={project.cover_image || DEFAULT_PROJECT_IMAGES[project.type] || DEFAULT_PROJECT_IMAGES.personal}
                        galleryImages={project.gallery_images || []}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase tracking-widest ${project.type === 'startup' ? 'bg-blue-100 text-blue-700' :
                                    project.type === 'academic' ? 'bg-purple-100 text-purple-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                    {project.type === 'academic' ? 'Portafolio Académico' : project.type === 'startup' ? 'Startup Project' : 'Innovación Personal'}
                                </span>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Calendar size={16} />
                                    <span>{formatDate(project.created_at)}</span>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
                                {project.title}
                            </h1>

                            <div className="prose prose-lg prose-purple max-w-none text-gray-700">
                                <p className="text-xl text-gray-600 mb-8 border-l-4 border-purple-200 pl-6 py-2 italic leading-relaxed">
                                    {project.description || "Este proyecto describe una solución innovadora dentro de su categoría."}
                                </p>

                                {project.content && (
                                    <div className="bg-gray-50/50 p-6 md:p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            🚀 Historia del Proyecto
                                        </h3>
                                        <div className="whitespace-pre-line leading-relaxed">
                                            {project.content}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Links Section */}
                            {(project.repo_url || project.demo_url) && (
                                <div className="flex flex-wrap gap-4 mt-10 pt-6 border-t border-gray-100">
                                    {project.repo_url && (
                                        <a
                                            href={project.repo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition font-bold text-gray-600"
                                        >
                                            <Github size={20} />
                                            Explorar Código
                                        </a>
                                    )}
                                    {project.demo_url && (
                                        <a
                                            href={project.demo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-bold shadow-lg shadow-purple-100"
                                        >
                                            <ExternalLink size={20} />
                                            Ver en Acción
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Autor Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest text-center opacity-50">Creador</h3>
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

                        {/* Competencias */}
                        <SkillsDetailTabs
                            hardSkills={project.hard_skills}
                            softSkills={project.soft_skills}
                        />

                        {/* Quick Stats or info */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-purple-100">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Globe size={18} />
                                Prisma Project
                            </h3>
                            <p className="text-sm text-purple-100 mb-4 leading-relaxed">
                                Este proyecto forma parte del portafolio profesional de {profile.full_name?.split(' ')[0] || profile.username}.
                            </p>
                            <Link href="/login" className="block text-center py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all border border-white/20 uppercase tracking-widest">
                                Únete a Prisma
                            </Link>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}
