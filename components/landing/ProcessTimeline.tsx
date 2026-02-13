'use client'

import React from 'react'
import { Icon } from '@iconify/react'

const steps = [
    {
        number: '01',
        icon: 'solar:cloud-upload-linear',
        title: 'Sube lo que haces — y lo que vives',
        description: '¿Terminaste un proyecto? ¿Lideraste un equipo? ¿Resolviste una crisis? En Prisma, tanto tus proyectos técnicos como tus experiencias significativas construyen tu perfil, porque ambos revelan habilidades reales.'
    },
    {
        number: '02',
        icon: 'solar:gallery-favourite-linear',
        title: 'Arma tu vitrina',
        description: 'Elige tus mejores piezas y deja que hablen por ti. Sin ruido, sin relleno.'
    },
    {
        number: '03',
        icon: 'solar:link-round-linear',
        title: 'Agrega evidencia',
        description: 'Links a tu GitHub, Behance, sitio personal... lo que sea que pruebe tu trabajo.'
    },
    {
        number: '04',
        icon: 'solar:share-circle-linear',
        title: 'Comparte tu perfil',
        description: 'Un link, una identidad profesional completa. Así de simple.'
    },
    {
        number: '05',
        icon: 'solar:users-group-two-rounded-linear',
        title: 'Conecta',
        description: 'Explora perfiles afines por área de interés o habilidad. Arma equipos, propón colaboraciones y construye una red basada en lo que sabes hacer, no en a quién conoces.'
    }
]

export const ProcessTimeline = () => {
    return (
        <section id="process" className="py-32 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl mb-24 reveal">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 font-sans">
                        Así funciona Prisma.<br />
                        Sin complicaciones.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className={`group reveal`} style={{ animationDelay: `${index * 0.1}s` }}>
                            {/* Step Number */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">{step.number}</span>
                                <div className="h-px flex-1 bg-slate-100 group-hover:bg-indigo-100 transition-colors"></div>
                            </div>

                            {/* Icon */}
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 mb-6 group-hover:border-indigo-100 group-hover:bg-indigo-50/50 transition-all duration-300 group-hover:-translate-y-1">
                                <Icon icon={step.icon} width="28" className="group-hover:text-indigo-600 transition-colors" />
                            </div>

                            {/* Content */}
                            <h3 className="font-bold text-lg text-slate-900 mb-3 tracking-tight font-sans">{step.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-sans font-light">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
