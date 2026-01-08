'use client'

import { useState } from 'react'
import { X, FolderGit2, Briefcase, Check } from 'lucide-react'
import { DEFAULT_EXP_IMAGES, DEFAULT_PROJECT_IMAGES } from '@/constants/images'

interface FeaturedItem {
    id: string
    type: 'project' | 'experience'
}

interface VitrinaCurationModalProps {
    isOpen: boolean
    onClose: () => void
    slotIndex: number
    projects: any[]
    experiences: any[]
    currentFeaturedItems: FeaturedItem[]
    onSelectItem: (slotIndex: number, item: FeaturedItem | null) => void
}

export default function VitrinaCurationModal({
    isOpen,
    onClose,
    slotIndex,
    projects,
    experiences,
    currentFeaturedItems,
    onSelectItem
}: VitrinaCurationModalProps) {
    const [activeTab, setActiveTab] = useState<'projects' | 'experiences'>('projects')

    if (!isOpen) return null

    // Get IDs of already selected items (excluding current slot)
    const selectedIds = currentFeaturedItems
        .filter((_, idx) => idx !== slotIndex)
        .map(item => item?.id)
        .filter(Boolean)

    const handleSelect = (id: string, type: 'project' | 'experience') => {
        onSelectItem(slotIndex, { id, type })
        onClose()
    }

    const tabs = [
        { key: 'projects' as const, label: 'Proyectos', icon: FolderGit2, count: projects.length },
        { key: 'experiences' as const, label: 'Experiencias', icon: Briefcase, count: experiences.length }
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Seleccionar para Slot {slotIndex + 1}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Elige un proyecto o experiencia para destacar en tu vitrina
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 py-3 border-b border-slate-100 flex gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-indigo-100' : 'bg-slate-100'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 gap-3">
                        {activeTab === 'projects' ? (
                            projects.length > 0 ? (
                                projects.map(project => {
                                    const isSelected = selectedIds.includes(project.id)
                                    const isCurrentSlot = currentFeaturedItems[slotIndex]?.id === project.id

                                    return (
                                        <button
                                            key={project.id}
                                            onClick={() => !isSelected && handleSelect(project.id, 'project')}
                                            disabled={isSelected}
                                            className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${isCurrentSlot
                                                    ? 'border-indigo-300 bg-indigo-50'
                                                    : isSelected
                                                        ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                                                        : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                                                }`}
                                        >
                                            <img
                                                src={project.cover_image || DEFAULT_PROJECT_IMAGES[project.type] || DEFAULT_PROJECT_IMAGES.personal}
                                                alt={project.title}
                                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-slate-900 truncate">
                                                    {project.title}
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {project.type === 'academic' ? 'Académico' :
                                                        project.type === 'startup' ? 'Startup' : 'Personal'}
                                                </p>
                                            </div>
                                            {isCurrentSlot && (
                                                <div className="flex-shrink-0">
                                                    <Check size={20} className="text-indigo-600" />
                                                </div>
                                            )}
                                            {isSelected && !isCurrentSlot && (
                                                <span className="text-xs text-slate-400 flex-shrink-0">
                                                    Ya en vitrina
                                                </span>
                                            )}
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="text-center py-12 text-slate-400">
                                    <FolderGit2 size={32} className="mx-auto mb-3 opacity-50" />
                                    <p>No tienes proyectos aún</p>
                                </div>
                            )
                        ) : (
                            experiences.length > 0 ? (
                                experiences.map(exp => {
                                    const isSelected = selectedIds.includes(exp.id)
                                    const isCurrentSlot = currentFeaturedItems[slotIndex]?.id === exp.id

                                    return (
                                        <button
                                            key={exp.id}
                                            onClick={() => !isSelected && handleSelect(exp.id, 'experience')}
                                            disabled={isSelected}
                                            className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${isCurrentSlot
                                                    ? 'border-indigo-300 bg-indigo-50'
                                                    : isSelected
                                                        ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                                                        : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                                                }`}
                                        >
                                            <img
                                                src={exp.cover_image || DEFAULT_EXP_IMAGES[exp.type] || DEFAULT_EXP_IMAGES.otro}
                                                alt={exp.title}
                                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-slate-900 truncate">
                                                    {exp.title}
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {exp.organization || exp.type}
                                                </p>
                                            </div>
                                            {isCurrentSlot && (
                                                <div className="flex-shrink-0">
                                                    <Check size={20} className="text-indigo-600" />
                                                </div>
                                            )}
                                            {isSelected && !isCurrentSlot && (
                                                <span className="text-xs text-slate-400 flex-shrink-0">
                                                    Ya en vitrina
                                                </span>
                                            )}
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="text-center py-12 text-slate-400">
                                    <Briefcase size={32} className="mx-auto mb-3 opacity-50" />
                                    <p>No tienes experiencias aún</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
