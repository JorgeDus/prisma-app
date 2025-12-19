'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function UseCases() {
    const [ref, isVisible] = useScrollAnimation()

    return (
        <section
            ref={ref}
            className={`py-24 bg-gradient-to-br from-purple-50 to-cyan-50 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 text-center mb-6 tracking-tight">
                    Historias que queremos hacer realidad
                </h2>
                <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg leading-relaxed">
                    Prisma está comenzando. Estas son las historias que queremos hacer posibles. ¿Quieres ser uno de los primeros?
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-200">
                        <div className="flex items-center mb-5">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-200 to-cyan-200 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl">👩‍💻</span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">María, Ing. Informática</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            Durante 4 años construyó un portfolio con 8 proyectos. Cuando se graduó, una startup la contactó porque vio su trabajo en Prisma. Hoy es su primera developer.
                        </p>
                    </div>

                    <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-200">
                        <div className="flex items-center mb-5">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-200 to-purple-200 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl">🚀</span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Carlos & Ana, Co-founders</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            Se conocieron en Prisma buscando colaboradores para un proyecto. Hoy tienen una startup financiada que nació de esa conexión.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
