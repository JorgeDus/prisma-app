
'use client'

import { useState } from 'react'
import { Quote, Plus, Star } from 'lucide-react'
import { Testimonial } from '@/types/database.types'
import TestimonialModal from './TestimonialModal'

interface TestimonialSectionProps {
    testimonials: Testimonial[]
    userId: string
    isReadOnly?: boolean
}

export default function TestimonialSection({ testimonials, userId, isReadOnly = false }: TestimonialSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

    const handleEdit = (t: Testimonial) => {
        if (isReadOnly) return
        setEditingTestimonial(t)
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        setEditingTestimonial(null)
        setIsModalOpen(true)
    }

    if (isReadOnly && testimonials.length === 0) return null

    return (
        <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-2xl shadow-sm border border-purple-100 p-8 overflow-hidden relative">
            {/* Decoration */}
            <Star className="absolute top-6 right-6 text-purple-100 pointer-events-none" size={120} strokeWidth={1} />

            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <span className="text-3xl">🤝</span>
                        Mi Vitrina
                    </h2>
                    {!isReadOnly && (
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-purple-200 text-purple-600 rounded-xl text-sm font-bold hover:bg-purple-50 transition-all shadow-sm"
                        >
                            <Plus size={18} />
                            Gestionar Vitrina
                        </button>
                    )}
                </div>

                {testimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testimonials.map((t) => (
                            <div
                                key={t.id}
                                onClick={() => handleEdit(t)}
                                className={`relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all group ${!isReadOnly ? 'cursor-pointer hover:border-purple-300 hover:shadow-md' : ''}`}
                            >
                                <div className="absolute top-4 left-4 text-gray-100 group-hover:text-purple-100 transition-colors">
                                    <Quote size={40} fill="currentColor" />
                                </div>
                                <p className="text-gray-700 italic leading-relaxed mb-6 relative z-10 pl-6">
                                    "{t.content}"
                                </p>
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-50 mt-auto">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-black text-lg border-2 border-white shadow-sm shrink-0">
                                        {t.author_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-gray-900 truncate">{t.author_name}</p>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest truncate">{t.author_role || 'Referencia'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-purple-200">
                        <Quote className="mx-auto text-purple-200 mb-4" size={48} />
                        <h4 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">Tu vitrina está esperando testimonios.</h4>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto">Comparte lo que otros dicen de tu trabajo para generar confianza.</p>
                        {!isReadOnly && (
                            <button
                                onClick={handleCreate}
                                className="mt-4 text-purple-600 font-bold hover:underline"
                            >
                                + Agregar el primero
                            </button>
                        )}
                    </div>
                )}
            </div>

            {!isReadOnly && (
                <TestimonialModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userId={userId}
                    testimonialToEdit={editingTestimonial}
                    onSuccess={() => window.location.reload()}
                />
            )}
        </section>
    )
}
