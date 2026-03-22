'use client'

import { useState } from 'react'
import { FolderGit2, Briefcase, Award, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts'

export default function ContentTab({ stats }: any) {
    const [selectedDetail, setSelectedDetail] = useState<'projects' | 'experiences' | 'achievements' | null>(null)

    // Transform data for cohorts Stacked Bar Chart
    const processStackedData = (sourceStat: any) => {
        // sourceStat.byCohort is { '2023': 15, '2022': 30 } which is just totals.
        // Wait, the backend currently counts total byCohort and byGender, but NOT a 2D matrix!
        // The implementation_plan wanted Stacked Bar (Cohort x Gender). 
        // Our backend returns `projects.byCohort` and `projects.byGender` as separate 1D objects.
        // We will display a simple Bar chart for Cohorts, and a separate one for Careers.
        
        return Object.entries(sourceStat.byCohort || {})
            .map(([cohort, count]) => ({
                name: cohort,
                total: count
            }))
            .sort((a,b) => a.name.localeCompare(b.name)) // Sort by year
    }

    const projectsByCohort = processStackedData(stats.projects)
    const experiencesByCohort = processStackedData(stats.experiences)

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* KPI Totales de Contenido */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                    className={`bg-white rounded-xl border p-5 shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:ring-2 hover:ring-indigo-500/50 ${selectedDetail === 'projects' ? 'ring-2 ring-indigo-500 border-indigo-200 bg-indigo-50/10' : 'border-slate-100'}`}
                    onClick={() => setSelectedDetail(selectedDetail === 'projects' ? null : 'projects')}
                >
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
                        <FolderGit2 size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Proyectos Totales</p>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.projects.total}</p>
                    </div>
                </div>
                
                <div 
                    className={`bg-white rounded-xl border p-5 shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:ring-2 hover:ring-emerald-500/50 ${selectedDetail === 'experiences' ? 'ring-2 ring-emerald-500 border-emerald-200 bg-emerald-50/10' : 'border-slate-100'}`}
                    onClick={() => setSelectedDetail(selectedDetail === 'experiences' ? null : 'experiences')}
                >
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Experiencias</p>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.experiences.total}</p>
                    </div>
                </div>

                <div 
                    className={`bg-white rounded-xl border p-5 shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:ring-2 hover:ring-amber-500/50 ${selectedDetail === 'achievements' ? 'ring-2 ring-amber-500 border-amber-200 bg-amber-50/10' : 'border-slate-100'}`}
                    onClick={() => setSelectedDetail(selectedDetail === 'achievements' ? null : 'achievements')}
                >
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                        <Award size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Logros</p>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.achievements.total}</p>
                    </div>
                </div>
            </div>

            {/* Gráficos de Contenido por Cohorte */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Proyectos x Cohorte */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-6">Proyectos por Cohorte</h2>
                    <div className="h-64 w-full">
                        {projectsByCohort.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={projectsByCohort}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <RechartsTooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} name="Proyectos" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 text-sm">Sin datos para mostrar</div>
                        )}
                    </div>
                </div>

                {/* Experiencias x Cohorte */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-6">Experiencias por Cohorte</h2>
                    <div className="h-64 w-full">
                        {experiencesByCohort.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={experiencesByCohort}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <RechartsTooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="total" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Experiencias" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 text-sm">Sin datos para mostrar</div>
                        )}
                    </div>
                </div>

            </div>

            {/* Detalle Seleccionado */}
            {selectedDetail && stats[selectedDetail]?.items && (
                <div id="detail-section" className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm mt-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                Detalle de {
                                    selectedDetail === 'projects' ? 'Proyectos' : 
                                    selectedDetail === 'experiences' ? 'Experiencias' : 
                                    'Logros'
                                }
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Creados por la cohorte y/o carrera actualmente seleccionada.
                            </p>
                        </div>
                        <button 
                            onClick={() => setSelectedDetail(null)} 
                            className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-medium transition-colors"
                        >
                            <X size={16} /> Cerrar
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="p-3">Título / Rol</th>
                                    <th className="p-3">Estudiante</th>
                                    <th className="p-3">Fecha de Creación</th>
                                    <th className="p-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {stats[selectedDetail].items.length > 0 ? stats[selectedDetail].items.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-3 text-sm font-semibold text-slate-800">
                                            {item.title}
                                        </td>
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
                                        <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">
                                            No hay elementos para mostrar
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
