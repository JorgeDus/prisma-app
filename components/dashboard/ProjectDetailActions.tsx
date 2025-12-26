'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil, Trash2, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import { Project } from '@/types/database.types'
import ProjectFormModal from './ProjectFormModal'
import { createClient } from '@/utils/supabase/client'
import Modal from '@/components/ui/Modal'

interface ProjectDetailActionsProps {
    project: Project
    userId: string
}

export default function ProjectDetailActions({ project, userId }: ProjectDetailActionsProps) {
    const router = useRouter()
    const supabase = createClient()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const { error } = await supabase.from('projects').delete().eq('id', project.id)
            if (error) throw error
            router.push('/dashboard?tab=proyectos')
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Error al eliminar')
            setIsDeleting(false)
        }
    }

    const handleEditSuccess = () => {
        router.refresh()
    }

    return (
        <>
            {/* Navbar Actions */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/dashboard?tab=proyectos"
                        className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest shadow-sm"
                        >
                            <Pencil size={14} />
                            <span className="hidden sm:inline">Editar Perfil</span>
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar Proyecto"
                        >
                            <Trash2 size={18} />
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block"></div>
                        <Link
                            href="/dashboard"
                            className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X size={20} />
                        </Link>
                    </div>
                </div>
            </nav>

            <ProjectFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userId={userId}
                projectToEdit={project}
                onSuccess={handleEditSuccess}
            />

            {/* Delete Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Eliminar Proyecto">
                <div className="space-y-4">
                    <p className="text-gray-600">
                        ¿Estás seguro de que quieres eliminar <strong>{project.title}</strong>? Esta acción borrará permanentemente el proyecto.
                    </p>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
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
