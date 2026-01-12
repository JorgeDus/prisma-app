'use client'

import { X, Blocks, Sparkles, Brain } from 'lucide-react'
import Modal from '@/components/ui/Modal'

interface SkillsModalProps {
    isOpen: boolean
    onClose: () => void
    hardSkills: string[]
    softSkills: string[]
    skillCounts?: Record<string, number>
}

export default function SkillsModal({
    isOpen,
    onClose,
    hardSkills,
    softSkills,
    skillCounts = {}
}: SkillsModalProps) {

    const SkillItem = ({ skill, type }: { skill: string, type: 'hard' | 'soft' }) => {
        const count = skillCounts[skill] || 1
        const dotColor = type === 'hard' ? 'bg-indigo-400' : 'bg-blue-400'
        const hoverColor = type === 'hard' ? 'group-hover:text-indigo-600' : 'group-hover:text-blue-600'

        return (
            <div className="group flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    <span className={`text-sm font-medium text-slate-700 ${hoverColor} transition-colors`}>
                        {skill}
                    </span>
                </div>
                <span className={`font-mono text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] ${hoverColor} transition-colors`}>
                    {count} {count === 1 ? 'evidencia' : 'evidencias'}
                </span>
            </div>
        )
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Competencias Validadas"
        >
            <div className="space-y-6">
                {/* Stats Summary */}
                <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold text-indigo-600">{hardSkills.length}</div>
                        <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Técnicas</div>
                    </div>
                    <div className="w-px bg-slate-200" />
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold text-blue-600">{softSkills.length}</div>
                        <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Transversales</div>
                    </div>
                </div>

                {/* Two Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hard Skills Column */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b-2 border-indigo-100">
                            <Sparkles size={14} className="text-indigo-500" />
                            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-indigo-600">
                                Competencias Técnicas
                            </h3>
                        </div>
                        <div className="space-y-0 max-h-64 overflow-y-auto pr-2">
                            {hardSkills.length > 0 ? (
                                hardSkills.map((skill) => (
                                    <SkillItem key={skill} skill={skill} type="hard" />
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 italic py-4 text-center">
                                    Sin competencias técnicas registradas
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Soft Skills Column */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-100">
                            <Brain size={14} className="text-blue-500" />
                            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-blue-600">
                                Habilidades Transversales
                            </h3>
                        </div>
                        <div className="space-y-0 max-h-64 overflow-y-auto pr-2">
                            {softSkills.length > 0 ? (
                                softSkills.map((skill) => (
                                    <SkillItem key={skill} skill={skill} type="soft" />
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 italic py-4 text-center">
                                    Sin habilidades transversales registradas
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
