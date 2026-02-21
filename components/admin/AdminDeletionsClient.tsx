'use client'

import { useState, useTransition } from 'react'
import { Trash2, Clock, AlertTriangle, Loader2, CheckCircle } from 'lucide-react'
import { deleteUserAccount, executePendingDeletions } from '@/app/(admin)/admin/actions'

interface DeletionAccount {
    id: string
    username: string
    full_name: string | null
    email: string | null
    deletion_requested_at: string | null
    deletion_date: string
    days_remaining: number
    ready_for_deletion: boolean
}

export default function AdminDeletionsClient({
    readyForDeletion,
    inGracePeriod,
}: {
    readyForDeletion: DeletionAccount[]
    inGracePeriod: DeletionAccount[]
}) {
    const [isPending, startTransition] = useTransition()
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [batchLoading, setBatchLoading] = useState(false)
    const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const handleDeleteSingle = (userId: string) => {
        if (!confirm('¿Estás seguro? Esta acción eliminará permanentemente la cuenta y todos sus datos.')) return
        setLoadingId(userId)
        startTransition(async () => {
            const res = await deleteUserAccount(userId)
            setLoadingId(null)
            if (res.error) {
                setResult({ type: 'error', message: res.error })
            } else {
                setResult({ type: 'success', message: 'Cuenta eliminada correctamente' })
            }
        })
    }

    const handleBatchDelete = () => {
        if (!confirm(`¿Eliminar ${readyForDeletion.length} cuenta(s)? Esta acción es irreversible.`)) return
        setBatchLoading(true)
        startTransition(async () => {
            const res = await executePendingDeletions()
            setBatchLoading(false)
            if (res.error) {
                setResult({ type: 'error', message: res.error })
            } else {
                setResult({ type: 'success', message: `${res.deleted} cuenta(s) eliminada(s)` })
            }
        })
    }

    return (
        <div className="space-y-6">
            {/* Status message */}
            {result && (
                <div className={`flex items-center gap-2 p-4 rounded-xl border text-sm ${result.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                    <CheckCircle size={16} />
                    {result.message}
                </div>
            )}

            {/* Ready for deletion */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-500" />
                        <h2 className="text-sm font-mono font-bold tracking-widest uppercase text-slate-400">
                            Listas para eliminar
                        </h2>
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                            {readyForDeletion.length}
                        </span>
                    </div>
                    {readyForDeletion.length > 0 && (
                        <button
                            onClick={handleBatchDelete}
                            disabled={batchLoading || isPending}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {batchLoading ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Trash2 size={14} />
                            )}
                            Eliminar todas
                        </button>
                    )}
                </div>
                <div className="divide-y divide-slate-100">
                    {readyForDeletion.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-400">
                            No hay cuentas listas para eliminar
                        </div>
                    ) : (
                        readyForDeletion.map(account => (
                            <div key={account.id} className="flex items-center gap-4 px-5 py-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800">
                                        {account.full_name || account.username}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        @{account.username} · {account.email}
                                    </p>
                                </div>
                                <span className="text-xs text-red-500 font-medium shrink-0">
                                    Venció hace {Math.abs(account.days_remaining)} día(s)
                                </span>
                                <button
                                    onClick={() => handleDeleteSingle(account.id)}
                                    disabled={loadingId === account.id || isPending}
                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                    title="Eliminar cuenta"
                                >
                                    {loadingId === account.id ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* In grace period */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                    <Clock size={16} className="text-amber-500" />
                    <h2 className="text-sm font-mono font-bold tracking-widest uppercase text-slate-400">
                        En período de gracia
                    </h2>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-600">
                        {inGracePeriod.length}
                    </span>
                </div>
                <div className="divide-y divide-slate-100">
                    {inGracePeriod.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-400">
                            No hay cuentas en período de gracia
                        </div>
                    ) : (
                        inGracePeriod.map(account => (
                            <div key={account.id} className="flex items-center gap-4 px-5 py-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800">
                                        {account.full_name || account.username}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        @{account.username} · {account.email}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-medium text-amber-600">
                                        {account.days_remaining} día{account.days_remaining !== 1 ? 's' : ''} restante{account.days_remaining !== 1 ? 's' : ''}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        Solicitado: {account.deletion_requested_at ? new Date(account.deletion_requested_at).toLocaleDateString('es-CL', {
                                            day: 'numeric',
                                            month: 'short',
                                        }) : '—'}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
