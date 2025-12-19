'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Check } from 'lucide-react'

interface Option {
    id: number | string
    name: string
}

interface ComboboxProps {
    options: Option[]
    value: string
    onChange: (value: string) => void
    placeholder: string
    icon?: React.ReactNode
    emptyMessage?: string
}

export default function Combobox({ options, value, onChange, placeholder, icon, emptyMessage = "No se encontraron resultados" }: ComboboxProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find(opt => opt.id.toString() === value)

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent cursor-pointer bg-white transition-all ${isOpen ? 'ring-2 ring-purple-500 border-transparent shadow-md' : 'hover:border-gray-400'}`}
            >
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}

                <span className={`block truncate font-medium ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
                    {selectedOption ? selectedOption.name : placeholder}
                </span>

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-[60] mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-gray-50 flex items-center gap-2">
                        <Search size={16} className="text-gray-400 ml-2" />
                        <input
                            type="text"
                            autoFocus
                            placeholder="Buscar..."
                            className="w-full py-2 bg-transparent text-sm focus:outline-none text-gray-900"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') setIsOpen(false)
                            }}
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => {
                                        onChange(option.id.toString())
                                        setIsOpen(false)
                                        setSearchTerm('')
                                    }}
                                    className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors ${option.id.toString() === value
                                            ? 'bg-purple-50 text-purple-700 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="truncate">{option.name}</span>
                                    {option.id.toString() === value && <Check size={14} className="text-purple-600" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-sm text-gray-500 italic">
                                {emptyMessage}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
