'use client'

import React from 'react'
import { Icon } from '@iconify/react'

export const ServiceShowcase = () => {
    return (
        <section id="services" className="py-32 px-6 bg-slate-50/50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-16 reveal font-sans">
                    Todo lo que necesitas para destacar.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Card 1: Centralización (Featured) */}
                    <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 flex flex-col h-full relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-500 shadow-2xl reveal">
                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 p-32 bg-indigo-600 rounded-full blur-[100px] opacity-20 -mr-16 -mt-16 group-hover:opacity-30 transition-opacity duration-700"></div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-indigo-500 transition-all duration-500">
                                <Icon icon="solar:folder-with-files-linear" width="24" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 tracking-tight font-sans">Todo en Un Solo Lugar</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-sans font-light">
                                Olvídate de dispersar tu trabajo en mil plataformas. Registra proyectos, enlaza repositorios, conecta tus portafolios personales y descubre talento afín para impulsar colaboraciones que multipliquen tu impacto.
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Vitrina */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col h-full reveal delay-100 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-500 group">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 mb-8 border border-slate-100 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-500">
                            <Icon icon="solar:gallery-wide-linear" width="24" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight font-sans">Vitrina de Impacto Curada</h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-sans font-light">
                            Sube tus proyectos o experiencias y selecciona los más significativos para mostrar en Mi Vitrina. Muestra tu mejor trabajo con un diseño editorial de alto nivel.
                        </p>
                    </div>

                    {/* Card 3: Línea del Tiempo */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col h-full reveal delay-200 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-500 group">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 mb-8 border border-slate-100 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-500">
                            <Icon icon="solar:history-linear" width="24" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight font-sans">Línea del Tiempo Verificada</h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-sans font-light">
                            Tu trayectoria profesional se construye sola. Hitos académicos, laborales y sociales ordenados cronológicamente para demostrar constancia y evolución verificable.
                        </p>
                    </div>

                    {/* Card 4: Skills */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col h-full reveal delay-300 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-500 group">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 mb-8 border border-slate-100 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-500">
                            <Icon icon="solar:chart-2-linear" width="24" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight font-sans">Snapshot de Habilidades</h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-sans font-light">
                            Visualización dinámica de tus Hard y Soft Skills basada en tu evidencia real. No más listas vacías; demuestra tu dominio a través de tus proyectos y experiencias.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
