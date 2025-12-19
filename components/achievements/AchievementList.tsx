
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trophy } from 'lucide-react'
import { Achievement } from '@/types/database.types'
import AwardCard from './AwardCard'
import CertificationCard from './CertificationCard'
import CourseChairCard from './CourseChairCard'
import AcademicRoleCard from './AcademicRoleCard'
import AchievementModal from './AchievementModal'

interface AchievementListProps {
    initialAchievements: Achievement[]
    userId: string
    isReadOnly?: boolean
}

export default function AchievementList({ initialAchievements, userId, isReadOnly = false }: AchievementListProps) {
    const router = useRouter()
    const [achievements, setAchievements] = useState(initialAchievements)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)

    useEffect(() => {
        setAchievements(initialAchievements)
    }, [initialAchievements])

    const handleEdit = (achievement: Achievement) => {
        if (isReadOnly) return
        setEditingAchievement(achievement)
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        setEditingAchievement(null)
        setIsModalOpen(true)
    }

    const handleSuccess = () => {
        router.refresh()
    }

    const groupedAchievements = {
        award: achievements.filter(a => a.category === 'award'),
        certification: achievements.filter(a => a.category === 'certification'),
        academic_role: achievements.filter(a => a.category === 'academic_role'),
        course_chair: achievements.filter(a => a.category === 'course_chair'),
    }

    const sections = [
        { id: 'award', title: 'Premios y Reconocimientos', items: groupedAchievements.award },
        { id: 'certification', title: 'Certificaciones y Cursos', items: groupedAchievements.certification },
        { id: 'academic_role', title: 'Ayudantías / Investigación', items: groupedAchievements.academic_role },
        { id: 'course_chair', title: 'Cátedras Destacadas', items: groupedAchievements.course_chair },
    ]

    const hasAnyAchievement = achievements.length > 0

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{isReadOnly ? 'Sala de Trofeos' : 'Mis Logros'}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {isReadOnly
                            ? 'Reconocimientos, certificaciones y méritos académicos destacados.'
                            : 'Gestiona tus méritos. Haz clic en cualquier tarjeta para editarla.'}
                    </p>
                </div>
                {!isReadOnly && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-100"
                    >
                        <Plus size={20} />
                        Agregar Logro
                    </button>
                )}
            </div>

            {/* Sections */}
            {hasAnyAchievement ? (
                <div className="space-y-16">
                    {sections.map((section) => (
                        section.items.length > 0 && (
                            <div key={section.id} className="space-y-6">
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                                    <div className="w-8 h-1 bg-purple-600 rounded-full" />
                                    {section.title}
                                </h3>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {section.items.map((achievement) => {
                                        const onEdit = isReadOnly ? undefined : () => handleEdit(achievement)

                                        if (achievement.category === 'course_chair') {
                                            return <CourseChairCard key={achievement.id} achievement={achievement} onEdit={onEdit} />
                                        }
                                        if (achievement.category === 'academic_role') {
                                            return <AcademicRoleCard key={achievement.id} achievement={achievement} onEdit={onEdit} />
                                        }
                                        if (achievement.category === 'award') {
                                            return <AwardCard key={achievement.id} achievement={achievement} onEdit={onEdit} />
                                        }
                                        return <CertificationCard key={achievement.id} achievement={achievement} onEdit={onEdit} />
                                    })}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <div className="w-20 h-20 bg-amber-50 text-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Tu sala de trofeos está vacía</h3>
                    <p className="text-gray-500 mt-2 mb-8 max-w-sm mx-auto">
                        Comienza a registrar tus méritos académicos, certificados y premios para destacar tu trayectoria.
                    </p>
                    {!isReadOnly && (
                        <button
                            onClick={handleCreate}
                            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
                        >
                            + Agregar primer logro
                        </button>
                    )}
                </div>
            )}

            {!isReadOnly && (
                <AchievementModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userId={userId}
                    achievementToEdit={editingAchievement}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    )
}
