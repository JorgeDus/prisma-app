
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Type, Building2, Calendar, Tag, Upload, X, ImageIcon, Move, Plus, Star, Award, Heart, HeartPulse, Palette, Dumbbell, GraduationCap, Briefcase, Zap } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { Experience } from '@/types/database.types'

interface ExperienceFormModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
    experienceToEdit?: Experience | null
    onSuccess: () => void
}

export default function ExperienceFormModal({ isOpen, onClose, userId, experienceToEdit, onSuccess }: ExperienceFormModalProps) {
    const supabase = createClient()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [galleryFiles, setGalleryFiles] = useState<File[]>([])
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])

    // Crop State
    const [cropSettings, setCropSettings] = useState({
        zoom: 1,
        x: 50, // 50% (center)
        y: 50  // 50% (center)
    })
    const [isAdjusting, setIsAdjusting] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        organization: '',
        type: 'otro' as Experience['type'],
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_current: false,
        description: '',
        achievements: '',
        value_reflection: '',
        skills: [] as string[],
        cover_image: '',
        gallery_images: [] as string[],
        is_featured: false
    })

    // Estado local para el input de skills
    const [currentSkill, setCurrentSkill] = useState('')

    // Cargar datos al abrir para editar
    useEffect(() => {
        if (isOpen && experienceToEdit) {
            setFormData({
                title: experienceToEdit.title,
                organization: experienceToEdit.organization,
                type: experienceToEdit.type || 'otro',
                start_date: experienceToEdit.start_date || new Date().toISOString().split('T')[0],
                end_date: experienceToEdit.end_date || '',
                is_current: experienceToEdit.is_current || false,
                description: experienceToEdit.description || '',
                achievements: experienceToEdit.achievements || '',
                value_reflection: experienceToEdit.value_reflection || '',
                skills: experienceToEdit.skills || [],
                cover_image: experienceToEdit.cover_image || '',
                gallery_images: experienceToEdit.gallery_images || [],
                is_featured: experienceToEdit.is_featured || false
            })
            setImagePreview(experienceToEdit.cover_image || null)
            setGalleryPreviews(experienceToEdit.gallery_images || [])
            setImageFile(null)
            setGalleryFiles([])
            setIsAdjusting(false)
        } else if (isOpen && !experienceToEdit) {
            // Reset si es nuevo
            setFormData({
                title: '',
                organization: '',
                type: 'otro',
                start_date: new Date().toISOString().split('T')[0],
                end_date: '',
                is_current: false,
                description: '',
                achievements: '',
                value_reflection: '',
                skills: [],
                cover_image: '',
                gallery_images: [],
                is_featured: false
            })
            setImagePreview(null)
            setGalleryPreviews([])
            setImageFile(null)
            setGalleryFiles([])
            setIsAdjusting(false)
        }
    }, [isOpen, experienceToEdit])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen es demasiado grande. El límite es 2MB.')
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido (JPG, PNG).')
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
            setImageFile(file)
            setIsAdjusting(true)
            setCropSettings({ zoom: 1, x: 50, y: 50 })
        }
        reader.readAsDataURL(file)
    }

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        const totalImages = galleryPreviews.length + files.length
        if (totalImages > 5) {
            alert('Puedes subir un máximo de 5 imágenes para la galería.')
            return
        }

        files.forEach(file => {
            if (file.size > 2 * 1024 * 1024) {
                alert(`La imagen ${file.name} es demasiado grande. El límite es 2MB.`)
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setGalleryPreviews(prev => [...prev, reader.result as string])
                setGalleryFiles(prev => [...prev, file])
            }
            reader.readAsDataURL(file)
        })
    }

    const generateCroppedImage = (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            const canvas = canvasRef.current
            if (!canvas || !imagePreview) return resolve(null)

            const ctx = canvas.getContext('2d')
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.src = imagePreview
            img.onload = () => {
                const width = 800
                const height = 450
                canvas.width = width
                canvas.height = height

                const imgAspect = img.width / img.height
                const targetAspect = width / height

                let drawWidth, drawHeight, offsetX, offsetY

                if (imgAspect > targetAspect) {
                    drawHeight = height * cropSettings.zoom
                    drawWidth = drawHeight * imgAspect
                } else {
                    drawWidth = width * cropSettings.zoom
                    drawHeight = drawWidth / imgAspect
                }

                offsetX = (width / 2) - (drawWidth * (cropSettings.x / 100))
                offsetY = (height / 2) - (drawHeight * (cropSettings.y / 100))

                ctx?.clearRect(0, 0, width, height)
                ctx?.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

                canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.85)
            }
        })
    }

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentSkill.trim()) {
            e.preventDefault()
            if (!formData.skills.includes(currentSkill.trim())) {
                setFormData(prev => ({ ...prev, skills: [...(prev.skills || []), currentSkill.trim()] }))
            }
            setCurrentSkill('')
        }
    }

    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            let finalImageUrl = formData.cover_image
            if (imageFile && isAdjusting) {
                setUploadingImage(true)
                const blob = await generateCroppedImage()
                if (blob) {
                    const fileName = `${userId}/${Date.now()}-experience.jpg`
                    const { error: uploadError } = await supabase.storage
                        .from('project-images') // Reusing same bucket to simplify
                        .upload(fileName, blob, { contentType: 'image/jpeg', upsert: false })

                    if (uploadError) throw uploadError

                    const { data: { publicUrl } } = supabase.storage
                        .from('project-images')
                        .getPublicUrl(fileName)

                    finalImageUrl = publicUrl
                }
            } else if (!imagePreview) {
                finalImageUrl = ''
            }

            const finalGalleryUrls = [...formData.gallery_images]
            if (galleryFiles.length > 0) {
                for (const file of galleryFiles) {
                    const fileName = `${userId}/${Date.now()}-exp-gallery-${Math.random().toString(36).substring(7)}.jpg`
                    const { error: uploadError } = await supabase.storage
                        .from('project-images')
                        .upload(fileName, file, { contentType: file.type, upsert: false })

                    if (uploadError) throw uploadError

                    const { data: { publicUrl } } = supabase.storage
                        .from('project-images')
                        .getPublicUrl(fileName)

                    finalGalleryUrls.push(publicUrl)
                }
            }

            const experienceData = {
                title: formData.title,
                organization: formData.organization,
                type: formData.type,
                start_date: formData.start_date || null,
                end_date: formData.is_current ? null : (formData.end_date || null),
                is_current: formData.is_current,
                description: formData.description || null,
                achievements: formData.achievements || null,
                value_reflection: formData.value_reflection || null,
                skills: formData.skills,
                cover_image: finalImageUrl || null,
                gallery_images: finalGalleryUrls,
                is_featured: formData.is_featured,
                updated_at: new Date().toISOString()
            }

            if (experienceToEdit) {
                const { error } = await supabase
                    .from('experiences')
                    .update(experienceData)
                    .eq('id', experienceToEdit.id)

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('experiences')
                    .insert({
                        user_id: userId,
                        ...experienceData,
                        created_at: new Date().toISOString()
                    })

                if (error) throw error
            }

            onSuccess()
            onClose()
            setIsAdjusting(false)
        } catch (error: any) {
            console.error('Error saving experience:', error)
            alert(`Error al guardar: ${error.message || 'Error desconocido'}`)
        } finally {
            setIsLoading(false)
            setUploadingImage(false)
        }
    }

    const categories = [
        { id: 'liderazgo', label: 'Liderazgo', icon: Award },
        { id: 'social', label: 'Social / Voluntariado', icon: Heart },
        { id: 'emprendimiento', label: 'Emprendimiento', icon: Zap },
        { id: 'empleo_sustento', label: 'Empleo / Sustento', icon: Briefcase },
        { id: 'academico', label: 'Académico (Ayudantías)', icon: GraduationCap },
        { id: 'deportivo', label: 'Deportivo', icon: Dumbbell },
        { id: 'creativo', label: 'Creativo / Artístico', icon: Palette },
        { id: 'cuidado_vida', label: 'Cuidado y Vida', icon: HeartPulse },
        { id: 'otro', label: 'Otro', icon: Star },
    ]

    return (
        <Modal isOpen={isOpen} onClose={() => { onClose(); setIsAdjusting(false); }} title={experienceToEdit ? "Editar Experiencia" : "Nueva Experiencia"}>
            <form onSubmit={handleSubmit} className="space-y-6 pb-4">

                {/* 1. Título y Organización */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Type size={16} className="text-purple-500" /> Título / Rol
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                            placeholder="Ej: Presidente del CEE"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Building2 size={16} className="text-purple-500" /> Organización
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                            placeholder="Ej: Universidad de Chile"
                        />
                    </div>
                </div>

                {/* 2. Categoría */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                        <Tag size={16} className="text-purple-500" /> Categoría de Experiencia
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {categories.map((cat) => {
                            const Icon = cat.icon
                            const isSelected = formData.type === cat.id
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: cat.id as any })}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${isSelected
                                        ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm'
                                        : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={20} className={`mb-1 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                                    <span className="text-xs font-bold text-center">{cat.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* 3. Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Calendar size={16} className="text-purple-500" /> Fecha de Inicio
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 text-sm font-bold cursor-pointer"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700 mb-0 flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" /> Fecha de Fin
                        </label>
                        <input
                            type="date"
                            disabled={formData.is_current}
                            value={formData.end_date}
                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 text-sm font-bold ${formData.is_current ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_current"
                                checked={formData.is_current}
                                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked, end_date: e.target.checked ? '' : formData.end_date })}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                            />
                            <label htmlFor="is_current" className="text-sm text-purple-700 font-bold cursor-pointer select-none">
                                Actualmente en este rol
                            </label>
                        </div>
                    </div>
                </div>

                {/* 4. Imagen de Portada */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                        <ImageIcon size={16} className="text-purple-500" /> Imagen de Portada (Opcional)
                    </label>
                    {imagePreview ? (
                        <div className="space-y-4">
                            <div className="relative group w-full h-40 rounded-2xl border-2 border-purple-200 overflow-hidden bg-gray-100 shadow-sm">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover transition-transform duration-500"
                                    style={{
                                        transform: isAdjusting ? `scale(${cropSettings.zoom})` : 'none',
                                        objectPosition: isAdjusting ? `${cropSettings.x}% ${cropSettings.y}%` : 'center'
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className="flex flex-col items-center text-white">
                                        <Upload size={24} />
                                        <span className="text-[10px] font-black mt-2 uppercase tracking-widest">Cambiar Imagen</span>
                                    </div>
                                </div>
                            </div>

                            {isAdjusting && (
                                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-2 text-purple-700 font-bold text-[10px] uppercase tracking-widest mb-2">
                                        <Move size={12} /> Ajustar Encuadre
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Zoom</span>
                                            <input type="range" min="1" max="3" step="0.1" value={cropSettings.zoom} onChange={(e) => setCropSettings({ ...cropSettings, zoom: parseFloat(e.target.value) })} className="w-full accent-purple-600 h-1.5 bg-purple-200 rounded-full appearance-none cursor-pointer" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Pos H</span>
                                            <input type="range" min="0" max="100" value={cropSettings.x} onChange={(e) => setCropSettings({ ...cropSettings, x: parseInt(e.target.value) })} className="w-full accent-purple-600 h-1.5 bg-purple-200 rounded-full appearance-none cursor-pointer" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Pos V</span>
                                            <input type="range" min="0" max="100" value={cropSettings.y} onChange={(e) => setCropSettings({ ...cropSettings, y: parseInt(e.target.value) })} className="w-full accent-purple-600 h-1.5 bg-purple-200 rounded-full appearance-none cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => { setImageFile(null); setImagePreview(null); setIsAdjusting(false); setFormData(prev => ({ ...prev, cover_image: '' })); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                className="flex items-center gap-2 text-rose-500 hover:text-rose-600 text-[10px] font-black uppercase tracking-widest transition-colors"
                            >
                                <X size={14} /> Eliminar Foto
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:bg-gray-100 hover:border-purple-200 hover:text-purple-500 transition-all duration-300"
                        >
                            <ImageIcon size={24} strokeWidth={1.5} className="mb-2" />
                            <span className="text-xs font-bold uppercase tracking-widest">Subir Portada</span>
                        </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* 5. Galería (Opcional) */}
                {/* Omitido para simplificar esta versión inicial, pero fácil de añadir si el usuario lo pide explícitamente */}

                {/* 6. Descripción y Narrativa */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Tag size={16} className="text-purple-500" /> Resumen Corto (Card)
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 text-sm min-h-[80px] font-medium resize-none"
                            placeholder="Breve descripción del rol..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Award size={16} className="text-amber-500" /> Logros o Resultados (Opcional)
                        </label>
                        <textarea
                            value={formData.achievements}
                            onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 text-sm min-h-[100px] font-medium"
                            placeholder="¿Qué lograste? ¿Hubo un impacto medible?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Heart size={16} className="text-rose-500" /> Reflexión o Valor (Opcional)
                        </label>
                        <textarea
                            value={formData.value_reflection}
                            onChange={(e) => setFormData({ ...formData, value_reflection: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 text-sm min-h-[100px] font-medium"
                            placeholder="¿Qué aprendiste? ¿Cómo te formó esta experiencia?"
                        />
                    </div>
                </div>

                {/* 7. Skills */}
                <div className="col-span-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                        <Tag size={16} className="text-purple-500" /> Skills Desarrolladas
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[56px] focus-within:ring-2 focus-within:ring-purple-200 transition-all">
                        {formData.skills.map(skill => (
                            <span key={skill} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm">
                                {skill}
                                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-purple-900 transition-colors"><X size={12} /></button>
                            </span>
                        ))}
                        <input
                            type="text"
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            onKeyDown={handleAddSkill}
                            className="bg-transparent outline-none flex-1 text-sm text-gray-900 font-medium min-w-[120px]"
                            placeholder="Escribe y presiona Enter..."
                        />
                    </div>
                </div>

                {/* 8. Featured Checkbox */}
                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <input
                        type="checkbox"
                        id="is_featured"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500 border-yellow-300 cursor-pointer"
                    />
                    <label htmlFor="is_featured" className="text-sm text-yellow-800 font-bold cursor-pointer select-none">
                        Destacar en Perfil Público
                    </label>
                </div>


                <div className="pt-6 flex justify-end gap-3 sticky bottom-0 bg-white/80 backdrop-blur-sm pb-2 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => { onClose(); setIsAdjusting(false); }}
                        className="px-6 py-2.5 text-gray-500 hover:text-gray-700 font-bold text-xs uppercase tracking-widest transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || uploadingImage}
                        className="px-10 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.1em] shadow-lg shadow-purple-100 transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading || uploadingImage ? <Loader2 size={16} className="animate-spin" /> : (experienceToEdit ? 'Guardar Cambios' : 'Crear Experiencia')}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
