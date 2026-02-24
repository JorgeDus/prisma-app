'use client'

import { useState, useTransition } from 'react'
import {
    Search,
    ExternalLink,
    PauseCircle,
    PlayCircle,
    Loader2,
    FolderOpen,
    Briefcase,
    Trash2,
    EyeOff,
    Eye,
} from 'lucide-react'
import { toggleUserPause, deleteUserAccount, toggleUserExploreVisibility } from '@/app/(admin)/admin/actions'

interface UserRow {
    id: string
    username: string
    full_name: string | null
    email: string | null
    avatar_url: string | null
    is_paused: boolean
    paused_at: string | null
    deletion_requested_at: string | null
    created_at: string
    last_sign_in_at: string | null
    hidden_from_explore: boolean
    university_name: string | null
    project_count: number
    experience_count: number
    status: 'active' | 'paused' | 'deletion_pending'
}

const statusConfig = {
    active: { label: 'Activo', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    paused: { label: 'Pausado', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    deletion_pending: { label: 'Eliminación pendiente', className: 'bg-red-50 text-red-700 border-red-200' },
}

export default function AdminUsersClient({ users }: { users: UserRow[] }) {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [hidingId, setHidingId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const filtered = users.filter(user => {
        const matchesSearch = search === '' || [
            user.full_name,
            user.username,
            user.email,
            user.university_name,
        ].some(field => field?.toLowerCase().includes(search.toLowerCase()))

        const matchesStatus = statusFilter === 'all' || user.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleTogglePause = (userId: string) => {
        setLoadingId(userId)
        startTransition(async () => {
            await toggleUserPause(userId)
            setLoadingId(null)
        })
    }

    const handleDeleteUser = (userId: string, displayName: string) => {
        if (!confirm(`¿Eliminar permanentemente la cuenta de "${displayName}"? Esta acción es irreversible y borrará todos sus datos.`)) return
        setDeletingId(userId)
        startTransition(async () => {
            await deleteUserAccount(userId)
            setDeletingId(null)
        })
    }

    const handleToggleExplore = (userId: string) => {
        setHidingId(userId)
        startTransition(async () => {
            await toggleUserExploreVisibility(userId)
            setHidingId(null)
        })
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, username, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="paused">Pausados</option>
                    <option value="deletion_pending">Eliminación pendiente</option>
                </select>
            </div>

            {/* Results count */}
            <p className="text-xs text-slate-400">
                Mostrando {filtered.length} de {users.length} usuarios
            </p>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="text-left px-5 py-3 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">Usuario</th>
                                <th className="text-left px-5 py-3 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">Universidad</th>
                                <th className="text-center px-5 py-3 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">Contenido</th>
                                <th className="text-center px-5 py-3 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">Estado</th>
                                <th className="text-center px-5 py-3 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">Último ingreso</th>
                                <th className="text-center px-5 py-3 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">Registro</th>
                                <th className="text-right px-5 py-3 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                                        No se encontraron usuarios
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        {/* User info */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                    {user.full_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-800 truncate">
                                                        {user.full_name || user.username}
                                                    </p>
                                                    <p className="text-xs text-slate-400 truncate">
                                                        @{user.username} · {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* University */}
                                        <td className="px-5 py-4 text-slate-600">
                                            {user.university_name || <span className="text-slate-300">—</span>}
                                        </td>

                                        {/* Content counts */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-center gap-3 text-slate-500">
                                                <span className="flex items-center gap-1" title="Proyectos">
                                                    <FolderOpen size={14} />
                                                    {user.project_count}
                                                </span>
                                                <span className="flex items-center gap-1" title="Experiencias">
                                                    <Briefcase size={14} />
                                                    {user.experience_count}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig[user.status].className}`}>
                                                {statusConfig[user.status].label}
                                            </span>
                                        </td>

                                        {/* Last sign in */}
                                        <td className="px-5 py-4 text-center text-slate-400 text-xs">
                                            {user.last_sign_in_at ? (
                                                <span title={new Date(user.last_sign_in_at).toLocaleString('es-CL')}>
                                                    {new Date(user.last_sign_in_at).toLocaleDateString('es-CL', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300">Nunca</span>
                                            )}
                                        </td>

                                        {/* Registration date */}
                                        <td className="px-5 py-4 text-center text-slate-400 text-xs">
                                            {new Date(user.created_at).toLocaleDateString('es-CL', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <a
                                                    href={`/${user.username}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                    title="Ver perfil público"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                                {user.status !== 'deletion_pending' && (
                                                    <button
                                                        onClick={() => handleTogglePause(user.id)}
                                                        disabled={loadingId === user.id || isPending}
                                                        className={`p-2 rounded-lg transition-colors ${user.is_paused
                                                            ? 'text-emerald-500 hover:bg-emerald-50'
                                                            : 'text-amber-500 hover:bg-amber-50'
                                                            } disabled:opacity-50`}
                                                        title={user.is_paused ? 'Reactivar cuenta' : 'Pausar cuenta'}
                                                    >
                                                        {loadingId === user.id ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : user.is_paused ? (
                                                            <PlayCircle size={16} />
                                                        ) : (
                                                            <PauseCircle size={16} />
                                                        )}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleToggleExplore(user.id)}
                                                    disabled={hidingId === user.id || isPending}
                                                    className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${user.hidden_from_explore
                                                            ? 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                                                            : 'text-indigo-500 hover:bg-indigo-50'
                                                        }`}
                                                    title={user.hidden_from_explore ? 'Mostrar en Explorar' : 'Ocultar de Explorar'}
                                                >
                                                    {hidingId === user.id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : user.hidden_from_explore ? (
                                                        <EyeOff size={16} />
                                                    ) : (
                                                        <Eye size={16} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.full_name || user.username)}
                                                    disabled={deletingId === user.id || isPending}
                                                    className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                                    title="Eliminar cuenta permanentemente"
                                                >
                                                    {deletingId === user.id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
