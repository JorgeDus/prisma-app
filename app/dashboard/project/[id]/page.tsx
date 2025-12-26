import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Calendar, Github, ExternalLink, Users, Code } from 'lucide-react'
import ProjectDetailActions from '@/components/dashboard/ProjectDetailActions'
import ProjectGallery from '@/components/projects/ProjectGallery'

// Tipos para props y params de Next.js
interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ProjectDetailPage(props: PageProps) {
    const params = await props.params
    const supabase = await createClient()

    // 1. Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    // 2. Fetch Project
    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id) // Security check: only own projects
        .single()

    if (error || !project) {
        return notFound()
    }

    // Helper para fecha
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }


    return (
        <div className="min-h-screen bg-slate-50">
            {/* Actions & Navigation (Client Component) */}
            <ProjectDetailActions project={project} userId={user.id} />

            <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 animate-fade-in">
                {/* 1. Project Gallery & Hero */}
                <section className="max-w-5xl mx-auto">
                    <ProjectGallery
                        coverImage={project.cover_image}
                        galleryImages={project.gallery_images || []}
                    />
                </section>

                {/* 2. Header Information */}
                <header className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className={`text-[10px] px-3 py-1 rounded-full font-mono font-bold uppercase tracking-[0.2em] border ${project.type === 'startup' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            project.type === 'academic' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                            {project.type === 'academic' ? 'Proyecto Académico' : project.type === 'startup' ? 'Startup / Producto' : 'Innovación'}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200 bg-white">
                            <Calendar size={12} className="text-indigo-400" />
                            <span>{formatDate(project.created_at)}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-serif italic text-slate-900 leading-tight">
                            {project.title}
                        </h1>
                        {project.role && (
                            <div className="text-indigo-600 font-mono text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-50/50 w-fit mx-auto px-4 py-1.5 rounded-full border border-indigo-100/50 shadow-sm">
                                Rol: {project.role}
                            </div>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Content Section */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 shadow-sm space-y-16">
                            {/* Description */}
                            <section className="prose prose-lg prose-slate max-w-none">
                                <p className="text-xl text-slate-600 italic leading-relaxed font-medium border-l-4 border-indigo-100 pl-6">
                                    {project.description || "Este proyecto describe una solución innovadora dentro de su categoría."}
                                </p>
                            </section>

                            {/* Detalle del Proyecto */}
                            <div className="space-y-16">
                                {project.challenges && (
                                    <section className="space-y-4">
                                        <h3 className="text-sm font-mono font-black tracking-widest uppercase text-slate-400 flex items-center gap-3">
                                            <span className="w-8 h-px bg-slate-200" />
                                            Contexto y Desafío
                                        </h3>
                                        <div className="text-slate-700 leading-relaxed whitespace-pre-line text-lg pl-11">
                                            {project.challenges}
                                        </div>
                                    </section>
                                )}

                                <section className="space-y-4">
                                    <h3 className="text-sm font-mono font-black tracking-widest uppercase text-slate-400 flex items-center gap-3">
                                        <span className="w-8 h-px bg-slate-200" />
                                        La Solución
                                    </h3>
                                    <div className="text-slate-700 leading-relaxed whitespace-pre-line text-lg pl-11">
                                        {project.content || "Desarrollo de una solución técnica enfocada en eficiencia y escalabilidad."}
                                    </div>
                                </section>

                                {/* Resultados y Aprendizajes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-50">
                                    {project.results && (
                                        <section className="space-y-4">
                                            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2">
                                                <span className="text-amber-500">🏆</span> Resultados
                                            </h3>
                                            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line pl-6">
                                                {project.results}
                                            </div>
                                        </section>
                                    )}
                                    {project.learnings && (
                                        <section className="space-y-4">
                                            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2">
                                                <span className="text-emerald-500">💡</span> Aprendizajes
                                            </h3>
                                            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line pl-6">
                                                {project.learnings}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>

                            {/* Links */}
                            <div className="flex flex-wrap gap-4 pt-12 border-t border-slate-50">
                                {project.repo_url && (
                                    <a
                                        href={project.repo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700 shadow-sm"
                                    >
                                        <Github size={16} />
                                        Repository
                                    </a>
                                )}
                                {project.demo_url && (
                                    <a
                                        href={project.demo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-mono text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-slate-200"
                                    >
                                        <ExternalLink size={16} />
                                        Live Launch
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Aside */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Stack Widget */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
                            <h3 className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-slate-500 mb-6 flex items-center gap-2">
                                <Code size={14} className="text-indigo-500" />
                                Tech Stack
                            </h3>
                            {project.skills && project.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {project.skills.map((tag, idx) => (
                                        <span key={idx} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-100 font-mono uppercase tracking-tighter shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic font-mono">None specified.</p>
                            )}

                            {/* Team Widget */}
                            {project.team_members && (
                                <div className="mt-8 pt-8 border-t border-slate-50">
                                    <h3 className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-slate-500 mb-4 flex items-center gap-2">
                                        <Users size={14} className="text-indigo-500" />
                                        Colaboradores
                                    </h3>
                                    <div className="text-sm font-bold text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 italic">
                                        "{project.team_members}"
                                    </div>
                                </div>
                            )}

                            {/* Owner Help Info */}
                            <div className="mt-8 pt-8 border-t border-slate-50">
                                <div className="bg-slate-900 rounded-xl p-4 text-white space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                        <span className="text-[9px] font-mono font-black uppercase tracking-widest text-indigo-300">MODO EDICIÓN</span>
                                    </div>
                                    <p className="text-[10px] leading-relaxed text-slate-400">
                                        Estás visualizando el resultado final tal como lo verán los reclutadores. Usa la barra superior para realizar ajustes.
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
