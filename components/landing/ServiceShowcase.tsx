'use client'

import React from 'react'
import { Icon } from '@iconify/react'

export const ServiceShowcase = () => {
    return (
        <section id="services" className="py-32 bg-slate-50/50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-2xl mb-16 reveal">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4 font-sans">
                        Todo lo que necesitas para destacar.
                    </h2>
                    <p className="text-lg text-slate-500 font-light font-sans">
                        Las herramientas que necesitas para construir, demostrar y compartir tu evidencia profesional.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {/* Card 1: Centralización (Featured — full width) */}
                    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 border border-slate-800 flex flex-col h-full relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-500 shadow-2xl reveal">
                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 p-32 bg-indigo-600 rounded-full blur-[100px] opacity-20 -mr-16 -mt-16 group-hover:opacity-30 transition-opacity duration-700"></div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-indigo-500 transition-all duration-500">
                                <Icon icon="solar:folder-with-files-linear" width="24" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 tracking-tight font-sans">Todo en un solo lugar</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-sans font-light">
                                Centraliza tu evidencia profesional, conecta con talento afín y crea oportunidades propias: colaboraciones, proyectos, equipos. Todo desde un solo perfil.
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Vitrina */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col h-full reveal delay-100 hover:shadow-xl hover:shadow-violet-100/50 hover:border-violet-100 transition-all duration-500 group">
                        <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 mb-8 border border-violet-100 group-hover:scale-110 group-hover:bg-violet-100 transition-all duration-500">
                            <Icon icon="solar:gallery-wide-linear" width="24" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight font-sans">Vitrina de Impacto</h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-sans font-light">
                            Selecciona tus mejores piezas y preséntalas con un diseño editorial que habla por ti.
                        </p>
                    </div>

                    {/* Card 3: Línea del Tiempo */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col h-full reveal delay-200 hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-100 transition-all duration-500 group">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-8 border border-blue-100 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-500">
                            <Icon icon="solar:history-linear" width="24" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight font-sans">Línea del Tiempo Verificada</h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-sans font-light">
                            Tu trayectoria se construye sola. Hitos ordenados cronológicamente que demuestran constancia y evolución.
                        </p>
                    </div>

                    {/* Card 4: Skills */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col h-full reveal delay-300 hover:shadow-xl hover:shadow-emerald-100/50 hover:border-emerald-100 transition-all duration-500 group">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-8 border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-500">
                            <Icon icon="solar:chart-2-linear" width="24" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight font-sans">Snapshot de Habilidades</h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-sans font-light">
                            Tus habilidades técnicas y transversales, respaldadas por evidencia real.
                        </p>
                    </div>

                    {/* Card 5: Explorar Colaboradores */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col h-full reveal delay-300 hover:shadow-xl hover:shadow-amber-100/50 hover:border-amber-100 transition-all duration-500 group">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-8 border border-amber-100 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-500">
                            <Icon icon="solar:users-group-two-rounded-linear" width="24" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight font-sans">Encuentra Colaboradores</h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-sans font-light">
                            Busca talento por habilidad, carrera o universidad. Conecta con personas que complementan lo que sabes hacer y crea oportunidades juntos.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
