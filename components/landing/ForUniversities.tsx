'use client'

import { Building2, CheckCircle } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function ForUniversities() {
    const [ref, isVisible] = useScrollAnimation()

    return (
        <section
            ref={ref}
            id="universidades"
            className={`py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
                        <Building2 className="w-9 h-9 text-white" />
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Para Universidades
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Potencia la empleabilidad de tu institución y destaca el talento de tus estudiantes
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">📊 Visibilidad de Resultados</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Muestra al mundo el verdadero impacto de tu educación a través de los perfiles de tus estudiantes.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Showcase institucional con proyectos destacados.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Métricas de empleabilidad en tiempo real.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Historias de éxito de egresados documentadas.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">🤝 Red Alumni Activa</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Crea una comunidad donde egresados exitosos mentorean a estudiantes actuales, fortaleciendo tu red institucional.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Conecta estudiantes con alumni por carrera e industria.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Programas de mentoría integrados en la plataforma.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Engagement continuo con tu comunidad egresada.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">💼 Conexión con Empleadores</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Las empresas buscan talento directamente en tu institución, aumentando las oportunidades para tus estudiantes.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Empresas acceden a perfiles validados por tu institución.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Tracking de colocación laboral de egresados.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Ferias de empleo virtuales integradas.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
