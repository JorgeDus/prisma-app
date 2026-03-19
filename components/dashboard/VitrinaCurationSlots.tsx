'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Plus, X, Pencil, GraduationCap, Rocket, User, Award, Heart, Zap, Briefcase, Dumbbell, Palette, HeartPulse, Star, FileBadge, Trophy, Users, Stethoscope } from 'lucide-react'
import { DEFAULT_EXP_IMAGES, DEFAULT_PROJECT_IMAGES } from '@/constants/images'
import VitrinaCurationModal from './VitrinaCurationModal'

interface FeaturedItem {
    id: string
    type: 'project' | 'experience' | 'achievement'
}

interface VitrinaCurationSlotsProps {
    profileId: string
    featuredItems: FeaturedItem[]
    projects: any[]
    experiences: any[]
    achievements: any[]
}

const PROJECT_CATEGORY_MAP: Record<string, { label: string, icon: any, color: string, bg: string }> = {
    academic: { label: 'Académico', icon: GraduationCap, color: 'text-purple-700', bg: 'bg-purple-100' },
    startup: { label: 'Emprendimiento', icon: Rocket, color: 'text-blue-700', bg: 'bg-blue-100' },
    personal: { label: 'Personal', icon: User, color: 'text-green-700', bg: 'bg-green-100' }
}

const EXP_CATEGORY_MAP: Record<string, { label: string, icon: any, color: string, bg: string, border: string }> = {
    liderazgo: { label: 'Liderazgo', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    social: { label: 'Social', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    emprendimiento: { label: 'Emprendimiento', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    empleo_sustento: { label: 'Trayectoria', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    academico: { label: 'Académico', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    deportivo: { label: 'Deportivo', icon: Dumbbell, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    creativo: { label: 'Creativo', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
    cuidado_vida: { label: 'Cuidado y Vida', icon: HeartPulse, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
    practica: { label: 'Práctica Profesional', icon: Stethoscope, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
    otro: { label: 'General', icon: Star, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' }
}

const ACHIEVEMENT_CATEGORY_MAP: Record<string, { label: string, icon: any, gradient: string, color: string, bg: string }> = {
    certification: { label: 'Certificación', icon: FileBadge, gradient: 'from-blue-500 to-cyan-500', color: 'text-blue-700', bg: 'bg-blue-100' },
    award: { label: 'Premio', icon: Trophy, gradient: 'from-amber-500 to-orange-500', color: 'text-amber-700', bg: 'bg-amber-100' },
    course_chair: { label: 'Cátedra', icon: GraduationCap, gradient: 'from-indigo-500 to-purple-500', color: 'text-indigo-700', bg: 'bg-indigo-100' },
    academic_role: { label: 'Investigación', icon: Users, gradient: 'from-cyan-500 to-teal-500', color: 'text-cyan-700', bg: 'bg-cyan-100' }
}

export default function VitrinaCurationSlots({
    profileId,
    featuredItems,
    projects,
    experiences,
    achievements
}: VitrinaCurationSlotsProps) {
    const router = useRouter()
    const supabase = createClient()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingSlot, setEditingSlot] = useState<number>(0)
    const [isSaving, setIsSaving] = useState(false)

    // Ensure we always have 3 slots (fill with null if needed)
    const slots: (FeaturedItem | null)[] = [
        featuredItems[0] || null,
        featuredItems[1] || null,
        featuredItems[2] || null
    ]

    // Resolve actual item data from IDs
    const resolvedItems = slots.map(slot => {
        if (!slot) return null
        if (slot.type === 'project') {
            return { ...projects.find(p => p.id === slot.id), itemType: 'project' }
        } else if (slot.type === 'achievement') {
            return { ...achievements.find(a => a.id === slot.id), itemType: 'achievement' }
        } else {
            return { ...experiences.find(e => e.id === slot.id), itemType: 'experience' }
        }
    })

    const handleOpenModal = (slotIndex: number) => {
        setEditingSlot(slotIndex)
        setIsModalOpen(true)
    }

    const handleSelectItem = async (slotIndex: number, item: FeaturedItem | null) => {
        setIsSaving(true)
        try {
            const newFeaturedItems = [...slots]
            newFeaturedItems[slotIndex] = item

            // Filter out nulls for storage but maintain order
            const cleanedItems = newFeaturedItems.filter(Boolean) as FeaturedItem[]

            const { error } = await supabase
                .from('profiles')
                .update({ featured_items: cleanedItems as any })
                .eq('id', profileId)

            if (error) throw error
            router.refresh()
        } catch (error) {
            console.error('Error saving featured items:', error)
            alert('Error al guardar la vitrina')
        } finally {
            setIsSaving(false)
        }
    }

    const handleRemoveItem = async (slotIndex: number) => {
        if (!confirm('¿Quitar este elemento de la vitrina?')) return
        await handleSelectItem(slotIndex, null)
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[500px]">
                {resolvedItems.map((item, index) => {
                    const isLarge = index === 0

                    if (!item) {
                        // Empty slot
                        return (
                            <div
                                key={`slot-${index}`}
                                className={`${isLarge ? "md:col-span-8 md:row-span-2" : "md:col-span-4"
                                    } group relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50/30 min-h-[240px] md:min-h-0 flex items-center justify-center`}
                            >
                                <button
                                    onClick={() => handleOpenModal(index)}
                                    disabled={isSaving}
                                    className="flex flex-col items-center gap-3 p-8 text-slate-400 hover:text-indigo-600 transition-colors"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                                        <Plus size={24} />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-sm">
                                            {isLarge ? 'Destacar Principal' : 'Añadir Item'}
                                        </p>
                                        <p className="text-xs mt-1 opacity-70">
                                            Slot {index + 1} de 3
                                        </p>
                                    </div>
                                </button>
                            </div>
                        )
                    }

                    // Filled slot
                    const isProject = item.itemType === 'project'
                    const isAchievement = item.itemType === 'achievement'
                    let categoryInfo: any
                    let CategoryIcon: any

                    if (isProject) {
                        categoryInfo = PROJECT_CATEGORY_MAP[item.type] || PROJECT_CATEGORY_MAP.personal
                        CategoryIcon = categoryInfo.icon
                    } else if (isAchievement) {
                        categoryInfo = ACHIEVEMENT_CATEGORY_MAP[item.category] || ACHIEVEMENT_CATEGORY_MAP.certification
                        CategoryIcon = categoryInfo.icon
                    } else {
                        categoryInfo = EXP_CATEGORY_MAP[item.type] || EXP_CATEGORY_MAP.otro
                        CategoryIcon = categoryInfo.icon
                    }

                    const displayImage = item.cover_image ||
                        (isProject
                            ? (DEFAULT_PROJECT_IMAGES[item.type] || DEFAULT_PROJECT_IMAGES.personal)
                            : (DEFAULT_EXP_IMAGES[item.type] || DEFAULT_EXP_IMAGES.otro)
                        )

                    return (
                        <div
                            key={item.id || `slot-${index}`}
                            className={`${isLarge ? "md:col-span-8 md:row-span-2" : "md:col-span-4"
                                } group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/10 min-h-[240px] md:min-h-0`}
                        >
                            {/* Background Image with Dark Overlay */}
                            <div className="absolute inset-0 z-0">
                                {isAchievement ? (
                                    /* Achievement: Gradient background with centered icon */
                                    <>
                                        <div className={`w-full h-full bg-gradient-to-br ${categoryInfo.gradient}`} />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                            <CategoryIcon size={isLarge ? 200 : 120} className="text-white" />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                                    </>
                                ) : (
                                    /* Project/Experience: Image background */
                                    <>
                                        <img
                                            src={displayImage}
                                            alt={item.title}
                                            className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                                    </>
                                )}
                            </div>

                            {/* Category Badge - Top Left */}
                            <div className="absolute top-4 left-4 z-20">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-mono font-black tracking-[0.15em] uppercase shadow-lg ${categoryInfo.bg} ${categoryInfo.color}`}>
                                    <CategoryIcon size={11} strokeWidth={2.5} />
                                    {categoryInfo.label}
                                </span>
                            </div>

                            {/* Slot indicator */}
                            <div className="absolute top-4 right-16 z-20">
                                <span className="px-2 py-1 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-mono text-white/70">
                                    Slot {index + 1}
                                </span>
                            </div>

                            {/* Edit/Remove buttons */}
                            <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenModal(index)}
                                    disabled={isSaving}
                                    className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-colors"
                                    title="Cambiar item"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => handleRemoveItem(index)}
                                    disabled={isSaving}
                                    className="p-2 bg-rose-500/20 backdrop-blur-md rounded-lg text-rose-200 hover:bg-rose-500/40 transition-colors"
                                    title="Quitar de vitrina"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Content Overlay - Title at Bottom */}
                            <div className="relative z-10 h-full p-8 flex flex-col justify-end">
                                <div className="space-y-3 transform transition-transform duration-700 group-hover:-translate-y-2">
                                    <h3 className={`${isLarge ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'} font-extrabold text-white leading-[1.1] tracking-tight group-hover:text-indigo-50 transition-colors`}>
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <VitrinaCurationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                slotIndex={editingSlot}
                projects={projects}
                experiences={experiences}
                achievements={achievements}
                currentFeaturedItems={slots.filter(Boolean) as FeaturedItem[]}
                onSelectItem={handleSelectItem}
            />
        </>
    )
}
