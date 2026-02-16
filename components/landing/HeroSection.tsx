'use client'

import React from 'react'
import { Icon } from '@iconify/react'

export const HeroSection = () => {
    return (
        <section id="home" className="pt-32 pb-20 md:pt-48 md:pb-32 border-b border-zinc-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-50 via-white to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 lg:gap-20 items-center">

                {/* Content */}
                <div className="max-w-2xl fade-enter">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-6 font-sans">
                        Demuestra tu valor.<br />
                        Crea tus oportunidades.
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-lg mb-10 font-sans">
                        Prisma no es donde buscas trabajo. Es donde construyes la evidencia de lo que vales, y encuentras a quienes quieres construir contigo.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="/login" className="inline-flex justify-center items-center h-12 px-8 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 font-mono uppercase tracking-widest">
                            Crea tu perfil
                            <Icon icon="solar:arrow-right-linear" className="ml-2" width="18" />
                        </a>
                        <a href="#process" className="inline-flex justify-center items-center h-12 px-8 bg-white text-slate-600 border border-slate-200 text-sm font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-mono uppercase tracking-widest">
                            Cómo funciona
                        </a>
                    </div>
                </div>

                {/* Visual — Live Demo */}
                <a
                    href="https://www.tuprisma.com/elenasolis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/50 fade-enter delay-200 group bg-white block hover:shadow-indigo-100/80 transition-all duration-500"
                >
                    {/* Live badge */}
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest">Perfil en vivo</span>
                    </div>

                    {/* Profile Demo Video */}
                    <video
                        src="/Perfil ES 2.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />

                    {/* Bottom label */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent p-6 pt-16">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-bold text-sm font-sans">Elena Solís</p>
                                <p className="text-white/70 text-xs font-sans font-light">Perfil de ejemplo real</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/80 group-hover:text-white transition-colors">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Ver perfil</span>
                                <Icon icon="solar:arrow-right-linear" width="14" />
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </section>
    )
}
