
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Plus, Briefcase } from 'lucide-react'
import { Experience } from '@/types/database.types'
import ExperienceCard from './ExperienceCard'
import ExperienceFormModal from './ExperienceFormModal'

interface ExperienceListProps {
    initialExperiences: Experience[]
    userId: string
    isReadOnly?: boolean
    username?: string
}

export default function ExperienceList({ initialExperiences, userId, isReadOnly = false, username }: ExperienceListProps) {
    const router = useRouter()
    const supabase = createClient()
    const [experiences, setExperiences] = useState(initialExperiences)

    // Modal controls
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null)

    useEffect(() => {
        setExperiences(initialExperiences)
    }, [initialExperiences])

    // Update is_featured in Supabase
    const toggleFeatured = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('experiences')
                .update({ is_featured: !currentStatus })
                .eq('id', id)

            if (error) throw error

            setExperiences(prev => prev.map(e =>
                e.id === id ? { ...e, is_featured: !currentStatus } : e
            ))

            router.refresh()
        } catch (error) {
            console.error('Error toggling featured status:', error)
            alert('Error al actualizar el estado destacado')
        }
    }

    // Update show_in_timeline in Supabase
    const toggleTimeline = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('experiences')
                .update({ show_in_timeline: !currentStatus })
                .eq('id', id)

            if (error) throw error

            setExperiences(prev => prev.map(e =>
                e.id === id ? { ...e, show_in_timeline: !currentStatus } : e
            ))

            router.refresh()
        } catch (error) {
            console.error('Error toggling timeline status:', error)
            alert('Error al actualizar el estado en trayectoria')
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from('experiences').delete().eq('id', id)
            if (error) throw error
            setExperiences(prev => prev.filter(e => e.id !== id))
            router.refresh()
        } catch (error) {
            console.error('Error deleting experience:', error)
            alert('Error al eliminar experiencia')
        }
    }

    const handleEdit = (experience: Experience) => {
        setEditingExperience(experience)
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        setEditingExperience(null)
        setIsModalOpen(true)
    }

    const handleSuccess = () => {
        router.refresh()
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{isReadOnly ? 'Experiencias' : 'Mis Experiencias'}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {isReadOnly
                            ? 'Trayectoria profesional, liderazgo y voluntariado.'
                            : 'Gestiona tu historia personal. Agrega experiencias académicas, personales, profesionales, voluntariados, de liderazgo y más. Destaca (⭐) los que quieras mostrar en tu perfil principal'}
                    </p>
                </div>
                {!isReadOnly && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-200"
                    >
                        <Plus size={20} />
                        Añadir Experiencia
                    </button>
                )}
            </div>

            {/* Grid */}
            {experiences && experiences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experiences.map(experience => (
                        <ExperienceCard
                            key={experience.id}
                            experience={experience}
                            isFeatured={experience.is_featured || false}
                            showInTimeline={experience.show_in_timeline ?? true}
                            onToggleFeatured={isReadOnly ? undefined : toggleFeatured}
                            onToggleTimeline={isReadOnly ? undefined : toggleTimeline}
                            onDelete={isReadOnly ? undefined : handleDelete}
                            onEdit={isReadOnly ? undefined : handleEdit}
                            isReadOnly={isReadOnly}
                            username={username}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-purple-50 text-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No hay experiencias aún</h3>
                    <p className="text-gray-500 mt-1 mb-6">Comienza añadiendo tu primera experiencia laboral o de voluntariado.</p>
                    {!isReadOnly && (
                        <button
                            onClick={handleCreate}
                            className="text-purple-600 font-semibold hover:text-purple-700"
                        >
                            + Crear primera experiencia
                        </button>
                    )}
                </div>
            )}

            {!isReadOnly && (
                <ExperienceFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userId={userId}
                    experienceToEdit={editingExperience}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    )
}
