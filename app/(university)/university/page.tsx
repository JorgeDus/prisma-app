import { GraduationCap, Users, FolderGit2, Briefcase, TrendingUp, UserPlus } from 'lucide-react'
import { getUniversityStats } from './actions'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import Image from 'next/image'
import Link from 'next/link'

function StatCard({ label, value, icon: Icon, trend, color = 'indigo' }: {
    label: string
    value: number | string
    icon: any
    trend?: string
    color?: 'indigo' | 'emerald' | 'amber' | 'rose'
}) {
    const colors = {
        indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-500', border: 'border-indigo-100' },
        emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', border: 'border-emerald-100' },
        amber: { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-100' },
        rose: { bg: 'bg-rose-50', icon: 'text-rose-500', border: 'border-rose-100' },
    }
    const c = colors[color]

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-3xl font-extrabold text-slate-900">{value}</p>
                    {trend && (
                        <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                            <TrendingUp size={11} /> {trend}
                        </p>
                    )}
                </div>
                <div className={`${c.bg} ${c.border} border rounded-xl p-3`}>
                    <Icon size={22} className={c.icon} />
                </div>
            </div>
        </div>
    )
}

export default async function UniversityDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const adminClient = createAdminClient()
    const { data: authUser } = await adminClient.auth.admin.getUserById(user!.id)
    const universityId = authUser?.user?.app_metadata?.university_id as number

    // Datos de la universidad
    const { data: university } = await adminClient
        .from('universities')
        .select('name, logo_url')
        .eq('id', universityId)
        .single()

    const stats = await getUniversityStats(universityId)

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                {university?.logo_url && (
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                        <Image
                            src={university.logo_url}
                            alt={university.name || 'Universidad'}
                            width={56}
                            height={56}
                            className="object-contain w-full h-full"
                        />
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{university?.name || 'Portal Universidad'}</h1>
                    <p className="text-sm text-slate-500">
                        Vista general del talento de tus estudiantes en Prisma
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    label="Total Estudiantes"
                    value={stats.totalStudents}
                    icon={Users}
                    color="indigo"
                />
                <StatCard
                    label="Activos (30 días)"
                    value={stats.activeStudents}
                    icon={TrendingUp}
                    color="emerald"
                />
                <StatCard
                    label="Nuevos este mes"
                    value={stats.newThisMonth}
                    icon={UserPlus}
                    color="amber"
                />
                <StatCard
                    label="Proyectos"
                    value={stats.totalProjects}
                    icon={FolderGit2}
                    color="indigo"
                />
                <StatCard
                    label="Experiencias"
                    value={stats.totalExperiences}
                    icon={Briefcase}
                    color="rose"
                />
                <StatCard
                    label="Carreras"
                    value={stats.byCareer.length}
                    icon={GraduationCap}
                    color="indigo"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Skills */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-mono font-bold text-slate-500 uppercase tracking-wider mb-4">
                        Top Competencias
                    </h2>
                    <div className="space-y-2">
                        {stats.topSkills.length === 0 ? (
                            <p className="text-slate-400 text-sm">Sin datos aún</p>
                        ) : stats.topSkills.map(({ skill, count }) => (
                            <div key={skill} className="flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-slate-700 font-medium truncate">{skill}</span>
                                        <span className="text-xs text-slate-400 ml-2 shrink-0">{count}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full">
                                        <div
                                            className="h-1.5 bg-indigo-500 rounded-full transition-all"
                                            style={{ width: `${Math.min(100, (count / (stats.topSkills[0]?.count || 1)) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Por Carrera */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-mono font-bold text-slate-500 uppercase tracking-wider mb-4">
                        Estudiantes por Carrera
                    </h2>
                    <div className="space-y-3">
                        {stats.byCareer.length === 0 ? (
                            <p className="text-slate-400 text-sm">Sin datos aún</p>
                        ) : stats.byCareer.map(({ career, count }) => (
                            <div key={career} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                <span className="text-sm text-slate-700 font-medium truncate pr-4">{career}</span>
                                <span className="shrink-0 inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Estudiantes recientes */}
            {stats.recentStudents.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-mono font-bold text-slate-500 uppercase tracking-wider">
                            Registros Recientes
                        </h2>
                        <Link href="/university/students" className="text-xs text-indigo-600 hover:text-indigo-500 font-semibold">
                            Ver todos →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {stats.recentStudents.map((s: any) => (
                            <div key={s.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0 overflow-hidden">
                                    {s.avatar_url ? (
                                        <Image src={s.avatar_url} alt="" width={36} height={36} className="w-full h-full object-cover" />
                                    ) : (
                                        (s.full_name || s.username || '?').charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{s.full_name || s.username}</p>
                                    <p className="text-xs text-slate-400">{(s as any).careers?.name || 'Sin carrera'}</p>
                                </div>
                                <a
                                    href={`/${s.username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 text-xs text-indigo-500 hover:text-indigo-600 font-medium"
                                >
                                    Ver perfil →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
