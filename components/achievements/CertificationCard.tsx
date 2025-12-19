
import { FileBadge, ArrowRight } from 'lucide-react'
import { Achievement } from '@/types/database.types'

interface CertificationCardProps {
    achievement: Achievement
    onEdit?: () => void
}

export default function CertificationCard({ achievement, onEdit }: CertificationCardProps) {
    return (
        <div
            onClick={onEdit}
            className={`bg-white rounded-2xl border border-blue-50 p-4 flex items-center gap-4 hover:border-blue-200 transition-all group ${onEdit ? 'cursor-pointer' : ''}`}
        >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                <FileBadge size={24} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[9px] font-black rounded-md uppercase tracking-wider">
                        Certificación
                    </span>
                    {achievement.distinction && (
                        <span className="text-[10px] text-blue-400 font-bold italic">
                            • {achievement.distinction}
                        </span>
                    )}
                </div>
                <h4 className="text-sm font-black text-gray-900 truncate tracking-tight uppercase">
                    {achievement.title}
                </h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                    {achievement.organization}
                </p>
            </div>

            {onEdit && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={16} className="text-blue-300" />
                </div>
            )}
        </div>
    )
}
