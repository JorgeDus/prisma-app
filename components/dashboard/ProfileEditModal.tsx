'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2, User, Type, FileText, School, Upload, X, Move, GraduationCap, Plus, Star, Settings, Pause, Play, Trash2, AlertTriangle, Mail, Calendar, Briefcase } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { Profile, University, Career, UserCareer } from '@/types/database.types'
import Combobox from '@/components/ui/Combobox'
import CareersModal from './CareersModal'

interface ProfileEditModalProps {
    profile: Profile
    isOpen: boolean
    onClose: () => void
}

export default function ProfileEditModal({ profile, isOpen, onClose }: ProfileEditModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Catálogos
    const [universities, setUniversities] = useState<University[]>([])
    const [careers, setCareers] = useState<Career[]>([])
    const [userCareers, setUserCareers] = useState<(UserCareer & { career?: { id: number; name: string } | null })[]>([])

    // Avatar State
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url || null)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)

    // Crop State
    const [cropSettings, setCropSettings] = useState({
        zoom: 1,
        x: 50, // 50% (center)
        y: 50  // 50% (center)
    })
    const [isAdjusting, setIsAdjusting] = useState(false)
    const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | 'same' | 'idle'>('idle')
    const [isCareersModalOpen, setIsCareersModalOpen] = useState(false)

    // Account Management State
    const [isPaused, setIsPaused] = useState(profile.is_paused || false)
    const [isPausingAccount, setIsPausingAccount] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isRequestingDeletion, setIsRequestingDeletion] = useState(false)
    const [deletionRequested, setDeletionRequested] = useState(!!profile.deletion_requested_at)

    const [formData, setFormData] = useState({
        username: profile.username || '',
        full_name: profile.full_name || '',
        headline: profile.headline || '',
        about: profile.about || '',
        university_id: profile.university_id || '',
        career_id: profile.career_id || '',
        career_start_date: profile.career_start_date || '',
        career_end_date: profile.career_end_date || '',
        custom_university: profile.custom_university || '',
        custom_career: profile.custom_career || '',
        career_status: (profile as any).career_status || '',
    })

    const [isStudying, setIsStudying] = useState(!profile.career_end_date || new Date(profile.career_end_date) > new Date())

    useEffect(() => {
        if (isOpen) {
            setFormData({
                username: profile.username || '',
                full_name: profile.full_name || '',
                headline: profile.headline || '',
                about: profile.about || '',
                university_id: profile.university_id || '',
                career_id: profile.career_id || '',
                career_start_date: profile.career_start_date || '',
                career_end_date: profile.career_end_date || '',
                custom_university: profile.custom_university || '',
                custom_career: profile.custom_career || '',
                career_status: (profile as any).career_status || '',
            })

            const fetchCatalogs = async () => {
                const { data: u } = await supabase.from('universities').select('*').order('name')
                const { data: c } = await supabase.from('careers').select('*').order('name')
                const { data: uc } = await supabase
                    .from('user_careers')
                    .select('*, career:careers(id, name)')
                    .eq('user_id', profile.id)
                    .order('is_primary', { ascending: false })
                if (u) setUniversities(u)
                if (c) setCareers(c)
                if (uc) setUserCareers(uc)
            }
            fetchCatalogs()
            setIsStudying(!profile.career_end_date || new Date(profile.career_end_date) > new Date())
            setAvatarPreview(profile.avatar_url || null)
        }
    }, [isOpen, profile])

    // Validación de Username
    useEffect(() => {
        const username = formData.username.trim().toLowerCase()

        if (!username || username === profile.username) {
            setUsernameStatus(username === profile.username ? 'same' : 'idle')
            return
        }

        if (username.length < 3) {
            setUsernameStatus('idle')
            return
        }

        const checkAvailability = async () => {
            setUsernameStatus('checking')
            const { data, error } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', username)
                .maybeSingle()

            if (!error) {
                setUsernameStatus(data ? 'taken' : 'available')
            }
        }

        const timer = setTimeout(checkAvailability, 500)
        return () => clearTimeout(timer)
    }, [formData.username, profile.username])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen es demasiado grande (Máx 2MB)')
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string)
            setAvatarFile(file)
            setIsAdjusting(true)
            setCropSettings({ zoom: 1, x: 50, y: 50 })
        }
        reader.readAsDataURL(file)
    }

    const generateCroppedImage = (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            const canvas = canvasRef.current
            if (!canvas || !avatarPreview) return resolve(null)

            const ctx = canvas.getContext('2d')
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.src = avatarPreview
            img.onload = () => {
                const size = 300
                canvas.width = size
                canvas.height = size

                const imgAspect = img.width / img.height
                let drawWidth, drawHeight, offsetX, offsetY

                if (imgAspect > 1) {
                    drawHeight = size * cropSettings.zoom
                    drawWidth = drawHeight * imgAspect
                } else {
                    drawWidth = size * cropSettings.zoom
                    drawHeight = drawWidth / imgAspect
                }

                offsetX = (size / 2) - (drawWidth * (cropSettings.x / 100))
                offsetY = (size / 2) - (drawHeight * (cropSettings.y / 100))

                ctx?.clearRect(0, 0, size, size)
                ctx?.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

                canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9)
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            let finalAvatarUrl = profile.avatar_url
            if (avatarFile && isAdjusting) {
                setUploadingAvatar(true)
                const blob = await generateCroppedImage()
                if (blob) {
                    const fileName = `${profile.id}/${Date.now()}-avatar.jpg`
                    const { error: uploadError } = await supabase.storage
                        .from('avatars')
                        .upload(fileName, blob, { contentType: 'image/jpeg', upsert: true })

                    if (uploadError) throw uploadError

                    const { data: { publicUrl } } = supabase.storage
                        .from('avatars')
                        .getPublicUrl(fileName)

                    finalAvatarUrl = publicUrl
                }
            } else if (!avatarPreview) {
                finalAvatarUrl = null
            }

            const updates: any = {
                username: formData.username.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-t0-9_-]/g, ''),
                full_name: formData.full_name,
                headline: formData.headline,
                about: formData.about,
                avatar_url: finalAvatarUrl,
                university_id: formData.university_id ? Number(formData.university_id) : null,
                career_id: formData.career_id ? Number(formData.career_id) : null,
                career_start_date: formData.career_start_date || null,
                career_end_date: isStudying ? null : (formData.career_end_date || null),
                custom_university: (() => {
                    const selectedId = Number(formData.university_id)
                    const selected = universities.find(u => u.id === selectedId)
                    const name = selected?.name?.toLowerCase() || ''
                    const isOther = name.includes('otro') || name.includes('no listada')
                    return isOther ? formData.custom_university : null
                })(),
                custom_career: (() => {
                    const selectedId = Number(formData.career_id)
                    const selected = careers.find(c => c.id === selectedId)
                    const name = selected?.name?.toLowerCase() || ''
                    const isOther = name.includes('otro') || name.includes('no listada')
                    return isOther ? formData.custom_career : null
                })(),
                career_status: formData.career_status || null,
                updated_at: new Date().toISOString()
            }

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', profile.id)

            if (error) throw error

            onClose()
            setIsAdjusting(false)
            router.refresh()
        } catch (error: any) {
            console.error('Error updating profile:', error)
            alert('Error al actualizar el perfil.')
        } finally {
            setIsLoading(false)
            setUploadingAvatar(false)
        }
    }

    const handlePauseAccount = async () => {
        setIsPausingAccount(true)
        try {
            const newPausedState = !isPaused
            const { error } = await supabase
                .from('profiles')
                .update({
                    is_paused: newPausedState,
                    paused_at: newPausedState ? new Date().toISOString() : null
                })
                .eq('id', profile.id)

            if (error) throw error

            setIsPaused(newPausedState)
            router.refresh()
        } catch (error) {
            console.error('Error toggling pause:', error)
            alert('Error al cambiar el estado de la cuenta')
        } finally {
            setIsPausingAccount(false)
        }
    }

    const handleRequestDeletion = async () => {
        setIsRequestingDeletion(true)
        try {
            // Generate a deletion token
            const token = crypto.randomUUID()
            const { error } = await supabase
                .from('profiles')
                .update({
                    deletion_requested_at: new Date().toISOString(),
                    deletion_token: token
                })
                .eq('id', profile.id)

            if (error) throw error

            // TODO: Send confirmation email to user and notification to admin
            // For now, we'll just mark it as requested
            // The admin email should contain the user's email and the deletion date

            setDeletionRequested(true)
            setShowDeleteConfirm(false)
            alert(`Tu solicitud de eliminación ha sido registrada.\n\nTu cuenta será eliminada definitivamente el ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}.\n\nPuedes cancelar esta solicitud iniciando sesión antes de esa fecha.`)
            router.refresh()
        } catch (error) {
            console.error('Error requesting deletion:', error)
            alert('Error al solicitar la eliminación')
        } finally {
            setIsRequestingDeletion(false)
        }
    }

    const handleCancelDeletion = async () => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    deletion_requested_at: null,
                    deletion_token: null
                })
                .eq('id', profile.id)

            if (error) throw error

            setDeletionRequested(false)
            router.refresh()
        } catch (error) {
            console.error('Error canceling deletion:', error)
            alert('Error al cancelar la solicitud')
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Configuración de Perfil">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-[2rem] border-2 border-slate-100 shadow-sm overflow-hidden bg-slate-50 flex items-center justify-center relative">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                    style={{
                                        transform: isAdjusting ? `scale(${cropSettings.zoom})` : 'none',
                                        objectPosition: isAdjusting ? `${cropSettings.x}% ${cropSettings.y}%` : 'center'
                                    }}
                                />
                            ) : (
                                <User size={32} className="text-slate-300" />
                            )}

                            {uploadingAvatar && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <Loader2 size={24} className="animate-spin text-indigo-600" />
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-slate-700 transition-all shadow-md"
                        >
                            <Upload size={14} />
                        </button>

                        {avatarPreview && (
                            <button
                                type="button"
                                onClick={() => { setAvatarPreview(null); setAvatarFile(null); setIsAdjusting(false); }}
                                className="absolute -top-1 -right-1 w-6 h-6 bg-white text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center border border-slate-100 shadow-sm transition-colors"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>

                    {isAdjusting && (
                        <div className="w-full max-w-[280px] space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Move size={10} /> Ajustar Imagen
                            </p>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[9px] font-mono text-slate-400 uppercase">
                                        <span>Zoom</span>
                                        <span>{cropSettings.zoom}x</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="3" step="0.1"
                                        value={cropSettings.zoom}
                                        onChange={(e) => setCropSettings({ ...cropSettings, zoom: parseFloat(e.target.value) })}
                                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[9px] font-mono text-slate-400 uppercase">
                                        <span>Horizontal</span>
                                        <span>{cropSettings.x}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100"
                                        value={cropSettings.x}
                                        onChange={(e) => setCropSettings({ ...cropSettings, x: parseInt(e.target.value) })}
                                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[9px] font-mono text-slate-400 uppercase">
                                        <span>Vertical</span>
                                        <span>{cropSettings.y}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100"
                                        value={cropSettings.y}
                                        onChange={(e) => setCropSettings({ ...cropSettings, y: parseInt(e.target.value) })}
                                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Identity Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tu Link Personal / Username</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-[10px]">tuprisma.com/</span>
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                className={`w-full pl-[95px] pr-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-slate-900 font-mono text-sm ${usernameStatus === 'taken' ? 'border-red-300 focus:ring-red-500' :
                                    usernameStatus === 'available' ? 'border-green-300 focus:ring-green-500' :
                                        'border-slate-200 focus:ring-indigo-500'
                                    }`}
                                placeholder="tu_nombre"
                            />
                            {usernameStatus === 'checking' && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Loader2 size={14} className="animate-spin text-slate-400" />
                                </div>
                            )}
                        </div>
                        <div className="mt-1 flex justify-between items-center px-1">
                            {usernameStatus === 'taken' && <p className="text-[9px] text-red-500 font-bold uppercase tracking-wider">❌ Ocupado</p>}
                            {usernameStatus === 'available' && <p className="text-[9px] text-green-600 font-bold uppercase tracking-wider">✨ Disponible</p>}
                            {usernameStatus === 'same' && <p className="text-[9px] text-slate-400 font-mono uppercase">Tu link actual</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre Completo</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                required
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="Tu nombre"
                            />
                        </div>
                    </div>
                </div>

                {/* Impact Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titular Académico / Profesional</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                value={formData.headline}
                                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="Ej: Estudiante de Ingeniería | Innovador Social"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
                            <textarea
                                value={formData.about}
                                onChange={(e) => {
                                    if (e.target.value.length <= 200) {
                                        setFormData({ ...formData, about: e.target.value })
                                    }
                                }}
                                maxLength={150}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[100px] resize-none leading-relaxed"
                                placeholder="Describe brevemente tu trayectoria..."
                            />
                        </div>
                        <div className="flex justify-end mt-1">
                            <span className={`text-xs ${formData.about.length >= 100 ? 'text-amber-500' : 'text-slate-400'} ${formData.about.length >= 150 ? 'text-red-500 font-semibold' : ''}`}>
                                {formData.about.length}/150
                            </span>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-600">
                                <GraduationCap size={16} />
                                <span className="text-sm font-semibold">Formación Académica</span>
                            </div>
                        </div>

                        {/* List of existing careers */}
                        {userCareers.length > 0 ? (
                            <div className="space-y-2">
                                {userCareers.map((uc) => (
                                    <div
                                        key={uc.id}
                                        className={`p-3 rounded-lg border ${uc.is_primary ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-100 bg-white'}`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm text-slate-900 truncate">
                                                        {(uc as any).career?.name || uc.custom_career}
                                                    </span>
                                                    {uc.is_primary && (
                                                        <Star size={12} className="text-indigo-600 flex-shrink-0" fill="currentColor" />
                                                    )}
                                                </div>
                                                {uc.institution && (
                                                    <p className="text-xs text-slate-500 truncate">{uc.institution}</p>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                                                {uc.start_year} - {uc.is_current ? 'Actual' : uc.end_year}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 text-center py-2">
                                No has agregado carreras aún
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={() => setIsCareersModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
                        >
                            <Settings size={16} />
                            Gestionar Carreras
                        </button>
                    </div>
                </div>

                <CareersModal
                    isOpen={isCareersModalOpen}
                    onClose={async () => {
                        setIsCareersModalOpen(false)
                        // Refresh careers list
                        const { data: uc } = await supabase
                            .from('user_careers')
                            .select('*, career:careers(id, name)')
                            .eq('user_id', profile.id)
                            .order('is_primary', { ascending: false })
                        if (uc) setUserCareers(uc)
                    }}
                    userId={profile.id}
                />

                {/* Estado Profesional / Career Status */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Briefcase size={16} />
                        <span className="text-sm font-semibold">Estado Actual</span>
                    </div>
                    <p className="text-xs text-slate-500">
                        ¿En qué etapa de tu carrera te encuentras? Esto es visible para tu universidad.
                    </p>
                    <select
                        value={formData.career_status}
                        onChange={(e) => setFormData({ ...formData, career_status: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-sm font-medium"
                    >
                        <option value="">Sin especificar</option>
                        <option value="estudiante_activo">Estudiante Activo</option>
                        <option value="disponible_para_practica">Disponible para Práctica</option>
                        <option value="en_practica">En Práctica</option>
                        <option value="buscando_primer_empleo">Buscando Primer Empleo</option>
                        <option value="empleado">Empleado (en el área)</option>
                        <option value="empleado_fuera_area">Empleado (fuera del área)</option>
                        <option value="emprendiendo">Emprendiendo</option>
                        <option value="en_posgrado">En Posgrado</option>
                    </select>
                </div>

                {/* Account Management Section */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Settings size={16} className="text-slate-500" />
                        <h3 className="text-sm font-bold text-slate-700">Gestión de Cuenta</h3>
                    </div>

                    {/* Pause Account */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    {isPaused ? <Play size={16} className="text-green-600" /> : <Pause size={16} className="text-amber-600" />}
                                    <span className="text-sm font-semibold text-slate-700">
                                        {isPaused ? 'Reactivar Perfil' : 'Pausar Perfil'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    {isPaused
                                        ? 'Tu perfil está oculto. Reactívalo para volver a aparecer en búsquedas.'
                                        : 'Tu perfil no aparecerá en búsquedas ni será visible públicamente. Tus conexiones se mantendrán.'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handlePauseAccount}
                                disabled={isPausingAccount}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isPaused
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                    } disabled:opacity-50`}
                            >
                                {isPausingAccount ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : isPaused ? (
                                    <><Play size={14} /> Reactivar</>
                                ) : (
                                    <><Pause size={14} /> Pausar</>
                                )}
                            </button>
                        </div>
                        {isPaused && profile.paused_at && (
                            <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                <Calendar size={10} />
                                Pausado desde {new Date(profile.paused_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        )}
                    </div>

                    {/* Delete Account */}
                    <div className="mt-4 p-4 bg-red-50/50 rounded-xl border border-red-100 space-y-3">
                        {!showDeleteConfirm && !deletionRequested ? (
                            <>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Trash2 size={16} className="text-red-600" />
                                            <span className="text-sm font-semibold text-red-700">Eliminar Cuenta</span>
                                        </div>
                                        <p className="text-xs text-red-600/70 mt-1">
                                            Esta acción es irreversible. Tu perfil y todos tus datos serán eliminados permanentemente.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                                    >
                                        <Trash2 size={14} />
                                        Eliminar
                                    </button>
                                </div>
                            </>
                        ) : deletionRequested ? (
                            <>
                                <div className="flex items-center gap-2 text-amber-600">
                                    <AlertTriangle size={16} />
                                    <span className="text-sm font-bold">Eliminación Programada</span>
                                </div>
                                <p className="text-xs text-slate-600">
                                    Tu cuenta será eliminada el{' '}
                                    <strong>
                                        {profile.deletion_requested_at && new Date(new Date(profile.deletion_requested_at).getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </strong>.
                                    Puedes cancelar esta solicitud en cualquier momento.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleCancelDeletion}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all"
                                >
                                    Cancelar Eliminación
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle size={16} />
                                    <span className="text-sm font-bold">¿Estás seguro?</span>
                                </div>
                                <div className="p-3 bg-white rounded-lg border border-red-200 space-y-2">
                                    <p className="text-xs text-slate-600">
                                        Al confirmar, iniciarás un periodo de gracia de <strong>14 días</strong>. Durante este tiempo:
                                    </p>
                                    <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
                                        <li>Tu perfil será ocultado</li>
                                        <li>Puedes cancelar la eliminación iniciando sesión</li>
                                        <li>Después de 14 días, todos tus datos serán borrados permanentemente</li>
                                    </ul>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRequestDeletion}
                                        disabled={isRequestingDeletion}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                                    >
                                        {isRequestingDeletion ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <><Mail size={14} /> Confirmar Eliminación</>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || uploadingAvatar || usernameStatus === 'taken'}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Actualizar Perfil'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
