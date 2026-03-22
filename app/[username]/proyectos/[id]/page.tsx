import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Calendar, Github, ExternalLink, ArrowLeft, Globe, MapPin, Code, FolderGit2, Users, Target, Rocket, Award, Tag } from 'lucide-react'
import ProjectGallery from '@/components/projects/ProjectGallery'
import { DEFAULT_PROJECT_IMAGES } from '@/constants/images'
import { SkillsDetailTabs } from '@/components/shared/SkillsDetailTabs'
import BackButton from '@/components/shared/BackButton'

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

    // 2b. Fetch the Unified Team (Root Owner + Accepted Collaborators)
    const rootProjectId = project.original_project_id || project.id;
    
    // a) Get Root Owner
    const { data: rootProject } = await supabase.from('projects').select('user_id').eq('id', rootProjectId).single();
    let rootOwnerProfile = null;
    if (rootProject) {
        const { data } = await supabase.from('profiles').select('id, username, full_name, avatar_url, headline').eq('id', rootProject.user_id).single();
        rootOwnerProfile = data;
    }
    
    // b) Get Accepted Collaborators of the Root Project
    const { data: activeCollabs } = await supabase
        .from('project_collaborations')
        .select('collaborator_id')
        .eq('project_id', rootProjectId)
        .eq('status', 'accepted');
        
    const activeIds = activeCollabs?.map(c => c.collaborator_id) || [];
    let collabProfiles: any[] = [];
    if (activeIds.length > 0) {
        const { data } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url, headline')
            .in('id', activeIds);
        collabProfiles = data || [];
    }
    
    // c) Combine and deduplicate
    const fullTeamRaw = [rootOwnerProfile, ...collabProfiles].filter(Boolean);
    const uniqueTeam = Array.from(new Map(fullTeamRaw.map(item => [item.id, item])).values());

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
            month: 'long',
            timeZone: 'UTC'
        })
    }

    const PROJECT_LABELS: Record<string, string> = {
        academic: 'Portafolio Académico',
        startup: 'Emprendimiento',
        personal: 'Innovación Personal'
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] selection:bg-indigo-100">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <BackButton fallbackHref={`/${params.username}`} />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <span className="font-mono text-xs font-bold tracking-tighter uppercase text-slate-900 truncate max-w-[120px]">
                            / {params.username}
                        </span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-32">
                {/* 1. Project Gallery & Hero */}
                <section className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-slate-100 bg-white p-2 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <ProjectGallery
                        coverImage={project.cover_image || DEFAULT_PROJECT_IMAGES[project.type] || DEFAULT_PROJECT_IMAGES.personal}
                        galleryImages={project.gallery_images || []}
                    />
                </section>


                {/* 2. Header Information - full width, fuera del grid */}
                <header className="max-w-4xl space-y-8 mb-16">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                            {PROJECT_LABELS[project.type] || project.type}
                        </span>
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">
                            {formatDate(project.created_at)}
                        </span>
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Column: Content */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* 3. Text Content in Premium Card */}

                        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 shadow-sm space-y-16">
                            {/* Summary / Impact Thesis */}
                            <section className="space-y-6">
                                <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">Resumen del proyecto</h2>
                                <p className="text-2xl font-medium text-slate-800 leading-relaxed">
                                    {project.description || "Este proyecto describe una solución innovadora dentro de su categoría."}
                                </p>
                            </section>

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
                                                {project.results.split('\n').filter(r => r.trim() !== '').map((item, idx) => (
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

                            {/* Action Links */}
                            <div className="flex flex-wrap gap-4 pt-12 border-t border-slate-50">
                                {project.repo_url && (
                                    <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-600 transition-all font-mono text-[10px] font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                        <Github size={14} />
                                        Protocolo / GitHub
                                    </a>
                                )}
                                {project.demo_url && (
                                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Globe size={14} />
                                        Demo en Vivo ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <aside className="lg:col-span-4 space-y-16">
                        <section className="sticky top-24 space-y-12">
                            {/* Competencias */}
                            <SkillsDetailTabs
                                hardSkills={project.hard_skills}
                                softSkills={project.soft_skills}
                            />

                            {/* Team - free text field */}
                            {project.team_members && (
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                    <h3 className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-slate-500 mb-4 flex items-center gap-2">
                                        <Users size={14} className="text-indigo-500" />
                                        Otros colaboradores
                                    </h3>
                                    <div className="text-sm font-bold text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 italic">
                                        "{project.team_members}"
                                    </div>
                                </div>
                            )}

                            {/* Unified Team Widget */}
                            {uniqueTeam.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                    <h3 className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-slate-500 mb-4 flex items-center gap-2">
                                        <Users size={14} className="text-indigo-500" />
                                        Equipo del Proyecto
                                    </h3>
                                    <div className="space-y-4">
                                        {uniqueTeam.map(member => (
                                            <Link
                                                key={member.id}
                                                href={`/${member.username}`}
                                                className="flex items-center gap-3 group hover:bg-slate-50 rounded-xl p-2 transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 overflow-hidden flex-shrink-0 border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                                                    {member.avatar_url ? (
                                                        <img src={member.avatar_url} alt={member.full_name || ''} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-indigo-400">
                                                            {(member.full_name || member.username).charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                                        {member.full_name || member.username}
                                                    </p>
                                                    {member.headline && (
                                                        <p className="text-[10px] text-slate-400 truncate">{member.headline}</p>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    </aside>
                </div>

                {/* Footer Projects */}
                {otherProjects && otherProjects.length > 0 && (
                    <footer className="mt-32 pt-24 border-t border-slate-100 space-y-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900 underline decoration-indigo-200 underline-offset-8">Otros Proyectos</h2>
                            <Link href={`/${profile.username}`} className="text-[10px] font-mono font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                                Ver Todo ↗
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {otherProjects.map(p => (
                                <Link key={p.id} href={`/${profile.username}/proyectos/${p.id}`} className="group space-y-4">
                                    <div className="aspect-[16/10] rounded-2xl bg-white border border-slate-100 overflow-hidden relative group-hover:border-indigo-200 transition-all">
                                        {(() => {
                                            const displayImg = p.cover_image || DEFAULT_PROJECT_IMAGES[p.type] || DEFAULT_PROJECT_IMAGES.personal;
                                            return (
                                                <img src={displayImg} alt={p.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                                            )
                                        })()}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{p.title}</h4>
                                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{PROJECT_LABELS[p.type] || p.type}</p>
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
