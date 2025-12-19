
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Quote, Trash2, User, Briefcase, MessageSquare } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { Testimonial } from '@/types/database.types'

interface TestimonialModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
    testimonialToEdit: Testimonial | null
    onSuccess: () => void
}

export default function TestimonialModal({ isOpen, onClose, userId, testimonialToEdit, onSuccess }: TestimonialModalProps) {
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const [formData, setFormData] = useState({
        author_name: '',
        author_role: '',
        content: ''
    })

    useEffect(() => {
        if (testimonialToEdit) {
            setFormData({
                author_name: testimonialToEdit.author_name,
                author_role: testimonialToEdit.author_role || '',
                content: testimonialToEdit.content
            })
        } else {
            setFormData({
                author_name: '',
                author_role: '',
                content: ''
            })
        }
    }, [testimonialToEdit, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const data = {
                user_id: userId,
                author_name: formData.author_name,
                author_role: formData.author_role || null,
                content: formData.content,
                updated_at: new Date().toISOString()
            }

            if (testimonialToEdit) {
                const { error } = await supabase
                    .from('testimonials')
                    .update(data)
                    .eq('id', testimonialToEdit.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('testimonials')
                    .insert([data])
                if (error) throw error
            }

            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error saving testimonial:', error)
            alert('Error al guardar el testimonio')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!testimonialToEdit) return
        if (!confirm('¿Estás seguro de que quieres eliminar este testimonio?')) return

        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', testimonialToEdit.id)
            if (error) throw error
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error deleting testimonial:', error)
            alert('Error al eliminar el testimonio')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={testimonialToEdit ? 'Editar Testimonio' : 'Nuevo Testimonio'}
            maxWidth="max-w-xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Testimonio (Contenido)</label>
                    <div className="relative">
                        <div className="absolute top-3 left-3 text-gray-400">
                            <Quote size={18} />
                        </div>
                        <textarea
                            required
                            rows={4}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium text-gray-700 resize-none"
                            placeholder="Ej: Es un gran profesional con una capacidad de resolución increíble..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Autor</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-gray-900"
                                placeholder="Ej: Marcela Soto"
                                value={formData.author_name}
                                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Cargo / Referencia</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Briefcase size={18} />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-gray-900"
                                placeholder="Ej: Gerente de Tecnología"
                                value={formData.author_role}
                                onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    {testimonialToEdit && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting || isLoading}
                            className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                            {isDeleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading || isDeleting}
                        className="flex-1 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : (testimonialToEdit ? 'Guardar Cambios' : 'Publicar en Vitrina')}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
