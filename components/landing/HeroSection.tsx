'use client'

import React from 'react'
import { Icon } from '@iconify/react'

export const HeroSection = () => {
    return (
        <section id="home" className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 border-b border-zinc-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-50 via-white to-white overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                {/* Content */}
                <div className="max-w-2xl fade-enter">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest">Protocolo Beta Vivo</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-6 font-sans">
                        Demuestra tu valor.<br />
                        Crea tus oportunidades.
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-lg mb-10 font-sans">
                        Prisma no es donde buscas trabajo. Es donde construyes evidencia de que vales la pena.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="#register" className="inline-flex justify-center items-center h-12 px-8 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 font-mono uppercase tracking-widest">
                            Empezar Trayectoria
                            <Icon icon="solar:arrow-right-linear" className="ml-2" width="18" />
                        </a>
                        <a href="#process" className="inline-flex justify-center items-center h-12 px-8 bg-white text-slate-600 border border-slate-200 text-sm font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-mono uppercase tracking-widest">
                            Ver Metodología
                        </a>
                    </div>
                </div>

                {/* Visual */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50 fade-enter delay-200 group bg-slate-50 h-[500px]">
                    <img
                        src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop"
                        alt="Trayectoria Profesional"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
                    />

                    {/* Floating Element - Impact Capsule */}
                    <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-80 bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-white/50 shadow-xl ring-1 ring-slate-900/5 transition-transform hover:-translate-y-1">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 border border-indigo-200/50 shadow-sm shrink-0">
                                <Icon icon="solar:stars-minimalistic-linear" width="20" />
                            </div>
                            <div>
                                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Cápsula de Impacto</div>
                                <div className="text-sm text-slate-800 leading-snug font-sans">"Liderazgo de proyecto con un retorno social del 40% en 6 meses."</div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Floating Element */}
                    <div className="absolute top-8 right-8 bg-indigo-600/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl flex items-center gap-2">
                        <Icon icon="solar:shield-check-linear" className="text-white" width="16" />
                        <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Evidencia Verificada</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
