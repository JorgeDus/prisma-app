'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Plus } from 'lucide-react'
import { Project } from '@/types/database.types'
import ProjectCard from './ProjectCard'
import ProjectFormModal from './ProjectFormModal'

interface ProjectListProps {
    initialProjects: Project[]
    userId: string
    isReadOnly?: boolean
    username?: string
}

export default function ProjectList({ initialProjects, userId, isReadOnly = false, username }: ProjectListProps) {
    const router = useRouter()
    const supabase = createClient()
    const [projects, setProjects] = useState(initialProjects)

    // Modal controls
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)

    useEffect(() => {
        setProjects(initialProjects)
    }, [initialProjects])

    // Update is_featured in Supabase when featured changes
    const toggleFeatured = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('projects')
                .update({ is_featured: !currentStatus })
                .eq('id', id)

            if (error) throw error

            // Update local state for immediate UI feedback
            setProjects(prev => prev.map(p =>
                p.id === id ? { ...p, is_featured: !currentStatus } : p
            ))

            router.refresh()
        } catch (error) {
            console.error('Error toggling featured status:', error)
            alert('Error al actualizar el estado destacado')
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from('projects').delete().eq('id', id)
            if (error) throw error
            // Remove from local state immediately for UI snappiness
            setProjects(prev => prev.filter(p => p.id !== id))
            router.refresh()
        } catch (error) {
            console.error('Error deleting project:', error)
            alert('Error al eliminar proyecto')
        }
    }

    const handleEdit = (project: Project) => {
        setEditingProject(project)
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        setEditingProject(null)
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
                    <h2 className="text-2xl font-bold text-gray-900">{isReadOnly ? 'Proyectos' : 'Mis Proyectos'}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {isReadOnly
                            ? 'Portafolio de proyectos académicos y personales.'
                            : 'Gestiona tu portafolio académico y personal. Destaca (⭐) los que quieras mostrar en tu perfil principal.'}
                    </p>
                </div>
                {!isReadOnly && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-200"
                    >
                        <Plus size={20} />
                        Añadir Proyecto
                    </button>
                )}
            </div>

            {/* Grid */}
            {projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            isFeatured={project.is_featured}
                            onToggleFeatured={isReadOnly ? undefined : toggleFeatured}
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
                        <Plus size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No hay proyectos aún</h3>
                    <p className="text-gray-500 mt-1 mb-6">Comienza añadiendo tu primer proyecto académico o personal.</p>
                    <button
                        onClick={handleCreate}
                        className="text-purple-600 font-semibold hover:text-purple-700"
                    >
                        + Crear primer proyecto
                    </button>
                </div>
            )}

            {!isReadOnly && (
                <ProjectFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userId={userId}
                    projectToEdit={editingProject}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    )
}
