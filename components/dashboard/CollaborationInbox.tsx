'use client'

import { useState, useEffect } from 'react'
import { Users, Check, X, Briefcase, Sparkles, Loader2, HelpCircle } from 'lucide-react'
import { getPendingCollaborations, respondToCollaboration } from '@/app/(app)/collaboration-actions'

interface CollaborationInboxProps {
    userId: string
}

export default function CollaborationInbox({ userId }: CollaborationInboxProps) {
    const [loading, setLoading] = useState(true)
    const [collaborations, setCollaborations] = useState<{ projects: any[]; experiences: any[] }>({ projects: [], experiences: [] })
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
            const result = await respondToCollaboration(collab.id, collab.type, true)

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

            // Navigate to the newly cloned project/experience detail view
            if (result && result.clonedId) {
                window.location.href = collab.type === 'project'
                    ? `/dashboard/project/${result.clonedId}?edit=true`
                    : `/dashboard/experiencias/${result.clonedId}?edit=true`
            }
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
                    <p>Otro usuario te ha agregado como colaborador. Al aceptar, el proyecto se clonará en tu portafolio para que puedas editar tu participación.</p>
                    <ul className="list-disc pl-4 space-y-1 mt-2">
                        <li><strong>Aceptar y Editar</strong> — se clonará el proyecto y te llevaremos a editarlo para que cuentes tu propia versión.</li>
                        <li><strong>Rechazar</strong> — el proyecto no aparecerá en tu perfil y la invitación será eliminada.</li>
                    </ul>
                </div>
            )}

            <div className="space-y-3">
                {allPending.map((collab) => {
                    const isProject = collab.type === 'project'
                    const title = isProject ? collab.project?.title : collab.experience?.title
                    const original = isProject ? collab.project : collab.experience
                    const ownerName = collab.owner?.full_name || collab.owner?.username || 'Alguien'
                    const ownerAvatar = collab.owner?.avatar_url
                    const isResponding = responding === collab.id

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
                                        onClick={() => handleAccept(collab)}
                                        disabled={isResponding}
                                        className="h-8 px-4 bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        {isResponding ? (
                                            <Loader2 size={12} className="animate-spin" />
                                        ) : (
                                            <>
                                                <Check size={12} />
                                                Aceptar y Editar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
