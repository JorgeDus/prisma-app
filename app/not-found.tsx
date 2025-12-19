import Link from 'next/link'
import Image from 'next/image'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-8">
                <Link href="/">
                    <Image
                        src="/logo-prisma.png"
                        alt="Prisma Logo"
                        width={150}
                        height={50}
                        className="h-10 w-auto object-contain mx-auto"
                    />
                </Link>
            </div>

            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Search size={40} strokeWidth={1.5} />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfil no encontrado</h1>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Lo sentimos, el usuario que buscas no existe o el enlace es incorrecto.
                    ¡Pero no te preocupes, puedes volver a explorar!
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-100"
                    >
                        <Home size={18} />
                        Volver al Inicio
                    </Link>
                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold transition-all"
                    >
                        <ArrowLeft size={18} />
                        Ir a Iniciar Sesión
                    </Link>
                </div>
            </div>

            <p className="mt-12 text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Prisma. Todos los derechos reservados.
            </p>
        </div>
    )
}
