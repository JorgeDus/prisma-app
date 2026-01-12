'use client'

import { useMemo } from 'react'

interface MonthYearPickerProps {
    value: string // formato YYYY-MM-DD o YYYY-MM o vacío
    onChange: (value: string) => void
    disabled?: boolean
    required?: boolean
    className?: string
    yearRange?: { start: number; end: number }
}

const MONTHS = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
]

export default function MonthYearPicker({
    value,
    onChange,
    disabled = false,
    required = false,
    className = '',
    yearRange
}: MonthYearPickerProps) {
    // Parsear el valor actual
    const { month, year } = useMemo(() => {
        if (!value) return { month: '', year: '' }
        const parts = value.split('-')
        return {
            year: parts[0] || '',
            month: parts[1] || ''
        }
    }, [value])

    // Generar lista de años (desde 10 años atrás hasta el año actual + 5)
    const currentYear = new Date().getFullYear()
    const startYear = yearRange?.start ?? currentYear - 15
    const endYear = yearRange?.end ?? currentYear + 5

    const years = useMemo(() => {
        const result = []
        for (let y = endYear; y >= startYear; y--) {
            result.push(y.toString())
        }
        return result
    }, [startYear, endYear])

    const handleMonthChange = (newMonth: string) => {
        if (year && newMonth) {
            onChange(`${year}-${newMonth}-01`)
        } else if (newMonth && !year) {
            // Si no hay año seleccionado, usar el actual
            onChange(`${currentYear}-${newMonth}-01`)
        }
    }

    const handleYearChange = (newYear: string) => {
        if (month && newYear) {
            onChange(`${newYear}-${month}-01`)
        } else if (newYear && !month) {
            // Si no hay mes seleccionado, usar enero
            onChange(`${newYear}-01-01`)
        }
    }

    const baseSelectClasses = `px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 text-sm font-bold cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`

    return (
        <div className={`flex gap-3 ${className}`}>
            {/* Selector de Mes */}
            <select
                value={month}
                onChange={(e) => handleMonthChange(e.target.value)}
                disabled={disabled}
                required={required}
                className={`${baseSelectClasses} flex-1`}
            >
                <option value="">Mes</option>
                {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                        {m.label}
                    </option>
                ))}
            </select>

            {/* Selector de Año */}
            <select
                value={year}
                onChange={(e) => handleYearChange(e.target.value)}
                disabled={disabled}
                required={required}
                className={`${baseSelectClasses} w-28`}
            >
                <option value="">Año</option>
                {years.map((y) => (
                    <option key={y} value={y}>
                        {y}
                    </option>
                ))}
            </select>
        </div>
    )
}
