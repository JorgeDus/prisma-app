'use client'

import React from 'react'
import { Icon } from '@iconify/react'

export const UniversityHero = () => {
    return (
        <section id="hero-uni" className="relative pt-32 pb-20 md:pt-48 md:pb-32 border-b border-zinc-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/60 via-white to-white overflow-hidden">

            {/* Background Icon */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
                <img
                    src="/Prisma Icono.png"
                    alt=""
                    className="w-[800px] h-[800px] object-contain grayscale md:w-[1200px] md:h-[1200px]"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 lg:gap-20 items-center">

                {/* Content */}
                <div className="max-w-2xl fade-enter">
                    {/* Badge Audiencia */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span className="text-[10px] sm:text-xs font-mono font-bold text-indigo-700 uppercase tracking-widest px-1">
                            Para instituciones educativas
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-6 font-sans">
                        Inteligencia<br />
                        estudiantil en<br />
                        tiempo real.
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-lg mb-10 font-sans">
                        Un dashboard institucional que transforma la actividad de tus estudiantes en datos accionables: competencias, producción y diversidad — todo en un solo lugar.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="mailto:contacto@tuprisma.com?subject=Demo%20Dashboard%20Institucional" className="inline-flex justify-center items-center h-12 px-8 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 font-mono uppercase tracking-widest">
                            Agenda una demo
                            <Icon icon="solar:arrow-right-linear" className="ml-2" width="18" />
                        </a>
                        <a href="#dashboard" className="inline-flex justify-center items-center h-12 px-8 bg-white text-slate-600 border border-slate-200 text-sm font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-mono uppercase tracking-widest">
                            Conoce el dashboard
                        </a>
                    </div>
                </div>

                {/* Visual — Dashboard Placeholder */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/50 fade-enter delay-200 bg-gradient-to-br from-slate-50 to-slate-100">
                    {/* Placeholder badge */}
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest">Dashboard institucional</span>
                    </div>

                    {/* Placeholder content */}
                    <div className="flex flex-col items-center justify-center min-h-[320px] md:min-h-[420px] p-12">
                        <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6">
                            <Icon icon="solar:chart-square-linear" width="40" className="text-indigo-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
                            Captura del dashboard
                        </p>
                        <p className="text-xs text-slate-300 font-sans font-light text-center max-w-xs">
                            Aquí irá una imagen real del portal de inteligencia estudiantil
                        </p>
                    </div>

                    {/* Bottom label */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/60 via-slate-900/30 to-transparent p-6 pt-12">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-bold text-sm font-sans">Portal de Inteligencia</p>
                                <p className="text-white/70 text-xs font-sans font-light">Vista en tiempo real de tus estudiantes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
