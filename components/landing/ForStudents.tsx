'use client'

import { GraduationCap, CheckCircle } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function ForStudents() {
    const [ref, isVisible] = useScrollAnimation()

    return (
        <section
            ref={ref}
            id="estudiantes"
            className={`py-24 bg-gradient-to-br from-purple-50 via-white to-purple-50 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                        <GraduationCap className="w-9 h-9 text-white" />
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Para Estudiantes
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Construye tu identidad profesional desde el primer día
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Tu Perfil Vivo</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Cada proyecto, trabajo o experiencia queda documentada con contexto real. No más CVs genéricos que no muestran tu verdadero talento.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Sube tus experiencias y proyectos con imágenes, videos y descripción detallada.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Proceso &gt; Resultado: Muestra cómo piensas y resuelves problemas.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Valida tus habilidades con certificaciones y proyectos reales.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-orange-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">🧩 Encuentra Socios y Co-founders</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Arma tu Dream Team para ese proyecto que tienes en mente, conecta con alumni que ya están donde quieres estar, y construye tu red profesional desde la universidad.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Filtra por skills: Encuentra al colaborador exacto que necesitas.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Match de Co-founders: Conecta con estudiantes que comparten tu visión y ambición.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Mentores Alumni: Valida tu idea con egresados que ya emprendieron.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">🚀 Destaca Ante Empresas</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Cuando llegue el momento de buscar oportunidades laborales, tu perfil en Prisma habla por ti. Haz que los reclutadores te busquen por lo que eres capaz de construir.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Empresas te descubren por tu portafolio completo.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">El respaldo de tu universidad te pone por delante de candidatos externos</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">Recibe propuestas que calzan con tus skills reales, no spam.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
