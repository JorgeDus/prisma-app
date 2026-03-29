'use client'

import { Users, TrendingUp, UserPlus, AlertCircle, BookOpen, Briefcase } from 'lucide-react'
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer, Tooltip as RechartsTooltip, Legend
} from 'recharts'
import { CustomTooltip, SectionHeader } from '../ChartHelpers'
import DataGrid from '../DataGrid'
import { useState, useMemo } from 'react'

function StatCard({ label, value, icon: Icon, subtext, color = 'indigo', prominent = false }: any) {
    const colors: any = {
        indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-500', border: 'border-indigo-100', accent: 'bg-indigo-500' },
        emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', border: 'border-emerald-100', accent: 'bg-emerald-500' },
        amber: { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-100', accent: 'bg-amber-500' },
        rose: { bg: 'bg-rose-50', icon: 'text-rose-500', border: 'border-rose-100', accent: 'bg-rose-500' },
        slate: { bg: 'bg-slate-50', icon: 'text-slate-500', border: 'border-slate-100', accent: 'bg-slate-400' },
    }
    const c = colors[color]

    return (
        <div className={`bg-white rounded-xl border p-5 relative overflow-hidden ${prominent
                ? 'shadow-md border-slate-200'
                : 'shadow-sm border-slate-100'
            }`}>
            {prominent && (
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${c.accent}`} />
            )}
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
    const [showUniqueUsers, setShowUniqueUsers] = useState(false)

    const genderData = stats.demographics.gender.map((item: any) => ({
        name: item.gender,
        value: item.count
    }))

    const GENDER_COLORS: any = {
        'Mujer': '#ec4899',
        'Hombre': '#3b82f6',
        'No binario': '#14b8a6',
        'Prefiero autodescribirme': '#8b5cf6',
        'Prefiero no decirlo': '#94a3b8'
    }

    // Funnel data logic
    const total = stats.totalStudents
    const completes = total - stats.incompleteProfiles
    const act90 = stats.activeStudentsDetail.last90
    const act30 = stats.activeStudentsDetail.last30

    // Creadores: estudiantes con al menos 1 proyecto o experiencia
    const usersWithContent = new Set([
        ...(stats.projects?.items || []).map((i: any) => i.userUsername),
        ...(stats.experiences?.items || []).map((i: any) => i.userUsername),
    ]).size

    const funnelData = [
        { name: 'Registrados', value: total, fill: '#818cf8' },
        { name: 'Perfil Completo', value: completes, fill: '#6366f1' },
        { name: 'Activos (90d)', value: act90, fill: '#34d399' },
        { name: 'Activos (30d)', value: act30, fill: '#10b981' },
        { name: 'Creadores de Contenido', value: usersWithContent, fill: '#059669' },
    ]

    // Métricas normalizadas
    const avgContentPerActiveStudent = act30 > 0
        ? ((stats.projects.total + stats.experiences.total) / act30).toFixed(1)
        : '0'
    const practiceCount = stats.experiences?.items?.filter((i: any) =>
        i.type === 'practica' || i.type === 'empleo_sustento'
    ).length ?? 0
    const pctWithPractice = total > 0 ? Math.round((practiceCount / total) * 100) : 0
    // Gráfico de diversidad: puede mostrar "Contenido" (default) o "Personas únicas"
    const diversityData = useMemo(() => {
        // 1. Mapear usuarios únicos por Carrera|Género (Denominador para el promedio)
        const usersMap = (stats.deepDiveData || []).reduce((acc: any, curr: any) => {
            const key = `${curr.career}|${curr.gender}`
            acc[key] = (acc[key] || 0) + curr.count
            return acc
        }, {})

        const sourceData = showUniqueUsers ? (stats.deepDiveData || []) : (stats.productionDeepDiveData || [])

        const map = sourceData.reduce((acc: any, curr: any) => {
            const key = curr.career
            if (!acc[key]) acc[key] = {
                name: key,
                Mujer: 0,
                Hombre: 0,
                'No binario': 0,
                'Prefiero autodescribirme': 0,
                'Prefiero no decirlo': 0
            }

            const genderKey = curr.gender
            let value = curr.count

            // Si estamos en modo Producción, calculamos el PROMEDIO
            if (!showUniqueUsers) {
                const userKey = `${curr.career}|${curr.gender}`
                const totalUsers = usersMap[userKey] || 0
                value = totalUsers > 0 ? Number((value / totalUsers).toFixed(1)) : 0
            }

            if (genderKey in acc[key]) {
                acc[key][genderKey] = (acc[key][genderKey] || 0) + value
            } else {
                acc[key]['Prefiero no decirlo'] = (acc[key]['Prefiero no decirlo'] || 0) + value
            }
            return acc
        }, {})

        return Object.values(map).sort((a: any, b: any) => {
            const sumA: number = (a.Mujer || 0) + (a.Hombre || 0) + (a['No binario'] || 0) + (a['Prefiero autodescribirme'] || 0) + (a['Prefiero no decirlo'] || 0)
            const sumB: number = (b.Mujer || 0) + (b.Hombre || 0) + (b['No binario'] || 0) + (b['Prefiero autodescribirme'] || 0) + (b['Prefiero no decirlo'] || 0)
            return sumB - sumA
        }).slice(0, 15) // Top 15 carreras
    }, [stats, showUniqueUsers])

    const showDiversityChart = diversityData.length > 0 && diversityData.some((c: any) => {
        return (c.Mujer || 0) + (c.Hombre || 0) + (c['No binario'] || 0) + (c['Prefiero autodescribirme'] || 0) + (c['Prefiero no decirlo'] || 0) > 0
    })

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* KPI Row 1: Conteos base */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Estudiantes"
                    value={stats.totalStudents}
                    icon={Users}
                    color="indigo"
                    prominent
                    subtext="En el segmento actual"
                />
                <StatCard
                    label="Activos Recientes (30d)"
                    value={stats.activeStudentsDetail.last30}
                    icon={TrendingUp}
                    color="emerald"
                    prominent
                    subtext={`${Math.round((stats.activeStudentsDetail.last30 / (stats.totalStudents || 1)) * 100)}% del total`}
                />
                <StatCard
                    label="Nuevos este Mes"
                    value={stats.newThisMonth}
                    icon={UserPlus}
                    color="indigo"
                    prominent
                />
                <StatCard
                    label="Perfiles Incompletos"
                    value={stats.incompleteProfiles}
                    icon={AlertCircle}
                    color="amber"
                    prominent
                    subtext="Falta foto, bio o género"
                />
            </div>

            {/* KPI Row 2: Métricas de calidad normalizadas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    label="Contenido por Estudiante Activo"
                    value={avgContentPerActiveStudent}
                    icon={BookOpen}
                    color="indigo"
                    subtext="Proyectos + experiencias promedio (ult. 30d)"
                />
                <StatCard
                    label="Con Experiencia Profesional"
                    value={`${pctWithPractice}%`}
                    icon={Briefcase}
                    color="emerald"
                    subtext={`${practiceCount} estudiantes con práctica o pasantía`}
                />
                <StatCard
                    label="Creadores de Contenido"
                    value={usersWithContent}
                    icon={Users}
                    color="slate"
                    subtext={`${Math.round((usersWithContent / (total || 1)) * 100)}% del total tiene al menos 1 item`}
                />
            </div>

            {/* Engagement: Funnel + Género */}
            <SectionHeader
                icon={TrendingUp}
                title="Engagement Estudiantil"
                subtitle="Activación y retención en el ciclo de vida del alumno"
                color="indigo"
            />

            {/* Split Row for Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Funnel de Retención */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-1">Funnel de Engagement</h2>
                    <p className="text-xs text-slate-400 mb-5">Evolución desde el registro hasta la producción activa</p>
                    {stats.totalStudents > 0 ? (
                        <div className="flex flex-col items-center gap-0.5">
                            {funnelData.map((step, idx) => {
                                const pctOfTotal = total > 0 ? (step.value / total) * 100 : 0
                                const prevValue = idx > 0 ? funnelData[idx - 1].value : null
                                const convRate = prevValue && prevValue > 0
                                    ? Math.round((step.value / prevValue) * 100)
                                    : null
                                const barWidth = Math.max(30, pctOfTotal)
                                return (
                                    <div key={idx} className="w-full flex flex-col items-center">
                                        {convRate !== null && (
                                            <div className="flex items-center gap-1.5 py-0.5">
                                                <div className="h-3 w-px bg-slate-200" />
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${convRate >= 80 ? 'text-emerald-700 bg-emerald-50' :
                                                        convRate >= 50 ? 'text-amber-700 bg-amber-50' :
                                                            'text-rose-700 bg-rose-50'
                                                    }`}>
                                                    {convRate}% continúa
                                                </span>
                                                <div className="h-3 w-px bg-slate-200" />
                                            </div>
                                        )}
                                        <div
                                            className="flex items-center justify-between rounded-lg transition-all duration-700"
                                            style={{
                                                width: `${barWidth}%`,
                                                backgroundColor: step.fill + '22',
                                                borderLeft: `3px solid ${step.fill}`,
                                                padding: '7px 14px',
                                            }}
                                        >
                                            <span className="text-xs font-semibold text-slate-700 truncate">{step.name}</span>
                                            <div className="flex items-baseline gap-1.5 shrink-0 ml-2">
                                                <span className="text-sm font-extrabold" style={{ color: step.fill }}>
                                                    {step.value.toLocaleString('es-CL')}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">
                                                    {Math.round(pctOfTotal)}%
                                                </span>
                                            </div>
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
                                            <Cell key={`cell-${index}`} fill={GENDER_COLORS[entry.name] || '#cbd5e1'} />
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

            {/* Gráfico de Actividad por Género y Carrera (solo si hay diversidad de género) */}
            {showDiversityChart && (
                <>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <SectionHeader
                            icon={Users}
                            title="Distribución Demográfica"
                            subtitle={showUniqueUsers ? "Estudiantes únicos con participación en cada carrera" : "Promedio de items producidos por estudiante según género"}
                            color="slate"
                        />
                        <div className="bg-slate-100 p-1 rounded-lg flex items-center mb-1">
                            <button
                                onClick={() => setShowUniqueUsers(false)}
                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${!showUniqueUsers ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                PROMEDIO (PROD.)
                            </button>
                            <button
                                onClick={() => setShowUniqueUsers(true)}
                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${showUniqueUsers ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                PARTICIPACIÓN (PERSONAS)
                            </button>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-sm font-bold text-slate-800">
                                    {showUniqueUsers ? 'Participación por Género y Carrera' : 'Intensidad de Producción por Género'}
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {showUniqueUsers ? 'Conteo de estudiantes únicos por género' : 'Promedio de contenido (proyectos + experiencias) por cada estudiante de ese grupo'}
                                </p>
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={diversityData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#64748b' }}
                                        tickFormatter={(v) => v.length > 14 ? v.substring(0, 13) + '…' : v}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                                    <Bar dataKey="Mujer" stackId="a" fill="#ec4899" />
                                    <Bar dataKey="Hombre" stackId="a" fill="#3b82f6" />
                                    <Bar dataKey="No binario" stackId="a" fill="#14b8a6" />
                                    <Bar dataKey="Prefiero autodescribirme" stackId="a" fill="#8b5cf6" />
                                    <Bar dataKey="Prefiero no decirlo" stackId="a" fill="#94a3b8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

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

            {/* DataGrid interactiva cruzada (Deep-Dive) */}
            {stats.deepDiveData && stats.deepDiveData.length > 0 && (
                <div className="pt-8 mb-4">
                    <DataGrid data={stats.deepDiveData} />
                </div>
            )}
        </div>
    )
}
