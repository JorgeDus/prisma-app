'use client'

import { FolderGit2, Briefcase, Award } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts'

export default function ContentTab({ stats }: any) {
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
                <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
                        <FolderGit2 size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Proyectos Totales</p>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.projects.total}</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Experiencias</p>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.experiences.total}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
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
        </div>
    )
}
