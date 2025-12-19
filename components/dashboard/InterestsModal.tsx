
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { X, Heart, Plus, Loader2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { useRouter } from 'next/navigation'

interface InterestsModalProps {
    isOpen: boolean
    onClose: () => void
    initialInterests: string[]
    profileId: string
}

export default function InterestsModal({ isOpen, onClose, initialInterests, profileId }: InterestsModalProps) {
    const [interests, setInterests] = useState<string[]>(initialInterests)
    const [isLoading, setIsLoading] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const supabase = createClient()
    const router = useRouter()

    const handleAddInterest = () => {
        const val = inputValue.trim()
        if (val && !interests.includes(val)) {
            setInterests([...interests, val])
            setInputValue('')
        }
    }

    const handleRemoveInterest = (idx: number) => {
        setInterests(interests.filter((_, i) => i !== idx))
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    interests: interests,
                    updated_at: new Date().toISOString()
                })
                .eq('id', profileId)

            if (error) throw error

            router.refresh()
            onClose()
        } catch (error: any) {
            console.error('Error saving interests:', error)
            alert('Error al guardar intereses: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gestionar Intereses" maxWidth="max-w-md">
            <div className="space-y-6">
                <p className="text-sm text-gray-500">
                    Agrega hobbies, pasiones o temas que te interesen. Esto ayuda a que otros conecten contigo a un nivel más personal.
                </p>

                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                        {interests.map((interest, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-100 text-purple-700 rounded-xl text-sm font-bold shadow-sm animate-in zoom-in duration-200"
                            >
                                {interest}
                                <button
                                    onClick={() => handleRemoveInterest(idx)}
                                    className="hover:text-rose-500 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                        {interests.length === 0 && (
                            <div className="flex flex-col items-center justify-center w-full text-gray-400 italic text-center py-4">
                                <Heart size={24} className="mb-2 opacity-20" />
                                <span className="text-xs">No hay intereses agregados todavía.</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-3 text-gray-400">
                                <Plus size={18} />
                            </span>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleAddInterest()
                                    }
                                }}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all"
                                placeholder="Ej: ⚽ Fútbol, 🎨 Diseño, 🍕 Pizza..."
                            />
                        </div>
                        <button
                            onClick={handleAddInterest}
                            disabled={!inputValue.trim()}
                            className="px-4 py-2.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 disabled:grayscale transition-all"
                        >
                            Agregar
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-100 transition-all disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
