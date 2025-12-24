'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Experience } from '@/types/database.types'
import { Star, Award, Heart, Zap, Briefcase, GraduationCap, Dumbbell, Palette, HeartPulse, Building2 } from 'lucide-react'

interface OverviewExperiencesProps {
    experiences: Experience[]
    isReadOnly?: boolean
    username?: string
}

export default function OverviewExperiences({ experiences, isReadOnly = false, username }: OverviewExperiencesProps) {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    if (!isLoaded) return null

    // Categorías y colores
    const categories: Record<string, { label: string, icon: any, color: string, bg: string, border: string }> = {
        'liderazgo': { label: 'Liderazgo', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        'social': { label: 'Social', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
        'emprendimiento': { label: 'Emprendimiento', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        'empleo_sustento': { label: 'Empleo', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        'academico': { label: 'Académico', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        'deportivo': { label: 'Deportivo', icon: Dumbbell, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        'creativo': { label: 'Creativo', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
        'cuidado_vida': { label: 'Cuidado y Vida', icon: HeartPulse, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
        'otro': { label: 'Otro', icon: Star, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100' },
    }

    // Lógica para Vista Pública: Selección de "Experiencia Destacada" (Singular)
    let featuredExperiences: Experience[] = []

    if (isReadOnly) {
        const markedFeatured = experiences.filter(e => e.is_featured)
            .sort((a, b) => new Date(b.start_date || b.created_at).getTime() - new Date(a.start_date || a.created_at).getTime())

        if (markedFeatured.length > 0) {
            // Si hay marcados por el usuario, mostramos el más reciente de ellos
            featuredExperiences = [markedFeatured[0]]
        }
    } else {
        // Lógica para Dashboard: Muestra todos los marcados en la base de datos
        featuredExperiences = experiences.filter(e => e.is_featured)
    }

    // Fallback: Si no hay experiencias, mensaje.
    if (experiences.length === 0) {
        return (
            <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-gray-500">No tienes experiencias registradas aún.</p>
                <Link href="/dashboard?tab=experiencias" className="text-purple-600 font-medium hover:text-purple-700 mt-2 inline-block">
                    Ir a Mis Experiencias →
                </Link>
            </div>
        )
    }

    // Si no hay destacados, sugerir destacar (o mostrar mensaje público).
    if (featuredExperiences.length === 0) {
        if (isReadOnly) {
            return (
                <div className="text-center py-12 bg-gray-50/30 rounded-2xl border-2 border-dashed border-gray-100">
                    <Star className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium text-sm">Sin experiencias destacadas seleccionadas.</p>
                </div>
            )
        }
        return (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
                <Star className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Aún no has destacado ninguna experiencia.</p>
                <p className="text-sm text-gray-500 mb-3">Ve a la pestaña de experiencias y marca con una estrella ⭐ tus mejores experiencias para mostrarlas aquí.</p>
                <Link href="/dashboard?tab=experiencias" className="text-purple-600 font-medium hover:text-purple-700 text-sm">
                    Gestionar Experiencias →
                </Link>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
        })
    }

    return (
        <div className={`grid grid-cols-1 ${featuredExperiences.length > 1 ? 'md:grid-cols-2' : ''} gap-6 animate-fade-in`}>
            {featuredExperiences.map(experience => {
                const category = categories[experience.type] || categories['otro']
                const CategoryIcon = category.icon

                return (
                    <Link
                        key={experience.id}
                        href={isReadOnly ? `/${username || experience.user_id}/experiencias/${experience.id}` : `/dashboard/experiencias/${experience.id}`}
                        className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full group hover:border-purple-200"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-[0.15em] flex items-center gap-1.5 ${category.bg} ${category.color} ${category.border} border`}>
                                <CategoryIcon size={10} />
                                {category.label}
                            </span>
                            {/* Indicador visual de destacado */}
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        </div>

                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors tracking-tight leading-tight">
                            {experience.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1 mb-2">
                            <Building2 size={14} />
                            {experience.organization}
                        </div>

                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{experience.description}</p>

                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                            <div className="flex flex-wrap gap-2">
                                {experience.skills?.slice(0, 2).map(skill => (
                                    <span key={skill} className="text-xs bg-gray-50 text-gray-600 border border-gray-100 px-2 py-1 rounded">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">
                                {experience.start_date ? formatDate(experience.start_date) : ''}
                            </span>
                        </div>
                    </Link>
                )
            })}
            <div className="col-span-1 md:col-span-2 mt-2 text-center">
                <Link href={isReadOnly ? `?tab=experiencias` : `/dashboard?tab=experiencias`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    Ver todas las experiencias ({experiences.length})
                </Link>
            </div>
        </div>
    )
}
