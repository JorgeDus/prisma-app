'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2, GraduationCap, Building2, User, Calendar } from 'lucide-react'
import { University, Career, Profile } from '@/types/database.types'
import Combobox from '@/components/ui/Combobox'

interface OnboardingFormProps {
    universities: University[]
    careers: Career[]
    userProfile: Profile
}

export default function OnboardingForm({ universities, careers, userProfile }: OnboardingFormProps) {
    const router = useRouter()
    const supabase = createClient()

    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: userProfile.full_name || '',
        university_id: userProfile.university_id?.toString() || '',
        career_id: userProfile.career_id?.toString() || '',
        custom_university: userProfile.custom_university || '',
        custom_career: userProfile.custom_career || '',
        career_start_date: userProfile.career_start_date || '',
        career_end_date: userProfile.career_end_date || '',
    })

    const selectedUni = universities.find(u => u.id.toString() === formData.university_id)
    const isOtherUniversity = !!(selectedUni?.name?.toLowerCase().includes('otro') || selectedUni?.name?.toLowerCase().includes('no listada'))

    const selectedCareer = careers.find(c => c.id.toString() === formData.career_id)
    const isOtherCareer = !!(selectedCareer?.name?.toLowerCase().includes('otro') || selectedCareer?.name?.toLowerCase().includes('no listada'))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const updates = {
                id: userProfile.id,
                full_name: formData.full_name,
                university_id: parseInt(formData.university_id),
                career_id: parseInt(formData.career_id),
                custom_university: isOtherUniversity ? formData.custom_university : null,
                custom_career: isOtherCareer ? formData.custom_career : null,
                career_start_date: formData.career_start_date || null,
                career_end_date: formData.career_end_date || null,
                updated_at: new Date().toISOString(),
            }

            console.log('Onboarding updates:', updates)

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userProfile.id)

            if (error) {
                console.error('Supabase error (onboarding):', error)
                throw error
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

    return (
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

            {/* Universidad */}
            <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                    Universidad
                </label>
                <Combobox
                    options={universities}
                    value={formData.university_id}
                    onChange={(val) => setFormData({ ...formData, university_id: val })}
                    placeholder="Busca tu universidad"
                    icon={<Building2 size={18} />}
                />
            </div>

            {/* Universidad Custom (Solo si selecciona 'Otro') */}
            {isOtherUniversity && (
                <div className="animate-fade-in">
                    <label htmlFor="custom_university" className="block text-sm font-medium text-gray-700">
                        ¿Cuál es tu universidad?
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building2 className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all text-gray-900 placeholder-gray-500 font-medium bg-white"
                            placeholder="Nombre de tu universidad"
                            value={formData.custom_university}
                            onChange={(e) => setFormData({ ...formData, custom_university: e.target.value })}
                        />
                    </div>
                </div>
            )}

            {/* Carrera */}
            <div>
                <label htmlFor="career" className="block text-sm font-medium text-gray-700 mb-1">
                    Carrera
                </label>
                <Combobox
                    options={careers}
                    value={formData.career_id}
                    onChange={(val) => setFormData({ ...formData, career_id: val })}
                    placeholder="Busca tu carrera"
                    icon={<GraduationCap size={18} />}
                />
            </div>

            {/* Carrera Custom (Solo si selecciona 'Otro') */}
            {isOtherCareer && (
                <div className="animate-fade-in">
                    <label htmlFor="custom_career" className="block text-sm font-medium text-gray-700">
                        ¿Cuál es tu carrera?
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <GraduationCap className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all text-gray-900 placeholder-gray-500 font-medium bg-white"
                            placeholder="Nombre de tu carrera"
                            value={formData.custom_career}
                            onChange={(e) => setFormData({ ...formData, custom_career: e.target.value })}
                        />
                    </div>
                </div>
            )}

            {/* Fechas de Carrera */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fecha Inicio */}
                <div>
                    <label htmlFor="career_start_date" className="block text-sm font-medium text-gray-700 mb-1">
                        ¿Cuándo empezaste?
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            required
                            id="career_start_date"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all text-gray-900 font-medium"
                            value={formData.career_start_date}
                            onChange={(e) => setFormData({ ...formData, career_start_date: e.target.value })}
                        />
                    </div>
                </div>

                {/* Fecha Fin */}
                <div>
                    <label htmlFor="career_end_date" className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de egreso (Estimada)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            id="career_end_date"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all text-gray-900 font-medium"
                            value={formData.career_end_date}
                            onChange={(e) => setFormData({ ...formData, career_end_date: e.target.value })}
                        />
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400 italic leading-tight">
                        Puedes dejarlo vacío si aún estás estudiando.
                    </p>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-cyan-500 hover:from-purple-800 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    'Guardar y Continuar'
                )}
            </button>
        </form>
    )
}
