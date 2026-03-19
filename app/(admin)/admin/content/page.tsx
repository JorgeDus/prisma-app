import { createAdminClient } from '@/utils/supabase/admin'
import { ExternalLink, FolderOpen, Briefcase } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const experienceTypeLabels: Record<string, string> = {
    liderazgo: 'Liderazgo',
    social: 'Social',
    emprendimiento: 'Emprendimiento',
    empleo_sustento: 'Empleo / Sustento',
    academico: 'Académico',
    deportivo: 'Deportivo',
    creativo: 'Creativo',
    cuidado_vida: 'Cuidado de Vida',
    practica: 'Práctica Profesional',
    otro: 'Otro',
}

const projectTypeLabels: Record<string, string> = {
    academic: 'Académico',
    startup: 'Startup',
    personal: 'Personal',
}

export default async function AdminContentPage() {
    const adminClient = createAdminClient()

    // Fetch recent content with user info
    const [
        { data: recentProjects },
        { data: recentExperiences },
        { count: totalProjects },
        { count: totalExperiences },
        { data: projectsByType },
        { data: experiencesByType },
    ] = await Promise.all([
        adminClient
            .from('projects')
            .select('id, title, type, created_at, user_id, profiles(username, full_name)')
            .order('created_at', { ascending: false })
            .limit(10),
        adminClient
            .from('experiences')
            .select('id, title, type, organization, created_at, user_id, profiles(username, full_name)')
            .order('created_at', { ascending: false })
            .limit(10),
        adminClient.from('projects').select('*', { count: 'exact', head: true }),
        adminClient.from('experiences').select('*', { count: 'exact', head: true }),
        adminClient.from('projects').select('type'),
        adminClient.from('experiences').select('type'),
    ])

    // Compute type distributions
    const projectTypeCount: Record<string, number> = {}
    projectsByType?.forEach((p: any) => {
        projectTypeCount[p.type] = (projectTypeCount[p.type] || 0) + 1
    })

    const experienceTypeCount: Record<string, number> = {}
    experiencesByType?.forEach((e: any) => {
        experienceTypeCount[e.type] = (experienceTypeCount[e.type] || 0) + 1
    })

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Contenido</h1>
                <p className="text-sm text-slate-500 mt-1">
                    {totalProjects} proyecto{totalProjects !== 1 ? 's' : ''} · {totalExperiences} experiencia{totalExperiences !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Type distributions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Projects by type */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 mb-4">
                        Proyectos por tipo
                    </h3>
                    <div className="space-y-2">
                        {Object.entries(projectTypeLabels).map(([key, label]) => {
                            const count = projectTypeCount[key] || 0
                            const pct = (totalProjects || 0) > 0 ? (count / (totalProjects || 1)) * 100 : 0
                            return (
                                <div key={key} className="flex items-center gap-3">
                                    <span className="text-sm text-slate-600 w-24">{label}</span>
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full transition-all"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-slate-400 w-8 text-right">{count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Experiences by type */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 mb-4">
                        Experiencias por tipo
                    </h3>
                    <div className="space-y-2">
                        {Object.entries(experienceTypeLabels).map(([key, label]) => {
                            const count = experienceTypeCount[key] || 0
                            const pct = (totalExperiences || 0) > 0 ? (count / (totalExperiences || 1)) * 100 : 0
                            return (
                                <div key={key} className="flex items-center gap-3">
                                    <span className="text-sm text-slate-600 w-36 truncate">{label}</span>
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500 rounded-full transition-all"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-slate-400 w-8 text-right">{count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Recent content lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                        <FolderOpen size={16} className="text-indigo-500" />
                        <h2 className="text-sm font-mono font-bold tracking-widest uppercase text-slate-400">
                            Últimos Proyectos
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {(recentProjects || []).length === 0 ? (
                            <div className="p-8 text-center text-sm text-slate-400">Sin proyectos</div>
                        ) : (
                            (recentProjects || []).map((project: any) => (
                                <div key={project.id} className="flex items-center gap-3 px-5 py-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 truncate">{project.title}</p>
                                        <p className="text-xs text-slate-400 truncate">
                                            por {project.profiles?.full_name || project.profiles?.username} · {projectTypeLabels[project.type] || project.type}
                                        </p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 shrink-0">
                                        {new Date(project.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                                    </span>
                                    <Link
                                        href={`/${project.profiles?.username}/proyectos/${project.id}`}
                                        target="_blank"
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                    >
                                        <ExternalLink size={14} />
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Experiences */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                        <Briefcase size={16} className="text-purple-500" />
                        <h2 className="text-sm font-mono font-bold tracking-widest uppercase text-slate-400">
                            Últimas Experiencias
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {(recentExperiences || []).length === 0 ? (
                            <div className="p-8 text-center text-sm text-slate-400">Sin experiencias</div>
                        ) : (
                            (recentExperiences || []).map((exp: any) => (
                                <div key={exp.id} className="flex items-center gap-3 px-5 py-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 truncate">{exp.title}</p>
                                        <p className="text-xs text-slate-400 truncate">
                                            por {exp.profiles?.full_name || exp.profiles?.username} · {experienceTypeLabels[exp.type] || exp.type}
                                        </p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 shrink-0">
                                        {new Date(exp.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                                    </span>
                                    <Link
                                        href={`/${exp.profiles?.username}/experiencias/${exp.id}`}
                                        target="_blank"
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                                    >
                                        <ExternalLink size={14} />
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
