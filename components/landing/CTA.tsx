'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function CTA() {
    const [ref, isVisible] = useScrollAnimation()

    return (
        <section
            ref={ref}
            id="cta"
            className={`py-24 bg-gradient-to-br from-purple-800 via-purple-600 to-cyan-500 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        Únete al Futuro del Talento Universitario
                    </h2>
                    <p className="text-xl text-cyan-50 leading-relaxed mb-6">
                        Crea tu perfil profesional hoy y conecta con oportunidades reales.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-white/90 mb-10">
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            ✨ Gratis para estudiantes
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            🚀 Perfiles verificados
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            🤝 Conecta con empresas
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Comienza ahora
                        </h3>
                        <p className="text-gray-600">
                            Crea tu perfil en menos de 5 minutos
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            href="/login"
                            className="group w-full bg-gradient-to-r from-purple-700 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-800 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            Crear mi Perfil Gratis
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/login"
                            className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
                        >
                            Ya tengo cuenta - Ingresar
                        </Link>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>Al registrarte, aceptas nuestros términos de servicio.</p>
                        <p className="mt-2">Respetamos tu privacidad. 💎</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
