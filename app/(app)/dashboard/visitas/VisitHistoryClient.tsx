'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, Clock, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { getVisitsPage } from './actions'

function formatRelativeTime(dateString: string): string {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMin < 1) return 'ahora'
    if (diffMin < 60) return `hace ${diffMin} min`
    if (diffHours < 24) return `hace ${diffHours}h`
    if (diffDays === 1) return 'ayer'
    if (diffDays < 7) return `hace ${diffDays} días`
    return new Date(dateString).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

function formatFullDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function VisitHistoryClient() {
    const [visits, setVisits] = useState<any[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)

    const fetchPage = async (page: number) => {
        setLoading(true)
        try {
            const result = await getVisitsPage(page)
            setVisits(result.visits)
            setTotalCount(result.totalCount)
            setTotalPages(result.totalPages || 0)
            setCurrentPage(result.currentPage || page)
        } catch (err) {
            console.error('Error fetching visits:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPage(1)
    }, [])

    return (
        <div className="min-h-screen pt-24 pb-32 px-4 md:px-6">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Dashboard
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Visitas a tu Perfil</h1>
                            <p className="text-sm text-slate-500 mt-1">
                                {totalCount === 0
                                    ? 'Sin visitas registradas'
                                    : `${totalCount} visita${totalCount !== 1 ? 's' : ''} en total`
                                }
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Eye size={22} className="text-indigo-500" />
                        </div>
                    </div>
                </div>

                {/* Visits list */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="px-6 py-16 text-center">
                            <div className="w-6 h-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                            <p className="text-sm text-slate-400 mt-3">Cargando historial...</p>
                        </div>
                    ) : visits.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <Eye size={32} className="text-slate-300 mx-auto mb-3" />
                            <p className="text-lg font-semibold text-slate-500">Sin visitas aún</p>
                            <p className="text-sm text-slate-400 mt-1">
                                Cuando alguien visite tu perfil público, aparecerá aquí
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {visits.map((visit) => (
                                <div
                                    key={visit.id}
                                    className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50/50 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Eye size={16} className="text-slate-400" />
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
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <div className="flex items-center gap-1">
                                                <Clock size={11} className="text-slate-400" />
                                                <span className="text-[11px] text-slate-400 font-mono">
                                                    {formatRelativeTime(visit.visited_at)}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-300">
                                                {formatFullDate(visit.visited_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2">
                        <button
                            onClick={() => fetchPage(currentPage - 1)}
                            disabled={currentPage <= 1 || loading}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={14} />
                            Anterior
                        </button>
                        <span className="text-xs font-mono text-slate-400">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => fetchPage(currentPage + 1)}
                            disabled={currentPage >= totalPages || loading}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Siguiente
                            <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
