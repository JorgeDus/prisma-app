'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'

export const LandingFooter = () => {
    return (
        <footer className="bg-slate-900 text-white pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto">
                {/* CTA Section */}
                <div className="text-center mb-20 reveal">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-sans mb-6">
                        ¿Listo para construir tu evidencia?
                    </h2>
                    <p className="text-slate-400 text-lg font-light font-sans max-w-lg mx-auto mb-10">
                        Empieza hoy. Tu futuro profesional te lo agradecerá.
                    </p>
                    <a
                        href="/login"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white text-sm font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Crea tu perfil gratis
                        <Icon icon="solar:arrow-right-linear" width="18" />
                    </a>
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
                        <div className="flex items-center gap-8 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
                            <Link href="/privacidad" className="hover:text-white transition-colors">
                                Privacidad
                            </Link>
                            <a href="mailto:contacto@tuprisma.com" className="hover:text-white transition-colors">
                                Contacto
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
