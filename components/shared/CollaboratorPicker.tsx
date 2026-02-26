'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Users, Search, X, ChevronDown } from 'lucide-react'

interface ContactProfile {
    id: string
    username: string
    full_name: string | null
    avatar_url: string | null
    headline: string | null
}

interface CollaboratorPickerProps {
    userId: string
    selectedIds: string[]
    onChange: (ids: string[]) => void
    label?: string
}

export default function CollaboratorPicker({
    userId,
    selectedIds,
    onChange,
    label = 'Colaboradores en Prisma'
}: CollaboratorPickerProps) {
    const supabase = createClient()
    const dropdownRef = useRef<HTMLDivElement>(null)

    const [contacts, setContacts] = useState<ContactProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')

    // Fetch accepted contacts on mount
    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true)
            try {
                // Get all accepted connections for this user
                const { data: connections, error } = await supabase
                    .from('connections')
                    .select('sender_id, receiver_id')
                    .eq('status', 'accepted')
                    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)

                if (error || !connections || connections.length === 0) {
                    setContacts([])
                    return
                }

                // Extract the "other" user's ID from each connection
                const contactIds = connections.map(c =>
                    c.sender_id === userId ? c.receiver_id : c.sender_id
                )

                // Fetch profiles for those contacts
                const { data: profiles, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, username, full_name, avatar_url, headline')
                    .in('id', contactIds)

                if (profilesError) {
                    setContacts([])
                    return
                }

                setContacts(profiles || [])
            } finally {
                setLoading(false)
            }
        }

        if (userId) fetchContacts()
    }, [userId])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
                setSearch('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedContacts = contacts.filter(c => selectedIds.includes(c.id))
    const availableContacts = contacts.filter(c => !selectedIds.includes(c.id))
    const filteredContacts = availableContacts.filter(c =>
    (c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.username.toLowerCase().includes(search.toLowerCase()))
    )

    const handleSelect = (contact: ContactProfile) => {
        onChange([...selectedIds, contact.id])
        setSearch('')
    }

    const handleRemove = (id: string) => {
        onChange(selectedIds.filter(sid => sid !== id))
    }

    const getInitial = (contact: ContactProfile) =>
        (contact.full_name || contact.username).charAt(0).toUpperCase()

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users size={16} className="text-purple-500" />
                {label}
            </label>
            <p className="text-[10px] text-slate-500 italic -mt-2">
                Solo puedes agregar contactos que ya están conectados contigo en Prisma.
            </p>

            {/* Selected collaborators chips */}
            {selectedContacts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedContacts.map(contact => (
                        <div
                            key={contact.id}
                            className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-xl px-3 py-1.5 text-xs font-semibold"
                        >
                            {contact.avatar_url ? (
                                <img
                                    src={contact.avatar_url}
                                    alt={contact.full_name || contact.username}
                                    className="w-5 h-5 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-[9px] font-bold">
                                    {getInitial(contact)}
                                </div>
                            )}
                            <span>{contact.full_name || contact.username}</span>
                            <button
                                type="button"
                                onClick={() => handleRemove(contact.id)}
                                className="text-indigo-400 hover:text-rose-500 transition-colors ml-0.5"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Dropdown trigger */}
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(prev => !prev)}
                    disabled={loading}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-purple-300 hover:bg-purple-50/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="font-medium">
                        {loading
                            ? 'Cargando contactos...'
                            : availableContacts.length === 0 && selectedContacts.length === 0
                                ? 'Aún no tienes contactos en Prisma'
                                : availableContacts.length === 0
                                    ? 'Todos tus contactos ya están agregados'
                                    : `Agregar colaborador...`}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Dropdown panel */}
                {isOpen && availableContacts.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                        {/* Search input */}
                        <div className="p-3 border-b border-gray-100">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Buscar contacto..."
                                    className="w-full pl-8 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Contact list */}
                        <div className="max-h-56 overflow-y-auto">
                            {filteredContacts.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-6">Sin resultados</p>
                            ) : (
                                filteredContacts.map(contact => (
                                    <button
                                        key={contact.id}
                                        type="button"
                                        onClick={() => handleSelect(contact)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors text-left"
                                    >
                                        {contact.avatar_url ? (
                                            <img
                                                src={contact.avatar_url}
                                                alt={contact.full_name || contact.username}
                                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                {getInitial(contact)}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {contact.full_name || contact.username}
                                            </p>
                                            {contact.headline && (
                                                <p className="text-[10px] text-gray-400 truncate">{contact.headline}</p>
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
