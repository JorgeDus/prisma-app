'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Project } from '@/types/database.types'
import { Star } from 'lucide-react'

interface OverviewProjectsProps {
    projects: Project[]
    isReadOnly?: boolean
    username?: string
}

export default function OverviewProjects({ projects, isReadOnly = false, username }: OverviewProjectsProps) {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    // Si no ha cargado (SSR), no mostramos nada para evitar hidratación mismatch o mostramos skeleton
    if (!isLoaded) return null // O un loading skeleton

    // Lógica para Vista Pública: Selección del "Proyecto Destacado" (Singular)
    let featuredProjects: Project[] = []

    if (isReadOnly) {
        const markedFeatured = projects.filter(p => p.is_featured)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        if (markedFeatured.length > 0) {
            // Si hay marcados por el usuario, mostramos el más reciente de ellos
            featuredProjects = [markedFeatured[0]]
        }
        // Eliminamos el fallback automático de projects[0] para respetar la decisión del usuario
    } else {
        // Lógica para Dashboard: Muestra todos los marcados en la base de datos
        featuredProjects = projects.filter(p => p.is_featured)
    }

    // Fallback: Si no hay proyectos, mensaje.
    if (projects.length === 0) {
        return (
            <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-gray-500">No tienes proyectos registrados aún.</p>
                <Link href="/dashboard?tab=proyectos" className="text-purple-600 font-medium hover:text-purple-700 mt-2 inline-block">
                    Ir a Mis Proyectos →
                </Link>
            </div>
        )
    }

    // Si no hay destacados, sugerir destacar (o mostrar mensaje público).
    if (featuredProjects.length === 0) {
        if (isReadOnly) {
            return (
                <div className="text-center py-12 bg-gray-50/30 rounded-2xl border-2 border-dashed border-gray-100">
                    <Star className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium text-sm">Sin proyectos destacados seleccionados.</p>
                </div>
            )
        }
        return (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
                <Star className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Aún no has destacado ningún proyecto.</p>
                <p className="text-sm text-gray-500 mb-3">Ve a la pestaña de proyectos y marca con una estrella ⭐ tus mejores trabajos para mostrarlos aquí.</p>
                <Link href="/dashboard?tab=proyectos" className="text-purple-600 font-medium hover:text-purple-700 text-sm">
                    Gestionar Proyectos →
                </Link>
            </div>
        )
    }

    return (
        <div className={`grid grid-cols-1 ${featuredProjects.length > 1 ? 'md:grid-cols-2' : ''} gap-6 animate-fade-in`}>
            {featuredProjects.map(project => (
                <Link key={project.id} href={isReadOnly ? `/${username || project.user_id}/proyectos/${project.id}` : `/dashboard/project/${project.id}`} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full group hover:border-purple-200">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium uppercase tracking-wider ${project.type === 'startup' ? 'bg-blue-50 text-blue-700' :
                            project.type === 'personal' ? 'bg-green-50 text-green-700' :
                                'bg-purple-50 text-purple-700'
                            }`}>
                            {project.type}
                        </span>
                        {/* Indicador visual de destacado */}
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors tracking-tight uppercase leading-tight">
                        {project.title}
                    </h3>
                    {project.role && (
                        <p className="text-[10px] text-purple-600 font-black uppercase tracking-[0.2em] mt-1 mb-2">
                            {project.role}
                        </p>
                    )}
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-4 flex-1">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                        {project.skills?.slice(0, 3).map(skill => (
                            <span key={skill} className="text-xs bg-gray-50 text-gray-600 border border-gray-100 px-2 py-1 rounded">
                                {skill}
                            </span>
                        ))}
                    </div>
                </Link>
            ))}
            <div className="col-span-1 md:col-span-2 mt-2 text-center">
                <Link href={isReadOnly ? `?tab=proyectos` : `/dashboard?tab=proyectos`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    Ver todos los proyectos ({projects.length})
                </Link>
            </div>
        </div>
    )
}
