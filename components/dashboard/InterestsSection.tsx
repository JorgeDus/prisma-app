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
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative overflow-hidden group">
            {/* Decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-50 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <span className="text-3xl">🌱</span>
                    Intereses
                </h2>

                {!isReadOnly && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-bold hover:bg-green-100 transition-all border border-green-100"
                    >
                        <Plus size={16} />
                        Gestionar Intereses
                    </button>
                )}
            </div>

            {interests.length > 0 ? (
                <div className="flex flex-wrap gap-4 relative z-10">
                    {interests.map((interest, idx) => {
                        const emojiMatch = interest.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u)
                        const emoji = emojiMatch ? emojiMatch[0] : null
                        const text = emoji ? interest.replace(emoji, '').trim() : interest

                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl hover:shadow-md hover:scale-[1.02] transition-all cursor-default group/tag"
                            >
                                {emoji && <span className="text-2xl group-hover/tag:scale-125 transition-transform">{emoji}</span>}
                                <span className="font-bold text-gray-700">
                                    {text}
                                </span>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div
                    onClick={() => !isReadOnly && setIsModalOpen(true)}
                    className={`text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 relative z-10 ${!isReadOnly ? 'cursor-pointer hover:bg-gray-100/50 transition-colors' : ''}`}
                >
                    <p className="text-gray-400 text-sm italic">
                        ¿Tienes hobbies o intereses que quieras compartir? <br />
                        {isReadOnly ? 'Este usuario aún no ha agregado intereses.' : 'Haz clic aquí o en el botón superior para agregar tus pasiones.'}
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
