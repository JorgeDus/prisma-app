
'use client'

import { useState } from 'react'
import { Experience } from '@/types/database.types'
import { Calendar, Star, Pencil, Trash2, Loader2, Award, Heart, Zap, Briefcase, GraduationCap, Dumbbell, Palette, HeartPulse, Building2, Clock } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Link from 'next/link'

interface ExperienceCardProps {
    experience: Experience
    isFeatured?: boolean
    showInTimeline?: boolean
    onToggleFeatured?: (id: string, currentStatus: boolean) => void
    onToggleTimeline?: (id: string, currentStatus: boolean) => void
    onDelete?: (id: string) => void
    onEdit?: (experience: Experience) => void
    isReadOnly?: boolean
    username?: string
}

export default function ExperienceCard({
    experience,
    isFeatured = false,
    showInTimeline = true,
    onToggleFeatured,
    onToggleTimeline,
    onDelete,
    onEdit,
    isReadOnly = false,
    username
}: ExperienceCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleDelete = async () => {
        if (!onDelete) return
        setIsDeleting(true)
        await onDelete(experience.id)
        setIsDeleting(false)
        setShowDeleteModal(false)
    }

    // Helper para formatear fecha
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
        })
    }

    const getDateRange = () => {
        if (!experience.start_date) return 'Fecha no definida'
        const start = formatDate(experience.start_date)
        const end = experience.is_current ? 'Presente' : (experience.end_date ? formatDate(experience.end_date) : '')
        return `${start} - ${end}`
    }

    const categories = {
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

    const category = categories[experience.type as keyof typeof categories] || categories['otro']
    const Icon = category.icon

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group relative flex flex-col h-full">

                {/* Header Image (Optional) */}
                {experience.cover_image && (
                    <Link href={isReadOnly ? `/${username || experience.user_id}/experiencias/${experience.id}` : `/dashboard/experiencias/${experience.id}`} className="h-40 bg-gray-100 relative overflow-hidden block cursor-pointer group-hover:opacity-95 transition-opacity">
                        <img src={experience.cover_image} alt={experience.title} className="w-full h-full object-cover" />
                    </Link>
                )}

                {/* Featured & Timeline Buttons (Top Right) */}
                {!isReadOnly && (onToggleFeatured || onToggleTimeline) && (
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                        {onToggleTimeline && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onToggleTimeline(experience.id, showInTimeline);
                                }}
                                className={`p-2 rounded-full backdrop-blur-md transition-all ${showInTimeline
                                    ? 'bg-purple-500 text-white shadow-lg scale-110'
                                    : 'bg-white/50 text-gray-400 hover:bg-white hover:text-purple-500'
                                    }`}
                                title={showInTimeline ? "Quitar de trayectoria" : "Mostrar en trayectoria"}
                            >
                                <Clock size={16} />
                            </button>
                        )}
                        {onToggleFeatured && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onToggleFeatured(experience.id, isFeatured);
                                }}
                                className={`p-2 rounded-full backdrop-blur-md transition-all ${isFeatured
                                    ? 'bg-yellow-400 text-white shadow-lg scale-110'
                                    : 'bg-white/50 text-gray-400 hover:bg-white hover:text-yellow-400'
                                    }`}
                                title={isFeatured ? "Quitar de destacados" : "Destacar experiencia"}
                            >
                                <Star size={16} fill={isFeatured ? "currentColor" : "none"} />
                            </button>
                        )}
                    </div>
                )}

                {/* Actions Menu (Top Left) */}
                {!isReadOnly && onEdit && onDelete && (
                    <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onEdit(experience);
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
                        <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1.5 border ${category.bg} ${category.color} ${category.border}`}>
                            <Icon size={12} />
                            {category.label}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                            <span>{getDateRange()}</span>
                        </div>
                    </div>

                    <Link href={isReadOnly ? `/${username || experience.user_id}/experiencias/${experience.id}` : `/dashboard/experiencias/${experience.id}`} className="block group-hover:text-purple-600 transition-colors">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{experience.title}</h3>
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-3">
                        <Building2 size={14} />
                        {experience.organization}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
                        {experience.description || "Sin descripción"}
                    </p>

                    {/* Skills */}
                    {experience.skills && experience.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
                            {experience.skills.slice(0, 3).map(skill => (
                                <span key={skill} className="text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-100 px-2 py-1 rounded-md">
                                    {skill}
                                </span>
                            ))}
                            {experience.skills.length > 3 && (
                                <span className="text-[10px] text-gray-400 px-1 py-1">+{experience.skills.length - 3}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Eliminar Experiencia">
                <div className="space-y-4">
                    <p className="text-gray-600">
                        ¿Estás seguro de que quieres eliminar <strong>{experience.title}</strong>? Esta acción no se puede deshacer.
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
