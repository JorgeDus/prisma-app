'use client'

import React, { useState } from 'react'
import { Icon } from '@iconify/react'

const tabs = [
    {
        id: 'general',
        label: 'Vista General',
        icon: 'solar:chart-2-linear',
        color: 'indigo',
        title: 'El pulso de tu comunidad estudiantil',
        description: 'Obtén una visión panorámica de tu base de estudiantes con métricas clave actualizadas en tiempo real.',
        features: [
            'Total de estudiantes registrados y activos (últimos 30 días)',
            'Detección de perfiles incompletos (falta foto, bio o género)',
            'Funnel de evolución: desde registro hasta portafolio con experiencia profesional',
            'Composición demográfica por género con gráfico interactivo',
            'Distribución por carrera y género con vista cruzada',
            'Tabla de deep-dive interactiva por carrera, cohorte y género',
        ]
    },
    {
        id: 'content',
        label: 'Producción',
        icon: 'solar:pie-chart-2-linear',
        color: 'emerald',
        title: 'Qué están construyendo tus estudiantes',
        description: 'Analiza el volumen, tipología y calidad del contenido que tus estudiantes publican en sus perfiles.',
        features: [
            'KPIs de proyectos, experiencias y logros totales',
            'Tasa de colaboración con benchmark cualitativo (Alta / Media / Baja)',
            'Volumen por año de ingreso con desglose opcional por género',
            'Tipología: distribución por categoría (académico, startup, liderazgo, social, etc.)',
            'Benchmark normalizado: contenido por alumno comparado entre cohortes',
            'Radiografía de empleabilidad: sector (público/privado) y áreas de desempeño',
        ]
    },
    {
        id: 'skills',
        label: 'Competencias',
        icon: 'solar:brain-linear',
        color: 'amber',
        title: 'El mapa de habilidades de tu universidad',
        description: 'Descubre las competencias técnicas y transversales más frecuentes, respaldadas por evidencia real.',
        features: [
            'Top 10 competencias técnicas (hard skills) más mencionadas',
            'Top 10 competencias transversales (soft skills) más mencionadas',
            'Click interactivo: selecciona una competencia y ve el contenido que la respalda',
            'Drill-down con detalle de proyectos y experiencias asociados a cada skill',
            'Vista cruzada: quién demuestra qué, con link directo al perfil público',
            'Datos construidos desde la evidencia (no autodeclarados sin contexto)',
        ]
    }
]

const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string; activeBg: string; activeBorder: string }> = {
    indigo: {
        bg: 'bg-indigo-50/50',
        border: 'border-indigo-100',
        text: 'text-indigo-600',
        iconBg: 'bg-indigo-100',
        activeBg: 'bg-indigo-50',
        activeBorder: 'border-indigo-200',
    },
    emerald: {
        bg: 'bg-emerald-50/50',
        border: 'border-emerald-100',
        text: 'text-emerald-600',
        iconBg: 'bg-emerald-100',
        activeBg: 'bg-emerald-50',
        activeBorder: 'border-emerald-200',
    },
    amber: {
        bg: 'bg-amber-50/50',
        border: 'border-amber-100',
        text: 'text-amber-600',
        iconBg: 'bg-amber-100',
        activeBg: 'bg-amber-50',
        activeBorder: 'border-amber-200',
    }
}

export const DashboardShowcase = () => {
    const [activeTab, setActiveTab] = useState('general')
    const currentTab = tabs.find(t => t.id === activeTab)!
    const colors = colorMap[currentTab.color]

    return (
        <section id="dashboard" className="py-32 bg-slate-50/50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-2xl mb-16 reveal">
                    <p className="text-[14px] font-mono font-bold text-indigo-500 uppercase tracking-[0.3em] mb-4">
                        Dashboard Institucional
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4 font-sans">
                        Tres vistas. Una imagen completa.
                    </h2>
                    <p className="text-lg text-slate-500 font-light font-sans">
                        El portal de inteligencia de Prisma organiza los datos de tus estudiantes en tres dimensiones complementarias, con filtros globales por carrera y año de ingreso.
                    </p>
                </div>

                {/* Tab Selector */}
                <div className="flex flex-wrap gap-3 mb-12 reveal delay-100">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id
                        const c = colorMap[tab.color]
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-bold transition-all duration-300 ${isActive
                                    ? `${c.activeBg} ${c.activeBorder} ${c.text} shadow-sm`
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                                    }`}
                            >
                                <Icon icon={tab.icon} width="20" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Active Tab Content */}
                <div className={`rounded-3xl border p-8 md:p-12 transition-all duration-500 ${colors.activeBg} ${colors.activeBorder}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-start">
                        {/* Left: Description */}
                        <div>
                            <div className={`w-14 h-14 rounded-2xl ${colors.iconBg} ${colors.border} border flex items-center justify-center ${colors.text} mb-6`}>
                                <Icon icon={currentTab.icon} width="28" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight font-sans">
                                {currentTab.title}
                            </h3>
                            <p className="text-slate-500 text-base leading-relaxed font-sans font-light mb-8">
                                {currentTab.description}
                            </p>
                            <a
                                href="mailto:contacto@tuprisma.com?subject=Demo%20Dashboard%20Institucional"
                                className={`inline-flex items-center gap-2 text-sm font-bold font-mono uppercase tracking-widest ${colors.text} hover:opacity-80 transition-opacity`}
                            >
                                Solicitar demo
                                <Icon icon="solar:arrow-right-linear" width="16" />
                            </a>
                        </div>

                        {/* Right: Feature List */}
                        <div className="space-y-4">
                            {currentTab.features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300"
                                >
                                    <div className={`w-6 h-6 rounded-lg ${colors.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                                        <Icon icon="solar:check-circle-bold" width="14" className={colors.text} />
                                    </div>
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed font-sans">
                                        {feature}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
