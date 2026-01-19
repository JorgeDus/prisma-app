'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { X, Globe, Plus, Loader2, Building2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { useRouter } from 'next/navigation'
import { Language } from '@/types/database.types'

interface LanguagesModalProps {
    isOpen: boolean
    onClose: () => void
    initialLanguages: Language[]
    userId: string
}

const LANGUAGE_OPTIONS = [
    "Español", "Inglés", "Portugués", "Francés", "Alemán",
    "Italiano", "Chino Mandarín", "Japonés", "Coreano", "Ruso"
]

const LEVEL_OPTIONS = [
    { value: 'Nativo / Bilingüe', label: 'Nativo / Bilingüe' },
    { value: 'Avanzado (C1-C2)', label: 'Avanzado (C1-C2)' },
    { value: 'Intermedio (B1-B2)', label: 'Intermedio (B1-B2)' },
    { value: 'Básico (A1-A2)', label: 'Básico (A1-A2)' },
] as const

type LanguageLevel = typeof LEVEL_OPTIONS[number]['value']

export default function LanguagesModal({ isOpen, onClose, initialLanguages, userId }: LanguagesModalProps) {
    const [languages, setLanguages] = useState<Language[]>(initialLanguages)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState('')
    const [selectedLevel, setSelectedLevel] = useState<LanguageLevel>('Intermedio (B1-B2)')
    const [institution, setInstitution] = useState('')
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        if (isOpen) {
            setLanguages(initialLanguages)
        }
    }, [isOpen, initialLanguages])

    const handleAddLanguage = async () => {
        if (!selectedLanguage) return

        // Check if language already exists
        if (languages.some(l => l.language === selectedLanguage)) {
            alert('Este idioma ya está agregado.')
            return
        }

        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('languages')
                .insert({
                    user_id: userId,
                    language: selectedLanguage,
                    level: selectedLevel,
                    institution: institution.trim() || null
                })
                .select()
                .single()

            if (error) throw error

            setLanguages([...languages, data])
            setSelectedLanguage('')
            setSelectedLevel('Intermedio (B1-B2)')
            setInstitution('')
        } catch (error: any) {
            console.error('Error adding language:', error)
            alert('Error al agregar idioma: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveLanguage = async (id: string) => {
        setIsLoading(true)
        try {
            const { error } = await supabase
                .from('languages')
                .delete()
                .eq('id', id)

            if (error) throw error

            setLanguages(languages.filter(l => l.id !== id))
        } catch (error: any) {
            console.error('Error removing language:', error)
            alert('Error al eliminar idioma: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        router.refresh()
        onClose()
    }

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Nativo / Bilingüe': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case 'Avanzado (C1-C2)': return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'Intermedio (B1-B2)': return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'Básico (A1-A2)': return 'bg-slate-50 text-slate-600 border-slate-200'
            default: return 'bg-gray-50 text-gray-600 border-gray-200'
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Gestionar Idiomas" maxWidth="max-w-lg">
            <div className="space-y-6">
                <p className="text-sm text-gray-500">
                    Agrega los idiomas que dominas y tu nivel de competencia. Puedes incluir la institución si tienes una certificación.
                </p>

                {/* Current Languages List */}
                <div className="space-y-3 min-h-[80px] p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    {languages.length > 0 ? (
                        languages.map((lang) => (
                            <div
                                key={lang.id}
                                className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm animate-in zoom-in duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <Globe size={18} className="text-indigo-500" />
                                    <div>
                                        <p className="font-bold text-slate-800">{lang.language}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getLevelColor(lang.level)}`}>
                                                {lang.level}
                                            </span>
                                            {lang.institution && (
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    <Building2 size={10} /> {lang.institution}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveLanguage(lang.id)}
                                    disabled={isLoading}
                                    className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full text-gray-400 italic text-center py-4">
                            <Globe size={24} className="mb-2 opacity-20" />
                            <span className="text-xs">No hay idiomas agregados todavía.</span>
                        </div>
                    )}
                </div>

                {/* Add New Language Form */}
                <div className="space-y-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
                        <Plus size={12} /> Agregar Idioma
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Idioma</label>
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                            >
                                <option value="">Seleccionar...</option>
                                {LANGUAGE_OPTIONS.filter(l => !languages.some(lang => lang.language === l)).map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Nivel</label>
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value as LanguageLevel)}
                                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                            >
                                {LEVEL_OPTIONS.map(level => (
                                    <option key={level.value} value={level.value}>{level.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Institución / Certificación (Opcional)</label>
                        <input
                            type="text"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            placeholder="Ej: Cambridge, TOEFL, Alliance Française..."
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        />
                    </div>
                    <button
                        onClick={handleAddLanguage}
                        disabled={!selectedLanguage || isLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale transition-all"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                        Agregar Idioma
                    </button>
                </div>

                {/* Close Button */}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-100 transition-all"
                    >
                        Listo
                    </button>
                </div>
            </div>
        </Modal>
    )
}
