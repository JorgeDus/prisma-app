'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    ArrowLeft,
    LogOut,
    GraduationCap,
    ChevronDown,
} from 'lucide-react'

interface UniversitySidebarProps {
    universityName: string
    universityLogoUrl: string | null
    accountName: string
    role: string
}

const navItems = [
    { href: '/university', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/university/students', label: 'Estudiantes', icon: Users },
]

export default function UniversitySidebar({
    universityName,
    universityLogoUrl,
    accountName,
    role,
}: UniversitySidebarProps) {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-indigo-950 text-white flex flex-col z-50">
            {/* Header — identidad de la universidad */}
            <div className="p-6 border-b border-indigo-900">
                <div className="flex items-center gap-3 mb-4">
                    <Image
                        src="/logo-prisma.png"
                        alt="Prisma"
                        width={90}
                        height={24}
                        className="h-5 w-auto brightness-200 invert"
                    />
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-400/20 text-indigo-300 text-[10px] font-mono font-bold tracking-widest uppercase">
                        <GraduationCap size={10} />
                        Portal
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    {universityLogoUrl ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0">
                            <Image
                                src={universityLogoUrl}
                                alt={universityName}
                                width={40}
                                height={40}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-indigo-800 flex items-center justify-center shrink-0">
                            <GraduationCap size={20} className="text-indigo-400" />
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-white leading-tight truncate">
                            {universityName}
                        </p>
                        <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider">
                            Portal Institucional
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/university' && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                                : 'text-indigo-300 hover:text-white hover:bg-indigo-900'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer — cuenta */}
            <div className="p-4 border-t border-indigo-900 space-y-1">
                <div className="px-3 py-2 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{accountName}</p>
                    <p className="text-[10px] text-indigo-400 capitalize">{role}</p>
                </div>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-300 hover:text-white hover:bg-indigo-900 transition-all duration-150"
                >
                    <ArrowLeft size={18} />
                    Volver a Prisma
                </Link>
                <form action="/auth/signout" method="post">
                    <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-300 hover:text-red-400 hover:bg-indigo-900 transition-all duration-150">
                        <LogOut size={18} />
                        Cerrar Sesión
                    </button>
                </form>
            </div>
        </aside>
    )
}
