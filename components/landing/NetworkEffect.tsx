'use client'

import { GraduationCap, Building2, Briefcase, ArrowRight } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function NetworkEffect() {
    const [ref, isVisible] = useScrollAnimation()

    return (
        <section
            ref={ref}
            className={`py-24 bg-gradient-to-br from-gray-50 to-white transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        El talento se pierde cuando solo importan las notas
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Prisma crea valor para todos conectando a los actores clave del ecosistema universitario-laboral
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Grid de actores */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {/* Estudiantes */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200 transform transition-all hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <GraduationCap className="w-9 h-9 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-center text-gray-900 mb-3">Estudiantes</h3>
                            <p className="text-center text-gray-600 text-sm mb-4">
                                Construyen perfiles profesionales completos y validados
                            </p>
                            <div className="space-y-2 text-xs text-gray-600">
                                <div className="flex items-center">
                                    <ArrowRight className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
                                    <span>Documentan experiencias, proyectos y portafolios</span>
                                </div>
                                <div className="flex items-center">
                                    <ArrowRight className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
                                    <span>Encuentran Co-founders y socios</span>
                                </div>
                                <div className="flex items-center">
                                    <ArrowRight className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
                                    <span>Conectan con oportunidades laborales</span>
                                </div>
                            </div>
                        </div>

                        {/* Universidades */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200 transform transition-all hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <Building2 className="w-9 h-9 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-center text-gray-900 mb-3">Universidades</h3>
                            <p className="text-center text-gray-600 text-sm mb-4">
                                Potencian empleabilidad y visibilizan su impacto
                            </p>
                            <div className="space-y-2 text-xs text-gray-600">
                                <div className="flex items-center">
                                    <ArrowRight className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                                    <span>Validan estudiantes</span>
                                </div>
                                <div className="flex items-center">
                                    <ArrowRight className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                                    <span>Activan red alumni</span>
                                </div>
                                <div className="flex items-center">
                                    <ArrowRight className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                                    <span>Mejoran rankings</span>
                                </div>
                            </div>
                        </div>

                        {/* Empresas */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-cyan-200 transform transition-all hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <Briefcase className="w-9 h-9 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-center text-gray-900 mb-3">Empresas</h3>
                            <p className="text-center text-gray-600 text-sm mb-4">
                                Descubren talento validado y reducen costos
                            </p>
                            <div className="space-y-2 text-xs text-gray-600">
                                <div className="flex items-center">
                                    <ArrowRight className="w-4 h-4 text-cyan-600 mr-2 flex-shrink-0" />
                                    <span>Acceden a perfiles reales</span>
                                </div>
                                <div className="flex items-center">
                                    <ArrowRight className="w-4 h-4 text-cyan-600 mr-2 flex-shrink-0" />
                                    <span>Reducen tiempo screening</span>
                                </div>
                                <div className="flex items-center">
                                    <ArrowRight className="w-4 h-4 text-cyan-600 mr-2 flex-shrink-0" />
                                    <span>Mejoran contratación</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ciclo virtuoso */}
                    <div className="rounded-2xl p-6 md:p-8">
                        <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">El Ciclo Virtuoso de Prisma</h3>

                        {/* Desktop version */}
                        <div className="hidden md:block relative w-full max-w-2xl mx-auto" style={{ minHeight: '420px' }}>
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" fill="rgba(75, 85, 99, 0.7)">
                                        <polygon points="0 0, 10 3, 0 6" />
                                    </marker>
                                </defs>
                                <circle cx="300" cy="210" r="95" fill="none" stroke="rgba(156, 163, 175, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
                                <path d="M 300 50 Q 170 120, 150 280" fill="none" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowhead)" />
                                <path d="M 180 310 Q 300 370, 420 310" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowhead)" />
                                <path d="M 450 280 Q 430 120, 300 50" fill="none" stroke="rgba(0, 184, 200, 0.5)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowhead)" />
                            </svg>

                            {/* Centro */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center border-2 border-gray-300 shadow-xl z-20">
                                <div className="text-center">
                                    <div className="text-2xl mb-0.5">🔄</div>
                                    <div className="text-[10px] font-bold leading-tight text-gray-700">Efecto<br />de Red</div>
                                </div>
                            </div>

                            {/* Estudiantes - Arriba */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-48 z-30" style={{ top: '10px' }}>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3.5 border-2 border-purple-300 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-2 shadow-md">
                                            <GraduationCap className="w-6 h-6 text-white" />
                                        </div>
                                        <p className="text-sm font-bold mb-1 text-gray-900">Estudiantes</p>
                                        <p className="text-[11px] leading-snug text-gray-700">
                                            Crean perfiles → <strong>más valor para universidades</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Universidades - Abajo Izquierda */}
                            <div className="absolute z-30" style={{ bottom: '15px', left: '40px', width: '190px' }}>
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3.5 border-2 border-blue-300 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-2 shadow-md">
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>
                                        <p className="text-sm font-bold mb-1 text-gray-900">Universidades</p>
                                        <p className="text-[11px] leading-snug text-gray-700">
                                            Validan → <strong>más confianza para empresas</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Empresas - Abajo Derecha */}
                            <div className="absolute z-30" style={{ bottom: '15px', right: '40px', width: '190px' }}>
                                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-3.5 border-2 border-cyan-300 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mb-2 shadow-md">
                                            <Briefcase className="w-6 h-6 text-white" />
                                        </div>
                                        <p className="text-sm font-bold mb-1 text-gray-900">Empresas</p>
                                        <p className="text-[11px] leading-snug text-gray-700">
                                            Buscan talento → <strong>más oportunidades para estudiantes</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile version */}
                        <div className="md:hidden space-y-3">
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-300 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                        <GraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm mb-0.5 text-gray-900">Estudiantes</p>
                                        <p className="text-xs leading-relaxed text-gray-700">Crean perfiles → <strong>más valor</strong></p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <div className="text-4xl text-gray-400">↓</div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-300 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm mb-0.5 text-gray-900">Universidades</p>
                                        <p className="text-xs leading-relaxed text-gray-700">Validan → <strong>más confianza</strong></p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <div className="text-4xl text-gray-400">↓</div>
                            </div>

                            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 border-2 border-cyan-300 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                        <Briefcase className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm mb-0.5 text-gray-900">Empresas</p>
                                        <p className="text-xs leading-relaxed text-gray-700">Buscan talento → <strong>más oportunidades</strong></p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center pt-1">
                                <div className="text-4xl text-gray-400 mb-2">🔄</div>
                                <p className="text-xs font-semibold text-gray-700">Y el ciclo se fortalece continuamente</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
