
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
        <section className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h3 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-slate-400">Mi Vitrina / Validaciones</h3>
                </div>
                {!isReadOnly && (
                    <button
                        onClick={handleCreate}
                        className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        + Gestionar Vitrina
                    </button>
                )}
            </div>

            {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            onClick={() => handleEdit(t)}
                            className={`group relative bg-white border border-slate-100 p-8 rounded-2xl transition-all duration-300 ${!isReadOnly ? 'cursor-pointer hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5' : ''}`}
                        >
                            <div className="absolute -top-3 -left-3 w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                                <Quote size={16} fill="currentColor" />
                            </div>

                            <p className="text-lg font-serif italic text-slate-700 leading-relaxed mb-8">
                                "{t.content}"
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-mono text-xs font-bold">
                                    {t.author_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-900">{t.author_name}</p>
                                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest truncate">
                                        {t.author_role || 'Referencia'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl group">
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                        <Quote size={20} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-lg font-serif text-slate-800 mb-1">Sin testimonios aún</h4>
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-tight text-center max-w-[280px]">
                        Tu vitrina está esperando testimonios.
                    </p>
                    {!isReadOnly && (
                        <button
                            onClick={handleCreate}
                            className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-mono tracking-widest uppercase hover:bg-slate-800 transition-colors"
                        >
                            Añadir Testimonio
                        </button>
                    )}
                </div>
            )}

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
