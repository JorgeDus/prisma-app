'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeatureGrid } from '@/components/landing/FeatureGrid'
import { ServiceShowcase } from '@/components/landing/ServiceShowcase'
import { ProcessTimeline } from '@/components/landing/ProcessTimeline'
import { ManifestoBreak } from '@/components/landing/ManifestoBreak'
import { LandingFAQ } from '@/components/landing/LandingFAQ'
import { LandingFooter } from '@/components/landing/LandingFooter'

export default function LandingPreview() {
    const mainRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });

        // Observe all current .reveal elements
        const observeAll = () => {
            document.querySelectorAll('.reveal:not(.active)').forEach(el => observer.observe(el));
        };
        observeAll();

        // Also watch for new .reveal elements added to the DOM
        const mutationObserver = new MutationObserver(() => observeAll());
        if (mainRef.current) {
            mutationObserver.observe(mainRef.current, { childList: true, subtree: true });
        }

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);

    return (
        <div ref={mainRef} className="bg-white min-h-screen">
            {/* Navigation */}
            <nav className="fixed w-full z-50 top-0 left-0 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
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
                    <div className="hidden md:flex items-center gap-8 text-[14px] font-mono font-bold uppercase tracking-widest text-slate-400">
                        <a href="#home" className="hover:text-indigo-600 transition-colors">Home</a>
                        <a href="#vision" className="hover:text-indigo-600 transition-colors">Visión</a>
                        <a href="#process" className="hover:text-indigo-600 transition-colors">Cómo Funciona</a>
                        <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
                    </div>
                    <a href="/login" className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100/50 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                        Acceder
                    </a>
                </div>
            </nav>

            <main>
                <HeroSection />
                <FeatureGrid />
                <ServiceShowcase />
                <ManifestoBreak />
                <ProcessTimeline />
                <LandingFAQ />
            </main>

            <LandingFooter />
        </div>
    )
}
