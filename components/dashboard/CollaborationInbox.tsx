'use client'

import { useState, useEffect } from 'react'
import { Users, Check, X, ChevronDown, ChevronUp, Briefcase, Sparkles, Loader2, Plus, HelpCircle } from 'lucide-react'
import { getPendingCollaborations, respondToCollaboration, updateCollaborationDetails } from '@/app/(app)/collaboration-actions'

interface CollaborationInboxProps {
    userId: string
}

export default function CollaborationInbox({ userId }: CollaborationInboxProps) {
    const [loading, setLoading] = useState(true)
    const [collaborations, setCollaborations] = useState<{ projects: any[]; experiences: any[] }>({ projects: [], experiences: [] })
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [customRole, setCustomRole] = useState('')
    const [customLearnings, setCustomLearnings] = useState('')
    const [selectedHardSkills, setSelectedHardSkills] = useState<string[]>([])
    const [selectedSoftSkills, setSelectedSoftSkills] = useState<string[]>([])
    const [newSkillInput, setNewSkillInput] = useState('')
    const [showInProfile, setShowInProfile] = useState(true)
    const [showInTimeline, setShowInTimeline] = useState(true)
    const [responding, setResponding] = useState<string | null>(null)
    const [showHelp, setShowHelp] = useState(false)

    useEffect(() => {
        loadCollaborations()
    }, [])

    const loadCollaborations = async () => {
        try {
            const data = await getPendingCollaborations()
            setCollaborations(data)
        } catch (err) {
            console.error('Error loading collaborations:', err)
        } finally {
            setLoading(false)
        }
    }

    const allPending = [...collaborations.projects, ...collaborations.experiences]

    if (loading || allPending.length === 0) return null

    const handleAccept = async (collab: any) => {
        setResponding(collab.id)
        try {
            await respondToCollaboration(collab.id, collab.type, true)

            // If user customized, update details
            const hasCustomizations = customRole || customLearnings || selectedHardSkills.length > 0 || selectedSoftSkills.length > 0 || !showInProfile || !showInTimeline
            if (hasCustomizations) {
                await updateCollaborationDetails(collab.id, collab.type, {
                    customRole: customRole || undefined,
                    customLearnings: customLearnings || undefined,
                    customHardSkills: selectedHardSkills.length > 0 ? selectedHardSkills : undefined,
                    customSoftSkills: selectedSoftSkills.length > 0 ? selectedSoftSkills : undefined,
                    showInProfile,
                    showInTimeline
                })
            }

            // Remove from local state
            if (collab.type === 'project') {
                setCollaborations(prev => ({
                    ...prev,
                    projects: prev.projects.filter(p => p.id !== collab.id)
                }))
            } else {
                setCollaborations(prev => ({
                    ...prev,
                    experiences: prev.experiences.filter(e => e.id !== collab.id)
                }))
            }

            resetForm()
        } catch (err) {
            console.error('Error accepting collaboration:', err)
            alert('Error al aceptar la colaboración')
        } finally {
            setResponding(null)
        }
    }

    const handleReject = async (collab: any) => {
        if (!confirm('¿Rechazar esta colaboración?')) return

        setResponding(collab.id)
        try {
            await respondToCollaboration(collab.id, collab.type, false)

            if (collab.type === 'project') {
                setCollaborations(prev => ({
                    ...prev,
                    projects: prev.projects.filter(p => p.id !== collab.id)
                }))
            } else {
                setCollaborations(prev => ({
                    ...prev,
                    experiences: prev.experiences.filter(e => e.id !== collab.id)
                }))
            }
        } catch (err) {
            console.error('Error rejecting collaboration:', err)
            alert('Error al rechazar la colaboración')
        } finally {
            setResponding(null)
        }
    }

    const resetForm = () => {
        setExpandedId(null)
        setCustomRole('')
        setCustomLearnings('')
        setSelectedHardSkills([])
        setSelectedSoftSkills([])
        setNewSkillInput('')
        setShowInProfile(true)
        setShowInTimeline(true)
    }

    const toggleExpand = (id: string, collab: any) => {
        if (expandedId === id) {
            setExpandedId(null)
        } else {
            setExpandedId(id)
            setCustomRole('')
            setCustomLearnings('')
            setNewSkillInput('')
            setShowInProfile(true)
            setShowInTimeline(true)
            // Pre-select all original skills
            const original = collab.type === 'project' ? collab.project : collab.experience
            setSelectedHardSkills([...(original?.hard_skills || [])])
            setSelectedSoftSkills([...(original?.soft_skills || [])])
        }
    }

    const toggleSkill = (skill: string, type: 'hard' | 'soft') => {
        if (type === 'hard') {
            setSelectedHardSkills(prev =>
                prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
            )
        } else {
            setSelectedSoftSkills(prev =>
                prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
            )
        }
    }

    const addCustomSkill = (type: 'hard' | 'soft') => {
        const trimmed = newSkillInput.trim()
        if (!trimmed) return
        if (type === 'hard') {
            if (!selectedHardSkills.includes(trimmed)) {
                setSelectedHardSkills(prev => [...prev, trimmed])
            }
        } else {
            if (!selectedSoftSkills.includes(trimmed)) {
                setSelectedSoftSkills(prev => [...prev, trimmed])
            }
        }
        setNewSkillInput('')
    }

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Users size={16} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">
                            Invitaciones de Colaboración
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                            {allPending.length} {allPending.length === 1 ? 'pendiente' : 'pendientes'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowHelp(!showHelp)}
                    className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-200 transition-colors"
                    title="¿Qué es esto?"
                >
                    <HelpCircle size={14} />
                </button>
            </div>

            {showHelp && (
                <div className="bg-white border border-indigo-100 rounded-xl p-4 text-xs text-slate-600 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="font-bold text-slate-800">¿Qué son las invitaciones de colaboración?</p>
                    <p>Otro usuario te ha agregado como colaborador en uno de sus proyectos o experiencias. Puedes:</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Aceptar directamente</strong> — el proyecto/experiencia aparecerá en tu perfil con las skills del original.</li>
                        <li><strong>Personalizar antes de aceptar</strong> — presiona la flecha ↓ para definir tu rol, aprendizajes, elegir qué skills aplican a tu participación, y agregar skills propias.</li>
                        <li><strong>Rechazar</strong> — el proyecto no aparecerá en tu perfil.</li>
                    </ul>
                    <p className="text-slate-400">Puedes eliminar la colaboración de tu perfil en cualquier momento desde tu dashboard.</p>
                </div>
            )}

            <div className="space-y-3">
                {allPending.map((collab) => {
                    const isProject = collab.type === 'project'
                    const title = isProject ? collab.project?.title : collab.experience?.title
                    const original = isProject ? collab.project : collab.experience
                    const ownerName = collab.owner?.full_name || collab.owner?.username || 'Alguien'
                    const ownerAvatar = collab.owner?.avatar_url
                    const isExpanded = expandedId === collab.id
                    const isResponding = responding === collab.id

                    // Get original skills for chip display
                    const originalHardSkills: string[] = original?.hard_skills || []
                    const originalSoftSkills: string[] = original?.soft_skills || []

                    return (
                        <div key={collab.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all">
                            <div className="p-4 flex items-center gap-3">
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isProject ? 'bg-blue-50' : 'bg-purple-50'}`}>
                                    {isProject ? (
                                        <Briefcase size={18} className="text-blue-500" />
                                    ) : (
                                        <Sparkles size={18} className="text-purple-500" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-slate-800 truncate">
                                        {title || 'Sin título'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        {ownerAvatar && (
                                            <img src={ownerAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                                        )}
                                        <span className="text-[10px] text-slate-500 font-medium">
                                            Invitado por {ownerName}
                                        </span>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${isProject ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                            {isProject ? 'Proyecto' : 'Experiencia'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleReject(collab)}
                                        disabled={isResponding}
                                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-50"
                                        title="Rechazar"
                                    >
                                        <X size={14} />
                                    </button>
                                    <button
                                        onClick={() => toggleExpand(collab.id, collab)}
                                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-200 transition-colors"
                                        title="Personalizar antes de aceptar"
                                    >
                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                    <button
                                        onClick={() => handleAccept(collab)}
                                        disabled={isResponding}
                                        className="h-8 px-4 bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        {isResponding ? (
                                            <Loader2 size={12} className="animate-spin" />
                                        ) : (
                                            <>
                                                <Check size={12} />
                                                Aceptar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded customization panel */}
                            {isExpanded && (
                                <div className="px-4 pb-4 pt-0 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider pt-3">
                                        Personaliza cómo se mostrará en tu perfil
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                                                Tu Rol
                                            </label>
                                            <input
                                                type="text"
                                                value={customRole}
                                                onChange={(e) => setCustomRole(e.target.value)}
                                                placeholder="Ej: Desarrollador Frontend"
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                                                Aprendizajes
                                            </label>
                                            <input
                                                type="text"
                                                value={customLearnings}
                                                onChange={(e) => setCustomLearnings(e.target.value)}
                                                placeholder="Ej: Aprendí a trabajar en equipo..."
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Skills section */}
                                    {(originalHardSkills.length > 0 || originalSoftSkills.length > 0) && (
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                                Selecciona las skills que aplican a tu participación
                                            </p>

                                            {originalHardSkills.length > 0 && (
                                                <div>
                                                    <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Hard Skills</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {originalHardSkills.map(skill => (
                                                            <button
                                                                key={`h-${skill}`}
                                                                onClick={() => toggleSkill(skill, 'hard')}
                                                                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border ${selectedHardSkills.includes(skill)
                                                                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                                                                    : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                                                                    }`}
                                                            >
                                                                {skill}
                                                            </button>
                                                        ))}
                                                        {/* Custom hard skills added by collaborator */}
                                                        {selectedHardSkills.filter(s => !originalHardSkills.includes(s)).map(skill => (
                                                            <button
                                                                key={`hc-${skill}`}
                                                                onClick={() => toggleSkill(skill, 'hard')}
                                                                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all"
                                                            >
                                                                {skill} ✕
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {originalSoftSkills.length > 0 && (
                                                <div>
                                                    <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Soft Skills</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {originalSoftSkills.map(skill => (
                                                            <button
                                                                key={`s-${skill}`}
                                                                onClick={() => toggleSkill(skill, 'soft')}
                                                                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border ${selectedSoftSkills.includes(skill)
                                                                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                                                                    : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                                                                    }`}
                                                            >
                                                                {skill}
                                                            </button>
                                                        ))}
                                                        {selectedSoftSkills.filter(s => !originalSoftSkills.includes(s)).map(skill => (
                                                            <button
                                                                key={`sc-${skill}`}
                                                                onClick={() => toggleSkill(skill, 'soft')}
                                                                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all"
                                                            >
                                                                {skill} ✕
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Add custom skill */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={newSkillInput}
                                                    onChange={(e) => setNewSkillInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') e.preventDefault()
                                                    }}
                                                    placeholder="Añadir skill propia..."
                                                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                                <button
                                                    onClick={() => addCustomSkill('hard')}
                                                    disabled={!newSkillInput.trim()}
                                                    className="px-2.5 py-1.5 text-[9px] font-mono font-bold uppercase bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                                                >
                                                    + Hard
                                                </button>
                                                <button
                                                    onClick={() => addCustomSkill('soft')}
                                                    disabled={!newSkillInput.trim()}
                                                    className="px-2.5 py-1.5 text-[9px] font-mono font-bold uppercase bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                                                >
                                                    + Soft
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-6 pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={showInProfile}
                                                onChange={(e) => setShowInProfile(e.target.checked)}
                                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                            />
                                            <span className="text-xs text-slate-600 font-medium">Mostrar en mi perfil</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={showInTimeline}
                                                onChange={(e) => setShowInTimeline(e.target.checked)}
                                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                            />
                                            <span className="text-xs text-slate-600 font-medium">Mostrar en trayectoria</span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
