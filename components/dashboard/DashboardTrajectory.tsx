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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                <h3 className="font-bold text-lg mb-2 flex items-center justify-center gap-2 text-gray-900">
                    <span className="text-purple-600">🚀</span>
                    Trayectoria
                </h3>
                <p className="text-sm text-gray-500">Aún no hay hitos registrados en tu trayectoria.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900">
                <span className="text-purple-600">🚀</span>
                Trayectoria
            </h3>

            {/* Timeline compacto */}
            <div className="relative">
                {/* Línea vertical */}
                <div className="absolute left-[11px] top-2 bottom-8 w-0.5 bg-gradient-to-b from-purple-300 via-purple-200 to-gray-100"></div>

                <div className="space-y-6">
                    {visibleHitos.map((hito) => (
                        <div key={hito.id} className="relative flex gap-3 group">
                            {/* Dot */}
                            <div className="relative z-10 w-6 h-6 rounded-full bg-white border-2 border-purple-300 flex items-center justify-center text-xs flex-shrink-0 group-hover:border-purple-500 transition-colors text-purple-600 group-hover:scale-110 shadow-sm">
                                {getMilestoneIcon(hito)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-1">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        {hito.link ? (
                                            <a
                                                href={hito.link}
                                                className="font-semibold text-gray-900 text-sm leading-tight hover:text-purple-600 transition-colors block"
                                            >
                                                {hito.title}
                                            </a>
                                        ) : (
                                            <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                                                {hito.title}
                                            </h4>
                                        )}
                                        <p className="text-[11px] text-gray-500 font-medium mt-0.5 uppercase tracking-wider">{hito.subtitle}</p>
                                    </div>
                                    <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full flex-shrink-0 border border-purple-100">
                                        {formatDate(hito.date)}
                                    </span>
                                </div>

                                {hito.description && (
                                    <p className={`text-xs text-gray-500 mt-1.5 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
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
                    className="mt-6 w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-medium text-xs transition-all border border-gray-200"
                >
                    <span>{expanded ? 'Ver menos' : 'Ver trayectoria completa'}</span>
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
            )}
        </div>
    )
}

