'use client'

import { Brain, Sparkles } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

export default function SkillsTab({ stats }: any) {
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

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* KPI Totales de Competencias */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
                        <Brain size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Total Competencias Técnicas</p>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.skills.hard.total}</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Total Competencias Transversales</p>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.skills.soft.total}</p>
                    </div>
                </div>
            </div>

            {/* Gráficos de Contenido por Cohorte */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Top Hard Skills */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-6">Top Competencias Técnicas</h2>
                    <div className="h-80 w-full">
                        {topHard.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topHard} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        type="category" 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 11, fill: '#475569' }} 
                                        width={110}
                                    />
                                    <RechartsTooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} name="Frecuencia" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 text-sm">Sin datos para mostrar</div>
                        )}
                    </div>
                </div>

                {/* Top Soft Skills */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-6">Top Competencias Transversales</h2>
                    <div className="h-80 w-full">
                        {topSoft.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topSoft} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        type="category" 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 11, fill: '#475569' }} 
                                        width={110}
                                    />
                                    <RechartsTooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} name="Frecuencia" />
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
