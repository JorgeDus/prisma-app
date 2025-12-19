
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Trophy, FileBadge, GraduationCap, Calendar, Building2, User, Award, Loader2, Trash2, Users } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { Achievement } from '@/types/database.types'

interface AchievementModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
    achievementToEdit?: Achievement | null
    onSuccess: () => void
}

const CATEGORIES = [
    { id: 'award', label: 'Premio / Reconocimiento', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'certification', label: 'Certificación / Curso', icon: FileBadge, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'academic_role', label: 'Ayudantía / Investigación', icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 'course_chair', label: 'Cátedra Destacada', icon: GraduationCap, color: 'text-indigo-500', bg: 'bg-indigo-50' }
] as const

export default function AchievementModal({ isOpen, onClose, userId, achievementToEdit, onSuccess }: AchievementModalProps) {
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        organization: '',
        date: '',
        category: 'certification' as Achievement['category'],
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

        const data = {
            user_id: userId,
            title: formData.title,
            organization: formData.organization,
            date: formData.date || null,
            category: formData.category,
            professor_name: ['course_chair', 'academic_role'].includes(formData.category) ? formData.professor_name : null,
            distinction: formData.distinction || null,
            updated_at: new Date().toISOString()
        }

        try {
            if (achievementToEdit) {
                const { error } = await supabase
                    .from('achievements')
                    .update(data)
                    .eq('id', achievementToEdit.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('achievements')
                    .insert([data])
                if (error) throw error
            }
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error saving achievement:', error)
            alert('Error al guardar el logro')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!achievementToEdit) return
        if (!confirm('¿Estás seguro de que quieres eliminar este logro?')) return

        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from('achievements')
                .delete()
                .eq('id', achievementToEdit.id)
            if (error) throw error
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error deleting achievement:', error)
            alert('Error al eliminar el logro')
        } finally {
            setIsDeleting(false)
        }
    }

    const selectedCategory = CATEGORIES.find(c => c.id === formData.category)

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={achievementToEdit ? 'Editar Logro' : 'Nuevo Logro / Reconocimiento'}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: cat.id })}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${formData.category === cat.id
                                ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-100'
                                : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200'
                                }`}
                        >
                            <cat.icon size={24} className={formData.category === cat.id ? 'text-purple-600' : 'text-gray-400'} />
                            <span className={`text-[9px] font-black uppercase text-center tracking-wider leading-tight ${formData.category === cat.id ? 'text-purple-700' : 'text-gray-500'
                                }`}>
                                {cat.label}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {/* Título */}
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Título del Logro</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">
                                {selectedCategory && <selectedCategory.icon size={18} />}
                            </span>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-gray-900"
                                placeholder={
                                    formData.category === 'award' ? 'Ej: Beca a la Excelencia Académica' :
                                        formData.category === 'certification' ? 'Ej: Certificación Cloud Computing' :
                                            formData.category === 'course_chair' ? 'Ej: Fundamentos de Programación' :
                                                'Ej: Ayudante de Algoritmos'
                                }
                            />
                        </div>
                    </div>

                    {/* Organización */}
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Institución / Entidad</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400"><Building2 size={18} /></span>
                            <input
                                type="text"
                                required
                                value={formData.organization}
                                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-gray-900"
                                placeholder="Ej: Universidad de Chile"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Fecha */}
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Fecha (Opcional)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400"><Calendar size={18} /></span>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Distinción / Nota */}
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Distinción / Nota</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400"><Award size={18} /></span>
                                <input
                                    type="text"
                                    value={formData.distinction}
                                    onChange={(e) => setFormData({ ...formData, distinction: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-gray-900"
                                    placeholder="Ej: Nota 7.0 / Top 1%"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Solo para Cátedras o Roles Académicos */}
                    {['course_chair', 'academic_role'].includes(formData.category) && (
                        <div className="animate-in slide-in-from-top duration-300">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nombre del Profesor</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400"><User size={18} /></span>
                                <input
                                    type="text"
                                    required
                                    value={formData.professor_name}
                                    onChange={(e) => setFormData({ ...formData, professor_name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-gray-900"
                                    placeholder="Ej: Dr. Ricardo Lagos"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-4 flex items-center justify-between gap-3">
                    {achievementToEdit ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex items-center gap-2 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl font-bold transition-all text-sm"
                        >
                            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            <span className="hidden sm:inline">Eliminar</span>
                        </button>
                    ) : <div />}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-gray-500 hover:bg-gray-100 rounded-xl font-bold transition-all text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-100 transition-all disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Logro'}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    )
}
