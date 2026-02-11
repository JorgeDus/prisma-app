'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeatureGrid } from '@/components/landing/FeatureGrid'

export default function LandingPreview() {
    useEffect(() => {
        // Scroll Reveal Logic (Minimal version for preview)
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, []);

    return (
        <div className="bg-white min-h-screen">
            {/* Navigation Placeholder */}
            <nav className="fixed w-full z-50 top-0 left-0 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/">
                            <Image
                                src="/logo-prisma.png"
                                alt="Prisma"
                                width={150}
                                height={50}
                                className="h-8 w-auto object-contain"
                                priority
                            />
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                        <a href="#home" className="hover:text-indigo-600 transition-colors">Home</a>
                        <a href="#concept" className="hover:text-indigo-600 transition-colors">Concepto</a>
                        <a href="#methodology" className="hover:text-indigo-600 transition-colors">Metodología</a>
                    </div>
                    <a href="/login" className="px-5 py-2 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all">
                        Acceder
                    </a>
                </div>
            </nav>

            <main>
                <HeroSection />
                <FeatureGrid />
            </main>

            <footer className="py-12 px-6 border-t border-slate-100 text-center">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    © 2024 Somos Prisma. Vista de Previsualización.
                </p>
            </footer>
        </div>
    )
}
