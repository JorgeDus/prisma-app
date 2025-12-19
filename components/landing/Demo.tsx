'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function Demo() {
    const [ref, isVisible] = useScrollAnimation()

    return (
        <section
            ref={ref}
            id="demo"
            className={`py-24 bg-white transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-8 tracking-tight">
                        Prisma: Tu perfil profesional que evoluciona contigo
                    </h2>
                    <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
                        <p>
                            Prisma es más que un portfolio. Es tu identidad profesional completa: tus proyectos, habilidades, experiencias, intereses y conexiones, todo en un solo lugar.
                        </p>
                        <p>
                            Desde tu primer año universitario hasta tu primer empleo, Prisma crece contigo. Muestra tu trabajo real, no solo tus notas. Conecta con compañeros para colaborar. Encuentra mentores alumni. Y cuando llegue el momento, destaca ante empresas que buscan exactamente lo que tú tienes.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl p-8 max-w-4xl mx-auto">
                    <a
                        href="https://demo.tuprisma.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group cursor-pointer overflow-hidden"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/Prisma Profile Ex.png"
                            alt="Demo Interactivo de Prisma"
                            className="w-full h-auto object-cover group-hover:opacity-90 transition-opacity duration-300"
                        />
                    </a>
                    <p className="text-center text-gray-600 mt-4 text-sm font-medium">
                        Haz click en la imagen para ver cómo funciona
                    </p>
                </div>
            </div>
        </section>
    )
}
