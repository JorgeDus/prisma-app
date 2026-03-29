'use client'

import { useState, useMemo, useEffect } from 'react'
import { FolderGit2, Briefcase, Award, X, Users, BarChart2, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts'
import { CustomTooltip, CustomYAxisTick, SectionHeader } from '../ChartHelpers'

export default function ContentTab({ stats, onFilterChange }: any) {
    const [selectedDetail, setSelectedDetail] = useState<'projects' | 'experiences' | 'achievements' | null>(null)
    const [showGenderBreakdown, setShowGenderBreakdown] = useState(false)
    const [detailCohortFilter, setDetailCohortFilter] = useState<string | null>(null)

    // Handler para click en barras de volumen — filtrado LOCAL, sin re-fetch
    const handleVolumeClick = (type: 'projects' | 'experiences', data: any) => {
        if (!data || !data.name) return
        // Si ya no es vista mensual, guardamos el año para filtrar el listado localmente
        const clickedYear = !isYearFiltered ? data.name : null
        setDetailCohortFilter(clickedYear)
        setSelectedDetail(type)
    }

    // Scroll automático al detalle cuando se selecciona
    useEffect(() => {
        if (selectedDetail) {
            // Un pequeño delay asegura que el elemento esté renderizado y la animación haya comenzado
            setTimeout(() => {
                const element = document.getElementById('detail-section')
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
            }, 100)
        }
    }, [selectedDetail])

    // Datos simples por cohorte/mes (total, sin desagregar)
    const processSimpleData = (sourceStat: any) => {
        const cohortKeys = Object.keys(sourceStat.byCohort || {})
        const isYearFiltered = cohortKeys.length === 1

        if (isYearFiltered) {
            const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
            return monthNames.map(month => ({
                name: month,
                Total: Object.values(sourceStat.byMonthGender?.[month] || {}).reduce((s: number, v: any) => s + v, 0) as number,
                ...(sourceStat.byMonthGender?.[month] || {})
            }))
        }

        return cohortKeys
            .map(cohort => ({
                name: cohort,
                Total: Object.values(sourceStat.byCohortGender?.[cohort] || {}).reduce((s: number, v: any) => s + v, 0) as number,
                ...(sourceStat.byCohortGender?.[cohort] || {})
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
    }

    const projectsByCohort = processSimpleData(stats.projects)
    const experiencesByCohort = processSimpleData(stats.experiences)
    const isYearFiltered = Object.keys(stats.projects?.byCohort || {}).length === 1

    const totalContent = stats.projects.total + stats.experiences.total
    const totalCollaborative = stats.projects.collaborativeCount + stats.experiences.collaborativeCount
    const collaborationRate = totalContent > 0 ? Math.round((totalCollaborative / totalContent) * 100) : 0

    // Tasas separadas para el desglose
    const projectCollabRate = stats.projects.total > 0
        ? Math.round((stats.projects.collaborativeCount / stats.projects.total) * 100)
        : 0
    const expCollabRate = stats.experiences.total > 0
        ? Math.round((stats.experiences.collaborativeCount / stats.experiences.total) * 100)
        : 0

    // Nivel de colaboración con benchmark
    const collabLevel =
        collaborationRate >= 50 ? { label: 'Alta', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' } :
            collaborationRate >= 30 ? { label: 'Buena', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' } :
                collaborationRate >= 15 ? { label: 'Media', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' } :
                    { label: 'Baja', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' }

    // Diccionarios de colores y etiquetas
    const PROJECT_LABELS: Record<string, string> = {
        academic: 'Académico',
        startup: 'Startup / Emprendimiento',
        personal: 'Personal',
        otro: 'Otro'
    }
    const PROJECT_COLORS: Record<string, string> = {
        academic: '#6366f1',  // indigo-500  (primario)
        startup: '#4f46e5',  // indigo-700  (más oscuro)
        personal: '#818cf8',  // indigo-400  (más claro)
        otro: '#94a3b8'   // slate-400
    }

    const EXP_LABELS: Record<string, string> = {
        liderazgo: 'Liderazgo',
        social: 'Social / Voluntariado',
        emprendimiento: 'Emprendimiento',
        empleo_sustento: 'Empleo / Pasantía',
        academico: 'Académico',
        deportivo: 'Deportivo',
        creativo: 'Creativo',
        cuidado_vida: 'Cuidado y Vida',
        practica: 'Práctica Profesional',
        otro: 'Otro'
    }
    const EXP_COLORS: Record<string, string> = {
        practica: '#047857',  // emerald-700  (más profesional)
        liderazgo: '#059669',  // emerald-600
        academico: '#10b981',  // emerald-500
        social: '#34d399',  // emerald-400
        deportivo: '#6ee7b7',  // emerald-300
        emprendimiento: '#f59e0b',  // amber-500    (excepción semántica)
        empleo_sustento: '#3b82f6',  // blue-500     (excepción: empleo formal)
        creativo: '#818cf8',  // indigo-400   (cercano a proyectos)
        cuidado_vida: '#94a3b8',  // slate-400
        otro: '#64748b'   // slate-500
    }

    // Preparar datos para Mix (Combinando tipos) mapeados a español y colores definidos
    const projectMixData = Object.entries(stats.projects?.byType || {})
        .map(([type, count]) => ({
            name: PROJECT_LABELS[type] || 'Desconocido',
            value: count,
            fill: PROJECT_COLORS[type] || '#94a3b8'
        }))

    const experienceMixData = Object.entries(stats.experiences?.byType || {})
        .map(([type, count]) => ({
            name: EXP_LABELS[type] || 'Desconocido',
            value: count,
            fill: EXP_COLORS[type] || '#64748b'
        }))

    // ── Benchmark por Cohorte (métrica normalizada) ──────────────────────────
    const cohortBenchmark = useMemo(() => {
        // Mapa de estudiantes por cohorte: [{cohort: '2023', count: 45}]
        const studentsByCohort: Record<string, number> = {}
            ; (stats.demographics?.cohort || []).forEach((c: any) => {
                studentsByCohort[c.cohort] = c.count
            })

        const projectsByCohortRaw: Record<string, number> = stats.projects?.byCohort || {}
        const experiencesByCohortRaw: Record<string, number> = stats.experiences?.byCohort || {}

        // Unir todas las cohortes conocidas
        const allCohorts = new Set([
            ...Object.keys(studentsByCohort),
            ...Object.keys(projectsByCohortRaw),
            ...Object.keys(experiencesByCohortRaw),
        ])

        const rows = Array.from(allCohorts)
            .filter(c => c !== 'Sin cohorte')
            .map(cohort => {
                const students = studentsByCohort[cohort] || 0
                const projects = projectsByCohortRaw[cohort] || 0
                const experiences = experiencesByCohortRaw[cohort] || 0
                const total = projects + experiences
                const perStudent = students > 0 ? total / students : 0
                return { cohort, students, projects, experiences, total, perStudent }
            })
            .sort((a, b) => a.cohort.localeCompare(b.cohort))

        if (rows.length === 0) return null

        const maxPerStudent = Math.max(...rows.map(r => r.perStudent), 0.01)
        const topCohort = rows.reduce((best, r) => r.perStudent > best.perStudent ? r : best, rows[0])

        return { rows, maxPerStudent, topCohort: topCohort.cohort }
    }, [stats])

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* KPI Totales de Contenido */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    className={`bg-white rounded-xl border p-5 shadow-md flex items-center gap-4 cursor-pointer transition-all hover:ring-2 hover:ring-indigo-500/50 ${selectedDetail === 'projects' ? 'ring-2 ring-indigo-500 border-indigo-200 bg-indigo-50/10' : 'border-slate-200'}`}
                    onClick={() => setSelectedDetail(selectedDetail === 'projects' ? null : 'projects')}
                >
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
                        <FolderGit2 size={24} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-400 uppercase truncate">Proyectos Totales</p>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.projects.total}</p>
                    </div>
                </div>

                <div
                    className={`bg-white rounded-xl border p-5 shadow-md flex items-center gap-4 cursor-pointer transition-all hover:ring-2 hover:ring-emerald-500/50 ${selectedDetail === 'experiences' ? 'ring-2 ring-emerald-500 border-emerald-200 bg-emerald-50/10' : 'border-slate-200'}`}
                    onClick={() => setSelectedDetail(selectedDetail === 'experiences' ? null : 'experiences')}
                >
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shrink-0">
                        <Briefcase size={24} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-400 uppercase truncate">Experiencias</p>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.experiences.total}</p>
                    </div>
                </div>

                <div
                    className={`bg-white rounded-xl border p-5 shadow-md flex items-center gap-4 cursor-pointer transition-all hover:ring-2 hover:ring-amber-500/50 ${selectedDetail === 'achievements' ? 'ring-2 ring-amber-500 border-amber-200 bg-amber-50/10' : 'border-slate-200'}`}
                    onClick={() => setSelectedDetail(selectedDetail === 'achievements' ? null : 'achievements')}
                >
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                        <Award size={24} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-400 uppercase truncate">Logros</p>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.achievements.total}</p>
                    </div>
                </div>

                {/* Card Tasa de Colaboración ― con contexto y benchmark */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-md relative overflow-hidden">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Tasa de Colaboración</p>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${collabLevel.bg} ${collabLevel.color} ${collabLevel.border}`}>
                                    {collabLevel.label}
                                </span>
                            </div>
                            <p className="text-2xl font-extrabold text-slate-900">{collaborationRate}%</p>
                            <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                                Contenido con al menos un colaborador registrado
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
                            <Users size={20} />
                        </div>
                    </div>

                    {/* Desglose proyectos vs experiencias */}
                    <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Proyectos</p>
                            <div className="flex items-center gap-1.5">
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${projectCollabRate}%` }} />
                                </div>
                                <span className="text-xs font-bold text-slate-700 shrink-0">{projectCollabRate}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Experiencias</p>
                            <div className="flex items-center gap-1.5">
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${expCollabRate}%` }} />
                                </div>
                                <span className="text-xs font-bold text-slate-700 shrink-0">{expCollabRate}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Volumen por Ingreso */}
            <SectionHeader
                icon={TrendingUp}
                title="Volumen de Producción"
                subtitle="Proyectos y experiencias publicadas por año de ingreso"
                color="indigo"
            />

            {/* Fila de Gráficos: Volumen por cohorte */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Toggle de desglose por género */}
                <div className="lg:col-span-2 flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium">
                        {isYearFiltered ? 'Vista mensual del año seleccionado' : 'Producción total por año de ingreso'}
                    </p>
                    <button
                        onClick={() => setShowGenderBreakdown(v => !v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${showGenderBreakdown
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-600'
                            }`}
                    >
                        <BarChart2 size={13} />
                        {showGenderBreakdown ? 'Ocultar desglose por género' : 'Ver por género'}
                    </button>
                </div>

                {/* Proyectos x Año de Ingreso */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-6">
                        {isYearFiltered ? 'Distribución Mensual: Proyectos' : 'Proyectos por Año de Ingreso'}
                    </h2>
                    <div className="h-64 w-full">
                        {projectsByCohort.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={projectsByCohort}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                    {showGenderBreakdown ? (
                                        <>
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                            <Bar dataKey="Mujer" stackId="a" fill="#ec4899" onClick={(data) => handleVolumeClick('projects', data)} style={{ cursor: 'pointer' }} />
                                            <Bar dataKey="Hombre" stackId="a" fill="#3b82f6" onClick={(data) => handleVolumeClick('projects', data)} style={{ cursor: 'pointer' }} />
                                            <Bar dataKey="No binario" stackId="a" fill="#14b8a6" onClick={(data) => handleVolumeClick('projects', data)} style={{ cursor: 'pointer' }} />
                                            <Bar dataKey="Prefiero autodescribirme" stackId="a" fill="#8b5cf6" onClick={(data) => handleVolumeClick('projects', data)} style={{ cursor: 'pointer' }} />
                                            <Bar dataKey="Prefiero no decirlo" stackId="a" fill="#94a3b8" onClick={(data) => handleVolumeClick('projects', data)} style={{ cursor: 'pointer' }} />
                                        </>
                                    ) : (
                                        <Bar dataKey="Total" fill="#6366f1" radius={[4, 4, 0, 0]} name="Proyectos" onClick={(data) => handleVolumeClick('projects', data)} style={{ cursor: 'pointer' }} />
                                    )}
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 text-sm">Sin datos para mostrar</div>
                        )}
                    </div>
                </div>

                {/* Experiencias x Año de Ingreso */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-6">
                        {isYearFiltered ? 'Distribución Mensual: Experiencias' : 'Experiencias por Año de Ingreso'}
                    </h2>
                    <div className="h-64 w-full">
                        {experiencesByCohort.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={experiencesByCohort}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                    {showGenderBreakdown ? (
                                        <>
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                            <Bar dataKey="Mujer" stackId="a" fill="#ec4899" onClick={(data) => handleVolumeClick('experiences', data)} style={{ cursor: 'pointer' }} />
                                            <Bar dataKey="Hombre" stackId="a" fill="#3b82f6" onClick={(data) => handleVolumeClick('experiences', data)} style={{ cursor: 'pointer' }} />
                                            <Bar dataKey="No binario" stackId="a" fill="#14b8a6" onClick={(data) => handleVolumeClick('experiences', data)} style={{ cursor: 'pointer' }} />
                                            <Bar dataKey="Prefiero autodescribirme" stackId="a" fill="#8b5cf6" onClick={(data) => handleVolumeClick('experiences', data)} style={{ cursor: 'pointer' }} />
                                            <Bar dataKey="Prefiero no decirlo" stackId="a" fill="#94a3b8" onClick={(data) => handleVolumeClick('experiences', data)} style={{ cursor: 'pointer' }} />
                                        </>
                                    ) : (
                                        <Bar dataKey="Total" fill="#10b981" radius={[4, 4, 0, 0]} name="Experiencias" onClick={(data) => handleVolumeClick('experiences', data)} style={{ cursor: 'pointer' }} />
                                    )}
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 text-sm">Sin datos para mostrar</div>
                        )}
                    </div>
                </div>

            </div>

            {/* Tipología de Contenido */}
            <SectionHeader
                icon={Award}
                title="Tipología de Contenido"
                subtitle="Distribución por categoría de proyectos y experiencias"
                color="indigo"
            />

            {/* Segunda Fila de Gráficos: Tipología */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Mix de Proyectos */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-6">Tipología de Proyectos</h2>
                    <div className="h-64 w-full">
                        {projectMixData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={projectMixData} cx="50%" cy="45%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                                        {projectMixData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 text-sm">Sin proyectos</div>
                        )}
                    </div>
                </div>

                {/* Mix de Experiencias */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-6">Tipología de Experiencias</h2>
                    <div className="h-64 w-full">
                        {experienceMixData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={experienceMixData} cx="50%" cy="45%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                                        {experienceMixData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 text-sm">Sin experiencias</div>
                        )}
                    </div>
                </div>

            </div>

            {/* Benchmark por Cohorte ― producción normalizada */}
            {cohortBenchmark && cohortBenchmark.rows.length >= 2 && (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-50">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-indigo-500" />
                            <h2 className="text-sm font-bold text-slate-800">Benchmark por Año de Ingreso</h2>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Contenido por alumno ― una comparación entre años de distinta antigüedad
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[560px]">
                            <thead>
                                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                                    <th className="px-5 py-3">Año Ingreso</th>
                                    <th className="px-5 py-3 text-right">Alumnos</th>
                                    <th className="px-5 py-3 text-right">Proyectos</th>
                                    <th className="px-5 py-3 text-right">Experiencias</th>
                                    <th className="px-5 py-3">Contenido / Alumno</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {cohortBenchmark.rows.map(row => {
                                    const isTop = row.cohort === cohortBenchmark.topCohort
                                    const barWidth = cohortBenchmark.maxPerStudent > 0
                                        ? (row.perStudent / cohortBenchmark.maxPerStudent) * 100
                                        : 0
                                    return (
                                        <tr key={row.cohort} className={`hover:bg-slate-50/50 transition-colors ${isTop ? 'bg-indigo-50/30' : ''}`}>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-slate-800">{row.cohort}</span>
                                                    {isTop && (
                                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-100 border border-indigo-200 px-1.5 py-0.5 rounded">
                                                            ★ TOP
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-sm text-slate-600 text-right font-medium">{row.students}</td>
                                            <td className="px-5 py-3 text-sm text-indigo-600 text-right font-semibold">{row.projects}</td>
                                            <td className="px-5 py-3 text-sm text-emerald-600 text-right font-semibold">{row.experiences}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-700 ${isTop ? 'bg-indigo-500' : 'bg-slate-300'}`}
                                                            style={{ width: `${barWidth}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-sm font-extrabold shrink-0 w-8 text-right ${isTop ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                        {row.perStudent.toFixed(1)}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-50">
                        <p className="text-[11px] text-slate-400">
                            ⚠️ Las generaciones recientes muestran ratios menores por llevar menos tiempo activas. Compara años con antigüedad similar para conclusiones adecuadas.
                        </p>
                    </div>
                </div>
            )}

            {/* Empleabilidad */}
            <SectionHeader
                icon={Briefcase}
                title="Radiografía de Empleabilidad"
                subtitle="Prácticas profesionales y pasantías declaradas en perfiles"
                color="blue"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mix de Sector */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-6">Distribución por Sector</h2>
                    <div className="h-64 w-full">
                        {stats.employment?.bySector?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.employment.bySector}
                                        cx="50%" cy="45%"
                                        innerRadius={40} outerRadius={70}
                                        paddingAngle={5} dataKey="value"
                                    >
                                        {stats.employment.bySector.map((entry: any, index: number) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.name === 'Privado' ? '#10b981' : (entry.name === 'Público' ? '#6366f1' : '#94a3b8')}
                                            />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 text-sm italic">Sin datos de sector registrados</div>
                        )}
                    </div>
                </div>

                {/* Top Áreas de Práctica */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-6">Áreas de Desempeño más Frecuentes</h2>
                    <div className="h-64 w-full">
                        {stats.employment?.byArea?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={stats.employment.byArea}
                                    layout="vertical"
                                    margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        width={130}
                                        tick={(props) => <CustomYAxisTick {...props} maxCharsPerLine={20} fontSize={10} fontWeight={600} />}
                                    />
                                    <RechartsTooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: '#f8fafc' }}
                                    />
                                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={18} name="Cantidad" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 text-sm italic">Sin áreas registradas</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detalle Seleccionado */}
            {selectedDetail && stats[selectedDetail]?.items && (() => {
                // Filtrado local por año: solo aplica cuando viene de clic en barra de volumen
                const allItems: any[] = stats[selectedDetail].items
                const displayItems = detailCohortFilter
                    ? allItems.filter((i: any) => i.cohort === detailCohortFilter)
                    : allItems
                const detailLabel = selectedDetail === 'projects' ? 'Proyectos' : selectedDetail === 'experiences' ? 'Experiencias' : 'Logros'

                return (
                    <div id="detail-section" className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm mt-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
                        {/* Header del panel de detalle */}
                        <div className="flex flex-wrap items-center justify-between mb-4 border-b border-slate-50 pb-4 gap-3">
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-lg font-bold text-slate-800">Detalle de {detailLabel}</h2>
                                    {detailCohortFilter && (
                                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Ingreso {detailCohortFilter}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {detailCohortFilter
                                        ? `${displayItems.length} item${displayItems.length !== 1 ? 's' : ''} del año de ingreso ${detailCohortFilter} — filtro local, no afecta el resto del dashboard`
                                        : 'Resultados según los filtros globales activos'
                                    }
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {detailCohortFilter && onFilterChange && (
                                    <button
                                        onClick={() => onFilterChange('cohort', detailCohortFilter)}
                                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                                    >
                                        Aplicar filtro global
                                    </button>
                                )}
                                {detailCohortFilter && (
                                    <button
                                        onClick={() => setDetailCohortFilter(null)}
                                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        Ver todos
                                    </button>
                                )}
                                <button
                                    onClick={() => { setSelectedDetail(null); setDetailCohortFilter(null) }}
                                    className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-medium transition-colors"
                                >
                                    <X size={16} /> Cerrar
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="p-3">Título / Rol</th>
                                        {selectedDetail !== 'achievements' && <th className="p-3">Categoría</th>}
                                        <th className="p-3">Estudiante</th>
                                        <th className="p-3">Fecha de Creación</th>
                                        <th className="p-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {displayItems.length > 0 ? displayItems.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-3 text-sm font-semibold text-slate-800">
                                                {item.title}
                                            </td>
                                            {selectedDetail !== 'achievements' && (
                                                <td className="p-3">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedDetail === 'projects'
                                                        ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        }`}>
                                                        {selectedDetail === 'projects'
                                                            ? (PROJECT_LABELS[item.type] || item.type || '---')
                                                            : (EXP_LABELS[item.type] || item.type || '---')
                                                        }
                                                    </span>
                                                </td>
                                            )}
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex justify-center items-center shrink-0">
                                                        {(item.userName || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-600 truncate max-w-[150px]">{item.userName}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-xs text-slate-500 font-medium">
                                                {item.date ? new Date(item.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' }) : '---'}
                                            </td>
                                            <td className="p-3 text-right">
                                                {item.userUsername && (
                                                    <a
                                                        href={`/${item.userUsername}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center px-4 py-1.5 bg-white border border-slate-200 shadow-sm rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-600 lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:border-indigo-200 hover:text-indigo-600"
                                                    >
                                                        Ver Perfil
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={selectedDetail === 'achievements' ? 4 : 5} className="p-8 text-center text-slate-400 text-sm">
                                                No hay elementos para mostrar
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            })()}
        </div>
    )
}
