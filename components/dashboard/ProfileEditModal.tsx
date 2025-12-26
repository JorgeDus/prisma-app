'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2, User, Type, FileText, School, Upload, X, Move } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { Profile, University, Career } from '@/types/database.types'
import Combobox from '@/components/ui/Combobox'

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
            })

            const fetchCatalogs = async () => {
                const { data: u } = await supabase.from('universities').select('*').order('name')
                const { data: c } = await supabase.from('careers').select('*').order('name')
                if (u) setUniversities(u)
                if (c) setCareers(c)
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
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Tu Link Personal / Username</label>
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
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Nombre Completo</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                required
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-serif italic"
                                placeholder="Tu nombre"
                            />
                        </div>
                    </div>
                </div>

                {/* Impact Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Titular Académico / Profesional</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                value={formData.headline}
                                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-serif italic"
                                placeholder="Ej: Estudiante de Ingeniería | Innovador Social"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Tesis de Impacto (Bio)</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
                            <textarea
                                value={formData.about}
                                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-serif italic min-h-[100px] resize-none leading-relaxed"
                                placeholder="Describe el propósito de tu trayectoria..."
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                        <div className="flex items-center gap-2 text-slate-600">
                            <School size={16} />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Validación Académica</span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <Combobox
                                options={universities}
                                value={formData.university_id.toString()}
                                onChange={(val) => setFormData({ ...formData, university_id: val })}
                                placeholder="Busca tu universidad"
                            />

                            <Combobox
                                options={careers}
                                value={formData.career_id.toString()}
                                onChange={(val) => setFormData({ ...formData, career_id: val })}
                                placeholder="Busca tu carrera"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase mb-1">Ingreso</label>
                                <input
                                    type="date"
                                    value={formData.career_start_date}
                                    onChange={(e) => setFormData({ ...formData, career_start_date: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase mb-1">Estado</label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={isStudying}
                                        onChange={(e) => setIsStudying(e.target.checked)}
                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-900 transition-colors uppercase">En Curso</span>
                                </label>
                                {!isStudying && (
                                    <input
                                        type="date"
                                        value={formData.career_end_date}
                                        onChange={(e) => setFormData({ ...formData, career_end_date: e.target.value })}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500 animate-in fade-in"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || uploadingAvatar || usernameStatus === 'taken'}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg text-xs font-mono font-bold tracking-widest uppercase hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Actualizar Perfil'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
