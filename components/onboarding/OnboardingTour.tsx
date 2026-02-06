'use client'

import { useEffect, useState, useCallback } from 'react'
import { driver, Driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { createClient } from '@/utils/supabase/client'

interface OnboardingTourProps {
    profileId: string
    hasCompletedTour: boolean
    onTourComplete?: () => void
}

// Tour step definitions
const TOUR_STEPS = [
    {
        element: '[data-tour="header"]',
        popover: {
            title: '👋 Tu Espacio Personal',
            description: 'Aquí puedes editar tu foto, bio, y datos de contacto. Es lo primero que verán los visitantes de tu perfil.',
            side: 'bottom' as const,
            align: 'center' as const,
        }
    },
    {
        element: '#highlights',
        popover: {
            title: '🔲 Mi Vitrina',
            description: 'Destaca tus 3 mejores proyectos o experiencias. Estos aparecerán de forma prominente en tu perfil público.',
            side: 'bottom' as const,
            align: 'start' as const,
        }
    },
    {
        element: '#logros',
        popover: {
            title: '🏆 Logros / Hitos',
            description: 'Añade certificaciones, premios, becas o reconocimientos académicos que validen tu formación.',
            side: 'top' as const,
            align: 'start' as const,
        }
    },
    {
        element: '#experiencia',
        popover: {
            title: '✨ Experiencias',
            description: 'Comparte experiencias significativas: liderazgo, voluntariado, emprendimiento, trabajo, y más.',
            side: 'top' as const,
            align: 'start' as const,
        }
    },
    {
        element: '#proyectos',
        popover: {
            title: '💼 Proyectos',
            description: 'Sube proyectos con evidencia de tu trabajo. Incluye demos, repositorios, y galería de imágenes.',
            side: 'top' as const,
            align: 'start' as const,
        }
    },
    {
        element: '#testimonios',
        popover: {
            title: '💬 Testimonios',
            description: 'Solicita testimonios de mentores, profesores o colegas que validen tus habilidades.',
            side: 'top' as const,
            align: 'start' as const,
        }
    },
    {
        element: '[data-tour="trajectory"]',
        popover: {
            title: '📅 Vista de Trayectoria',
            description: 'Una línea de tiempo unificada que muestra tu evolución: experiencias, proyectos y logros ordenados cronológicamente.',
            side: 'top' as const,
            align: 'center' as const,
        }
    },
    {
        element: '#contacto',
        popover: {
            title: '✉️ Contacto',
            description: 'Configura cómo pueden contactarte: email, LinkedIn, GitHub y tu sitio web personal.',
            side: 'top' as const,
            align: 'center' as const,
        }
    }
]

export default function OnboardingTour({
    profileId,
    hasCompletedTour,
    onTourComplete
}: OnboardingTourProps) {
    const [driverInstance, setDriverInstance] = useState<Driver | null>(null)
    const [showStartButton, setShowStartButton] = useState(false)
    const supabase = createClient()

    const markTourCompleted = useCallback(async () => {
        try {
            await supabase
                .from('profiles')
                .update({ has_completed_tour: true })
                .eq('id', profileId)

            onTourComplete?.()
        } catch (error) {
            console.error('Error marking tour as completed:', error)
        }
    }, [profileId, supabase, onTourComplete])

    const startTour = useCallback(() => {
        if (driverInstance) {
            driverInstance.drive()
        }
    }, [driverInstance])

    useEffect(() => {
        // Initialize driver instance
        const driverObj = driver({
            showProgress: true,
            animate: true,
            smoothScroll: true,
            allowClose: true,
            stagePadding: 8,
            stageRadius: 12,
            popoverClass: 'prisma-tour-popover',
            progressText: '{{current}} de {{total}}',
            nextBtnText: 'Siguiente →',
            prevBtnText: '← Anterior',
            doneBtnText: '¡Listo!',
            steps: TOUR_STEPS,
            onDestroyStarted: () => {
                // Mark as completed when tour is closed
                markTourCompleted()
                driverObj.destroy()
            },
            onDestroyed: () => {
                setShowStartButton(true)
            }
        })

        setDriverInstance(driverObj)

        // Auto-start tour for new users
        if (!hasCompletedTour) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                driverObj.drive()
            }, 500)
            return () => clearTimeout(timer)
        } else {
            setShowStartButton(true)
        }

        return () => {
            driverObj.destroy()
        }
    }, [hasCompletedTour, markTourCompleted])

    // Show button to restart tour
    if (showStartButton) {
        return (
            <button
                onClick={startTour}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 
                           bg-white/90 backdrop-blur-md border border-slate-200 
                           rounded-full shadow-lg hover:shadow-xl hover:scale-105
                           transition-all duration-200 group"
                title="Ver tour del dashboard"
            >
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-600 
                               group-hover:text-indigo-600 transition-colors">
                    Ver Tour
                </span>
            </button>
        )
    }

    return null
}
