'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'

export const UniversityFooter = () => {
    return (
        <footer className="bg-slate-900 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                {/* CTA Section — Institucional */}
                <div className="text-center mb-20 reveal">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-8">
                        <Icon icon="solar:calendar-linear" width="14" className="text-indigo-400" />
                        <span className="text-[10px] sm:text-xs font-mono font-bold text-indigo-300 uppercase tracking-widest px-1">
                            Demo
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-sans mb-6">
                        ¿Quieres ver el dashboard<br />
                        con los datos de tu universidad?
                    </h2>
                    <p className="text-slate-400 text-lg font-light font-sans max-w-xl mx-auto mb-10">
                        Agenda una demo de 20 minutos y te mostramos cómo Prisma puede transformar la manera en que tu institución entiende a sus estudiantes.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="mailto:contacto@tuprisma.com?subject=Demo%20Dashboard%20Institucional&body=Hola%2C%20me%20interesa%20conocer%20el%20dashboard%20institucional%20de%20Prisma%20para%20nuestra%20universidad."
                            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white text-sm font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Agenda una demo
                            <Icon icon="solar:arrow-right-linear" width="18" />
                        </a>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-4 text-slate-400 border border-slate-700 text-sm font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all"
                        >
                            Conoce Prisma para estudiantes
                        </Link>
                    </div>
                    <p className="text-xs text-slate-600 font-mono mt-8">
                        contacto@tuprisma.com
                    </p>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-800 pt-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logo-prisma.png"
                                alt="Prisma"
                                width={120}
                                height={40}
                                className="h-7 w-auto object-contain brightness-0 invert"
                            />
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-8 text-[14px] font-mono font-bold uppercase tracking-widest text-slate-500">
                            <Link href="/" className="hover:text-white transition-colors">
                                Para Estudiantes
                            </Link>
                            <Link href="/privacidad" className="hover:text-white transition-colors">
                                Privacidad
                            </Link>
                            <a href="mailto:contacto@tuprisma.com" className="hover:text-white transition-colors">
                                Contacto
                            </a>
                            <a
                                href="https://www.linkedin.com/company/tuprisma-edu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors"
                                aria-label="LinkedIn de Prisma"
                            >
                                <Icon icon="mdi:linkedin" width="20" />
                            </a>
                        </div>

                        {/* Copyright */}
                        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                            © 2025 Somos Prisma
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
