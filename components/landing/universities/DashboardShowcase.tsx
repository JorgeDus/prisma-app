'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'

// ─── Data ────────────────────────────────────────────────────────────────────

const tabs = [
    {
        id: 'general',
        label: 'Vista General',
        icon: 'solar:chart-2-linear',
        color: 'indigo',
        title: 'El pulso de tu comunidad estudiantil',
        description: 'Obtén una visión panorámica de tu base de estudiantes con métricas clave actualizadas en tiempo real.',
        images: [
            { src: '/dashboard-general-1.png', caption: 'KPIs, funnel de evolución y composición por género' },
            { src: '/dashboard-general-2.png', caption: 'Distribución demográfica y deep-dive por carrera' },
        ],
        features: [
            'Total de estudiantes registrados y activos (últimos 30 días)',
            'Detección de perfiles incompletos (falta foto, bio o género)',
            'Funnel de evolución: desde registro hasta portafolio con experiencia profesional',
            'Composición demográfica por género con gráfico interactivo',
            'Distribución por carrera y género con vista cruzada',
            'Tabla de deep-dive interactiva por carrera, generación y género',
        ]
    },
    {
        id: 'content',
        label: 'Producción',
        icon: 'solar:pie-chart-2-linear',
        color: 'emerald',
        title: 'Qué están construyendo tus estudiantes',
        description: 'Analiza el volumen, tipología y calidad del contenido que tus estudiantes publican en sus perfiles.',
        images: [
            { src: '/dashboard-produccion-1.png', caption: 'KPIs de producción, tasa de colaboración y volumen por generación' },
            { src: '/dashboard-produccion-2.png', caption: 'Tipología de proyectos, experiencias y benchmark normalizado' },
        ],
        features: [
            'KPIs de proyectos, experiencias y logros totales',
            'Tasa de colaboración con benchmark cualitativo (Alta / Media / Baja)',
            'Volumen por año de ingreso con desglose opcional por género',
            'Tipología: distribución por categoría (académico, startup, liderazgo, social, etc.)',
            'Benchmark normalizado: contenido por alumno comparado entre generaciones',
            'Radiografía de empleabilidad: sector (público/privado) y áreas de desempeño',
        ]
    },
    {
        id: 'skills',
        label: 'Competencias',
        icon: 'solar:star-shine-bold',
        color: 'amber',
        title: 'El mapa de habilidades de tu universidad',
        description: 'Descubre las competencias técnicas y transversales más frecuentes, respaldadas por evidencia real.',
        images: [
            { src: '/dashboard-competencias-1.png', caption: 'Ranking de hard y soft skills con drill-down interactivo' },
        ],
        features: [
            'Top 10 competencias técnicas (hard skills) más mencionadas',
            'Top 10 competencias transversales (soft skills) más mencionadas',
            'Click interactivo: selecciona una competencia y ve el contenido que la respalda',
            'Drill-down con detalle de proyectos y experiencias asociados a cada skill',
            'Vista cruzada: quién demuestra qué, con link directo al perfil público',
            'Datos construidos desde la evidencia (no autodeclarados sin contexto)',
        ]
    }
]

const colorMap: Record<string, {
    text: string; iconBg: string; border: string
    activeBg: string; activeBorder: string
    tabActiveBg: string; tabActiveBorder: string; tabActiveText: string
    featureCheckBg: string
}> = {
    indigo: {
        text: 'text-indigo-600', iconBg: 'bg-indigo-100', border: 'border-indigo-200',
        activeBg: 'bg-indigo-50', activeBorder: 'border-indigo-200',
        tabActiveBg: 'bg-indigo-50', tabActiveBorder: 'border-indigo-200', tabActiveText: 'text-indigo-700',
        featureCheckBg: 'bg-indigo-100',
    },
    emerald: {
        text: 'text-emerald-600', iconBg: 'bg-emerald-100', border: 'border-emerald-200',
        activeBg: 'bg-emerald-50', activeBorder: 'border-emerald-200',
        tabActiveBg: 'bg-emerald-50', tabActiveBorder: 'border-emerald-200', tabActiveText: 'text-emerald-700',
        featureCheckBg: 'bg-emerald-100',
    },
    amber: {
        text: 'text-amber-600', iconBg: 'bg-amber-100', border: 'border-amber-200',
        activeBg: 'bg-amber-50', activeBorder: 'border-amber-200',
        tabActiveBg: 'bg-amber-50', tabActiveBorder: 'border-amber-200', tabActiveText: 'text-amber-700',
        featureCheckBg: 'bg-amber-100',
    },
}

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({
    images,
    startIndex,
    onClose,
}: {
    images: { src: string; caption: string }[]
    startIndex: number
    onClose: () => void
}) {
    const [current, setCurrent] = useState(startIndex)

    const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length])
    const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose, prev, next])

    // Prevent body scroll while open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Main container — stops propagation so clicking the image doesn't close */}
            <div
                className="relative flex flex-col items-center max-w-[92vw] max-h-[92vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-xs font-mono font-bold uppercase tracking-widest"
                >
                    <Icon icon="solar:close-circle-linear" width="18" />
                    Cerrar
                </button>

                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white max-w-[88vw] max-h-[78vh]">
                    <Image
                        src={images[current].src}
                        alt={images[current].caption}
                        width={1400}
                        height={900}
                        className="object-contain max-h-[78vh] w-auto"
                        quality={95}
                    />
                </div>

                {/* Caption + navigation */}
                <div className="mt-5 flex items-center gap-6">
                    {/* Prev */}
                    {images.length > 1 && (
                        <button
                            onClick={prev}
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"
                            aria-label="Imagen anterior"
                        >
                            <Icon icon="solar:arrow-left-linear" width="18" />
                        </button>
                    )}

                    {/* Caption + dots */}
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-white/70 text-xs font-sans font-light text-center max-w-xs">
                            {images[current].caption}
                        </p>
                        {images.length > 1 && (
                            <div className="flex gap-1.5">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrent(idx)}
                                        className={`w-1.5 h-1.5 rounded-full transition-all ${idx === current ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Next */}
                    {images.length > 1 && (
                        <button
                            onClick={next}
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"
                            aria-label="Siguiente imagen"
                        >
                            <Icon icon="solar:arrow-right-linear" width="18" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Image Preview Card ───────────────────────────────────────────────────────

function ImagePreview({
    images,
    colors,
    tabLabel,
}: {
    images: { src: string; caption: string }[]
    colors: typeof colorMap[string]
    tabLabel: string
}) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxStart, setLightboxStart] = useState(0)
    const [previewIdx, setPreviewIdx] = useState(0)

    const openLightbox = (idx: number) => {
        setLightboxStart(idx)
        setLightboxOpen(true)
    }

    return (
        <>
            <div className={`relative rounded-2xl overflow-hidden border ${colors.border} bg-white shadow-lg group cursor-pointer`}
                onClick={() => openLightbox(previewIdx)}
            >
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                    </span>
                    <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">{tabLabel}</span>
                </div>

                {/* Expand icon overlay on hover */}
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/0 group-hover:bg-slate-900/20 transition-all duration-300">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-lg">
                        <Icon icon="solar:maximize-square-linear" width="16" className="text-slate-700" />
                        <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-widest">Ver en detalle</span>
                    </div>
                </div>

                {/* Current preview image */}
                <Image
                    src={images[previewIdx].src}
                    alt={images[previewIdx].caption}
                    width={800}
                    height={520}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    quality={85}
                />

                {/* Bottom: caption + thumbnail navigation if multiple */}
                {images.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent p-4 pt-10">
                        <div className="flex items-center justify-between">
                            <p className="text-white/80 text-xs font-sans font-light truncate mr-3">
                                {images[previewIdx].caption}
                            </p>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={e => { e.stopPropagation(); setPreviewIdx(i => (i - 1 + images.length) % images.length) }}
                                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 border border-white/20 flex items-center justify-center text-white transition-all"
                                    aria-label="Anterior"
                                >
                                    <Icon icon="solar:arrow-left-linear" width="14" />
                                </button>
                                <span className="text-white/60 text-[10px] font-mono font-bold">
                                    {previewIdx + 1}/{images.length}
                                </span>
                                <button
                                    onClick={e => { e.stopPropagation(); setPreviewIdx(i => (i + 1) % images.length) }}
                                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 border border-white/20 flex items-center justify-center text-white transition-all"
                                    aria-label="Siguiente"
                                >
                                    <Icon icon="solar:arrow-right-linear" width="14" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Single image caption */}
                {images.length === 1 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent p-4 pt-8">
                        <p className="text-white/80 text-xs font-sans font-light">
                            {images[0].caption}
                        </p>
                    </div>
                )}
            </div>

            {lightboxOpen && (
                <Lightbox
                    images={images}
                    startIndex={lightboxStart}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const DashboardShowcase = () => {
    const [activeTab, setActiveTab] = useState('general')
    const currentTab = tabs.find(t => t.id === activeTab)!
    const colors = colorMap[currentTab.color]

    return (
        <section id="dashboard" className="py-32 bg-slate-50/50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-2xl mb-16 reveal">
                    <p className="text-[14px] font-mono font-bold text-indigo-500 uppercase tracking-[0.3em] mb-4">
                        Dashboard Institucional
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4 font-sans">
                        Tres vistas. Una imagen completa.
                    </h2>
                    <p className="text-lg text-slate-500 font-light font-sans">
                        El portal de inteligencia de Prisma organiza los datos de tus estudiantes en tres dimensiones complementarias, con filtros globales por carrera y año de ingreso.
                    </p>
                </div>

                {/* Tab Selector */}
                <div className="flex flex-wrap gap-3 mb-12 reveal delay-100">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id
                        const c = colorMap[tab.color]
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-bold transition-all duration-300 ${isActive
                                    ? `${c.tabActiveBg} ${c.tabActiveBorder} ${c.tabActiveText} shadow-sm`
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                                    }`}
                            >
                                <Icon icon={tab.icon} width="20" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Active Tab — Features left, Image right */}
                <div className={`rounded-3xl border p-8 md:p-12 transition-all duration-500 ${colors.activeBg} ${colors.activeBorder}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                        {/* Left: Description + Feature List */}
                        <div>
                            <div className={`w-14 h-14 rounded-2xl ${colors.iconBg} ${colors.border} border flex items-center justify-center ${colors.text} mb-6`}>
                                <Icon icon={currentTab.icon} width="28" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight font-sans">
                                {currentTab.title}
                            </h3>
                            <p className="text-slate-500 text-base leading-relaxed font-sans font-light mb-8">
                                {currentTab.description}
                            </p>

                            <div className="space-y-3">
                                {currentTab.features.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300"
                                    >
                                        <div className={`w-5 h-5 rounded-md ${colors.featureCheckBg} flex items-center justify-center shrink-0 mt-0.5`}>
                                            <Icon icon="solar:check-circle-bold" width="12" className={colors.text} />
                                        </div>
                                        <p className="text-sm text-slate-700 font-medium leading-relaxed font-sans">
                                            {feature}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <a
                                href="mailto:contacto@tuprisma.com?subject=Demo%20Dashboard%20Institucional"
                                className={`inline-flex items-center gap-2 mt-8 text-sm font-bold font-mono uppercase tracking-widest ${colors.text} hover:opacity-80 transition-opacity`}
                            >
                                Solicitar demo
                                <Icon icon="solar:arrow-right-linear" width="16" />
                            </a>
                        </div>

                        {/* Right: Real image with lightbox */}
                        <ImagePreview
                            images={currentTab.images}
                            colors={colors}
                            tabLabel={currentTab.label}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
