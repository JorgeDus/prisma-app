'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Type, Calendar, Building2, Tag, Loader2, X, Users, Sparkles } from 'lucide-react'
import Modal from '@/components/ui/Modal'

interface AchievementFormModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
    achievementToEdit?: any
    onSuccess?: () => void
}

export default function AchievementFormModal({
    isOpen,
    onClose,
    userId,
    achievementToEdit,
    onSuccess
}: AchievementFormModalProps) {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        organization: '',
        date: '',
        category: 'certification' as 'award' | 'certification' | 'course_chair' | 'academic_role',
        professor_name: '',
        distinction: ''
    })

    useEffect(() => {
        if (achievementToEdit) {
            setFormData({
                title: achievementToEdit.title || '',
                organization: achievementToEdit.organization || '',
                date: achievementToEdit.date || '',
                category: achievementToEdit.category || 'certification',
                professor_name: achievementToEdit.professor_name || '',
                distinction: achievementToEdit.distinction || ''
            })
        } else {
            setFormData({
                title: '',
                organization: '',
                date: '',
                category: 'certification',
                professor_name: '',
                distinction: ''
            })
        }
    }, [achievementToEdit, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const dataToSave: any = {
                user_id: userId,
                title: formData.title,
                organization: formData.organization || null,
                date: formData.date || null,
                category: formData.category,
                professor_name: formData.professor_name || null,
                distinction: formData.distinction || null,
            }

            if (achievementToEdit) {
                const { error } = await supabase
                    .from('achievements')
                    .update(dataToSave)
                    .eq('id', achievementToEdit.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('achievements')
                    .insert(dataToSave)
                if (error) throw error
            }

            onSuccess?.()
            onClose()
            router.refresh()
        } catch (error) {
            console.error('Error saving achievement:', error)
            alert('Hubo un error al guardar.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={achievementToEdit ? 'Editar Logro' : 'Nuevo Logro'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        Título del Logro
                    </label>
                    <div className="relative">
                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-serif italic"
                            placeholder="Ej: Beca a la Excelencia Académica"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        Institución / Organización
                    </label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
                            placeholder="Ej: Universidad de Buenos Aires"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                            Fecha
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                            Categoría
                        </label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm appearance-none"
                            >
                                <option value="certification">Certificación</option>
                                <option value="award">Premio / Reconocimiento</option>
                                <option value="course_chair">Cátedra Destacada</option>
                                <option value="academic_role">Ayudantía / Investigación</option>
                            </select>
                        </div>
                    </div>
                </div>

                {(formData.category === 'course_chair' || formData.category === 'academic_role') && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                            Nombre del Profesor / Mentor
                        </label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                value={formData.professor_name}
                                onChange={(e) => setFormData({ ...formData, professor_name: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-serif italic"
                                placeholder="Ej: Dr. Alberto Pérez"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        Distinción / Mención Especial (Opcional)
                    </label>
                    <div className="relative">
                        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            value={formData.distinction}
                            onChange={(e) => setFormData({ ...formData, distinction: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
                            placeholder="Ej: Summa Cum Laude / Primer Puesto"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg text-xs font-mono font-bold tracking-widest uppercase hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : (achievementToEdit ? 'Actualizar' : 'Guardar')}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
