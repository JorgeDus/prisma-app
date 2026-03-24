'use client'

import { useState, useMemo } from 'react'
import { ArrowUpDown, Search } from 'lucide-react'

export default function DataGrid({ data }: { data: any[] }) {
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'count', direction: 'desc' })
    const [searchTerm, setSearchTerm] = useState('')

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
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1
            }
            return 0
        })
        
        return sortableItems
    }, [data, sortConfig, searchTerm])

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-800">Deep-Dive: Segmentación de Estudiantes</h2>
                    <p className="text-xs text-slate-500 mt-1">Explora los cruces demográficos exactos en la base de datos actual.</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Buscar carrera, año..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-sm pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-white">
                            <th className="p-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => requestSort('career')}>
                                <div className="flex items-center gap-2">Carrera <ArrowUpDown size={12} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => requestSort('cohort')}>
                                <div className="flex items-center gap-2">Año de Ingreso <ArrowUpDown size={12} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => requestSort('gender')}>
                                <div className="flex items-center gap-2">Género <ArrowUpDown size={12} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-slate-50 transition-colors text-right" onClick={() => requestSort('count')}>
                                <div className="flex items-center justify-end gap-2">Total Estudiantes <ArrowUpDown size={12} /></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {sortedAndFilteredData.length > 0 ? sortedAndFilteredData.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                <td className="p-4 text-sm font-medium text-slate-800">{row.career}</td>
                                <td className="p-4 text-sm text-slate-600">{row.cohort}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold
                                        ${row.gender.toLowerCase() === 'femenino' ? 'bg-rose-50 text-rose-600' : 
                                          row.gender.toLowerCase() === 'masculino' ? 'bg-indigo-50 text-indigo-600' : 
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
        </div>
    )
}
