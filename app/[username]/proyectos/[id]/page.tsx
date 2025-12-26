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
                    <div className="lg:col-span-8 space-y-24">

                        {/* Header */}
                        <header className="space-y-8">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                    {project.type}
                                </span>
                                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">
                                    {formatDate(project.created_at)}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-serif italic text-slate-900 leading-[1.1] tracking-tight">
                                {project.title}
                            </h1>

                            {project.role && (
                                <p className="text-xl font-serif text-slate-500 border-l-2 border-slate-200 pl-6 italic">
                                    {project.role}
                                </p>
                            )}
                        </header>

                        {/* Gallery */}
                        <div className="rounded-3xl overflow-hidden border border-slate-100 bg-white p-2">
                            <ProjectGallery
                                coverImage={project.cover_image}
                                galleryImages={project.gallery_images || []}
                            />
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-24">
                            {/* Summary / Impact Thesis */}
                            <section className="space-y-6">
                                <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">01 / Tesis del Proyecto</h2>
                                <p className="text-2xl font-serif text-slate-800 leading-relaxed italic">
                                    {project.description || "Este proyecto describe una solución innovadora dentro de su categoría."}
                                </p>
                            </section>

                            {/* Desafío */}
                            {project.challenges && (
                                <section className="space-y-6">
                                    <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">02 / Contexto y Desafío</h2>
                                    <div className="text-lg font-serif text-slate-700 leading-relaxed whitespace-pre-line">
                                        {project.challenges}
                                    </div>
                                </section>
                            )}

                            {/* Solución */}
                            <section className="space-y-6">
                                <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">03 / Implementación y Estrategia</h2>
                                <div className="text-lg font-serif text-slate-700 leading-relaxed whitespace-pre-line">
                                    {project.content || "Desarrollo de una solución técnica enfocada en eficiencia y escalabilidad."}
                                </div>
                            </section>

                            {/* Resultados */}
                            {(project.results || project.learnings) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-100">
                                    {project.results && (
                                        <section className="space-y-4">
                                            <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-600">Impacto y Resultados</h3>
                                            <div className="text-sm font-mono font-bold text-slate-600 leading-relaxed uppercase tracking-tight">
                                                {project.results}
                                            </div>
                                        </section>
                                    )}
                                    {project.learnings && (
                                        <section className="space-y-4">
                                            <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-rose-600">Lecciones Técnicas</h3>
                                            <div className="text-sm font-mono font-bold text-slate-600 leading-relaxed uppercase tracking-tight">
                                                {project.learnings}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            )}

                            {/* Links */}
                            <div className="flex flex-wrap gap-4 pt-8">
                                {project.repo_url && (
                                    <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-600 transition-all font-mono text-[10px] font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                        <Github size={14} />
                                        Protocolo / GitHub
                                    </a>
                                )}
                                {project.demo_url && (
                                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Globe size={14} />
                                        Artefacto Vivo ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <aside className="lg:col-span-4 space-y-16">
                        <section className="sticky top-24 space-y-12">

                            {/* Stack */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">Tecnologías Aplicadas</h3>
                                {project.skills && project.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {project.skills.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-white border border-slate-100 text-slate-900 rounded-lg text-[10px] font-mono font-bold uppercase">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[10px] font-mono text-slate-400 italic">No documentado.</p>
                                )}
                            </div>

                            {/* Team */}
                            {project.team_members && (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">Sinergia de Equipo</h3>
                                    <div className="bg-white border border-slate-100 p-4 rounded-2xl">
                                        <p className="text-xs font-mono font-bold text-slate-900 uppercase tracking-tight">{project.team_members}</p>
                                    </div>
                                </div>
                            )}

                            {/* Profile Highlight */}
                            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 overflow-hidden">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt={profile.full_name || ''} className="w-full h-full object-cover grayscale" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl font-serif text-slate-400">
                                            {(profile.full_name || profile.username).charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-serif text-lg text-slate-900 italic">{profile.full_name || profile.username}</p>
                                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Autor del Protocolo</p>
                                </div>
                                <Link href={`/${profile.username}`} className="text-[10px] font-mono font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors pt-2">
                                    Ver Perfil Completo ↗
                                </Link>
                            </div>
                        </section>
                    </aside>
                </div>

                {/* Footer Projects */}
                {otherProjects && otherProjects.length > 0 && (
                    <footer className="mt-32 pt-24 border-t border-slate-100 space-y-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-serif italic text-slate-900 underline decoration-indigo-200 underline-offset-8">Otros Protocolos</h2>
                            <Link href={`/${profile.username}`} className="text-[10px] font-mono font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                                Ver Todo ↗
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {otherProjects.map(p => (
                                <Link key={p.id} href={`/${profile.username}/proyectos/${p.id}`} className="group space-y-4">
                                    <div className="aspect-[16/10] rounded-2xl bg-white border border-slate-100 overflow-hidden relative group-hover:border-indigo-200 transition-all">
                                        {p.cover_image ? (
                                            <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-100">
                                                <FolderGit2 size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-serif italic text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{p.title}</h4>
                                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{p.type}</p>
                                    </div>
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
