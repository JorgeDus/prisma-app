'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
    fallbackHref?: string
    label?: string
}

export default function BackButton({ fallbackHref, label = 'Volver' }: BackButtonProps) {
    const router = useRouter()

    const handleClick = () => {
        // If there's browser history, go back. Otherwise navigate to fallback.
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back()
        } else if (fallbackHref) {
            router.push(fallbackHref)
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <button onClick={handleClick} className="flex items-center gap-2 group cursor-pointer">
            <ArrowLeft size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 group-hover:text-slate-900 transition-colors">
                {label}
            </span>
        </button>
    )
}
