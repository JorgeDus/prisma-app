
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Type, AlignLeft, Calendar, Tag, Upload, X, ImageIcon, Move, Plus, Github, ExternalLink, Users, Target, Rocket, Award } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { Project } from '@/types/database.types'

interface ProjectFormModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
    projectToEdit?: Project | null
    onSuccess: () => void
}

export default function ProjectFormModal({ isOpen, onClose, userId, projectToEdit, onSuccess }: ProjectFormModalProps) {
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
        description: '',
        content: '',
        type: 'academic' as 'academic' | 'startup' | 'personal',
        date: new Date().toISOString().split('T')[0],
        repo_url: '',
        demo_url: '',
        cover_image: '',
        skills: [] as string[],
        role: '',
        team_members: '',
        challenges: '',
        results: '',
        learnings: '',
        gallery_images: [] as string[],
        is_featured: false,
        show_in_timeline: true
    })

    // Estado local para el input de skills
    const [currentSkill, setCurrentSkill] = useState('')

    // Cargar datos al abrir para editar
    useEffect(() => {
        if (isOpen && projectToEdit) {
            setFormData({
                title: projectToEdit.title,
                description: projectToEdit.description || '',
                content: projectToEdit.content || '',
                type: projectToEdit.type || 'academic',
                date: projectToEdit.created_at ? new Date(projectToEdit.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                repo_url: projectToEdit.repo_url || '',
                demo_url: projectToEdit.demo_url || '',
                cover_image: projectToEdit.cover_image || '',
                skills: projectToEdit.skills || [],
                role: projectToEdit.role || '',
                team_members: projectToEdit.team_members || '',
                challenges: projectToEdit.challenges || '',
                results: projectToEdit.results || '',
                learnings: projectToEdit.learnings || '',
                gallery_images: projectToEdit.gallery_images || [],
                is_featured: projectToEdit.is_featured || false,
                show_in_timeline: projectToEdit.show_in_timeline !== false
            })
            setImagePreview(projectToEdit.cover_image || null)
            setGalleryPreviews(projectToEdit.gallery_images || [])
            setImageFile(null)
            setGalleryFiles([])
            setIsAdjusting(false)
        } else if (isOpen && !projectToEdit) {
            // Reset si es nuevo
            setFormData({
                title: '',
                description: '',
                content: '',
                type: 'academic',
                date: new Date().toISOString().split('T')[0],
                repo_url: '',
                demo_url: '',
                cover_image: '',
                skills: [],
                role: '',
                team_members: '',
                challenges: '',
                results: '',
                learnings: '',
                gallery_images: [],
                is_featured: false,
                show_in_timeline: true
            })
            setImagePreview(null)
            setGalleryPreviews([])
            setImageFile(null)
            setGalleryFiles([])
            setIsAdjusting(false)
        }
    }, [isOpen, projectToEdit])

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
                    const fileName = `${userId}/${Date.now()}-project.jpg`
                    const { error: uploadError } = await supabase.storage
                        .from('project-images')
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
                    const fileName = `${userId}/${Date.now()}-gallery-${Math.random().toString(36).substring(7)}.jpg`
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

            const projectData = {
                title: formData.title,
                description: formData.description,
                content: formData.content,
                type: formData.type,
                repo_url: formData.repo_url || null,
                demo_url: formData.demo_url || null,
                cover_image: finalImageUrl || null,
                skills: formData.skills,
                role: formData.role || null,
                team_members: formData.team_members || null,
                challenges: formData.challenges || null,
                results: formData.results || null,
                learnings: formData.learnings || null,
                gallery_images: finalGalleryUrls,
                is_featured: formData.is_featured,
                show_in_timeline: formData.show_in_timeline,
                updated_at: new Date().toISOString()
            }

            if (projectToEdit) {
                const { error } = await supabase
                    .from('projects')
                    .update(projectData)
                    .eq('id', projectToEdit.id)

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('projects')
                    .insert({
                        user_id: userId,
                        ...projectData,
                        created_at: new Date().toISOString()
                    })

                if (error) throw error
            }

            onSuccess()
            onClose()
            setIsAdjusting(false)
        } catch (error: any) {
            console.error('Error saving project:', error)
            alert(`Error al guardar: ${error.message || 'Error desconocido'}`)
        } finally {
            setIsLoading(false)
            setUploadingImage(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { onClose(); setIsAdjusting(false); }} title={projectToEdit ? "Editar Proyecto" : "Nuevo Proyecto"}>
            <form onSubmit={handleSubmit} className="space-y-6 pb-4">

                {/* 1. Título */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                        <Type size={16} className="text-purple-500" /> Título del Proyecto
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                        placeholder="Ej: Sistema de Gestión de Residuos"
                    />
                </div>

                {/* 2. Imagen de Portada */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                        <ImageIcon size={16} className="text-purple-500" /> Imagen de Portada
                    </label>
                    {imagePreview ? (
                        <div className="space-y-4">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative group cursor-pointer w-full h-52 rounded-2xl border-2 border-purple-200 overflow-hidden bg-gray-100 shadow-sm"
                            >
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover transition-transform duration-500"
                                    style={{
                                        transform: isAdjusting ? `scale(${cropSettings.zoom})` : 'none',
                                        objectPosition: isAdjusting ? `${cropSettings.x}% ${cropSettings.y}%` : 'center'
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
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
                                            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Pos Horizontal</span>
                                            <input type="range" min="0" max="100" value={cropSettings.x} onChange={(e) => setCropSettings({ ...cropSettings, x: parseInt(e.target.value) })} className="w-full accent-purple-600 h-1.5 bg-purple-200 rounded-full appearance-none cursor-pointer" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Pos Vertical</span>
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
                            className="w-full h-44 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:bg-gray-100 hover:border-purple-200 hover:text-purple-500 transition-all duration-300"
                        >
                            <ImageIcon size={32} strokeWidth={1.5} className="mb-3" />
                            <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Subir Imagen de Portada</span>
                            <span className="text-[10px] mt-1 opacity-60">Recomendado: 16:9 (Máx 2MB)</span>
                        </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* 3. Galería de Imágenes */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                        <Plus size={16} className="text-purple-500" /> Galería de Imágenes (Máx 5)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {galleryPreviews.map((url, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group shadow-sm bg-gray-50">
                                <img src={url} className="w-full h-full object-cover" alt="Gallery" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newPreviews = galleryPreviews.filter((_, i) => i !== idx)
                                        setGalleryPreviews(newPreviews)
                                        const existingCount = formData.gallery_images.length
                                        if (idx < existingCount) {
                                            setFormData(prev => ({
                                                ...prev,
                                                gallery_images: prev.gallery_images.filter((_, i) => i !== idx)
                                            }))
                                        } else {
                                            const fileIdx = idx - existingCount
                                            setGalleryFiles(prev => prev.filter((_, i) => i !== fileIdx))
                                        }
                                    }}
                                    className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        {galleryPreviews.length < 5 && (
                            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-purple-200 transition-all text-gray-400 group">
                                <Plus size={24} strokeWidth={1.5} className="group-hover:text-purple-500 transition-colors" />
                                <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* 4. Descripción Breve */}
                    <div className="col-span-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <AlignLeft size={16} className="text-purple-500" /> Resumen Corto (Card)
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 text-sm min-h-[80px] font-medium resize-none"
                            placeholder="Una breve oración que resuma tu proyecto..."
                        />
                    </div>

                    {/* 5. Mi Solución */}
                    <div className="col-span-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Rocket size={16} className="text-purple-500" /> Mi Solución (Detalle Técnico)
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 text-sm min-h-[120px] font-medium"
                            placeholder="Describe cómo lo hiciste, arquitectura, herramientas..."
                        />
                    </div>

                    {/* 6. Rol y Equipo */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Award size={16} className="text-purple-500" /> Tu Rol
                        </label>
                        <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 text-sm font-medium"
                            placeholder="Ej: Lead Developer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Users size={16} className="text-purple-500" /> Colaboradores
                        </label>
                        <input
                            type="text"
                            value={formData.team_members}
                            onChange={(e) => setFormData({ ...formData, team_members: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 text-sm font-medium"
                            placeholder="Ej: Juan Pérez, María G."
                        />
                    </div>

                    {/* 7. Desafío y Resultados */}
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                                <Target size={16} className="text-purple-500" /> El Desafío
                            </label>
                            <textarea
                                value={formData.challenges}
                                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 text-sm min-h-[100px] font-medium resize-none"
                                placeholder="¿Qué problema querías resolver?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                                <Award size={16} className="text-purple-500" /> Resultados
                            </label>
                            <textarea
                                value={formData.results}
                                onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 text-sm min-h-[100px] font-medium resize-none"
                                placeholder="¿Cuál fue el impacto final?"
                            />
                        </div>
                    </div>

                    {/* 8. Aprendizajes */}
                    <div className="col-span-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Tag size={16} className="text-purple-500" /> Aprendizajes Clave
                        </label>
                        <textarea
                            value={formData.learnings}
                            onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 text-sm min-h-[100px] font-medium resize-none"
                            placeholder="¿Qué aprendiste en este camino?"
                        />
                    </div>

                    {/* 9. Stack Tecnológico */}
                    <div className="col-span-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Tag size={16} className="text-purple-500" /> Stack Tecnológico
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

                    {/* 10. Enlaces */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Github size={16} className="text-gray-900" /> Repositorio GitHub
                        </label>
                        <input
                            type="url"
                            value={formData.repo_url}
                            onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 text-sm font-medium"
                            placeholder="https://github.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <ExternalLink size={16} className="text-purple-500" /> Demo en Vivo
                        </label>
                        <input
                            type="url"
                            value={formData.demo_url}
                            onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 text-sm font-medium"
                            placeholder="https://..."
                        />
                    </div>

                    {/* 11. Tipo y Fecha */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Tag size={16} className="text-purple-500" /> Tipo de Proyecto
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 text-sm font-bold appearance-none cursor-pointer"
                        >
                            <option value="academic">Académico</option>
                            <option value="personal">Personal</option>
                            <option value="startup">Startup / Innovación</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Calendar size={16} className="text-purple-500" /> Fecha del Proyecto
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 text-sm font-bold cursor-pointer"
                        />
                    </div>
                </div>

                {/* 12. Visibility & Featured Toggles */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Mostrar en Timeline */}
                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex-1">
                        <input
                            type="checkbox"
                            id="show_timeline"
                            checked={formData.show_in_timeline}
                            onChange={(e) => setFormData({ ...formData, show_in_timeline: e.target.checked })}
                            className="w-5 h-5 text-indigo-600 rounded-lg border-gray-300 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                            <label htmlFor="show_timeline" className="text-sm font-black text-indigo-900 uppercase tracking-tight cursor-pointer block">
                                Mostrar en Mi Trayectoria
                            </label>
                            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Aparecerá en el Timeline del perfil</p>
                        </div>
                    </div>

                    {/* Destacar */}
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl border border-yellow-200 flex-1">
                        <input
                            type="checkbox"
                            id="is_featured"
                            checked={formData.is_featured}
                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                            className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500 border-yellow-300 cursor-pointer"
                        />
                        <div className="flex-1">
                            <label htmlFor="is_featured" className="text-sm font-black text-yellow-800 uppercase tracking-tight cursor-pointer block">
                                Destacar en Perfil Público
                            </label>
                            <p className="text-[10px] text-yellow-600 font-bold uppercase tracking-widest">Se mostrará en la sección "Destacados"</p>
                        </div>
                    </div>
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
                        {isLoading || uploadingImage ? <Loader2 size={16} className="animate-spin" /> : (projectToEdit ? 'Guardar Cambios' : 'Crear Proyecto')}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
