
import { User, GraduationCap, Award } from 'lucide-react'
import { Achievement } from '@/types/database.types'

interface CourseChairCardProps {
    achievement: Achievement
    onEdit?: () => void
}

export default function CourseChairCard({ achievement, onEdit }: CourseChairCardProps) {
    return (
        <div
            onClick={onEdit}
            className={`bg-white rounded-[2rem] border border-indigo-100 p-6 shadow-sm hover:shadow-md transition-all relative group overflow-hidden ${onEdit ? 'cursor-pointer' : ''}`}
        >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <div className="relative flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <GraduationCap size={20} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-gray-900 tracking-tight uppercase leading-tight">
                                {achievement.title}
                            </h4>
                            <div className="flex items-center gap-1.5">
                                <GraduationCap size={10} className="text-indigo-400" />
                                <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em]">Cátedra Destacada</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl">
                            <User size={14} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-700">Prof. {achievement.professor_name || 'No especificado'}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {achievement.organization} {achievement.date ? `• ${new Date(achievement.date).getFullYear()}` : ''}
                        </div>
                    </div>
                </div>

                {achievement.distinction && (
                    <div className="shrink-0 flex items-center md:items-start">
                        <div className="flex flex-col items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200">
                            <Award size={20} className="text-indigo-600 mb-1" />
                            <span className="text-sm font-black text-indigo-700">{achievement.distinction}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
