'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { UniversityHero } from '@/components/landing/universities/UniversityHero'
import { UniversityPainPoints } from '@/components/landing/universities/UniversityPainPoints'
import { DashboardShowcase } from '@/components/landing/universities/DashboardShowcase'
import { UniversityBenefits } from '@/components/landing/universities/UniversityBenefits'
import { UniversityAdvantages } from '@/components/landing/universities/UniversityAdvantages'
import { UniversityCTA } from '@/components/landing/universities/UniversityCTA'
import { LandingFooter } from '@/components/landing/LandingFooter'

export default function UniversidadesPage() {
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
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link href="/universidades" className="text-indigo-600 transition-colors">Universidades</Link>
            <a href="#dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</a>
          </div>
          <a href="mailto:contacto@tuprisma.com?subject=Demo%20Dashboard%20Institucional" className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100/50 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
            Contactar
          </a>
        </div>
      </nav>

      <main>
        <UniversityHero />
        <UniversityPainPoints />
        <DashboardShowcase />
        <UniversityBenefits />
        <UniversityAdvantages />
        <UniversityCTA />
      </main>

      <LandingFooter />
    </div>
  )
}
