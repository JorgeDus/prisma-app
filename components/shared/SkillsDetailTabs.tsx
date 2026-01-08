'use client'

import { useState } from 'react'
import { Sparkles, Code, Users, Blocks } from 'lucide-react'

interface SkillsDetailTabsProps {
    hardSkills?: string[] | null
    softSkills?: string[] | null
}

export function SkillsDetailTabs({ hardSkills, softSkills }: SkillsDetailTabsProps) {
    const hasHardSkills = hardSkills && hardSkills.length > 0
    const hasSoftSkills = softSkills && softSkills.length > 0
    const hasAnySkills = hasHardSkills || hasSoftSkills
    const hasBothTypes = hasHardSkills && hasSoftSkills

    // Default to hard skills if available, otherwise soft skills
    const [activeTab, setActiveTab] = useState<'hard' | 'soft'>(hasHardSkills ? 'hard' : 'soft')
    const displaySkills = activeTab === 'hard' ? (hardSkills || []) : (softSkills || [])

    if (!hasAnySkills) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Blocks size={14} className="text-slate-400" />
                    <h3 className="text-[10px] font-mono font-black tracking-[0.15em] uppercase text-slate-500">
                        Competencias
                    </h3>
                </div>
                <p className="text-[10px] font-mono text-slate-400 italic">Pendiente de registro.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            {/* Section Title */}
            <div className="flex items-center gap-2 mb-4">
                <Blocks size={14} className="text-indigo-500" />
                <h3 className="text-[10px] font-mono font-black tracking-[0.15em] uppercase text-slate-500">
                    Competencias
                </h3>
            </div>

            {/* Tabs - Only show if both types exist */}
            {hasBothTypes && (
                <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-4">
                    <button
                        onClick={() => setActiveTab('hard')}
                        className={`flex-1 py-2 px-3 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'hard'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Técnicas
                    </button>
                    <button
                        onClick={() => setActiveTab('soft')}
                        className={`flex-1 py-2 px-3 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'soft'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Transversales
                    </button>
                </div>
            )}

            {/* Single Type Label - Show when only one type exists */}
            {!hasBothTypes && (
                <div className="flex items-center gap-2 mb-4">
                    {hasHardSkills ? (
                        <>
                            <Code size={12} className="text-indigo-500" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-indigo-600">
                                Competencias Técnicas
                            </span>
                        </>
                    ) : (
                        <>
                            <Users size={12} className="text-emerald-500" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-600">
                                Habilidades Transversales
                            </span>
                        </>
                    )}
                </div>
            )}

            {/* Skills List - Similar to Header design */}
            <div className="space-y-2">
                {displaySkills.length > 0 ? (
                    displaySkills.map((skill) => (
                        <div
                            key={skill}
                            className="group flex items-center gap-2 py-1.5 border-b border-slate-100 last:border-0"
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${hasBothTypes
                                ? (activeTab === 'hard' ? 'bg-indigo-400' : 'bg-emerald-400')
                                : (hasHardSkills ? 'bg-indigo-400' : 'bg-emerald-400')
                                }`} />
                            <span className="text-sm font-medium text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                                {skill}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-slate-400 italic text-center py-4">
                        {activeTab === 'hard'
                            ? 'Sin competencias técnicas registradas'
                            : 'Sin habilidades transversales registradas'
                        }
                    </p>
                )}
            </div>
        </div>
    )
}
