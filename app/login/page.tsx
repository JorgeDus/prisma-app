'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Mail, CheckCircle, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    const supabase = createClient()

    const handleMagicLinkLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
                },
            })

            if (error) {
                throw error
            }

            setIsSuccess(true)
        } catch (error: any) {
            setError(error.message || 'Ocurrió un error al enviar el correo.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
                },
            })
            if (error) throw error
        } catch (error: any) {
            setError(error.message)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Botón Volver */}
            <div className="absolute top-8 left-8">
                <Link
                    href="/"
                    className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Volver al inicio
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center mb-6">
                    <Image
                        src="/logo-prisma.png" // Ajustado al nombre del archivo renombrado por el usuario
                        alt="Prisma"
                        width={180}
                        height={60}
                        className="h-12 w-auto"
                        priority
                    />
                </Link>

                <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    Te damos la bienvenida a Prisma
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ingresa o crea tu cuenta ingresando tu correo
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">

                    {isSuccess ? (
                        <div className="text-center animate-fade-in description-success">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">¡Revisa tu correo!</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Hemos enviado un enlace mágico a <span className="font-semibold text-gray-900">{email}</span>.
                                Haz clic en el enlace para iniciar sesión.
                            </p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="text-sm font-medium text-purple-600 hover:text-purple-500"
                            >
                                Intentar con otro correo
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Google Login */}
                            <div>
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin text-gray-400" />
                                    ) : (
                                        <>
                                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.23856)">
                                                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.059 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.439 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                                </g>
                                            </svg>
                                            Continuar con Google
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        O ingresa con tu correo
                                    </span>
                                </div>
                            </div>

                            {/* Email Form */}
                            <form onSubmit={handleMagicLinkLogin} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Correo electrónico
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200 hover:border-gray-400"
                                            placeholder="tu@universidad.cl"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="rounded-md bg-red-50 p-4">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">
                                                    Error de inicio de sesión
                                                </h3>
                                                <div className="mt-2 text-sm text-red-700">
                                                    <p>{error}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-cyan-500 hover:from-purple-800 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Enviar enlace mágico'
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center text-xs text-gray-400">
                    <p>© 2025 Prisma. Protección y seguridad de datos garantizada.</p>
                </div>
            </div>
        </div>
    )
}
