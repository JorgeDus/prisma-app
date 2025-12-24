'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Pencil, Loader2, User, Type, FileText, School, GraduationCap, Calendar, Upload, X, ImageIcon, Move, Heart, Plus } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { Profile, University, Career } from '@/types/database.types'
import Combobox from '@/components/ui/Combobox'

interface EditProfileButtonProps {
    profile: Profile
}

export default function EditProfileButton({ profile }: EditProfileButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
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
            // Sincronizar formData con el perfil más reciente al abrir
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
        }
    }, [isOpen, profile])

    // Validación de Username en tiempo real
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
            img.crossOrigin = 'anonymous' // Necesario para imágenes de Supabase
            img.src = avatarPreview
            img.onload = () => {
                const size = 300 // Output size 300x300
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

                // Calculate center with manual offsets
                // x, y are 0-100
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
            // Si hay un ajuste pendiente o nuevo archivo, procesar crop
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

            console.log('Enviando actualizaciones:', updates)

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', profile.id)

            if (error) {
                console.error('Error detallado de Supabase:', JSON.stringify(error, null, 2))
                console.dir(error)
                throw error
            }

            setIsOpen(false)
            setIsAdjusting(false)
            router.refresh()
        } catch (error: any) {
            console.error('Error completo atrapado:', error)
            let errorMessage = error.message || 'Error desconocido'
            if (error.code === '23505') {
                errorMessage = 'Este nombre de usuario ya está en uso. Por favor elige otro.'
            }
            alert(`Error al actualizar el perfil: ${errorMessage}`)
        } finally {
            setIsLoading(false)
            setUploadingAvatar(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-semibold transition-colors shadow-lg shadow-gray-200"
            >
                <Pencil size={16} />
                <span>Editar Datos del Perfil</span>
            </button>

            <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); setIsAdjusting(false); }} title="Editar Perfil">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Avatar Upload with Adjust */}
                    <div className="flex flex-col items-center gap-4 pb-4 border-b border-gray-100">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center relative">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar"
                                        className="w-full h-full object-cover transition-transform"
                                        style={{
                                            transform: isAdjusting ? `scale(${cropSettings.zoom})` : 'none',
                                            objectPosition: isAdjusting ? `${cropSettings.x}% ${cropSettings.y}%` : 'center'
                                        }}
                                    />
                                ) : (
                                    <User size={40} className="text-gray-300" />
                                )}

                                {uploadingAvatar && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                        <Loader2 size={24} className="animate-spin text-purple-600" />
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg border-2 border-white transition-transform transform hover:scale-110"
                            >
                                <Upload size={14} />
                            </button>

                            {avatarPreview && (
                                <button
                                    type="button"
                                    onClick={() => { setAvatarPreview(null); setAvatarFile(null); setIsAdjusting(false); }}
                                    className="absolute -top-1 -right-1 p-1 bg-white hover:bg-gray-100 text-gray-400 hover:text-rose-500 rounded-full shadow border transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {isAdjusting && (
                            <div className="w-full max-w-[280px] space-y-3 p-3 bg-purple-50 rounded-xl border border-purple-100 animate-fade-in">
                                <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                                    <Move size={10} /> Ajustar Imagen
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-purple-600 w-8 font-bold">Zoom</span>
                                        <input
                                            type="range" min="1" max="3" step="0.1"
                                            value={cropSettings.zoom}
                                            onChange={(e) => setCropSettings({ ...cropSettings, zoom: parseFloat(e.target.value) })}
                                            className="flex-1 h-1 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-purple-600 w-8 font-bold">Pos X</span>
                                        <input
                                            type="range" min="0" max="100"
                                            value={cropSettings.x}
                                            onChange={(e) => setCropSettings({ ...cropSettings, x: parseInt(e.target.value) })}
                                            className="flex-1 h-1 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-purple-600 w-8 font-bold">Pos Y</span>
                                        <input
                                            type="range" min="0" max="100"
                                            value={cropSettings.y}
                                            onChange={(e) => setCropSettings({ ...cropSettings, y: parseInt(e.target.value) })}
                                            className="flex-1 h-1 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file" accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {/* Hidden canvas for generation */}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tu Link Personal (Username)</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-3 text-gray-400 font-medium text-sm">tuprisma.com/</span>
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                className={`w-full pl-[105px] pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-gray-900 font-bold ${usernameStatus === 'taken' ? 'border-red-300 focus:ring-red-500' :
                                    usernameStatus === 'available' ? 'border-green-300 focus:ring-green-500' : 'border-gray-200 focus:ring-purple-500'
                                    }`}
                                placeholder="tu_nombre"
                            />
                            {usernameStatus === 'checking' && (
                                <div className="absolute right-3 top-3">
                                    <Loader2 size={16} className="animate-spin text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="mt-1.5 flex justify-between items-center">
                            {usernameStatus === 'taken' && <p className="text-[10px] text-red-500 font-bold">❌ Este nombre ya está en uso</p>}
                            {usernameStatus === 'available' && <p className="text-[10px] text-green-600 font-bold">✨ ¡Está disponible!</p>}
                            {usernameStatus === 'same' && <p className="text-[10px] text-gray-400 font-medium">Este es tu nombre actual</p>}
                            {usernameStatus === 'idle' && formData.username.length > 0 && formData.username.length < 3 && <p className="text-[10px] text-amber-600 font-medium">Mínimo 3 caracteres</p>}
                            <p className="text-[10px] text-gray-400 italic">
                                ⚠️ Al cambiar esto, tu link actual dejará de funcionar.
                            </p>
                        </div>
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400"><User size={18} /></span>
                            <input
                                type="text"
                                required
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500 font-medium"
                                placeholder="Tu nombre"
                            />
                        </div>
                    </div>

                    {/* Headline */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titular (Headline)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400"><Type size={18} /></span>
                            <input
                                type="text"
                                value={formData.headline}
                                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500 font-medium"
                                placeholder="Ej: Estudiante de Ingeniería | Desarrollador Web"
                            />
                        </div>
                    </div>

                    {/* Información Académica */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <School size={16} className="text-purple-600" />
                            Información Académica
                        </h4>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Universidad</label>
                                <Combobox
                                    options={universities}
                                    value={formData.university_id.toString()}
                                    onChange={(val) => setFormData({ ...formData, university_id: val })}
                                    placeholder="Busca tu universidad"
                                />
                            </div>

                            {(() => {
                                const selected = universities.find(u => u.id === Number(formData.university_id))
                                return selected?.name.toLowerCase().includes('otro') || selected?.name.toLowerCase().includes('no listada')
                            })() && (
                                    <div className="animate-fade-in">
                                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">¿Cuál es tu universidad?</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.custom_university}
                                            onChange={(e) => setFormData({ ...formData, custom_university: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 font-medium"
                                            placeholder="Nombre de tu universidad"
                                        />
                                    </div>
                                )}

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Carrera</label>
                                <Combobox
                                    options={careers}
                                    value={formData.career_id.toString()}
                                    onChange={(val) => setFormData({ ...formData, career_id: val })}
                                    placeholder="Busca tu carrera"
                                />
                            </div>

                            {(() => {
                                const selectedId = Number(formData.career_id)
                                const selected = careers.find(c => c.id === selectedId)
                                return selected?.name.toLowerCase().includes('otro') || selected?.name.toLowerCase().includes('no listada')
                            })() && (
                                    <div className="animate-fade-in">
                                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">¿Cuál es tu carrera?</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.custom_career}
                                            onChange={(e) => setFormData({ ...formData, custom_career: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 font-medium"
                                            placeholder="Nombre de tu carrera"
                                        />
                                    </div>
                                )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Fecha Ingreso</label>
                                <input
                                    type="date"
                                    value={formData.career_start_date}
                                    onChange={(e) => setFormData({ ...formData, career_start_date: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Fecha Egreso</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isStudying}
                                            onChange={(e) => setIsStudying(e.target.checked)}
                                            className="rounded text-purple-600 focus:ring-purple-500"
                                        />
                                        <span>Cursando actualmente</span>
                                    </label>
                                    {!isStudying && (
                                        <input
                                            type="date"
                                            value={formData.career_end_date}
                                            onChange={(e) => setFormData({ ...formData, career_end_date: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none animate-fade-in text-gray-900 font-medium"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About / Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sobre mí (Bio)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400"><FileText size={18} /></span>
                            <textarea
                                value={formData.about}
                                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all min-h-[120px] resize-none text-gray-900 placeholder-gray-500 font-medium"
                                placeholder="Cuéntanos sobre tus intereses, experiencia y lo que buscas..."
                            />
                        </div>
                    </div>


                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); setIsAdjusting(false); }}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || uploadingAvatar || usernameStatus === 'taken' || (formData.username.length > 0 && formData.username.length < 3)}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading || uploadingAvatar ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
