import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Calendar, Github, ExternalLink, ArrowLeft, Globe, MapPin, Code, FolderGit2, Users, Target, Rocket, Award } from 'lucide-react'
import ProjectGallery from '@/components/projects/ProjectGallery'

interface ProjectPageProps {
    params: Promise<{ username: string; id: string }>
}

export default async function PublicProjectDetailPage(props: ProjectPageProps) {
    const params = await props.params
    const supabase = await createClient()

    // 1. Fetch Profile and Project
    const [profileRes, projectRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('username', params.username).single(),
        supabase.from('projects').select('*').eq('id', params.id).single()
    ])

    const profile = profileRes.data
    const project = projectRes.data

    if (!profile || !project || project.user_id !== profile.id) {
        return notFound()
    }

    // 2. Fetch Other Projects for Footer
    const { data: otherProjects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', profile.id)
        .neq('id', project.id)
        .order('created_at', { ascending: false })
        .limit(3)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long'
        })
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Simple Navbar */}
            <nav className="bg-white/80 border-b sticky top-0 z-50 backdrop-blur-md">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href={`/${params.username}`} className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium transition-colors">
                        <ArrowLeft size={18} />
                        <span className="text-sm border-b border-transparent hover:border-purple-200">Volver al perfil</span>
                    </Link>
                    <Link href="/" className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
                        <Image src="/logo-prisma.png" alt="Prisma Logo" width={90} height={30} className="h-7 w-auto object-contain" />
                    </Link>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">

                {/* Project Gallery & Hero */}
                <div className="mb-8">
                    <ProjectGallery
                        coverImage={project.cover_image}
                        galleryImages={project.gallery_images || []}
                    />
                </div>

                {/* Header Information */}
                <header className="mb-12">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-[0.2em] border ${project.type === 'startup' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            project.type === 'academic' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                'bg-green-50 text-green-700 border-green-100'
                            }`}>
                            {project.type === 'academic' ? 'Académico' : project.type === 'startup' ? 'Startup' : 'Innovación'}
                        </span>
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-gray-50">
                            <Calendar size={12} className="text-purple-400" />
                            <span>{formatDate(project.created_at)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                                {project.title}
                            </h1>
                            {project.role && (
                                <div className="text-purple-600 font-bold bg-purple-50 w-fit px-4 py-1.5 rounded-xl border border-purple-100 text-sm shadow-sm">
                                    {project.role}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content Area - FLAT (No white cards) */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Description */}
                        <section className="prose prose-lg prose-purple max-w-none">
                            <p className="text-xl text-gray-600 italic leading-relaxed font-medium border-l-4 border-purple-100 pl-6">
                                {project.description || "Este proyecto describe una solución innovadora dentro de su categoría."}
                            </p>
                        </section>

                        {/* Desafío */}
                        {project.challenges && (
                            <section>
                                <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="text-rose-500">🚀</span> Contexto y Desafío
                                </h3>
                                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                    {project.challenges}
                                </div>
                            </section>
                        )}

                        {/* Solución */}
                        <section>
                            <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-indigo-500">🛠</span> Mi Solución
                            </h3>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                {project.content || "Desarrollo de una solución técnica enfocada en eficiencia y escalabilidad."}
                            </div>
                        </section>

                        {/* Resultados y Aprendizajes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {project.results && (
                                <section>
                                    <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                                        <span className="text-amber-500">🏆</span> Resultados
                                    </h3>
                                    <div className="text-gray-600 leading-relaxed whitespace-pre-line border-t border-gray-100 pt-4">
                                        {project.results}
                                    </div>
                                </section>
                            )}
                            {project.learnings && (
                                <section>
                                    <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                                        <span className="text-green-500">💡</span> Aprendizajes
                                    </h3>
                                    <div className="text-gray-600 leading-relaxed whitespace-pre-line border-t border-gray-100 pt-4">
                                        {project.learnings}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Action Buttons at the bottom of content */}
                        <div className="flex flex-wrap gap-4 pt-10 border-t border-gray-100">
                            {project.repo_url && (
                                <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-gray-700 shadow-sm">
                                    <Github size={18} />
                                    Ver Código
                                </a>
                            )}
                            {project.demo_url && (
                                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-bold shadow-lg shadow-purple-100">
                                    <ExternalLink size={18} />
                                    Ver Proyecto
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Aside Area */}
                    <aside className="lg:col-span-4 space-y-10">
                        {/* Stack - FIRST */}
                        <div>
                            <h3 className="font-black text-gray-400 mb-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                <Code size={14} className="text-purple-400" />
                                Stack Tecnológico
                            </h3>
                            {project.skills && project.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {project.skills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100 shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 italic">No especificado.</p>
                            )}
                        </div>

                        {/* Team */}
                        {project.team_members && (
                            <div>
                                <h3 className="font-black text-gray-400 mb-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Users size={14} className="text-purple-400" />
                                    Equipo
                                </h3>
                                <div className="flex items-center gap-3 text-gray-700 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                    <span className="text-sm font-bold">{project.team_members}</span>
                                </div>
                            </div>
                        )}

                        {/* Profile Link Card */}
                        <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-white shadow-xl overflow-hidden mb-4 transition-transform hover:scale-105">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.full_name || ''} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-purple-600 bg-white">
                                        {(profile.full_name || profile.username).charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <span className="font-black text-gray-900 text-lg mb-1">{profile.full_name || profile.username}</span>
                            <Link href={`/${profile.username}`} className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:text-purple-700 transition-colors">
                                Ver Perfil →
                            </Link>
                        </div>
                    </aside>
                </div>

                {/* Footer Navigation: Other Projects */}
                {otherProjects && otherProjects.length > 0 && (
                    <footer className="mt-24 pt-12 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                Otros proyectos
                            </h2>
                            <Link href={`/${profile.username}`} className="text-xs font-bold text-gray-400 hover:text-purple-600 transition-colors uppercase tracking-widest">
                                Ver todos
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {otherProjects.map(p => (
                                <Link key={p.id} href={`/${profile.username}/proyectos/${p.id}`} className="group">
                                    <div className="aspect-video rounded-2xl bg-gray-50 mb-4 overflow-hidden relative border border-gray-100 group-hover:border-purple-200 transition-all">
                                        {p.cover_image ? (
                                            <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-purple-100">
                                                <FolderGit2 size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-1 truncate">{p.title}</h4>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{p.type}</p>
                                </Link>
                            ))}
                        </div>
                    </footer>
                )}
            </main>
        </div>
    )
}

function TrophyIcon({ size }: { size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
}
