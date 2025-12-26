import Link from 'next/link'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import {
    Briefcase,
    FolderGit2,
    Trophy,
    MessageSquare,
    Mail,
    LayoutGrid,
    Plus,
    LogOut,
    Sparkles
} from 'lucide-react'

// Nuevos Componentes Shared
import { NavRail } from '@/components/shared/NavRail'
import { ImpactHeader } from '@/components/shared/ImpactHeader'
import { BentoHighlights } from '@/components/shared/BentoHighlights'
import { BaseCard } from '@/components/shared/BaseCard'
import { EvidenceBadge } from '@/components/shared/EvidenceBadge'
import { EmptyState } from '@/components/shared/EmptyState'

import DashboardTrajectory from '@/components/dashboard/DashboardTrajectory'
import SkillsSection from '@/components/dashboard/SkillsSection'
import TestimonialSection from '@/components/dashboard/TestimonialSection'
import InterestsSection from '@/components/dashboard/InterestsSection'
import DashboardContent from '@/components/dashboard/DashboardContent'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const supabase = await createClient()

    // 1. Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    // 2. Obtener datos del perfil
    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            *,
            universities(name),
            careers(name)
        `)
        .eq('id', user.id)
        .single()

    if (!profile) redirect('/onboarding')

    // 3. Obtener Datos Relacionados
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const { data: experiences } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false })

    const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

    const { data: testimonials } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // --- CONSTRUCCIÓN DE LA TRAYECTORIA UNIFICADA ---
    const hitosUnificados: any[] = []
    const universityName = profile.universities?.name || 'Universidad'
    const careerName = profile.careers?.name || 'Carrera'

    // 1. Experiencias
    experiences?.filter(exp => exp.show_in_timeline !== false).forEach(exp => {
        hitosUnificados.push({
            id: exp.id,
            title: exp.title,
            subtitle: exp.organization,
            date: exp.start_date || exp.created_at,
            type: 'experience',
            category: exp.type,
            description: exp.description,
            link: `/${profile.username}/experiencias/${exp.id}`
        })
    })

    // 2. Proyectos
    projects?.filter(proj => proj.show_in_timeline !== false).forEach(proj => {
        hitosUnificados.push({
            id: proj.id,
            title: proj.title,
            subtitle: 'Proyecto',
            date: proj.created_at,
            type: 'project',
            category: proj.type,
            description: proj.description,
            link: `/${profile.username}/proyectos/${proj.id}`
        })
    })

    // 3. Logros (Achievements)
    achievements?.forEach(ach => {
        hitosUnificados.push({
            id: ach.id,
            title: ach.title,
            subtitle: ach.organization || 'Logro',
            date: ach.date || ach.created_at,
            type: 'achievement',
            category: ach.category,
            description: [
                ach.distinction,
                ach.professor_name ? `Prof. ${ach.professor_name}` : null
            ].filter(Boolean).join(' • ')
        })
    })

    // 4. Educación Universitaria (Hitos automáticos)
    if (profile.career_start_date) {
        hitosUnificados.push({
            id: `edu-start-${profile.id}`,
            title: `Inicio de ${careerName}`,
            subtitle: universityName,
            date: profile.career_start_date,
            type: 'education',
            category: 'academic'
        })
    }
    if (profile.career_end_date) {
        const isPast = new Date(profile.career_end_date) <= new Date()
        hitosUnificados.push({
            id: `edu-end-${profile.id}`,
            title: isPast ? `Egreso de ${careerName}` : `Fecha Estimada de Egreso`,
            subtitle: universityName,
            date: profile.career_end_date,
            type: 'education',
            category: 'academic'
        })
    }

    hitosUnificados.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return (
        <DashboardContent
            profile={profile}
            projects={projects || []}
            experiences={experiences || []}
            achievements={achievements || []}
            testimonials={testimonials || []}
            hitosUnificados={hitosUnificados}
        />
    )
}

