import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative bg-gradient-to-br from-purple-800 via-purple-700 to-cyan-500 py-24 lg:py-40 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-5xl mx-auto">
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight animate-fade-in-up">
                        Tu experiencia universitaria merece más que un CV de una página
                    </h1>

                    <p className="text-xl lg:text-2xl text-purple-50 mb-10 leading-relaxed max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
                        Prisma es la plataforma donde estudiantes universitarios construyen perfiles profesionales integrales, conectan con oportunidades reales, y encuentran colaboradores para crear juntos.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10 animate-fade-in-up animation-delay-400">
                        <Link
                            href="/login"
                            className="group px-8 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform flex items-center justify-center"
                        >
                            Crear mi Perfil
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#demo"
                            className="px-8 py-4 bg-cyan-500/90 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-cyan-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform border-2 border-white/20"
                        >
                            Ver Cómo Funciona
                        </a>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-purple-50 text-sm animate-fade-in-up animation-delay-600">
                        <span className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                            <CheckCircle className="w-5 h-5 mr-2 text-cyan-300" />
                            Gratis para estudiantes
                        </span>
                        <span className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                            <CheckCircle className="w-5 h-5 mr-2 text-cyan-300" />
                            Perfiles verificados
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
