'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2, GraduationCap, User, Star, Settings, Plus } from 'lucide-react'
import { University, Career, Profile, UserCareer } from '@/types/database.types'
import CareersModal from '@/components/dashboard/CareersModal'

interface OnboardingFormProps {
    universities: University[]
    careers: Career[]
    userProfile: Profile
}

export default function OnboardingForm({ universities, careers, userProfile }: OnboardingFormProps) {
    const router = useRouter()
    const supabase = createClient()

    const [isLoading, setIsLoading] = useState(false)
    const [isCareersModalOpen, setIsCareersModalOpen] = useState(false)
    const [userCareers, setUserCareers] = useState<(UserCareer & { career?: { id: number; name: string } | null })[]>([])

    const [formData, setFormData] = useState({
        full_name: userProfile.full_name || '',
        gender: userProfile.gender || '',
        custom_gender: userProfile.custom_gender || '',
    })

    // Fetch user careers on mount
    useEffect(() => {
        fetchUserCareers()
    }, [])

    const fetchUserCareers = async () => {
        const { data } = await supabase
            .from('user_careers')
            .select('*, career:careers(id, name)')
            .eq('user_id', userProfile.id)
            .order('is_primary', { ascending: false })

        if (data) setUserCareers(data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate that at least one career is added
        if (userCareers.length === 0) {
            alert('Por favor agrega al menos una carrera antes de continuar')
            return
        }

        setIsLoading(true)

        try {
            // Update profile with full_name and gender
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    gender: formData.gender || null,
                    custom_gender: formData.gender === 'otro' ? formData.custom_gender : null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userProfile.id)

            if (profileError) {
                console.error('Profile update error:', profileError)
                throw profileError
            }

            router.push('/dashboard')
            router.refresh()

        } catch (error: any) {
            console.error('Error completo atrapado:', error)
            alert(`Error al guardar el perfil: ${error.message || 'Error desconocido'}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCareersModalClose = async () => {
        setIsCareersModalOpen(false)
        // Refresh careers after modal closes
        await fetchUserCareers()
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre Completo */}
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                        Nombre Completo
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="full_name"
                            id="full_name"
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all text-gray-900 placeholder-gray-500 font-medium"
                            placeholder="Ej: Juan Pérez"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        />
                    </div>
                </div>

                {/* Identidad de Género */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                        Identidad de Género <span className="text-gray-400 font-normal text-xs">(Opcional)</span>
                    </label>
                    <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value, custom_gender: '' })}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all text-gray-900 bg-white font-medium"
                    >
                        <option value="" disabled>Selecciona una opción</option>
                        <option value="mujer">Mujer</option>
                        <option value="hombre">Hombre</option>
                        <option value="no_binario">No binario</option>
                        <option value="otro">Prefiero autodescribirme</option>
                        <option value="prefiero_no_decirlo">Prefiero no decirlo</option>
                    </select>
                    <p className="text-[11px] text-gray-500 mt-1">
                        Utilizamos esta información de forma confidencial para entender a nuestra comunidad. No se mostrará públicamente.
                    </p>
                </div>

                {formData.gender === 'otro' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <input
                            type="text"
                            placeholder="¿Cómo te describes?"
                            value={formData.custom_gender}
                            onChange={(e) => setFormData({ ...formData, custom_gender: e.target.value })}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all text-gray-900 placeholder-gray-500 font-medium"
                        />
                    </div>
                )}

                {/* Formación Académica Section */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                    <div className="flex items-center gap-2 text-gray-700">
                        <GraduationCap size={18} className="text-purple-600" />
                        <span className="text-sm font-semibold">Formación Académica</span>
                    </div>

                    {/* List of existing careers */}
                    {userCareers.length > 0 ? (
                        <div className="space-y-2">
                            {userCareers.map((uc) => (
                                <div
                                    key={uc.id}
                                    className={`p-3 rounded-lg border ${uc.is_primary ? 'border-purple-200 bg-purple-50/50' : 'border-gray-100 bg-white'}`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm text-gray-900 truncate">
                                                    {(uc as any).career?.name || uc.custom_career}
                                                </span>
                                                {uc.degree_type && uc.degree_type !== 'Carrera de Pregrado' && (
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                                                        {uc.degree_type}
                                                    </span>
                                                )}
                                                {uc.is_primary && (
                                                    <Star size={12} className="text-purple-600 flex-shrink-0" fill="currentColor" />
                                                )}
                                            </div>
                                            {uc.institution && (
                                                <p className="text-xs text-gray-500 truncate">{uc.institution}</p>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-mono flex-shrink-0">
                                            {uc.start_year} - {uc.is_current ? 'Actual' : uc.end_year}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-400">
                            <GraduationCap size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No has agregado carreras aún</p>
                            <p className="text-xs">Haz clic en el botón para agregar tu primera carrera</p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setIsCareersModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-purple-300 rounded-xl text-sm font-medium text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-all"
                    >
                        {userCareers.length === 0 ? (
                            <>
                                <Plus size={18} />
                                Agregar Carrera
                            </>
                        ) : (
                            <>
                                <Settings size={16} />
                                Gestionar Carreras
                            </>
                        )}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !formData.full_name || userCareers.length === 0}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-cyan-500 hover:from-purple-800 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        'Guardar y Continuar'
                    )}
                </button>

                {userCareers.length === 0 && (
                    <p className="text-center text-xs text-amber-600">
                        ⚠️ Debes agregar al menos una carrera para continuar
                    </p>
                )}
            </form>

            {/* Careers Modal */}
            <CareersModal
                isOpen={isCareersModalOpen}
                onClose={handleCareersModalClose}
                userId={userProfile.id}
            />
        </>
    )
}
