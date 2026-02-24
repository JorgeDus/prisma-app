'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Eye, Clock, X } from 'lucide-react'
import { getRecentVisits, markVisitsAsSeen } from '@/app/(app)/visit-actions'

interface ProfileVisitsPopoverProps {
    unseenCount: number
}

function formatRelativeTime(dateString: string): string {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMin < 1) return 'ahora'
    if (diffMin < 60) return `hace ${diffMin}m`
    if (diffHours < 24) return `hace ${diffHours}h`
    if (diffDays === 1) return 'ayer'
    if (diffDays < 7) return `hace ${diffDays}d`
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} sem`
    return `hace ${Math.floor(diffDays / 30)} mes`
}

export default function ProfileVisitsPopover({ unseenCount }: ProfileVisitsPopoverProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [visits, setVisits] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [badgeCount, setBadgeCount] = useState(unseenCount)
    const popoverRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleOpen = async () => {
        if (isOpen) {
            setIsOpen(false)
            return
        }

        setIsOpen(true)
        setLoading(true)

        try {
            const data = await getRecentVisits()
            setVisits(data)

            // Mark as seen
            if (badgeCount > 0) {
                await markVisitsAsSeen()
                setBadgeCount(0)
            }
        } catch (err) {
            console.error('Error fetching visits:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative" ref={popoverRef}>
            {/* Trigger button */}
            <button
                onClick={handleOpen}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                title="Visitas a tu perfil"
            >
                <Eye size={14} />
                <span className="hidden lg:inline">Visitas</span>
                {badgeCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {badgeCount > 9 ? '9+' : badgeCount}
                    </span>
                )}
            </button>

            {/* Popover panel */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-[10px] font-mono font-black tracking-widest uppercase text-slate-600">
                            Visitas a tu Perfil
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="max-h-72 overflow-y-auto">
                        {loading ? (
                            <div className="px-4 py-8 text-center">
                                <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                                <p className="text-xs text-slate-400 mt-2">Cargando...</p>
                            </div>
                        ) : visits.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <Eye size={24} className="text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">Sin visitas recientes</p>
                                <p className="text-xs text-slate-400 mt-1">Las visitas de los últimos 30 días aparecerán aquí</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {visits.map((visit) => (
                                    <div
                                        key={visit.id}
                                        className={`px-4 py-3 flex items-start gap-3 transition-colors ${!visit.seen_at ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Eye size={14} className="text-slate-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-700 leading-snug">
                                                Alguien
                                                {(visit.visitor_career || visit.visitor_university) && (
                                                    <> de{' '}
                                                        <span className="font-medium text-slate-800">
                                                            {[visit.visitor_career, visit.visitor_university].filter(Boolean).join(' · ')}
                                                        </span>
                                                    </>
                                                )}
                                                {' '}visitó tu perfil
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Clock size={10} className="text-slate-400" />
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {formatRelativeTime(visit.visited_at)}
                                                </span>
                                            </div>
                                        </div>
                                        {!visit.seen_at && (
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {!loading && visits.length > 0 && (
                        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                            <Link
                                href="/dashboard/visitas"
                                onClick={() => setIsOpen(false)}
                                className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-500 hover:text-indigo-700 transition-colors"
                            >
                                Ver historial completo →
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
