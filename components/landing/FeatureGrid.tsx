'use client'

import React from 'react'
import { Icon } from '@iconify/react'

const features = [
    {
        icon: 'solar:ghost-linear',
        title: 'El "Agujero Negro" de las aplicaciones',
        description: 'Enviar cientos de PDFs genéricos es una batalla perdida contra algoritmos (ATS) que buscan palabras clave, no talento. Si tu perfil se ve como el de todos, eres invisible por definición.'
    },
    {
        icon: 'solar:shield-warning-linear',
        title: 'La crisis de la credencial pura',
        description: 'Un título universitario ya no es garantía de confianza. En un mercado incierto, las empresas han pasado de "creer en lo que dices" a "necesitar ver lo que has hecho". La palabra no basta, la evidencia sí.'
    },
    {
        icon: 'solar:users-group-rounded-linear',
        title: 'La homogeneidad del talento',
        description: 'El CV tradicional aplana tu historia. Tus habilidades transversales, tu capacidad de aprendizaje y tu resiliencia quedan ocultas tras un formato rígido que te hace ver exactamente igual a otros 10,000 egresados.'
    },
    {
        icon: 'solar:hourglass-linear',
        title: 'La trampa de la reactividad',
        description: 'Construir tu perfil después de graduarte es llegar tarde. El nuevo mercado premia a quien construye trayectoria desde el día uno. Esperar a que una empresa te "descubra" es ceder el control de tu carrera.'
    }
]

export const FeatureGrid = () => {
    return (
        <section className="py-32 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl mb-24 reveal">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 font-sans">
                        El mercado laboral cambió.<br />
                        Es tiempo de adaptarse.
                    </h2>
                    <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed font-sans">
                        Con <span className="text-indigo-600 font-semibold text-2xl">39%</span> menos trabajos junior disponibles, aplicar a cientos de posiciones ya no funciona.
                        Necesitas demostrar tu valor con evidencia verificable y crear tus propias oportunidades.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
                    {features.map((feature, index) => (
                        <div key={index} className={`group reveal delay-${(index + 1) * 100}`}>
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 mb-8 group-hover:border-indigo-100 group-hover:bg-indigo-50/50 transition-all duration-300 group-hover:-translate-y-1">
                                <Icon icon={feature.icon} width="28" className="group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-3 tracking-tight font-sans italic">{feature.title}</h3>
                            <p className="text-base text-slate-500 leading-relaxed font-sans font-light">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
