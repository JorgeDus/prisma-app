'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/">
                            <Image
                                src="/logo-prisma.png"
                                alt="Prisma"
                                width={150}
                                height={50}
                                className="h-12 w-auto object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <a href="#estudiantes" className="text-base font-medium text-gray-600 hover:text-purple-700 transition-colors">
                            Estudiantes
                        </a>
                        <a href="#universidades" className="text-base font-medium text-gray-600 hover:text-cyan-600 transition-colors">
                            Universidades
                        </a>
                        <a href="#empresas" className="text-base font-medium text-gray-600 hover:text-teal-600 transition-colors">
                            Empresas
                        </a>
                        <Link
                            href="/login"
                            className="px-6 py-2 bg-gradient-to-r from-purple-700 to-cyan-500 text-white rounded-xl hover:from-purple-800 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            Ingresar
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <nav className="md:hidden mt-4 pb-4 space-y-3 animate-fade-in">
                        <a
                            href="#estudiantes"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 text-center font-medium text-gray-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-200"
                        >
                            🎓 Estudiantes
                        </a>
                        <a
                            href="#universidades"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 text-center font-medium text-gray-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200"
                        >
                            🏛️ Universidades
                        </a>
                        <a
                            href="#empresas"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 text-center font-medium text-gray-700 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-colors border border-cyan-200"
                        >
                            💼 Empresas
                        </a>
                        <Link
                            href="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 text-center font-bold text-white bg-gradient-to-r from-purple-700 to-cyan-500 hover:from-purple-800 hover:to-cyan-600 rounded-xl transition-all shadow-md"
                        >
                            Ingresar
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    )
}
