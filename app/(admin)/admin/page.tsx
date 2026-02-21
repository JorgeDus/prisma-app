import { createAdminClient } from '@/utils/supabase/admin'
import {
    Users,
    FolderOpen,
    Briefcase,
    Link2,
    AlertTriangle,
    PauseCircle,
    TrendingUp,
    Clock
} from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getAdminStats() {
    const adminClient = createAdminClient()

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    // Parallel queries for all stats
    const [
        { count: totalUsers },
        { count: newUsers7d },
        { count: newUsers30d },
        { count: totalProjects },
        { count: totalExperiences },
        { count: totalConnections },
        { count: pausedAccounts },
        { count: pendingDeletions },
        { data: recentUsers },
    ] = await Promise.all([
        adminClient.from('profiles').select('*', { count: 'exact', head: true }),
        adminClient.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
        adminClient.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
        adminClient.from('projects').select('*', { count: 'exact', head: true }),
        adminClient.from('experiences').select('*', { count: 'exact', head: true }),
        adminClient.from('connections').select('*', { count: 'exact', head: true }),
        adminClient.from('profiles').select('*', { count: 'exact', head: true }).eq('is_paused', true),
        adminClient.from('profiles').select('*', { count: 'exact', head: true }).not('deletion_requested_at', 'is', null),
        adminClient.from('profiles')
            .select('id, username, full_name, email, avatar_url, created_at')
            .order('created_at', { ascending: false })
            .limit(5),
    ])

    return {
        totalUsers: totalUsers || 0,
        newUsers7d: newUsers7d || 0,
        newUsers30d: newUsers30d || 0,
        totalProjects: totalProjects || 0,
        totalExperiences: totalExperiences || 0,
        totalConnections: totalConnections || 0,
        pausedAccounts: pausedAccounts || 0,
        pendingDeletions: pendingDeletions || 0,
        recentUsers: recentUsers || [],
    }
}

function StatCard({ icon: Icon, label, value, accent = false }: {
    icon: React.ElementType
    label: string
    value: number
    accent?: boolean
}) {
    return (
        <div className={`rounded-xl border p-5 ${accent ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${accent ? 'bg-amber-100 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    <Icon size={18} />
                </div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
                    {label}
                </span>
            </div>
            <p className={`text-3xl font-bold ${accent ? 'text-amber-700' : 'text-slate-800'}`}>
                {value.toLocaleString()}
            </p>
        </div>
    )
}

export default async function AdminOverviewPage() {
    const stats = await getAdminStats()

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Panel de Administración</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Resumen general de la plataforma Prisma
                </p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Usuarios" value={stats.totalUsers} />
                <StatCard icon={TrendingUp} label="Nuevos (7d)" value={stats.newUsers7d} />
                <StatCard icon={Clock} label="Nuevos (30d)" value={stats.newUsers30d} />
                <StatCard icon={FolderOpen} label="Proyectos" value={stats.totalProjects} />
                <StatCard icon={Briefcase} label="Experiencias" value={stats.totalExperiences} />
                <StatCard icon={Link2} label="Conexiones" value={stats.totalConnections} />
                <StatCard icon={PauseCircle} label="Cuentas Pausadas" value={stats.pausedAccounts} accent={stats.pausedAccounts > 0} />
                <StatCard icon={AlertTriangle} label="Eliminaciones Pendientes" value={stats.pendingDeletions} accent={stats.pendingDeletions > 0} />
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                    <h2 className="text-sm font-mono font-bold tracking-widest uppercase text-slate-400">
                        Últimos Registros
                    </h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {stats.recentUsers.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-400">
                            No hay usuarios registrados
                        </div>
                    ) : (
                        stats.recentUsers.map((user: any) => (
                            <div key={user.id} className="flex items-center gap-4 px-5 py-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                    {user.full_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                        {user.full_name || user.username}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">
                                        @{user.username} · {user.email}
                                    </p>
                                </div>
                                <span className="text-xs text-slate-400 shrink-0">
                                    {new Date(user.created_at).toLocaleDateString('es-CL', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
