'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Briefcase, GraduationCap, Trophy, Rocket, Heart, Award, Star, Palette, Dumbbell, HeartPulse } from 'lucide-react'

export type MilestoneType = 'project' | 'achievement' | 'experience' | 'education'

export interface Milestone {
    id: string
    title: string
    subtitle: string
    date: string
    type: MilestoneType
    category?: string // Para sub-tipos como 'academic', 'job', etc
    description?: string
    link?: string
}

interface DashboardTrajectoryProps {
    hitos: Milestone[]
    initialCount?: number
}

// Función auxiliar para obtener el icono según el tipo de hito
const getMilestoneIcon = (hito: Milestone) => {
    switch (hito.type) {
        case 'project':
            return hito.category === 'startup' ? <Rocket size={14} /> : <Briefcase size={14} />
        case 'achievement':
            return <Trophy size={14} />
        case 'education':
            return <GraduationCap size={14} />
        case 'experience':
            switch (hito.category) {
                case 'liderazgo': return <Award size={14} />
                case 'social': return <Heart size={14} />
                case 'emprendimiento': return <Rocket size={14} />
                case 'empleo_sustento': return <Briefcase size={14} />
                case 'academico': return <GraduationCap size={14} />
                case 'deportivo': return <Dumbbell size={14} />
                case 'creativo': return <Palette size={14} />
                case 'cuidado_vida': return <HeartPulse size={14} />
                default: return <Briefcase size={14} />
            }
        default:
            return <Star size={14} />
    }
}

// Función auxiliar para formatear fechas
const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString // Por si pasamos "Presente"
    return date.getFullYear().toString()
}

export default function DashboardTrajectory({
    hitos,
    initialCount = 4
}: DashboardTrajectoryProps) {
    const [expanded, setExpanded] = useState(false)

    // Ordenar por fecha descendente (ya vienen ordenados de fuera usualmente, pero aseguramos)
    const sortedHitos = [...hitos].sort(
        (a, b) => {
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            // Manejar fechas inválidas (como "Presente") poniéndolas arriba
            if (isNaN(dateA)) return -1
            if (isNaN(dateB)) return 1
            return dateB - dateA
        }
    )

    const visibleHitos = expanded ? sortedHitos : sortedHitos.slice(0, initialCount)
    const hasMore = hitos.length > initialCount

    if (hitos.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <h3 className="font-mono text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">
                    Trayectoria
                </h3>
                <p className="text-sm text-slate-500 font-serif italic">Sin hitos registrados en el protocolo.</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            {/* Removido el contenedor bg-white para integración fluida en sidebar */}
            <h3 className="font-mono text-[10px] font-black tracking-[0.2em] uppercase text-slate-500 mb-8 hidden">
                Trayectoria / Timeline
            </h3>

            {/* Timeline compacto */}
            <div className="relative">
                {/* Línea vertical */}
                <div className="absolute left-[11px] top-2 bottom-8 w-px bg-slate-100"></div>

                <div className="space-y-8">
                    {visibleHitos.map((hito) => (
                        <div key={hito.id} className="relative flex gap-4 group">
                            {/* Dot */}
                            <div className="relative z-10 w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-500 flex-shrink-0 group-hover:border-indigo-600 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all duration-500 shadow-sm ring-4 ring-transparent group-hover:ring-indigo-500/10">
                                {getMilestoneIcon(hito)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        {hito.link ? (
                                            <a href={hito.link} className="block group/link">
                                                <h4 className="font-serif text-lg text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                                    {hito.title}
                                                </h4>
                                            </a>
                                        ) : (
                                            <h4 className="font-serif text-lg text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                                {hito.title}
                                            </h4>
                                        )}
                                        <p className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-[0.1em] mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                            {hito.subtitle}
                                        </p>
                                    </div>
                                    <span className="text-[9px] text-indigo-600 font-mono font-black tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/50 flex-shrink-0">
                                        {formatDate(hito.date)}
                                    </span>
                                </div>

                                {hito.description && (
                                    <p className={`text-xs text-slate-500 mt-2 leading-relaxed font-serif italic ${expanded ? '' : 'line-clamp-2'}`}>
                                        {hito.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Botón Expandir/Colapsar */}
            {hasMore && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-8 w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded font-mono text-[10px] font-bold uppercase tracking-widest transition-all border border-slate-200"
                >
                    <span>{expanded ? 'Contraer' : 'Expandir Trayectoria'}</span>
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
            )}
        </div>
    )
}

