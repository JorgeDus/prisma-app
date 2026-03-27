'use client'

import { useState, useMemo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 50

function exportToCSV(data: any[]) {
    const headers = ['Carrera', 'Año de Ingreso', 'Género', 'Total Estudiantes']
    const rows = data.map(r => [
        `"${r.career}"`,
        `"${r.cohort}"`,
        `"${r.gender}"`,
        r.count
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `segmentacion_estudiantes_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
}

export default function DataGrid({ data }: { data: any[] }) {
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'count', direction: 'desc' })
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)

    const sortedAndFilteredData = useMemo(() => {
        let sortableItems = [...(data || [])]

        // Filter
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase()
            sortableItems = sortableItems.filter(item =>
                item.career.toLowerCase().includes(lowerTerm) ||
                item.cohort.toLowerCase().includes(lowerTerm) ||
                item.gender.toLowerCase().includes(lowerTerm)
            )
        }

        // Sort
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })

        return sortableItems
    }, [data, sortConfig, searchTerm])

    const totalPages = Math.ceil(sortedAndFilteredData.length / PAGE_SIZE)
    const paginatedData = sortedAndFilteredData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    const requestSort = (key: string) => {
        setSortConfig(prev =>
            prev.key === key
                ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
                : { key, direction: key === 'count' ? 'desc' : 'asc' }
        )
        setPage(0)
    }

    const SortIcon = ({ colKey }: { colKey: string }) => {
        if (sortConfig.key !== colKey) return <ArrowUpDown size={12} className="text-slate-300" />
        return sortConfig.direction === 'asc'
            ? <ArrowUp size={12} className="text-indigo-500" />
            : <ArrowDown size={12} className="text-indigo-500" />
    }

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-800">Deep-Dive: Segmentación de Estudiantes</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        {sortedAndFilteredData.length} cruces encontrados. Explora y filtra los segmentos exactos.
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar carrera, año..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(0) }}
                            className="w-full text-sm pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => exportToCSV(sortedAndFilteredData)}
                        title="Exportar a CSV"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm whitespace-nowrap"
                    >
                        <Download size={14} />
                        Exportar CSV
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-white">
                            <th className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${sortConfig.key === 'career' ? 'text-indigo-600' : ''}`} onClick={() => requestSort('career')}>
                                <div className="flex items-center gap-2">Carrera <SortIcon colKey="career" /></div>
                            </th>
                            <th className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${sortConfig.key === 'cohort' ? 'text-indigo-600' : ''}`} onClick={() => requestSort('cohort')}>
                                <div className="flex items-center gap-2">Año de Ingreso <SortIcon colKey="cohort" /></div>
                            </th>
                            <th className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${sortConfig.key === 'gender' ? 'text-indigo-600' : ''}`} onClick={() => requestSort('gender')}>
                                <div className="flex items-center gap-2">Género <SortIcon colKey="gender" /></div>
                            </th>
                            <th className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors text-right ${sortConfig.key === 'count' ? 'text-indigo-600' : ''}`} onClick={() => requestSort('count')}>
                                <div className="flex items-center justify-end gap-2">Total Estudiantes <SortIcon colKey="count" /></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paginatedData.length > 0 ? paginatedData.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                <td className="p-4 text-sm font-medium text-slate-800">{row.career}</td>
                                <td className="p-4 text-sm text-slate-600">{row.cohort}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold
                                        ${row.gender === 'Mujer' ? 'bg-rose-50 text-rose-600' : 
                                          row.gender === 'Hombre' ? 'bg-indigo-50 text-indigo-600' : 
                                          row.gender === 'No binario' ? 'bg-emerald-50 text-emerald-600' : 
                                          row.gender.includes('autodescribirme') ? 'bg-fuchsia-100 text-fuchsia-700' : 
                                          'bg-slate-100 text-slate-600'}`
                                    }>
                                        {row.gender}
                                    </span>
                                </td>
                                <td className="p-4 text-sm font-bold text-slate-900 text-right">{row.count}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">
                                    No se encontraron cruces de datos para esta búsqueda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium">
                        Mostrando {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sortedAndFilteredData.length)} de {sortedAndFilteredData.length} filas
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs font-semibold text-slate-700 px-2">
                            {page + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
