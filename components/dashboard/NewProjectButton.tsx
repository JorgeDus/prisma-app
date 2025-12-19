'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Plus, Loader2, Type, AlignLeft, Calendar, Tag } from 'lucide-react'
import Modal from '@/components/ui/Modal'

interface NewProjectButtonProps {
    userId: string
}

export default function NewProjectButton({ userId }: NewProjectButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'academic' as 'academic' | 'startup' | 'personal',
        date: new Date().toISOString().split('T')[0] // Default hoy, solo visual si quisieramos campo fecha, pero usaremos esto para created_at o futuras features
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { error } = await supabase
                .from('projects')
                .insert({
                    user_id: userId,
                    title: formData.title,
                    description: formData.description,
                    type: formData.type,
                    // skills: [], // Opcional, podríamos agregar selector de skills después
                    created_at: new Date().toISOString(), // Usamos la fecha actual como creación
                    updated_at: new Date().toISOString()
                })

            if (error) throw error

            setIsOpen(false)
            setFormData({
                title: '',
                description: '',
                type: 'academic',
                date: new Date().toISOString().split('T')[0]
            })
            router.refresh()
        } catch (error) {
            console.error('Error creating project:', error)
            alert('Hubo un error al crear el proyecto.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
            >
                <Plus size={16} />
                Nuevo Proyecto
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Nuevo Proyecto">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Título */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título del Proyecto</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400"><Type size={18} /></span>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500 font-medium"
                                placeholder="Ej: Sistema de Gestión de Residuos"
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Breve</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400"><AlignLeft size={18} /></span>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all min-h-[100px] resize-none text-gray-900 placeholder-gray-500 font-medium"
                                placeholder="Describe de qué trata el proyecto..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Tipo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400"><Tag size={18} /></span>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all appearance-none text-gray-900 font-medium"
                                >
                                    <option value="academic">Académico</option>
                                    <option value="personal">Personal</option>
                                    <option value="startup">Startup / Emprendimiento</option>
                                </select>
                            </div>
                        </div>

                        {/* Fecha (Visual, o para futuro campo date) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400"><Calendar size={18} /></span>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-bold transition-all disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Crear Proyecto'}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
