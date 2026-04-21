'use client'

import React from 'react'
import { Icon } from '@iconify/react'

const painPoints = [
    {
        icon: 'solar:eye-closed-linear',
        title: 'Poca visibilidad extracurricular',
        description: 'Voluntariados, liderazgos, emprendimientos, proyectos personales — experiencias que definen a tus estudiantes pero que hoy no quedan registradas en ningún sistema.'
    },
    {
        icon: 'solar:chart-square-linear',
        title: 'Datos de empleabilidad fragmentados',
        description: 'Las encuestas de egreso llegan tarde y con baja respuesta. Es difícil tener una radiografía clara de dónde trabajan tus egresados, en qué sectores y con qué competencias.'
    },
    {
        icon: 'solar:clipboard-remove-linear',
        title: 'Impacto difícil de medir',
        description: 'Demostrar que tus programas de formación integral funcionan requiere datos longitudinales de actividad estudiantil. Sin ellos, el impacto queda en lo anecdótico.'
    },
    {
        icon: 'solar:document-text-linear',
        title: 'Reportes estáticos, decisiones lentas',
        description: 'Los informes semestrales son una fotografía del pasado. Datos dinámicos, filtrables y cruzados permiten tomar decisiones en el momento correcto.'
    }
]

export const UniversityPainPoints = () => {
    return (
        <section className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-2xl mb-24 reveal">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 font-sans">
                        ¿Qué sabes realmente<br />
                        de tus estudiantes?
                    </h2>
                    <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed font-sans">
                        La trayectoria real de un estudiante rara vez queda registrada. Prisma lo cambia: <strong className="font-semibold text-slate-600">datos construidos por los propios alumnos, que revelan lo que los sistemas tradicionales no ven.</strong>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
                    {painPoints.map((point, index) => (
                        <div key={index} className={`group reveal`} style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 mb-8 group-hover:border-indigo-100 group-hover:bg-indigo-50/50 transition-all duration-300 group-hover:-translate-y-1">
                                <Icon icon={point.icon} width="28" className="group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-3 tracking-tight font-sans italic">{point.title}</h3>
                            <p className="text-base text-slate-500 leading-relaxed font-sans font-light">
                                {point.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
