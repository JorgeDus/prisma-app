'use client'

import { useState } from 'react'
import { Project } from '@/types/database.types'
import { Calendar, Github, ExternalLink, Star, Pencil, Trash2, MoreVertical, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Modal from '@/components/ui/Modal'
import Link from 'next/link'

interface ProjectCardProps {
    project: Project
    isFeatured?: boolean
    onToggleFeatured?: (id: string, currentStatus: boolean) => void
    onDelete?: (id: string) => void
    onEdit?: (project: Project) => void
    isReadOnly?: boolean
    username?: string
}

export default function ProjectCard({
    project,
    isFeatured = false,
    onToggleFeatured,
    onDelete,
    onEdit,
    isReadOnly = false,
    username
}: ProjectCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleDelete = async () => {
        if (!onDelete) return
        setIsDeleting(true)
        await onDelete(project.id)
        setIsDeleting(false)
        setShowDeleteModal(false)
    }

    // Helper para formatear fecha
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group relative flex flex-col h-full">

                {/* Header Image / Gradient Placeholder - Clickable */}
                <Link href={isReadOnly ? `/${username || project.user_id}/proyectos/${project.id}` : `/dashboard/project/${project.id}`} className="block h-48 bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden group-hover:scale-[1.01] transition-transform duration-500 cursor-pointer">
                    {project.cover_image ? (
                        <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-300">
                            {/* Pattern or Icon */}
                            <svg className="w-16 h-16 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                        </div>
                    )}
                </Link>

                {/* Featured Button (Top Right) - Outside Link but absolute positioned */}
                {!isReadOnly && onToggleFeatured && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleFeatured(project.id, isFeatured);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${isFeatured
                            ? 'bg-yellow-400 text-white shadow-lg scale-110'
                            : 'bg-white/50 text-gray-400 hover:bg-white hover:text-yellow-400'
                            }`}
                        title={isFeatured ? "Quitar de destacados" : "Destacar proyecto"}
                    >
                        <Star size={18} fill={isFeatured ? "currentColor" : "none"} />
                    </button>
                )}

                {/* Actions Menu (Top Left) */}
                {!isReadOnly && onEdit && onDelete && (
                    <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onEdit(project);
                            }}
                            className="p-2 bg-white/90 rounded-full text-gray-600 hover:text-purple-600 hover:bg-white transition-colors shadow-sm"
                            title="Editar"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowDeleteModal(true);
                            }}
                            className="p-2 bg-white/90 rounded-full text-gray-600 hover:text-red-600 hover:bg-white transition-colors shadow-sm"
                            title="Eliminar"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}


                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                        <span className={`text-xs px-2 py-1 rounded-md font-medium uppercase tracking-wider ${project.type === 'startup' ? 'bg-blue-100 text-blue-700' :
                            project.type === 'personal' ? 'bg-green-100 text-green-700' :
                                'bg-purple-100 text-purple-700'
                            }`}>
                            {project.type === 'academic' ? 'Académico' : project.type === 'startup' ? 'Startup' : 'Personal'}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar size={14} />
                            <span>{formatDate(project.created_at)}</span>
                        </div>
                    </div>

                    <Link href={isReadOnly ? `/${username || project.user_id}/proyectos/${project.id}` : `/dashboard/project/${project.id}`} className="group-hover:text-purple-600 transition-colors">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                            {project.title}
                        </h3>
                    </Link>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                        {project.description || "Sin descripción"}
                    </p>

                    {/* Stack / Skills */}
                    {project.skills && project.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.skills.slice(0, 3).map(skill => (
                                <span key={skill} className="text-xs bg-gray-50 text-gray-600 border border-gray-100 px-2 py-1 rounded-md">
                                    {skill}
                                </span>
                            ))}
                            {project.skills.length > 3 && (
                                <span className="text-xs text-gray-400 px-1 py-1">+{project.skills.length - 3}</span>
                            )}
                        </div>
                    )}

                    {/* Links Footer */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex gap-3">
                            {project.repo_url && (
                                <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors" title="Repositorio">
                                    <Github size={18} />
                                </a>
                            )}
                            {project.demo_url && (
                                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-600 transition-colors" title="Ver Demo">
                                    <ExternalLink size={18} />
                                </a>
                            )}
                            {!project.repo_url && !project.demo_url && (
                                <span className="text-xs text-gray-400 italic">Sin enlaces</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Eliminar Proyecto">
                <div className="space-y-4">
                    <p className="text-gray-600">
                        ¿Estás seguro de que quieres eliminar <strong>{project.title}</strong>? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                        >
                            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
