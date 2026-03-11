'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Clock, X, Eye, Users, UserPlus, Link2 } from 'lucide-react'
import { getRecentNotifications, markNotificationsAsSeen } from '@/app/(app)/notification-actions'

interface NotificationsPopoverProps {
    unseenCount: number
}

function formatRelativeTime(dateString: string): string {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMin < 1) return 'ahora'
    if (diffMin < 60) return `hace ${diffMin}m`
    if (diffHours < 24) return `hace ${diffHours}h`
    if (diffDays === 1) return 'ayer'
    if (diffDays < 7) return `hace ${diffDays}d`
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} sem`
    return `hace ${Math.floor(diffDays / 30)} mes`
}

function getNotificationIcon(type: string) {
    switch (type) {
        case 'profile_visit':
            return { icon: Eye, color: 'text-slate-400', bg: 'bg-slate-100' }
        case 'project_collaboration':
            return { icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' }
        case 'experience_collaboration':
            return { icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' }
        case 'connection_accepted':
            return { icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-50' }
        default:
            return { icon: Bell, color: 'text-slate-400', bg: 'bg-slate-100' }
    }
}

export default function NotificationsPopover({ unseenCount }: NotificationsPopoverProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [badgeCount, setBadgeCount] = useState(unseenCount)
    const popoverRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleOpen = async () => {
        if (isOpen) {
            setIsOpen(false)
            return
        }

        setIsOpen(true)
        setLoading(true)

        try {
            const data = await getRecentNotifications()
            setNotifications(data)

            // Mark as seen
            if (badgeCount > 0) {
                await markNotificationsAsSeen()
                setBadgeCount(0)
            }
        } catch (err) {
            console.error('Error fetching notifications:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative" ref={popoverRef}>
            {/* Trigger button */}
            <button
                onClick={handleOpen}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                title="Notificaciones"
            >
                <Bell size={14} />
                <span className="hidden lg:inline">Notificaciones</span>
                {badgeCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {badgeCount > 9 ? '9+' : badgeCount}
                    </span>
                )}
            </button>

            {/* Popover panel */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-[10px] font-mono font-black tracking-widest uppercase text-slate-600">
                            Notificaciones
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="px-4 py-8 text-center">
                                <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                                <p className="text-xs text-slate-400 mt-2">Cargando...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <Bell size={24} className="text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">Sin notificaciones</p>
                                <p className="text-xs text-slate-400 mt-1">Las notificaciones recientes aparecerán aquí</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {notifications.map((notif) => {
                                    const { icon: Icon, color, bg } = getNotificationIcon(notif.type)
                                    const content = (
                                        <div
                                            key={notif.id}
                                            className={`px-4 py-3 flex items-start gap-3 transition-colors hover:bg-slate-50 ${!notif.seen_at ? 'bg-indigo-50/50' : ''
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                <Icon size={14} className={color} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-slate-700 leading-snug font-medium">
                                                    {notif.title}
                                                </p>
                                                {notif.body && (
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                                        {notif.body}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Clock size={10} className="text-slate-400" />
                                                    <span className="text-[10px] text-slate-400 font-mono">
                                                        {formatRelativeTime(notif.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                            {!notif.seen_at && (
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2" />
                                            )}
                                        </div>
                                    )

                                    if (notif.action_url) {
                                        return (
                                            <Link
                                                key={notif.id}
                                                href={notif.action_url}
                                                onClick={() => setIsOpen(false)}
                                                className="block"
                                            >
                                                {content}
                                            </Link>
                                        )
                                    }

                                    return content
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
