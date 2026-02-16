'use client'

import React, { useState } from 'react'
import { Icon } from '@iconify/react'

const sources = [
    {
        id: 1,
        label: 'Randstad/WEF, 2024',
        url: 'https://www.weforum.org/stories/2025/09/gen-z-are-competitive-job-market-randstad/'
    },
    {
        id: 2,
        label: 'Emol / INE Chile, 2025',
        url: 'https://www.emol.com/noticias/Economia/2025/08/10/1174521/silenciosa-crisis-laboral-jovenes.html'
    }
]

const features = [
    {
        icon: 'solar:ghost-linear',
        title: 'El "Agujero Negro" de las aplicaciones',
        description: 'Cientos de PDFs contra algoritmos que buscan palabras clave, no talento. Si tu perfil se ve como el de todos, eres invisible.'
    },
    {
        icon: 'solar:shield-warning-linear',
        title: 'La crisis de la credencial pura',
        description: 'Un título ya no es garantía. Las empresas quieren ver lo que has hecho, no lo que dices saber. Y la IA ya hace lo que antes hacía un junior.'
    },
    {
        icon: 'solar:users-group-rounded-linear',
        title: 'La homogeneidad del talento',
        description: 'Tus habilidades blandas, tu resiliencia y tu historia quedan invisibles en un formato que iguala a todo el mundo.'
    },
    {
        icon: 'solar:hourglass-linear',
        title: 'La trampa de la reactividad',
        description: 'Armar tu perfil después de graduarte es llegar tarde. El mercado premia a quien construye desde el día uno y crea sus propias oportunidades.'
    }
]

const SourceRef = ({ id }: { id: number }) => {
    const source = sources.find(s => s.id === id)
    if (!source) return null
    return (
        <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-4 h-4 text-[9px] font-mono font-bold text-indigo-400 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full -translate-y-1 ml-0.5 transition-colors cursor-pointer no-underline"
            title={source.label}
        >
            {id}
        </a>
    )
}

export const FeatureGrid = () => {
    const [showSources, setShowSources] = useState(false)

    return (
        <section className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-2xl mb-24 reveal">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 font-sans">
                        El mercado laboral cambió.<br />
                        Es tiempo de adaptarse.
                    </h2>
                    <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed font-sans">
                        Las vacantes junior cayeron un <span className="text-indigo-600 font-semibold text-2xl">29%</span> a nivel global<SourceRef id={1} />.
                        En Chile, solo el <span className="text-indigo-600 font-semibold text-2xl">38%</span> de los jóvenes que buscan empleo lo encuentran<SourceRef id={2} />.
                        Aplicar a cientos de posiciones ya no funciona.
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

                {/* Collapsible Sources */}
                <div className="mt-20 reveal">
                    <button
                        onClick={() => setShowSources(!showSources)}
                        className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors"
                    >
                        <Icon
                            icon="solar:document-text-linear"
                            width="14"
                            className={`transition-transform duration-300 ${showSources ? 'rotate-12' : ''}`}
                        />
                        Fuentes
                        <Icon
                            icon="solar:alt-arrow-down-linear"
                            width="12"
                            className={`transition-transform duration-300 ${showSources ? 'rotate-180' : ''}`}
                        />
                    </button>
                    <div className={`overflow-hidden transition-all duration-400 ease-in-out ${showSources ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                        <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-400 font-sans">
                            {sources.map(source => (
                                <li key={source.id}>
                                    <a
                                        href={source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-indigo-500 transition-colors underline underline-offset-2"
                                    >
                                        {source.label}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    )
}
