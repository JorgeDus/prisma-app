'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
    LogOut,
    Users,
    LayoutDashboard,
    Menu,
    X,
    Bell
} from 'lucide-react'
import NotificationsPopover from './NotificationsPopover'

interface AppNavbarProps {
    username: string
    unseenNotificationCount?: number
}

export default function AppNavbar({ username, unseenNotificationCount = 0 }: AppNavbarProps) {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const isDashboard = pathname === '/dashboard'
    const isExplorar = pathname === '/explorar'

    return (
        <>
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    {/* Left side - Logo and navigation */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo-prisma.png"
                                alt="Prisma Logo"
                                width={120}
                                height={32}
                                className="h-7 md:h-8 w-auto object-contain"
                            />
                        </Link>

                        <div className="hidden md:block h-4 w-px bg-slate-200" />

                        {/* Desktop navigation tabs */}
                        <div className="hidden md:flex items-center gap-1">
                            <Link
                                href="/dashboard"
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition-colors ${isDashboard
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <LayoutDashboard size={14} />
                                Dashboard
                            </Link>
                            <Link
                                href="/explorar"
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition-colors ${isExplorar
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Users size={14} />
                                Explorar
                            </Link>
                        </div>

                        {/* Notifications */}
                        <NotificationsPopover unseenCount={unseenNotificationCount} />

                        {/* Mobile: current page indicator */}
                        <span className="md:hidden font-mono text-xs font-bold tracking-tighter uppercase text-slate-800">
                            {isDashboard ? 'Mi Panel' : 'Explorar'}
                        </span>
                    </div>

                    {/* Desktop right side */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href={`/${username}`}
                            target="_blank"
                            className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                            Ver Vista Pública ↗
                        </Link>
                        <form action="/auth/signout" method="post">
                            <button className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 hover:text-red-600 transition-colors">
                                <LogOut size={14} />
                                Cerrar Sesión
                            </button>
                        </form>
                    </div>

                    {/* Mobile hamburger button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile dropdown menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
                        <div className="px-4 py-3 space-y-1">
                            <Link
                                href={`/${username}`}
                                target="_blank"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                <LayoutDashboard size={18} className="text-slate-400" />
                                Ver Vista Pública
                            </Link>
                            <Link
                                href="/explorar"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors ${isExplorar ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                <Users size={18} className={isExplorar ? 'text-indigo-500' : 'text-slate-400'} />
                                Explorar Talento
                            </Link>
                            <div className="border-t border-slate-100 my-2" />
                            <form action="/auth/signout" method="post">
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 w-full px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut size={18} />
                                    Cerrar Sesión
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 safe-area-pb">
                <div className="flex items-center justify-around h-16">
                    <Link
                        href="/dashboard"
                        className={`flex flex-col items-center gap-1 px-4 py-2 ${isDashboard ? 'text-indigo-600' : 'text-slate-500'
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wide">Dashboard</span>
                    </Link>
                    <Link
                        href="/explorar"
                        className={`flex flex-col items-center gap-1 px-4 py-2 ${isExplorar ? 'text-indigo-600' : 'text-slate-500'
                            }`}
                    >
                        <Users size={20} />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wide">Explorar</span>
                    </Link>
                    <button
                        className="relative flex flex-col items-center gap-1 px-4 py-2 text-slate-500"
                        onClick={() => {
                            // Navigate to dashboard — popover will be accessible from there
                            window.location.href = '/dashboard'
                        }}
                    >
                        <div className="relative">
                            <Bell size={20} />
                            {unseenNotificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            )}
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wide">Alertas</span>
                    </button>
                    <form action="/auth/signout" method="post">
                        <button className="flex flex-col items-center gap-1 px-4 py-2 text-slate-500">
                            <LogOut size={20} />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wide">Salir</span>
                        </button>
                    </form>
                </div>
            </nav>
        </>
    )
}
