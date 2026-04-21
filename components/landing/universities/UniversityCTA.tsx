'use client'

import React from 'react'
import { Icon } from '@iconify/react'

export const UniversityCTA = () => {
    return (
        <section className="py-32 bg-white border-b border-slate-100">
            <div className="max-w-3xl mx-auto px-6 text-center reveal">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
                    <Icon icon="solar:calendar-linear" width="14" className="text-indigo-600" />
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-indigo-700 uppercase tracking-widest px-1">
                        Demo personalizada
                    </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6 font-sans">
                    ¿Quieres ver el dashboard<br />
                    con los datos de tu universidad?
                </h2>

                <p className="text-lg text-slate-500 font-light font-sans max-w-xl mx-auto mb-10">
                    Agenda una demo de 20 minutos y te mostramos cómo Prisma puede transformar la manera en que tu institución entiende a sus estudiantes.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="mailto:contacto@tuprisma.com?subject=Demo%20Dashboard%20Institucional&body=Hola%2C%20me%20interesa%20conocer%20el%20dashboard%20institucional%20de%20Prisma%20para%20nuestra%20universidad."
                        className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white text-sm font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Agenda una demo
                        <Icon icon="solar:arrow-right-linear" width="18" />
                    </a>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-600 border border-slate-200 text-sm font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                        Conoce Prisma
                    </a>
                </div>

                <p className="text-xs text-slate-400 font-mono mt-8">
                    contacto@tuprisma.com
                </p>
            </div>
        </section>
    )
}
