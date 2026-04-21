'use client'

import React from 'react'
import { Icon } from '@iconify/react'

const advantages = [
    {
        icon: 'solar:pulse-2-linear',
        title: 'Datos vivos, no encuestas post-facto',
        description: 'La información se genera mientras los estudiantes construyen sus perfiles. No necesitas esperar al egreso para saber qué hacen.'
    },
    {
        icon: 'solar:user-check-rounded-linear',
        title: 'Construido por los propios estudiantes',
        description: 'Cada proyecto, experiencia y competencia es cargada por el propio alumno con evidencia real. No hay intermediarios ni formularios institucionales.'
    },
    {
        icon: 'solar:tuning-2-linear',
        title: 'Filtros cruzados e instantáneos',
        description: 'Carrera, año de ingreso, género, tipo de contenido — combina los filtros que necesites y obtén respuestas en tiempo real.'
    },
    {
        icon: 'solar:verified-check-linear',
        title: 'Badge institucional',
        description: 'Los estudiantes vinculados a tu universidad lucen un badge verificado en su perfil público, fortaleciendo la marca institucional ante empleadores.'
    },
    {
        icon: 'solar:lock-password-unlocked-linear',
        title: 'Sin fricción para el estudiante',
        description: 'El estudiante usa Prisma para construir su marca profesional. Los datos del dashboard son un subproducto natural — no una carga adicional.'
    },
    {
        icon: 'solar:share-circle-linear',
        title: 'Acceso multi-usuario',
        description: 'Crea cuentas de owner, admin o viewer para distintos equipos de tu institución (empleabilidad, decanato, acreditación).'
    }
]

export const UniversityAdvantages = () => {
    return (
        <section className="py-32 bg-slate-50/50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-20 reveal">
                    <p className="text-[14px] font-mono font-bold text-indigo-500 uppercase tracking-[0.3em] mb-8">
                        ¿Por qué Prisma?
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-8 font-sans leading-tight">
                        No es otro formulario.<br />
                        Es inteligencia que se construye sola.
                    </h2>
                    <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed font-sans max-w-2xl mx-auto">
                        La diferencia clave de Prisma es que los datos del dashboard son un subproducto de algo que el estudiante ya quiere hacer: construir su portafolio profesional. Sin fricción, sin encuestas, sin pedir permiso.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {advantages.map((adv, index) => (
                        <div
                            key={index}
                            className="group reveal bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg hover:border-indigo-100 transition-all duration-500"
                            style={{ animationDelay: `${index * 0.08}s` }}
                        >
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:scale-110 group-hover:from-indigo-100 group-hover:to-violet-100 transition-all duration-500">
                                    <Icon icon={adv.icon} width="24" />
                                </div>
                                <h3 className="font-bold text-slate-900 tracking-tight font-sans text-base">
                                    {adv.title}
                                </h3>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed font-sans font-light pl-16">
                                {adv.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
