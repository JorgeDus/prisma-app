'use client'

import { Briefcase, CheckCircle } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function ForCompanies() {
    const [ref, isVisible] = useScrollAnimation()

    return (
        <section
            ref={ref}
            id="empresas"
            className={`py-24 bg-gradient-to-br from-cyan-50 via-white to-cyan-50 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl mb-6 shadow-lg">
                        <Briefcase className="w-9 h-9 text-white" />
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Para Empresas
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Descubre y recluta talento joven validado institucionalmente
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-cyan-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Reclutamiento Inteligente</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Busca candidatos por proyectos reales, habilidades demostradas y fit cultural, no solo por palabras clave en un CV.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-cyan-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Filtros por proyectos específicos y habilidades validadas</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-cyan-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Perfiles verificados por instituciones educativas</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-cyan-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Ve el trabajo real antes de la entrevista</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-cyan-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">⚡ Acceso Anticipado</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            No esperes a que se gradúen. Identifica talento prometedor desde etapas tempranas y conviértete en su primera opción.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-cyan-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Programa de pasantías con estudiantes destacados</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-cyan-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Marca empleadora visible para nuevas generaciones</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-cyan-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Pipeline de talento continuo</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-cyan-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">💰 Reducción de Costos</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Menos tiempo y recursos invertidos en procesos de selección. Mejor calidad de candidatos desde el primer filtro.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-cyan-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Reduce tiempo de screening en 70%</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-cyan-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Mayor retención por mejor fit inicial</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-cyan-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Elimina intermediarios costosos</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
