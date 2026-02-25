'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { X, Plus, Star, Trash2, GraduationCap, Loader2, Pencil } from 'lucide-react'
import { Career, UserCareer, University } from '@/types/database.types'

interface CareersModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
}

export default function CareersModal({ isOpen, onClose, userId }: CareersModalProps) {
    const supabase = createClient()
    const [userCareers, setUserCareers] = useState<(UserCareer & { career?: { id: number; name: string } | null })[]>([])
    const [careersCatalog, setCareersCatalog] = useState<Career[]>([])
    const [universitiesCatalog, setUniversitiesCatalog] = useState<University[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Form state for adding new career
    const [showAddForm, setShowAddForm] = useState(false)
    const [newCareer, setNewCareer] = useState({
        career_id: null as number | null,
        custom_career: '',
        institution: '',
        start_year: new Date().getFullYear(),
        end_year: null as number | null,
        is_current: true,
        is_primary: false,
        degree_type: 'Carrera de Pregrado' as 'Carrera de Pregrado' | 'Magíster' | 'Doctorado' | null
    })

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editCareer, setEditCareer] = useState({
        career_id: null as number | null,
        custom_career: '',
        institution: '',
        start_year: new Date().getFullYear(),
        end_year: null as number | null,
        is_current: true,
        degree_type: 'Carrera de Pregrado' as 'Carrera de Pregrado' | 'Magíster' | 'Doctorado' | null
    })

    // Fetch data on mount
    useEffect(() => {
        if (isOpen) {
            fetchData()
        }
    }, [isOpen])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            // Fetch careers catalog
            const { data: catalog } = await supabase
                .from('careers')
                .select('*')
                .order('name')

            // Fetch universities catalog
            const { data: universities } = await supabase
                .from('universities')
                .select('*')
                .order('name')

            // Fetch user's careers with career name
            const { data: careers } = await supabase
                .from('user_careers')
                .select('*, career:careers(id, name)')
                .eq('user_id', userId)
                .order('is_primary', { ascending: false })

            setCareersCatalog(catalog || [])
            setUniversitiesCatalog(universities || [])
            setUserCareers(careers || [])
        } catch (error) {
            console.error('Error fetching careers:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddCareer = async () => {
        if (!newCareer.career_id && !newCareer.custom_career.trim()) {
            alert('Debes seleccionar una carrera o escribir un nombre personalizado')
            return
        }

        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('user_careers')
                .insert({
                    user_id: userId,
                    career_id: newCareer.career_id,
                    custom_career: newCareer.custom_career.trim() || null,
                    institution: newCareer.institution.trim() || null,
                    start_year: newCareer.start_year,
                    end_year: newCareer.is_current ? null : newCareer.end_year,
                    is_current: newCareer.is_current,
                    is_primary: userCareers.length === 0, // First career is primary by default
                    degree_type: newCareer.degree_type
                })

            if (error) throw error

            // Reset form and refresh
            setNewCareer({
                career_id: null,
                custom_career: '',
                institution: '',
                start_year: new Date().getFullYear(),
                end_year: null,
                is_current: true,
                is_primary: false,
                degree_type: 'Carrera de Pregrado'
            })
            setShowAddForm(false)
            await fetchData()
        } catch (error) {
            console.error('Error adding career:', error)
            alert('Error al agregar carrera')
        } finally {
            setIsSaving(false)
        }
    }

    const handleStartEdit = (uc: UserCareer & { career?: { id: number; name: string } | null }) => {
        setEditingId(uc.id)
        setEditCareer({
            career_id: uc.career_id,
            custom_career: uc.custom_career || '',
            institution: uc.institution || '',
            start_year: uc.start_year || new Date().getFullYear(),
            end_year: uc.end_year,
            is_current: uc.is_current,
            degree_type: uc.degree_type || 'Carrera de Pregrado'
        })
        setShowAddForm(false)
    }

    const handleSaveEdit = async () => {
        if (!editingId) return
        if (!editCareer.career_id && !editCareer.custom_career.trim()) {
            alert('Debes seleccionar una carrera o escribir un nombre personalizado')
            return
        }

        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('user_careers')
                .update({
                    career_id: editCareer.career_id,
                    custom_career: editCareer.custom_career.trim() || null,
                    institution: editCareer.institution.trim() || null,
                    start_year: editCareer.start_year,
                    end_year: editCareer.is_current ? null : editCareer.end_year,
                    is_current: editCareer.is_current,
                    degree_type: editCareer.degree_type
                })
                .eq('id', editingId)

            if (error) throw error

            setEditingId(null)
            await fetchData()
        } catch (error) {
            console.error('Error updating career:', error)
            alert('Error al actualizar carrera')
        } finally {
            setIsSaving(false)
        }
    }

    const handleSetPrimary = async (careerId: string) => {
        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('user_careers')
                .update({ is_primary: true })
                .eq('id', careerId)

            if (error) throw error
            await fetchData()
        } catch (error) {
            console.error('Error setting primary:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteCareer = async (careerId: string) => {
        if (!confirm('¿Eliminar esta carrera?')) return

        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('user_careers')
                .delete()
                .eq('id', careerId)

            if (error) throw error
            await fetchData()
        } catch (error) {
            console.error('Error deleting career:', error)
        } finally {
            setIsSaving(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <GraduationCap size={20} className="text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Mis Carreras</h2>
                            <p className="text-xs text-slate-500">Gestiona tu formación académica</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={24} className="animate-spin text-indigo-600" />
                        </div>
                    ) : (
                        <>
                            {/* Existing careers */}
                            {userCareers.length > 0 ? (
                                <div className="space-y-3">
                                    {userCareers.map((uc) => (
                                        <div
                                            key={uc.id}
                                            className={`p-4 rounded-xl border transition-all ${uc.is_primary
                                                ? 'border-indigo-200 bg-indigo-50/50'
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                                }`}
                                        >
                                            {editingId === uc.id ? (
                                                /* Inline edit form */
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold text-slate-900">Editar Carrera</h4>

                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nivel de Estudio</label>
                                                        <select
                                                            value={editCareer.degree_type || 'Carrera de Pregrado'}
                                                            onChange={(e) => setEditCareer({ ...editCareer, degree_type: e.target.value as any })}
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                        >
                                                            <option value="Carrera de Pregrado">Carrera de Pregrado</option>
                                                            <option value="Magíster">Magíster</option>
                                                            <option value="Doctorado">Doctorado</option>
                                                        </select>
                                                    </div>

                                                    {editCareer.degree_type === 'Carrera de Pregrado' && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 mb-1">Carrera / Programa</label>
                                                            <select
                                                                value={editCareer.career_id || ''}
                                                                onChange={(e) => setEditCareer({
                                                                    ...editCareer,
                                                                    career_id: e.target.value ? parseInt(e.target.value) : null,
                                                                    custom_career: e.target.value ? '' : editCareer.custom_career
                                                                })}
                                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                            >
                                                                <option value="">-- Seleccionar del catálogo --</option>
                                                                {careersCatalog.map((c) => (
                                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}

                                                    {(!editCareer.career_id || editCareer.degree_type !== 'Carrera de Pregrado') && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                                {editCareer.degree_type === 'Carrera de Pregrado' ? 'O escribe el nombre' : 'Escribe el nombre'}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={editCareer.custom_career}
                                                                onChange={(e) => setEditCareer({ ...editCareer, custom_career: e.target.value })}
                                                                placeholder={editCareer.degree_type === 'Carrera de Pregrado' ? 'Ej: Ingeniería en Biotecnología' : 'Ej: Astrofísica'}
                                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                            />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Universidad</label>
                                                        <select
                                                            value={editCareer.institution}
                                                            onChange={(e) => setEditCareer({ ...editCareer, institution: e.target.value })}
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                        >
                                                            <option value="">-- Seleccionar universidad --</option>
                                                            {universitiesCatalog.map((u) => (
                                                                <option key={u.id} value={u.name}>{u.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 mb-1">Año inicio</label>
                                                            <input
                                                                type="number"
                                                                value={editCareer.start_year}
                                                                onChange={(e) => setEditCareer({ ...editCareer, start_year: parseInt(e.target.value) })}
                                                                min="1950" max="2030"
                                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 mb-1">Año término</label>
                                                            <input
                                                                type="number"
                                                                value={editCareer.end_year || ''}
                                                                onChange={(e) => setEditCareer({ ...editCareer, end_year: e.target.value ? parseInt(e.target.value) : null })}
                                                                min="1950" max="2030"
                                                                disabled={editCareer.is_current}
                                                                placeholder={editCareer.is_current ? 'Presente' : ''}
                                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                                                            />
                                                        </div>
                                                    </div>

                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={editCareer.is_current}
                                                            onChange={(e) => setEditCareer({ ...editCareer, is_current: e.target.checked })}
                                                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                                        />
                                                        <span className="text-sm text-slate-700">Actualmente cursando</span>
                                                    </label>

                                                    <div className="flex gap-2 pt-2">
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            onClick={handleSaveEdit}
                                                            disabled={isSaving}
                                                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                                        >
                                                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                                                            Guardar
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold text-slate-900 truncate">
                                                                {(uc as any).career?.name || uc.custom_career}
                                                            </h3>
                                                            {uc.degree_type && uc.degree_type !== 'Carrera de Pregrado' && (
                                                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                                                                    {uc.degree_type}
                                                                </span>
                                                            )}
                                                            {uc.is_primary && (
                                                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">
                                                                    <Star size={10} /> Principal
                                                                </span>
                                                            )}
                                                        </div>
                                                        {uc.institution && (
                                                            <p className="text-sm text-slate-500 mt-0.5">{uc.institution}</p>
                                                        )}
                                                        <p className="text-xs text-slate-400 mt-1">
                                                            {uc.start_year} - {uc.is_current ? 'Presente' : uc.end_year}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleStartEdit(uc)}
                                                            disabled={isSaving}
                                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-700"
                                                            title="Editar"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        {!uc.is_primary && (
                                                            <button
                                                                onClick={() => handleSetPrimary(uc.id)}
                                                                disabled={isSaving}
                                                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
                                                                title="Marcar como principal"
                                                            >
                                                                <Star size={16} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteCareer(uc.id)}
                                                            disabled={isSaving}
                                                            className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-slate-400 hover:text-rose-600"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    <GraduationCap size={32} className="mx-auto mb-3 opacity-50" />
                                    <p>No has agregado carreras aún</p>
                                </div>
                            )}

                            {/* Add new career form */}
                            {showAddForm ? (
                                <div className="mt-4 p-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30 space-y-4">
                                    <h4 className="font-semibold text-slate-900">Nueva Carrera</h4>

                                    {/* Nivel de Estudio */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Nivel de Estudio
                                        </label>
                                        <select
                                            value={newCareer.degree_type || 'Carrera de Pregrado'}
                                            onChange={(e) => setNewCareer({ ...newCareer, degree_type: e.target.value as any })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="Carrera de Pregrado">Carrera de Pregrado</option>
                                            <option value="Magíster">Magíster</option>
                                            <option value="Doctorado">Doctorado</option>
                                        </select>
                                    </div>

                                    {/* Career selection */}
                                    {newCareer.degree_type === 'Carrera de Pregrado' && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Carrera / Programa
                                            </label>
                                            <select
                                                value={newCareer.career_id || ''}
                                                onChange={(e) => setNewCareer({
                                                    ...newCareer,
                                                    career_id: e.target.value ? parseInt(e.target.value) : null,
                                                    custom_career: e.target.value ? '' : newCareer.custom_career
                                                })}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">-- Seleccionar del catálogo --</option>
                                                {careersCatalog.map((c) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Custom career if not selected from catalog */}
                                    {(!newCareer.career_id || newCareer.degree_type !== 'Carrera de Pregrado') && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                {newCareer.degree_type === 'Carrera de Pregrado' ? 'O escribe el nombre' : 'Escribe el nombre'}
                                            </label>
                                            <input
                                                type="text"
                                                value={newCareer.custom_career}
                                                onChange={(e) => setNewCareer({ ...newCareer, custom_career: e.target.value })}
                                                placeholder={newCareer.degree_type === 'Carrera de Pregrado' ? 'Ej: Ingeniería en Biotecnología' : 'Ej: Astrofísica'}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                    )}

                                    {/* Universidad */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Universidad
                                        </label>
                                        <select
                                            value={newCareer.institution}
                                            onChange={(e) => setNewCareer({ ...newCareer, institution: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">-- Seleccionar universidad --</option>
                                            {universitiesCatalog.map((u) => (
                                                <option key={u.id} value={u.name}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Years */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Año inicio
                                            </label>
                                            <input
                                                type="number"
                                                value={newCareer.start_year}
                                                onChange={(e) => setNewCareer({ ...newCareer, start_year: parseInt(e.target.value) })}
                                                min="1950"
                                                max="2030"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Año término
                                            </label>
                                            <input
                                                type="number"
                                                value={newCareer.end_year || ''}
                                                onChange={(e) => setNewCareer({ ...newCareer, end_year: e.target.value ? parseInt(e.target.value) : null })}
                                                min="1950"
                                                max="2030"
                                                disabled={newCareer.is_current}
                                                placeholder={newCareer.is_current ? 'Presente' : ''}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Is current */}
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newCareer.is_current}
                                            onChange={(e) => setNewCareer({ ...newCareer, is_current: e.target.checked })}
                                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-slate-700">Actualmente cursando</span>
                                    </label>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => setShowAddForm(false)}
                                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleAddCareer}
                                            disabled={isSaving}
                                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="w-full mt-4 px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} />
                                    Agregar Carrera
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                        Listo
                    </button>
                </div>
            </div>
        </div>
    )
}
