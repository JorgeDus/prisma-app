import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Política de Privacidad | Prisma',
    description: 'Política de privacidad de Prisma - Cómo recopilamos y protegemos tus datos.'
}

export default function PrivacidadPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navigation */}
            <nav className="bg-white border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo-prisma.png"
                            alt="Prisma Logo"
                            width={100}
                            height={28}
                            className="h-7 w-auto object-contain"
                        />
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Volver al inicio
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-16">
                <article className="prose prose-slate max-w-none">
                    <header className="mb-12 not-prose">
                        <p className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest mb-3">
                            Legal
                        </p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Política de Privacidad
                        </h1>
                        <p className="text-slate-500 mt-4">
                            Última actualización: Enero 2025
                        </p>
                    </header>

                    <section className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">1. Información que Recopilamos</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Cuando utilizas Prisma con tu cuenta de Google, recopilamos la siguiente información
                                proporcionada por Google con tu consentimiento:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 mt-4 space-y-2">
                                <li><strong>Nombre completo:</strong> Para personalizar tu perfil de estudiante.</li>
                                <li><strong>Correo electrónico:</strong> Para identificación de tu cuenta y comunicaciones importantes.</li>
                                <li><strong>Foto de perfil (opcional):</strong> Para mostrar en tu portafolio público si lo deseas.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">2. Uso de la Información</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Utilizamos tu información exclusivamente para:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 mt-4 space-y-2">
                                <li>Crear y gestionar tu perfil de estudiante en Prisma.</li>
                                <li>Permitirte construir tu portafolio de evidencias académicas y profesionales.</li>
                                <li>Facilitar la comunicación entre usuarios de la plataforma.</li>
                                <li>Enviarte notificaciones relevantes sobre tu cuenta.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">3. Compartición de Datos</h2>
                            <p className="text-slate-600 leading-relaxed">
                                <strong>No compartimos tu información personal con terceros sin tu consentimiento explícito.</strong>
                            </p>
                            <p className="text-slate-600 leading-relaxed mt-4">
                                La información de tu perfil público (como nombre, universidad, y proyectos) solo será
                                visible para otros usuarios si decides mantener tu perfil público. Tienes control total
                                sobre qué información es visible.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">4. Seguridad de los Datos</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Implementamos medidas de seguridad estándar de la industria para proteger tu información,
                                incluyendo:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 mt-4 space-y-2">
                                <li>Conexiones cifradas mediante HTTPS.</li>
                                <li>Autenticación segura a través de proveedores verificados (Google).</li>
                                <li>Almacenamiento seguro en servidores protegidos.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">5. Tus Derechos</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Tienes derecho a:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 mt-4 space-y-2">
                                <li>Acceder a tu información personal almacenada en Prisma.</li>
                                <li>Solicitar la corrección de datos inexactos.</li>
                                <li>Solicitar la eliminación de tu cuenta y datos asociados.</li>
                                <li>Retirar tu consentimiento en cualquier momento.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">6. Contacto</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Si tienes preguntas sobre esta política de privacidad o sobre el manejo de tus datos,
                                puedes contactarnos en:
                            </p>
                            <p className="text-slate-600 mt-4">
                                <strong>Email:</strong>{' '}
                                <a href="mailto:contacto@tuprisma.com" className="text-indigo-600 hover:text-indigo-700">
                                    contacto@tuprisma.com
                                </a>
                            </p>
                        </div>
                    </section>
                </article>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-8 mt-16">
                <div className="max-w-4xl mx-auto px-6 text-center text-slate-400 text-sm">
                    <p>© 2025 Prisma. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    )
}
