'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Type, Calendar, Building2, Tag, Loader2, Users, Sparkles } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import MonthYearPicker from '@/components/ui/MonthYearPicker'

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
        end_date: '',
        is_current: false,
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
                end_date: achievementToEdit.end_date || '',
                is_current: achievementToEdit.is_current || false,
                category: achievementToEdit.category || 'certification',
                professor_name: achievementToEdit.professor_name || '',
                distinction: achievementToEdit.distinction || ''
            })
        } else {
            setFormData({
                title: '',
                organization: '',
                date: '',
                end_date: '',
                is_current: false,
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

            // Solo agregar end_date e is_current para academic_role
            if (formData.category === 'academic_role') {
                dataToSave.end_date = formData.is_current ? null : (formData.end_date || null)
                dataToSave.is_current = formData.is_current
            } else {
                dataToSave.end_date = null
                dataToSave.is_current = null
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

    const isAcademicRole = formData.category === 'academic_role'

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={achievementToEdit ? 'Editar Logro' : 'Nuevo Logro'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Título del Logro
                    </label>
                    <div className="relative">
                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            placeholder="Ej: Beca a la Excelencia Académica"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Institución / Organización
                    </label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            placeholder="Ej: Universidad de Buenos Aires"
                        />
                    </div>
                </div>

                {/* Categoría */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Categoría
                    </label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({
                                ...formData,
                                category: e.target.value as any,
                                // Reset date fields when changing category
                                end_date: '',
                                is_current: false
                            })}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="certification">Certificación</option>
                            <option value="award">Premio / Reconocimiento</option>
                            <option value="course_chair">Cátedra Destacada</option>
                            <option value="academic_role">Investigación</option>
                        </select>
                    </div>
                </div>

                {/* Fechas - Condicional según categoría */}
                {isAcademicRole ? (
                    // Fecha inicio y fin para Ayudantía/Investigación
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                                <Calendar size={16} className="text-purple-500" /> Fecha de Inicio
                            </label>
                            <MonthYearPicker
                                required
                                value={formData.date}
                                onChange={(value) => setFormData({ ...formData, date: value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-0 flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" /> Fecha de Fin
                            </label>
                            <MonthYearPicker
                                disabled={formData.is_current}
                                value={formData.end_date}
                                onChange={(value) => setFormData({ ...formData, end_date: value })}
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_current_ach"
                                    checked={formData.is_current}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        is_current: e.target.checked,
                                        end_date: e.target.checked ? '' : formData.end_date
                                    })}
                                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                                />
                                <label htmlFor="is_current_ach" className="text-sm text-purple-700 font-bold cursor-pointer select-none">
                                    Actualmente en este rol
                                </label>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Fecha simple para otras categorías
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Calendar size={16} className="text-purple-500" /> Fecha
                        </label>
                        <MonthYearPicker
                            value={formData.date}
                            onChange={(value) => setFormData({ ...formData, date: value })}
                        />
                    </div>
                )}

                {(formData.category === 'course_chair' || formData.category === 'academic_role') && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Nombre del Profesor / Mentor
                        </label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                value={formData.professor_name}
                                onChange={(e) => setFormData({ ...formData, professor_name: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                placeholder="Ej: Dr. Alberto Pérez"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Distinción / Mención Especial (Opcional)
                    </label>
                    <div className="relative">
                        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            value={formData.distinction}
                            onChange={(e) => setFormData({ ...formData, distinction: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            placeholder="Ej: Summa Cum Laude / Primer Puesto"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-500 hover:text-gray-700 font-bold text-xs uppercase tracking-widest transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-10 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.1em] shadow-lg shadow-purple-100 transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : (achievementToEdit ? 'Guardar Cambios' : 'Crear Logro')}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
