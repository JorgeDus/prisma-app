import { User, Building2 } from 'lucide-react'
import { Achievement } from '@/types/database.types'

interface DashboardCourseCardProps {
    catedra: Achievement
    institutionName?: string
}

export default function DashboardCourseCard({ catedra, institutionName = 'Institución' }: DashboardCourseCardProps) {
    // Si no es una cátedra, no renderizar (safety check)
    if (catedra.category !== 'course_chair') return null

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-indigo-200 transition-all group relative overflow-hidden h-full">
            {/* Decorative university pattern */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full opacity-50" />

            {/* Distinction Badge - En el modelo actual 'organization' podría usarse para la distinción o institución */}
            <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-md">
                    ⭐ Destacado
                </span>
            </div>

            {/* Course Name */}
            <h4 className="font-bold text-gray-900 text-lg mb-3 pr-20 group-hover:text-indigo-700 transition-colors line-clamp-2">
                {catedra.title}
            </h4>

            {/* Professor - Highlighted */}
            {catedra.professor_name && (
                <div className="flex items-center gap-2 mb-3 p-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-white" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs text-indigo-600 font-medium">Cátedra</p>
                        <p className="font-semibold text-gray-900 text-sm truncate">{catedra.professor_name}</p>
                    </div>
                </div>
            )}

            {/* Institution */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-auto">
                <Building2 size={14} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{catedra.organization || institutionName}</span>
            </div>

            {/* Date */}
            {catedra.date && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Fecha: {new Date(catedra.date).toLocaleDateString()}</span>
                </div>
            )}
        </div>
    )
}
