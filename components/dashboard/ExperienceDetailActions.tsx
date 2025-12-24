'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil, Trash2, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import { Experience } from '@/types/database.types'
import ExperienceFormModal from './ExperienceFormModal'
import { createClient } from '@/utils/supabase/client'
import Modal from '@/components/ui/Modal'

interface ExperienceDetailActionsProps {
    experience: Experience
    userId: string
}

export default function ExperienceDetailActions({ experience, userId }: ExperienceDetailActionsProps) {
    const router = useRouter()
    const supabase = createClient()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const { error } = await supabase.from('experiences').delete().eq('id', experience.id)
            if (error) throw error
            router.push('/dashboard?tab=experiencias')
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
            <nav className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link
                        href="/dashboard?tab=experiencias"
                        className="text-gray-600 hover:text-purple-600 flex items-center gap-2 font-medium transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Volver a experiencias
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
                            title="Editar Experiencia"
                        >
                            <Pencil size={18} />
                            <span className="hidden sm:inline text-sm font-medium">Editar</span>
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                            title="Eliminar Experiencia"
                        >
                            <Trash2 size={18} />
                            <span className="hidden sm:inline text-sm font-medium">Eliminar</span>
                        </button>
                        <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>
                        <Link
                            href="/dashboard"
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </Link>
                    </div>
                </div>
            </nav>

            <ExperienceFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userId={userId}
                experienceToEdit={experience}
                onSuccess={handleEditSuccess}
            />

            {/* Delete Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Eliminar Experiencia">
                <div className="space-y-4">
                    <p className="text-gray-600">
                        ¿Estás seguro de que quieres eliminar <strong>{experience.title}</strong>? Esta acción borrará permanentemente la experiencia.
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
