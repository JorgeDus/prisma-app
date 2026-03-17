'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { GraduationCap, Loader2, Lock } from 'lucide-react'

export default function UniversityLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setError('Credenciales incorrectas. Verifica tu email y contraseña.')
            setIsLoading(false)
            return
        }

        // La redirección la maneja el layout guard — simplemente recargar
        window.location.href = '/university'
    }

    return (
        <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8 gap-4">
                    <Image
                        src="/logo-prisma.png"
                        alt="Prisma"
                        width={130}
                        height={36}
                        className="h-8 w-auto brightness-200 invert"
                    />
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800 text-indigo-300 text-xs font-mono font-bold tracking-widest uppercase">
                        <GraduationCap size={12} />
                        Portal Institucional
                    </span>
                </div>

                {/* Card */}
                <div className="bg-indigo-900/50 border border-indigo-800 rounded-2xl p-8 backdrop-blur-sm">
                    <h1 className="text-xl font-bold text-white mb-1">Acceso institucional</h1>
                    <p className="text-sm text-indigo-400 mb-6">
                        Ingresa con las credenciales de tu cuenta universitaria
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-indigo-400 uppercase tracking-wider mb-1.5">
                                Email institucional
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="direccion@universidad.cl"
                                className="w-full px-4 py-3 rounded-xl bg-indigo-950 border border-indigo-700 text-white placeholder-indigo-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-indigo-400 uppercase tracking-wider mb-1.5">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••••"
                                className="w-full px-4 py-3 rounded-xl bg-indigo-950 border border-indigo-700 text-white placeholder-indigo-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-950/50 border border-red-800 px-4 py-3">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Lock size={16} />
                            )}
                            {isLoading ? 'Ingresando...' : 'Ingresar al portal'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-indigo-600 mt-6">
                    Acceso exclusivo para cuentas institucionales · Prisma
                </p>
            </div>
        </div>
    )
}
