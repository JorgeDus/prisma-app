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
        <div className="min-h-screen bg-white">
            {/* Actions & Navigation (Client Component) */}
            <ProjectDetailActions project={project} userId={user.id} />

            <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">
                {/* Project Gallery & Hero */}
                <div className="mb-12">
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
                    {/* Left Column: Main Content */}
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

                        {/* Action Buttons Linkage */}
                        <div className="flex flex-wrap gap-4 pt-10 border-t border-gray-100">
                            {project.repo_url && (
                                <a
                                    href={project.repo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-gray-700 shadow-sm"
                                >
                                    <Github size={18} />
                                    Ver Código
                                </a>
                            )}
                            {project.demo_url && (
                                <a
                                    href={project.demo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-bold shadow-lg shadow-purple-100"
                                >
                                    <ExternalLink size={18} />
                                    Ver Demo
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Aside */}
                    <aside className="lg:col-span-4 space-y-10">
                        {/* Stack */}
                        <div>
                            <h3 className="font-black text-gray-400 mb-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                <Code size={14} className="text-purple-400" />
                                Stack Tecnológico
                            </h3>
                            {project.skills && project.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {project.skills.map((tag, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100 shadow-sm">
                                            {tag}
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

                        {/* Warning/Info for owner */}
                        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                            <h4 className="text-amber-800 font-bold text-xs uppercase tracking-widest mb-2">Vista Previa de Dueño</h4>
                            <p className="text-amber-700 text-xs leading-relaxed">
                                Estás viendo la versión detallada de tu proyecto. Los cambios que realices aquí se reflejarán instantáneamente en tu perfil público.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
