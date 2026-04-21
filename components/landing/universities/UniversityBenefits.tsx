'use client'

import React from 'react'
import { Icon } from '@iconify/react'

const benefits = [
    {
        icon: 'solar:filter-linear',
        title: 'Filtros por carrera y cohorte',
        description: 'Segmenta toda la data por carrera y año de ingreso. Los filtros son globales: se aplican a todas las vistas simultáneamente.',
        color: 'indigo'
    },
    {
        icon: 'solar:users-group-two-rounded-linear',
        title: 'Análisis de género y diversidad',
        description: 'Composición demográfica por género con gráfico interactivo y distribución cruzada por carrera — ideal para reportes de equidad e inclusión.',
        color: 'pink'
    },
    {
        icon: 'solar:sort-vertical-linear',
        title: 'Funnel de evolución',
        description: 'Visualiza cuántos estudiantes pasan de registrarse a completar su perfil, crear contenido, armar un portafolio sólido y tener experiencia profesional.',
        color: 'violet'
    },
    {
        icon: 'solar:people-nearby-linear',
        title: 'Tasa de colaboración',
        description: 'Mide qué porcentaje del contenido fue creado colaborativamente entre estudiantes, con desglose proyectos vs. experiencias y benchmark cualitativo.',
        color: 'cyan'
    },
    {
        icon: 'solar:chart-2-linear',
        title: 'Benchmark por cohorte',
        description: 'Compara la producción normalizada (contenido por alumno) entre distintas generaciones para detectar diferencias de engagement.',
        color: 'emerald'
    },
    {
        icon: 'solar:briefcase-linear',
        title: 'Radiografía de empleabilidad',
        description: 'Distribución por sector (público vs. privado) y áreas de desempeño más frecuentes en las experiencias profesionales de tus estudiantes.',
        color: 'blue'
    },
    {
        icon: 'solar:brain-linear',
        title: 'Ranking de competencias',
        description: 'Top 10 de hard y soft skills más mencionadas en toda la universidad, construidas desde la evidencia de proyectos y experiencias reales.',
        color: 'amber'
    },
    {
        icon: 'solar:cursor-square-linear',
        title: 'Drill-down interactivo',
        description: 'Haz click en una barra de competencias o en un segmento del gráfico y ve automáticamente el contenido que la respalda, con link al perfil del estudiante.',
        color: 'rose'
    }
]

const colorStyles: Record<string, { iconBg: string; iconBorder: string; iconText: string; hoverShadow: string; hoverBorder: string }> = {
    indigo: { iconBg: 'bg-indigo-50', iconBorder: 'border-indigo-100', iconText: 'text-indigo-600', hoverShadow: 'hover:shadow-indigo-100/50', hoverBorder: 'hover:border-indigo-100' },
    pink: { iconBg: 'bg-pink-50', iconBorder: 'border-pink-100', iconText: 'text-pink-600', hoverShadow: 'hover:shadow-pink-100/50', hoverBorder: 'hover:border-pink-100' },
    violet: { iconBg: 'bg-violet-50', iconBorder: 'border-violet-100', iconText: 'text-violet-600', hoverShadow: 'hover:shadow-violet-100/50', hoverBorder: 'hover:border-violet-100' },
    cyan: { iconBg: 'bg-cyan-50', iconBorder: 'border-cyan-100', iconText: 'text-cyan-600', hoverShadow: 'hover:shadow-cyan-100/50', hoverBorder: 'hover:border-cyan-100' },
    emerald: { iconBg: 'bg-emerald-50', iconBorder: 'border-emerald-100', iconText: 'text-emerald-600', hoverShadow: 'hover:shadow-emerald-100/50', hoverBorder: 'hover:border-emerald-100' },
    blue: { iconBg: 'bg-blue-50', iconBorder: 'border-blue-100', iconText: 'text-blue-600', hoverShadow: 'hover:shadow-blue-100/50', hoverBorder: 'hover:border-blue-100' },
    amber: { iconBg: 'bg-amber-50', iconBorder: 'border-amber-100', iconText: 'text-amber-600', hoverShadow: 'hover:shadow-amber-100/50', hoverBorder: 'hover:border-amber-100' },
    rose: { iconBg: 'bg-rose-50', iconBorder: 'border-rose-100', iconText: 'text-rose-600', hoverShadow: 'hover:shadow-rose-100/50', hoverBorder: 'hover:border-rose-100' },
}

export const UniversityBenefits = () => {
    return (
        <section className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-2xl mb-16 reveal">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4 font-sans">
                        Las variables que importan.
                    </h2>
                    <p className="text-lg text-slate-500 font-light font-sans">
                        Cada dato que ves en el dashboard se construye automáticamente desde la actividad real de tus estudiantes. Sin encuestas, sin formularios, sin demoras.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, index) => {
                        const c = colorStyles[benefit.color]
                        return (
                            <div
                                key={index}
                                className={`bg-white rounded-3xl p-8 border border-slate-200 flex flex-col h-full reveal hover:shadow-xl ${c.hoverShadow} ${c.hoverBorder} transition-all duration-500 group`}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className={`w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center ${c.iconText} mb-8 border ${c.iconBorder} group-hover:scale-110 transition-all duration-500`}>
                                    <Icon icon={benefit.icon} width="24" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight font-sans">{benefit.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-sans font-light">
                                    {benefit.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
