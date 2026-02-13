'use client'

import React, { useState } from 'react'
import { Icon } from '@iconify/react'

const faqs = [
    {
        question: '¿Prisma es gratis?',
        answer: 'Sí. Crear tu perfil, subir proyectos y experiencias, y compartir tu perfil es completamente gratis.'
    },
    {
        question: '¿Esto reemplaza mi CV?',
        answer: 'No lo reemplaza, lo complementa. Prisma es tu evidencia viva: lo que el CV dice, Prisma lo demuestra. Puedes incluir el link de tu perfil Prisma en tu CV.'
    },
    {
        question: '¿Quién puede ver mi perfil?',
        answer: 'Tu perfil público es visible para cualquiera que tenga tu link. Tú controlas qué proyectos y experiencias se muestran en tu Vitrina.'
    },
    {
        question: '¿Necesito ser de tecnología para usar Prisma?',
        answer: 'No. Prisma es para cualquier persona que quiera demostrar su valor profesional con evidencia real, sin importar su área. Diseñadores, comunicadores, ingenieros, administradores — todos tienen proyectos y experiencias que contar.'
    },
    {
        question: '¿En qué se diferencia de LinkedIn?',
        answer: 'LinkedIn es una red social con perfil estático. Prisma es una plataforma de evidencia profesional: te permite curar tus mejores trabajos, verificar tu trayectoria y conectar con talento afín basado en habilidades reales, no en conexiones superficiales.'
    },
    {
        question: '¿Puedo conectar mis repositorios o portafolios externos?',
        answer: 'Sí. Puedes enlazar tu GitHub, Behance, sitio personal o cualquier recurso externo directamente desde tus proyectos y tu perfil.'
    },
    {
        question: '¿Mis datos están seguros?',
        answer: 'Absolutamente. No compartimos tu información personal con terceros sin tu consentimiento. Usamos conexiones cifradas, autenticación segura y tú tienes control total sobre qué es visible en tu perfil. Puedes leer nuestra <a href="/privacidad" class="text-indigo-600 hover:text-indigo-700 underline underline-offset-2">Política de Privacidad</a> completa.'
    }
]

export const LandingFAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section id="faq" className="py-32 px-6 bg-slate-50/50 border-y border-slate-100">
            <div className="max-w-3xl mx-auto">
                <div className="mb-16 reveal">
                    <p className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-[0.3em] mb-4">
                        Preguntas Frecuentes
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 font-sans">
                        ¿Tienes dudas?
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="reveal bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:border-slate-300"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <button
                                onClick={() => toggle(index)}
                                className="w-full flex items-center justify-between p-6 text-left group"
                            >
                                <span className="font-bold text-slate-900 font-sans pr-4">{faq.question}</span>
                                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-indigo-50 text-indigo-600 rotate-45' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                                    <Icon icon="solar:add-circle-linear" width="20" />
                                </div>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <p
                                    className="px-6 pb-6 text-sm text-slate-500 leading-relaxed font-sans font-light"
                                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
