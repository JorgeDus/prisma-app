import Image from 'next/image'
import Link from 'next/link'
import { Mail, Linkedin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="mb-4">
                            <Image
                                src="/logo-prisma.png"
                                alt="Prisma"
                                width={120}
                                height={40}
                                className="h-10 w-auto brightness-0 invert object-contain"
                            />
                        </div>
                        <p className="text-gray-400 text-sm">
                            Talento, Networking y Emprendimiento
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Para</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="#estudiantes" className="hover:text-white transition">
                                    Estudiantes
                                </a>
                            </li>
                            <li>
                                <a href="#universidades" className="hover:text-white transition">
                                    Universidades
                                </a>
                            </li>
                            <li>
                                <a href="#empresas" className="hover:text-white transition">
                                    Empresas
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Recursos</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <span className="hover:text-white transition cursor-default">
                                    Blog (próximamente)
                                </span>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-white transition">
                                    Ingresar
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li className="flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                contacto@tuprisma.com
                            </li>
                            <li>📍 Santiago, Chile</li>
                            <li className="flex items-center">
                                <a
                                    href="https://www.linkedin.com/company/tuprisma-edu/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center hover:text-white transition"
                                >
                                    <Linkedin className="w-4 h-4 mr-2" />
                                    Prisma | LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                    <p>© 2025 Prisma. Todos los derechos reservados.</p>
                    <p className="mt-2">
                        Construido con ❤️ por alumni universitarios para la próxima generación
                    </p>
                </div>
            </div>
        </footer>
    )
}
