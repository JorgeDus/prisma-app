
import { Trophy, Calendar, MapPin } from 'lucide-react'
import { Achievement } from '@/types/database.types'

interface AwardCardProps {
    achievement: Achievement
    onEdit?: () => void
}

export default function AwardCard({ achievement, onEdit }: AwardCardProps) {
    const date = achievement.date ? new Date(achievement.date).toLocaleDateString('es-CL', {
        month: 'long',
        year: 'numeric'
    }) : 'Fecha no especificada'

    return (
        <div
            onClick={onEdit}
            className={`bg-white rounded-[1.5rem] border border-amber-100 p-5 flex items-center gap-6 shadow-sm hover:shadow-md transition-all group ${onEdit ? 'cursor-pointer' : ''}`}
        >
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform">
                <Trophy size={32} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                    <h4 className="text-lg font-black text-gray-900 truncate tracking-tight uppercase">
                        {achievement.title}
                    </h4>
                    {achievement.distinction && (
                        <span className="shrink-0 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                            {achievement.distinction}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-widest">
                        <MapPin size={12} className="text-amber-400" />
                        {achievement.organization || 'Organización no especificada'}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-widest">
                        <Calendar size={12} className="text-amber-400" />
                        {date}
                    </div>
                </div>
            </div>
        </div>
    )
}
