'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const faqs = [
    {
        q: '¿Qué es exactamente Prisma?',
        a: 'Prisma es una plataforma donde estudiantes universitarios construyen perfiles profesionales completos que van más allá del CV tradicional. Incluye proyectos, habilidades, experiencias, y conexiones con alumni y empresas.',
    },
    {
        q: '¿Es solo para carreras técnicas?',
        a: 'No. Prisma funciona para TODAS las carreras: ingeniería, diseño, derecho, medicina, negocios, artes, etc. El concepto es universal: mostrar tu trabajo más allá de las notas.',
    },
    {
        q: '¿Cuándo estará disponible?',
        a: 'Estamos en desarrollo activo y lanzaremos una beta en los próximos meses. Los que se unan a la lista de espera tendrán acceso prioritario.',
    },
    {
        q: '¿Tiene algún costo?',
        a: 'Los early adopters tendrán acceso gratuito. Posteriormente, habrá un tier gratuito con funciones básicas y opciones premium para features avanzados.',
    },
    {
        q: 'Para Universidades: ¿Cómo funciona la integración institucional?',
        a: 'Trabajamos contigo para integrar Prisma con tus sistemas. Los estudiantes crean perfiles que tu universidad puede validar, creando un showcase institucional de talento. Incluye dashboard de métricas de empleabilidad y herramientas de gestión alumni.',
    },
    {
        q: 'Para Empresas: ¿Cómo accedo a los perfiles de talento?',
        a: 'Las empresas obtienen acceso a nuestra plataforma de búsqueda inteligente. Pueden filtrar candidatos por proyectos reales, habilidades validadas, universidad, y más. También pueden publicar oportunidades que llegan directamente a estudiantes que cumplen el perfil.',
    },
    {
        q: '¿Cómo se diferencia de LinkedIn?',
        a: 'LinkedIn es genérico para todos los profesionales. Prisma está diseñado específicamente para estudiantes y early-career, con enfoque en proyectos académicos, validación institucional, y conexión con tu comunidad universitaria.',
    },
    {
        q: '¿Puedo usarlo si ya me gradué?',
        a: 'Sí! Los alumni pueden mantener su perfil activo, convertirse en mentores de estudiantes actuales, y seguir conectados con su comunidad universitaria.',
    },
    {
        q: 'Para Universidades: ¿Qué datos y métricas obtendré?',
        a: 'Tendrás acceso a métricas de empleabilidad de tus egresados, engagement de la red alumni, proyectos destacados por carrera, y más. Todo en tiempo real y con visualizaciones intuitivas.',
    },
    {
        q: '¿Mi universidad necesita estar asociada?',
        a: 'No necesariamente. Estamos comenzando con universidades partner, pero cualquier estudiante puede crear su perfil. La asociación institucional solo añade validación adicional.',
    },
    {
        q: '¿Cómo protegen mis datos?',
        a: 'Cumplimos con todas las leyes de protección de datos. Tú controlas qué información es pública o privada. Tus datos nunca se venden a terceros.',
    },
]

export default function FAQ() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const [ref, isVisible] = useScrollAnimation()

    return (
        <section
            ref={ref}
            className={`py-24 bg-gray-50 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 text-center mb-16 tracking-tight">
                    Preguntas Frecuentes
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200 rounded-xl"
                            >
                                <span className="font-semibold text-gray-900 pr-8">{faq.q}</span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${openFaq === idx ? 'transform rotate-180' : ''
                                        }`}
                                />
                            </button>
                            {openFaq === idx && (
                                <div className="px-6 pb-4">
                                    <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
