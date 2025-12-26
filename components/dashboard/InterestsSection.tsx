'use client'

import { useState } from 'react'
import { Heart, Plus } from 'lucide-react'
import InterestsModal from './InterestsModal'

interface InterestsSectionProps {
    interests: string[] | null
    isReadOnly?: boolean
    profileId?: string
}

export default function InterestsSection({ interests: rawInterests, isReadOnly = false, profileId }: InterestsSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const interests = rawInterests || []

    if (isReadOnly && interests.length === 0) return null

    return (
        <section className="bg-white rounded-xl border border-slate-200 p-6 relative group">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-mono text-xs font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2">
                    Intereses
                </h2>

                {!isReadOnly && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        + Editar
                    </button>
                )}
            </div>

            {interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {interests.map((interest, idx) => {
                        const emojiMatch = interest.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u)
                        const emoji = emojiMatch ? emojiMatch[0] : null
                        const text = emoji ? interest.replace(emoji, '').trim() : interest

                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded text-slate-700 hover:border-slate-300 transition-all cursor-default"
                            >
                                {emoji && <span className="text-base">{emoji}</span>}
                                <span className="font-serif text-sm italic">
                                    {text}
                                </span>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div
                    onClick={() => !isReadOnly && setIsModalOpen(true)}
                    className={`text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200 ${!isReadOnly ? 'cursor-pointer hover:bg-slate-100/50 transition-colors' : ''}`}
                >
                    <p className="text-slate-400 text-[11px] font-serif italic">
                        {isReadOnly ? 'Sin intereses registrados.' : 'Añade tus áreas de exploración personal.'}
                    </p>
                </div>
            )}

            {isModalOpen && profileId && (
                <InterestsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialInterests={interests}
                    profileId={profileId}
                />
            )}
        </section>
    )
}
