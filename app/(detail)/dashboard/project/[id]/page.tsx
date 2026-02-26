import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Calendar, Github, ExternalLink, Users, Code, Target, Rocket, Award, Tag } from 'lucide-react'
import ProjectDetailActions from '@/components/dashboard/ProjectDetailActions'
import ProjectGallery from '@/components/projects/ProjectGallery'
import { DEFAULT_PROJECT_IMAGES } from '@/constants/images'
import { SkillsDetailTabs } from '@/components/shared/SkillsDetailTabs'
import Link from 'next/link'

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

    // 3. Fetch collaborator profiles if any
    let collaborators: { id: string; username: string; full_name: string | null; avatar_url: string | null; headline: string | null }[] = []
    if (project.collaborator_ids && project.collaborator_ids.length > 0) {
        const { data } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url, headline')
            .in('id', project.collaborator_ids)
        collaborators = data || []
    }

    // Helper para fecha (solo mes y año)
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            timeZone: 'UTC'
        })
    }


    return (
        <div className="min-h-screen bg-slate-50">
            {/* Actions & Navigation (Client Component) */}
            <ProjectDetailActions project={project} userId={user.id} />

            <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 animate-fade-in">
                {/* 1. Project Gallery & Hero */}
                <section className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-slate-100 bg-white p-2">
                    <ProjectGallery
                        coverImage={project.cover_image || DEFAULT_PROJECT_IMAGES[project.type] || DEFAULT_PROJECT_IMAGES.personal}
                        galleryImages={project.gallery_images || []}
                    />
                </section>

                {/* 2. Header Information */}
                <header className="max-w-4xl space-y-8">
                    <div className="flex items-center gap-4">
                        <span className={`text-[10px] px-3 py-1 rounded-full font-mono font-bold uppercase tracking-widest border ${project.type === 'startup' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            project.type === 'academic' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                            {project.type === 'academic' ? 'Portafolio Académico' : project.type === 'startup' ? 'Emprendimiento' : 'Innovación Personal'}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200 bg-white">
                            <Calendar size={12} className="text-indigo-400" />
                            <span>{formatDate(project.created_at)}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight text-left">
                            {project.title}
                        </h1>
                        {project.role && (
                            <p className="text-xl font-medium text-slate-500 border-l-2 border-slate-200 pl-6 text-left">
                                {project.role}
                            </p>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Content Section */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 shadow-sm space-y-16">
                            {/* Description / Objetivo */}
                            <section className="space-y-6">
                                <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">Resumen del proyecto</h2>
                                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                                    {project.description || "Este proyecto describe una solución innovadora dentro de su categoría."}
                                </p>
                            </section>

                            {/* Detalle del Proyecto */}
                            <div className="space-y-16">
                                {/* El Desafío (Situation/Task) */}
                                {project.challenges && (
                                    <section className="space-y-6">
                                        <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2">
                                            <Target size={14} className="text-indigo-500" /> El Desafío
                                        </h2>
                                        <div className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
                                            {project.challenges}
                                        </div>
                                    </section>
                                )}

                                {/* La Solución (Action) */}
                                <section className="space-y-6">
                                    <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2">
                                        <Rocket size={14} className="text-indigo-500" /> La Solución
                                    </h2>
                                    <div className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
                                        {project.content || "Desarrollo de una solución técnica enfocada en eficiencia y escalabilidad."}
                                    </div>
                                </section>

                                {/* Impacto (Result) / Aprendizajes */}
                                {(project.results || project.learnings) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-100">
                                        {project.results && (
                                            <section className="space-y-4">
                                                <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2">
                                                    <Award size={14} className="text-emerald-500" /> Resultados
                                                </h3>
                                                <div className="space-y-3">
                                                    {project.results.split('\n').filter((r: string) => r.trim() !== '').map((item: string, idx: number) => (
                                                        <div key={idx} className="flex items-start gap-3">
                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                                            <p className="text-sm text-slate-600 leading-tight font-medium">{item}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                        {project.learnings && (
                                            <section className="space-y-4">
                                                <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2">
                                                    <Tag size={14} className="text-purple-500" /> Aprendizajes
                                                </h3>
                                                <div className="text-sm text-slate-600 leading-relaxed">
                                                    "{project.learnings}"
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                )}
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
                                        Demo en Vivo
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Aside */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Competencias Widget */}
                        <div className="sticky top-24 space-y-6">
                            <SkillsDetailTabs
                                hardSkills={project.hard_skills}
                                softSkills={project.soft_skills}
                            />

                            {/* Team Widget - Text free field */}
                            {project.team_members && (
                                <div className="mt-8 pt-8 border-t border-slate-50">
                                    <h3 className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-slate-500 mb-4 flex items-center gap-2">
                                        <Users size={14} className="text-indigo-500" />
                                        Otros colaboradores
                                    </h3>
                                    <div className="text-sm font-bold text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 italic">
                                        "{project.team_members}"
                                    </div>
                                </div>
                            )}

                            {/* Collaborators from Prisma */}
                            {collaborators.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-slate-50">
                                    <h3 className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-slate-500 mb-4 flex items-center gap-2">
                                        <Users size={14} className="text-indigo-500" />
                                        Equipo en Prisma
                                    </h3>
                                    <div className="space-y-2">
                                        {collaborators.map(collab => (
                                            <Link
                                                key={collab.id}
                                                href={`/${collab.username}`}
                                                target="_blank"
                                                className="flex items-center gap-3 group hover:bg-slate-50 rounded-xl p-2 transition-colors"
                                            >
                                                <div className="w-9 h-9 rounded-full bg-indigo-50 overflow-hidden flex-shrink-0 border border-slate-100">
                                                    {collab.avatar_url ? (
                                                        <img src={collab.avatar_url} alt={collab.full_name || ''} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-indigo-400">
                                                            {(collab.full_name || collab.username).charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                                        {collab.full_name || collab.username}
                                                    </p>
                                                    {collab.headline && (
                                                        <p className="text-[10px] text-slate-400 truncate">{collab.headline}</p>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
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
