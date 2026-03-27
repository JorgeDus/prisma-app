import { useState, useMemo } from 'react'
import { Brain, Sparkles, FolderCode, Briefcase, ExternalLink } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts'
import Link from 'next/link'
import { CustomTooltip, CustomYAxisTick, SectionHeader } from '../ChartHelpers'

export default function SkillsTab({ stats }: any) {
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

    // Top 10 Hard Skills
    const topHard = stats.skills.hard.top.slice(0, 10).map((s: any) => ({
        name: s.skill,
        count: s.count
    }))

    // Top 10 Soft Skills
    const topSoft = stats.skills.soft.top.slice(0, 10).map((s: any) => ({
        name: s.skill,
        count: s.count
    }))

    // Filtrar items basados en la competencia seleccionada
    const filteredContent = useMemo(() => {
        if (!selectedSkill) return null

        const allItems = [
            ...(stats.projects?.items || []).map((item: any) => ({ ...item, contentType: 'proyecto' })),
            ...(stats.experiences?.items || []).map((item: any) => ({ ...item, contentType: 'experiencia' }))
        ]

        const matches = allItems.filter((item: any) =>
            (item.hard_skills || []).some((s: string) => s.trim().toLowerCase() === selectedSkill.toLowerCase()) ||
            (item.soft_skills || []).some((s: string) => s.trim().toLowerCase() === selectedSkill.toLowerCase())
        ).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

        return { items: matches, hasData: allItems.length > 0 }
    }, [selectedSkill, stats])

    const handleBarClick = (data: any) => {
        if (selectedSkill === data.name) {
            setSelectedSkill(null)
        } else {
            setSelectedSkill(data.name)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* KPI Totales de Competencias */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-md flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
                        <Brain size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Catálogo de Competencias Técnicas</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-extrabold text-slate-900">{stats.skills.hard.total}</p>
                            <p className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                {stats.skills.hard.validations} MENCIONES
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-md flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Catálogo de Competencias Transversales</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-extrabold text-slate-900">{stats.skills.soft.total}</p>
                            <p className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                {stats.skills.soft.validations} MENCIONES
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráficos de Contenido por Cohorte */}
            <SectionHeader
                icon={Brain}
                title="Ranking de Competencias"
                subtitle="Top 10 hard y soft skills declaradas — click en una barra para filtrar el contenido relacionado"
                color="indigo"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Top Hard Skills */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-bold text-slate-800">Top Competencias Técnicas</h2>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Click para filtrar</span>
                    </div>
                    <div className="h-80 w-full">
                        {topHard.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topHard} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        width={130}
                                        tick={(props) => <CustomYAxisTick {...props} maxCharsPerLine={20} fontSize={11} fontWeight={500} fill="#475569" />}
                                    />
                                    <RechartsTooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: '#f8fafc' }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="#6366f1"
                                        radius={[0, 4, 4, 0]}
                                        barSize={20}
                                        name="Menciones"
                                        onClick={handleBarClick}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {topHard.map((entry: any, index: number) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={selectedSkill === entry.name ? '#4338ca' : '#6366f1'}
                                                className="transition-all duration-300"
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 text-sm">Sin datos para mostrar</div>
                        )}
                    </div>
                </div>

                {/* Top Soft Skills */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-bold text-slate-800">Top Competencias Transversales</h2>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Click para filtrar</span>
                    </div>
                    <div className="h-80 w-full">
                        {topSoft.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topSoft} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        width={130}
                                        tick={(props) => <CustomYAxisTick {...props} maxCharsPerLine={20} fontSize={11} fontWeight={500} fill="#475569" />}
                                    />
                                    <RechartsTooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: '#f8fafc' }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="#f59e0b"
                                        radius={[0, 4, 4, 0]}
                                        barSize={20}
                                        name="Menciones"
                                        onClick={handleBarClick}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {topSoft.map((entry: any, index: number) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={selectedSkill === entry.name ? '#b45309' : '#f59e0b'}
                                                className="transition-all duration-300"
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 text-sm">Sin datos para mostrar</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Panel de Detalle por Competencia */}
            {selectedSkill && (
                <div className="bg-white rounded-xl border-2 border-indigo-100 p-6 shadow-md animate-in slide-in-from-bottom-4 duration-500 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Brain size={120} className="text-indigo-600" />
                    </div>

                    <div className="flex items-center justify-between mb-6 relative">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles size={16} className="text-indigo-500" />
                                <h3 className="text-lg font-extrabold text-slate-900 leading-none">Contenido con <span className="text-indigo-600">"{selectedSkill}"</span></h3>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Proyectos y experiencias que validan esta competencia en la universidad.</p>
                        </div>
                        <button 
                            onClick={() => setSelectedSkill(null)}
                            className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-tighter transition-colors"
                        >
                            Cerrar detalle
                        </button>
                    </div>

                    {filteredContent && filteredContent.items.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                            {filteredContent.items.map((item: any) => (
                                <div key={item.id} className="group flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all duration-200">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                        item.contentType === 'proyecto' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'
                                    }`}>
                                        {item.contentType === 'proyecto' ? <FolderCode size={20} /> : <Briefcase size={20} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                                item.contentType === 'proyecto' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {item.contentType}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400">{new Date(item.date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{item.title}</p>
                                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                            por {item.userName}
                                        </p>
                                    </div>
                                    <Link
                                        href={item.contentType === 'proyecto' ? `/${item.userUsername}/proyectos/${item.id}` : `/${item.userUsername}/experiencias/${item.id}`}
                                        target="_blank"
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
                                    >
                                        <ExternalLink size={18} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                            <Brain size={40} className="mb-3 opacity-20" />
                            <p className="text-sm font-medium">
                                {filteredContent?.hasData
                                    ? 'No hay contenido que declare esta competencia en los filtros actuales.'
                                    : 'Sin datos de contenido disponibles para filtrar.'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
