'use client'

import { Users, TrendingUp, UserPlus, FolderGit2, AlertCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts'

function StatCard({ label, value, icon: Icon, subtext, color = 'indigo' }: any) {
    const colors: any = {
        indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-500', border: 'border-indigo-100' },
        emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', border: 'border-emerald-100' },
        amber: { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-100' },
        rose: { bg: 'bg-rose-50', icon: 'text-rose-500', border: 'border-rose-100' },
        slate: { bg: 'bg-slate-50', icon: 'text-slate-500', border: 'border-slate-100' },
    }
    const c = colors[color]

    return (
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-3xl font-extrabold text-slate-900">{value}</p>
                    {subtext && (
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            {subtext}
                        </p>
                    )}
                </div>
                <div className={`${c.bg} ${c.border} border rounded-xl p-2.5`}>
                    <Icon size={20} className={c.icon} />
                </div>
            </div>
        </div>
    )
}

export default function GeneralTab({ stats }: any) {
    // Prep dat for gender pie chart
    const genderData = stats.demographics.gender.map((item: any) => ({
        name: item.gender.charAt(0).toUpperCase() + item.gender.slice(1),
        value: item.count
    }))

    const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#f43f5e', '#64748b']

    // Funnel data logic
    const total = stats.totalStudents
    const completes = total - stats.incompleteProfiles
    const act90 = stats.activeStudentsDetail.last90
    const act30 = stats.activeStudentsDetail.last30
    const creators = stats.totalProjects > 0 ? act30 : 0 // Simplified creators logic placeholder

    const funnelData = [
        { name: 'Registrados', value: total, fill: '#6366f1' },
        { name: 'Perfiles Completos', value: completes, fill: '#8b5cf6' },
        { name: 'Activos (90d)', value: act90, fill: '#14b8a6' },
        { name: 'Activos (30d)', value: act30, fill: '#f59e0b' },
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* KPI Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    label="Total Estudiantes" 
                    value={stats.totalStudents} 
                    icon={Users} 
                    color="indigo"
                    subtext="En el segmento actual"
                />
                <StatCard 
                    label="Activos Recientes (30d)" 
                    value={stats.activeStudentsDetail.last30} 
                    icon={TrendingUp} 
                    color="emerald"
                    subtext={`${Math.round((stats.activeStudentsDetail.last30 / (stats.totalStudents || 1)) * 100)}% de conversión`}
                />
                <StatCard 
                    label="Nuevos este Mes" 
                    value={stats.newThisMonth} 
                    icon={UserPlus} 
                    color="amber"
                />
                <StatCard 
                    label="Perfiles Incompletos" 
                    value={stats.incompleteProfiles} 
                    icon={AlertCircle} 
                    color="rose"
                    subtext="Falta foto, bio o género"
                />
            </div>

            {/* Split Row for Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Funnel de Retención */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-6">Funnel de Engagement Estudiantil</h2>
                    {stats.totalStudents > 0 ? (
                        <div className="space-y-3">
                            {funnelData.map((step, idx) => {
                                const percentage = total > 0 ? Math.round((step.value / total) * 100) : 0
                                return (
                                    <div key={idx} className="relative">
                                        <div className="flex justify-between text-xs font-semibold mb-1">
                                            <span className="text-slate-700">{step.name}</span>
                                            <span className="text-slate-500">{step.value} ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-3">
                                            <div 
                                                className="h-3 rounded-full transition-all duration-1000" 
                                                style={{ width: `${percentage}%`, backgroundColor: step.fill }} 
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="flex h-40 items-center justify-center text-slate-400 text-sm">Sin datos para mostrar</div>
                    )}
                </div>

                {/* Demografía: Género */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-2">Composición por Género</h2>
                    {genderData.length > 0 ? (
                        <div className="h-48 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={genderData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {genderData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex h-40 items-center justify-center text-slate-400 text-sm">Sin datos para mostrar</div>
                    )}
                </div>

            </div>

            {/* Estudiantes recientes */}
            {stats.recentStudents?.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-800">
                            Registros Recientes
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats.recentStudents.map((s: any) => (
                            <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-50 bg-slate-50/50">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0 overflow-hidden">
                                    {(s.full_name || s.username || '?').charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{s.full_name || s.username}</p>
                                    <p className="text-[11px] text-slate-400">{(s as any).careers?.name || 'Sin carrera'}</p>
                                </div>
                                <a
                                    href={`/${s.username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 text-[10px] uppercase tracking-wider font-bold text-indigo-500 hover:text-indigo-600"
                                >
                                    Ver
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
