'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
    Plus,
    Sparkles,
    LayoutGrid,
    Briefcase,
    FolderGit2,
    Trophy,
    MessageSquare,
    Mail,
    FileBadge,
    GraduationCap,
    Users,
    ShieldCheck,
    Award,
    Heart,
    Zap,
    Dumbbell,
    Palette,
    HeartPulse,
    Star
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { DEFAULT_EXP_IMAGES, DEFAULT_PROJECT_IMAGES } from '@/constants/images'

// Components
import { NavRail } from '@/components/shared/NavRail'
import { ImpactHeader } from '@/components/shared/ImpactHeader'
import VitrinaCurationSlots from '@/components/dashboard/VitrinaCurationSlots'
import { BaseCard } from '@/components/shared/BaseCard'
import { EvidenceBadge } from '@/components/shared/EvidenceBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import DashboardTrajectory from '@/components/dashboard/DashboardTrajectory'
import InterestsSection from '@/components/dashboard/InterestsSection'
import TestimonialSection from '@/components/dashboard/TestimonialSection'
import ContactSection from '@/components/public/ContactSection'

// Modals
import ExperienceFormModal from './ExperienceFormModal'
import ProjectFormModal from './ProjectFormModal'
import AchievementFormModal from './AchievementFormModal'
import ProfileEditModal from './ProfileEditModal'
import LanguagesModal from './LanguagesModal'
import { Language } from '@/types/database.types'
import OnboardingTour from '@/components/onboarding/OnboardingTour'

interface DashboardContentProps {
    profile: any
    projects: any[]
    experiences: any[]
    achievements: any[]
    testimonials: any[]
    languages: Language[]
    hitosUnificados: any[]
    primaryCareer?: {
        id: string
        career_id: number | null
        custom_career: string | null
        institution: string | null
        start_year: number | null
        end_year: number | null
        is_current: boolean
        career?: { id: number; name: string } | null
    } | null
    userCareers?: any[]
}

const CATEGORY_MAP: Record<string, string> = {
    certification: "Certificación",
    award: "Premio / Reconocimiento",
    course_chair: "Cátedra Destacada",
    academic_role: "Investigación"
}

const EXP_CATEGORY_MAP: Record<string, { label: string, color: string, bg: string, border: string, icon: any }> = {
    liderazgo: { label: 'Liderazgo', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    social: { label: 'Social', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    emprendimiento: { label: 'Emprendimiento', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    empleo_sustento: { label: 'Trayectoria', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    academico: { label: 'Académico', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    deportivo: { label: 'Deportivo', icon: Dumbbell, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    creativo: { label: 'Creativo', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
    cuidado_vida: { label: 'Cuidado y Vida', icon: HeartPulse, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
    otro: { label: 'Otro', icon: Star, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' }
}

const CATEGORY_ICON: Record<string, any> = {
    certification: FileBadge,
    award: Trophy,
    course_chair: GraduationCap,
    academic_role: Users
}

const CATEGORY_COLOR: Record<string, string> = {
    certification: "text-blue-500",
    award: "text-amber-500",
    course_chair: "text-indigo-500",
    academic_role: "text-cyan-500"
}

// Helper para formatear fechas (solo mes y año)
const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        timeZone: 'UTC'
    })
}

export default function DashboardContent({
    profile,
    projects,
    experiences,
    achievements,
    testimonials,
    languages,
    hitosUnificados,
    primaryCareer,
    userCareers = []
}: DashboardContentProps) {
    const router = useRouter()
    const supabase = createClient()

    const [isExpModalOpen, setIsExpModalOpen] = useState(false)
    const [isProjModalOpen, setIsProjModalOpen] = useState(false)
    const [isAchModalOpen, setIsAchModalOpen] = useState(false)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [isLanguagesModalOpen, setIsLanguagesModalOpen] = useState(false)
    const [editingExp, setEditingExp] = useState<any>(null)
    const [editingProj, setEditingProj] = useState<any>(null)
    const [editingAch, setEditingAch] = useState<any>(null)
    const [isSavingContact, setIsSavingContact] = useState(false)


    // Parse social links once
    const socialLinks = typeof profile.social_links === 'string'
        ? JSON.parse(profile.social_links)
        : profile.social_links || {}

    const [contactConfig, setContactConfig] = useState({
        email: profile.email || '',
        linkedin: socialLinks?.linkedin || '',
        github: socialLinks?.github || '',
        website: socialLinks?.website || ''
    })

    const sections = [
        { id: "highlights", label: "Mi Vitrina" },
        { id: "logros", label: "Logros / Hitos" },
        { id: "experiencia", label: "Experiencias" },
        { id: "proyectos", label: "Proyectos" },
        { id: "testimonios", label: "Testimonios" },
        { id: "contacto", label: "Contacto" },
    ]

    // Get career and university names - prefer primaryCareer if available
    const careerName = primaryCareer
        ? ((primaryCareer as any).career?.name || primaryCareer.custom_career || 'Carrera')
        : (profile.careers?.name || 'Carrera')
    const universityName = primaryCareer?.institution || profile.universities?.name || 'Universidad'

    const getAcademicStatus = () => {
        const today = new Date()

        // Check user_careers (new multi-career system) first
        if (primaryCareer) {
            if (!primaryCareer.is_current && primaryCareer.end_year) {
                return primaryCareer.end_year <= today.getFullYear() ? "EGRESADO" : `EGRESA ${primaryCareer.end_year}`
            }
            if (primaryCareer.is_current && primaryCareer.start_year) {
                const diffYears = today.getFullYear() - primaryCareer.start_year + 1
                return diffYears > 0 ? `${diffYears}º AÑO` : "EN CURSO"
            }
        }

        // Fallback to legacy profile fields
        if (profile.career_end_date && new Date(profile.career_end_date) <= today) return "EGRESADO"
        if (!profile.career_start_date) return "EN CURSO"

        const start = new Date(profile.career_start_date)
        const diffYears = today.getFullYear() - start.getFullYear() + 1
        return diffYears > 0 ? `${diffYears}º AÑO` : "EN CURSO"
    }

    const academicStatus = getAcademicStatus()

    // --- AGREGACIÓN DE SKILLS (sin duplicados) + CONTEO + EVIDENCIAS ---
    const hardSkillsSet = new Set<string>()
    const softSkillsSet = new Set<string>()
    const skillCounts: Record<string, number> = {}
    const skillEvidence: Record<string, { id: string; title: string; type: 'project' | 'experience' }[]> = {}

    projects?.forEach(proj => {
        const addSkill = (skill: string, set: Set<string>) => {
            if (!skill) return
            set.add(skill)
            skillCounts[skill] = (skillCounts[skill] || 0) + 1
            if (!skillEvidence[skill]) skillEvidence[skill] = []
            skillEvidence[skill].push({ id: proj.id, title: proj.title, type: 'project' })
        }
        proj.hard_skills?.forEach((s: string) => addSkill(s.trim(), hardSkillsSet))
        proj.soft_skills?.forEach((s: string) => addSkill(s.trim(), softSkillsSet))
    })

    experiences?.forEach(exp => {
        const addSkill = (skill: string, set: Set<string>) => {
            if (!skill) return
            set.add(skill)
            skillCounts[skill] = (skillCounts[skill] || 0) + 1
            if (!skillEvidence[skill]) skillEvidence[skill] = []
            skillEvidence[skill].push({ id: exp.id, title: exp.title, type: 'experience' })
        }
        exp.hard_skills?.forEach((s: string) => addSkill(s.trim(), hardSkillsSet))
        exp.soft_skills?.forEach((s: string) => addSkill(s.trim(), softSkillsSet))
    })

    const aggregatedHardSkills = Array.from(hardSkillsSet)
    const aggregatedSoftSkills = Array.from(softSkillsSet)

    const handleSaveContact = async () => {
        setIsSavingContact(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    email: contactConfig.email,
                    social_links: {
                        ...socialLinks,
                        linkedin: contactConfig.linkedin,
                        github: contactConfig.github,
                        website: contactConfig.website
                    }
                })
                .eq('id', profile.id)

            if (error) throw error
            router.refresh()
            alert('Protocolo de contacto actualizado con éxito')
        } catch (error) {
            console.error(error)
            alert('Error al guardar la configuración de contacto')
        } finally {
            setIsSavingContact(false)
        }
    }

    const handleSuccess = () => {
        router.refresh()
    }

    const handleDelete = async (table: 'projects' | 'experiences' | 'achievements' | 'testimonials', id: string) => {
        if (!confirm('¿Estás seguro de eliminar este elemento?')) return

        const { error } = await supabase.from(table).delete().eq('id', id)
        if (error) {
            alert('Error al eliminar')
        } else {
            router.refresh()
        }
    }

    return (
        <div className="pb-24 md:pb-24">
            {/* Nav Rail (Scroll-spy) */}
            <NavRail sections={sections} />

            {/* Impact Header */}
            <div className="mt-16" data-tour="header">
                <ImpactHeader
                    name={profile.full_name || profile.username}
                    headline={profile.headline || undefined}
                    thesis={profile.about || "Escribe tu sección de bio en la configuración del perfil."}
                    career={careerName}
                    university={universityName}
                    academicStatus={academicStatus}
                    avatarUrl={profile.avatar_url || undefined}
                    socialLinks={socialLinks}
                    isEditable={true}
                    onEdit={() => setIsProfileModalOpen(true)}
                    hardSkills={aggregatedHardSkills}
                    softSkills={aggregatedSoftSkills}
                    interests={profile.interests || []}
                    skillCounts={skillCounts}
                    skillEvidence={skillEvidence}
                    allCareers={userCareers}
                    pinnedSkills={profile.skills_order || []}
                    profileId={profile.id}
                />
            </div>

            <ProfileEditModal
                profile={profile}
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />

            <main className="max-w-7xl mx-auto px-6 space-y-32">
                {/* 1. Highlights Section */}
                <section id="highlights" className="section-anchor">
                    <div className="space-y-8">
                        {/* Section Divider */}
                        <div>
                            <div className="border-t border-slate-200" />
                            <div className="flex items-center justify-between py-2">
                                <h2 className="text-lg font-mono font-black tracking-widest uppercase text-slate-600">
                                    Mi Vitrina
                                </h2>
                                <div className="flex items-center gap-3">
                                    <EvidenceBadge label="Modo Edición Activo" count={(profile.featured_items || []).length} />
                                    <LayoutGrid size={18} className="text-indigo-400" />
                                </div>
                            </div>
                            <div className="border-b border-slate-200" />
                        </div>
                        <VitrinaCurationSlots
                            profileId={profile.id}
                            featuredItems={profile.featured_items || []}
                            projects={projects}
                            experiences={experiences}
                            achievements={achievements}
                        />
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-32">

                        {/* 2. Logros */}
                        <section id="logros" className="section-anchor space-y-8">
                            {/* Section Divider */}
                            <div>
                                <div className="border-t border-slate-200" />
                                <div className="flex items-center justify-between py-2">
                                    <h2 className="text-lg font-mono font-black tracking-widest uppercase text-slate-600">
                                        Logros / Hitos
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => { setEditingAch(null); setIsAchModalOpen(true); }}
                                            className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors"
                                        >
                                            + Nuevo Logro
                                        </button>
                                        <Trophy size={18} className="text-amber-400" />
                                    </div>
                                </div>
                                <div className="border-b border-slate-200" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {achievements?.length ? (
                                    achievements.map((ach) => (
                                        <BaseCard
                                            key={ach.id}
                                            title={ach.title}
                                            subtitle={ach.organization || ""}
                                            overline={
                                                <div className="flex items-center gap-2">
                                                    {(() => {
                                                        const Icon = CATEGORY_ICON[ach.category] || Sparkles;
                                                        const colorClass = CATEGORY_COLOR[ach.category] || "text-slate-400";
                                                        return <Icon size={12} className={colorClass} strokeWidth={2.5} />;
                                                    })()}
                                                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.2em]">
                                                        {CATEGORY_MAP[ach.category] || ach.category}
                                                    </span>
                                                </div>
                                            }
                                            dateRange={
                                                ach.category === 'academic_role' && ach.date
                                                    ? `${formatDate(ach.date)} - ${ach.is_current ? 'Presente' : (ach.end_date ? formatDate(ach.end_date) : '')}`
                                                    : (ach.date ? formatDate(ach.date) : "")
                                            }
                                            isEditable={true}
                                            className="h-full"
                                            onEdit={() => { setEditingAch(ach); setIsAchModalOpen(true); }}
                                            onDelete={() => handleDelete('achievements', ach.id)}
                                        >
                                            {(ach.professor_name || ach.distinction) && (
                                                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                                                    {ach.professor_name && (
                                                        <p className="text-[10px] leading-relaxed">
                                                            <span className="font-mono font-bold text-slate-400 uppercase mr-1">Prof:</span>
                                                            <span className="text-slate-600">{ach.professor_name}</span>
                                                        </p>
                                                    )}
                                                    {ach.distinction && (
                                                        <p className="text-[10px] leading-relaxed">
                                                            <span className="font-mono font-bold text-slate-400 uppercase mr-1">Nota:</span>
                                                            <span className="text-slate-600">{ach.distinction}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </BaseCard>
                                    ))
                                ) : (
                                    <div className="col-span-2">
                                        <EmptyState
                                            title="Valida tu Formación"
                                            description="Añade logros, becas o certificaciones académicas."
                                            actionLabel="Añadir Logro"
                                            onAction={() => setIsAchModalOpen(true)}
                                            isEditable={true}
                                        />
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 3. Experiencia */}
                        <section id="experiencia" className="section-anchor space-y-8">
                            {/* Section Divider */}
                            <div>
                                <div className="border-t border-slate-200" />
                                <div className="flex items-center justify-between py-2">
                                    <h2 className="text-lg font-mono font-black tracking-widest uppercase text-slate-600">
                                        Experiencias
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => { setEditingExp(null); setIsExpModalOpen(true); }}
                                            className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors"
                                        >
                                            + Nueva Experiencia
                                        </button>
                                        <Sparkles size={18} className="text-purple-400" />
                                    </div>
                                </div>
                                <div className="border-b border-slate-200" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {experiences?.length ? (
                                    experiences.map((exp) => (
                                        <BaseCard
                                            key={exp.id}
                                            title={exp.title}
                                            subtitle={exp.organization}
                                            overline={
                                                (() => {
                                                    const cat = EXP_CATEGORY_MAP[exp.type || 'otro'] || EXP_CATEGORY_MAP.otro;
                                                    const Icon = cat.icon;
                                                    return (
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${cat.bg} ${cat.color} ${cat.border}`}>
                                                            <Icon size={12} strokeWidth={2.5} />
                                                            {cat.label}
                                                        </span>
                                                    )
                                                })()
                                            }
                                            description={exp.description || ""}
                                            imageUrl={exp.cover_image || DEFAULT_EXP_IMAGES[exp.type || 'otro'] || DEFAULT_EXP_IMAGES.otro}
                                            dateRange={exp.start_date ? `${formatDate(exp.start_date)} - ${exp.is_current ? 'Presente' : (exp.end_date ? formatDate(exp.end_date) : '')}` : ""}
                                            tags={[...(exp.hard_skills || []), ...(exp.soft_skills || [])]}
                                            href={`/dashboard/experiencias/${exp.id}`}
                                            isEditable={true}
                                            onEdit={() => { setEditingExp(exp); setIsExpModalOpen(true); }}
                                            onDelete={() => handleDelete('experiences', exp.id)}
                                        />
                                    ))
                                ) : (
                                    <EmptyState
                                        title="Registra tus Experiencias Significativas"
                                        description="Añade experiencias que validen tus habilidades en el campo real."
                                        actionLabel="Añadir Experiencia"
                                        onAction={() => setIsExpModalOpen(true)}
                                        isEditable={true}
                                    />
                                )}
                            </div>
                        </section>

                        {/* 4. Proyectos */}
                        <section id="proyectos" className="section-anchor space-y-8">
                            {/* Section Divider */}
                            <div>
                                <div className="border-t border-slate-200" />
                                <div className="flex items-center justify-between py-2">
                                    <h2 className="text-lg font-mono font-black tracking-widest uppercase text-slate-600">
                                        Proyectos
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => { setEditingProj(null); setIsProjModalOpen(true); }}
                                            className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors"
                                        >
                                            + Nuevo Proyecto
                                        </button>
                                        <Briefcase size={18} className="text-blue-400" />
                                    </div>
                                </div>
                                <div className="border-b border-slate-200" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects?.length ? (
                                    projects.map((proj) => (
                                        <BaseCard
                                            key={proj.id}
                                            title={proj.title}
                                            subtitle={proj.role || proj.type}
                                            description={proj.description || ""}
                                            imageUrl={proj.cover_image || DEFAULT_PROJECT_IMAGES[proj.type] || DEFAULT_PROJECT_IMAGES.personal}
                                            tags={[...(proj.hard_skills || []), ...(proj.soft_skills || [])]}
                                            href={`/dashboard/project/${proj.id}`}
                                            isEditable={true}
                                            is_learning_artifact={proj.is_startup}
                                            onEdit={() => { setEditingProj(proj); setIsProjModalOpen(true); }}
                                            onDelete={() => handleDelete('projects', proj.id)}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-2">
                                        <EmptyState
                                            title="Crea tu Portafolio"
                                            description="Sube proyectos que demuestren tu capacidad de ejecución."
                                            actionLabel="Añadir Proyecto"
                                            onAction={() => setIsProjModalOpen(true)}
                                            isEditable={true}
                                        />
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 5. Testimonios */}
                        <section id="testimonios" className="section-anchor space-y-8">
                            {/* Section Divider */}
                            <div>
                                <div className="border-t border-slate-200" />
                                <div className="flex items-center justify-between py-2">
                                    <h2 className="text-lg font-mono font-black tracking-widest uppercase text-slate-600">
                                        Testimonios
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <button className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors">+ Solicitar Testimonio</button>
                                        <MessageSquare size={18} className="text-emerald-400" />
                                    </div>
                                </div>
                                <div className="border-b border-slate-200" />
                            </div>
                            <TestimonialSection testimonials={testimonials || []} userId={profile.id} />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-12 lg:border-l lg:border-slate-100 lg:pl-8" data-tour="trajectory">
                        <section className="sticky top-24 space-y-8">
                            <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-thin space-y-8">
                                <h2 className="text-xs font-mono font-bold tracking-tight uppercase text-slate-500">Vista de Trayectoria</h2>
                                <DashboardTrajectory hitos={hitosUnificados} initialCount={5} />
                            </div>

                            {/* Languages Section */}
                            <div className="pt-8 border-t border-slate-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-mono font-bold tracking-tight uppercase text-slate-500 flex items-center gap-2">
                                        <span className="text-indigo-500"></span> Idiomas
                                    </h3>
                                    <button
                                        onClick={() => setIsLanguagesModalOpen(true)}
                                        className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors"
                                    >
                                        + Editar
                                    </button>
                                </div>
                                {languages.length > 0 ? (
                                    <div className="space-y-2">
                                        {[...languages].sort((a, b) => {
                                            const levelOrder = ['Nativo / Bilingüe', 'Avanzado (C1-C2)', 'Intermedio (B1-B2)', 'Básico (A1-A2)']
                                            return levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level)
                                        }).map((lang) => (
                                            <div key={lang.id} className="flex items-center justify-between py-2 px-3 bg-white border border-slate-100 rounded-xl">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm text-slate-800">{lang.language}</span>
                                                    {lang.institution && (
                                                        <span className="text-[10px] text-slate-400">{lang.institution}</span>
                                                    )}
                                                </div>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${lang.level === 'Nativo / Bilingüe' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    lang.level === 'Avanzado (C1-C2)' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        lang.level === 'Intermedio (B1-B2)' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                            'bg-slate-50 text-slate-600 border-slate-200'
                                                    }`}>
                                                    {lang.level}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsLanguagesModalOpen(true)}
                                        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors text-sm font-medium"
                                    >
                                        + Agregar Idiomas
                                    </button>
                                )}
                            </div>

                            <div className="pt-8 border-t border-slate-100">
                                <InterestsSection interests={profile.interests} profileId={profile.id} />
                            </div>
                        </section>
                    </aside>
                </div>
            </main>

            {/* Dark Closing Section (Full Width) */}
            <div className="bg-slate-900 mt-32 relative overflow-hidden pb-32">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

                <main className="max-w-7xl mx-auto px-6">
                    {/* 6. Contacto */}
                    <section id="contacto" className="section-anchor pt-32 space-y-24">
                        {/* Configuración */}
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-indigo-400 mb-12 text-center flex items-center justify-center gap-2">
                                <Mail size={14} />
                                Contacto
                            </h2>
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[2rem] space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Email de Recepción</label>
                                        <input
                                            type="email"
                                            value={contactConfig.email}
                                            onChange={(e) => setContactConfig({ ...contactConfig, email: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">LinkedIn URL</label>
                                        <input
                                            type="url"
                                            value={contactConfig.linkedin}
                                            onChange={(e) => setContactConfig({ ...contactConfig, linkedin: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">GitHub URL</label>
                                        <input
                                            type="url"
                                            value={contactConfig.github}
                                            onChange={(e) => setContactConfig({ ...contactConfig, github: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Sitio Web Personal</label>
                                        <input
                                            type="url"
                                            value={contactConfig.website}
                                            onChange={(e) => setContactConfig({ ...contactConfig, website: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            placeholder="https://tuweb.com"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={handleSaveContact}
                                        disabled={isSavingContact}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg hover:scale-105 disabled:opacity-50"
                                    >
                                        {isSavingContact ? "Guardando..." : "Guardar Protocolo de Contacto"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Vista Previa del Formulario */}
                        <div className="max-w-2xl mx-auto space-y-12 text-center pt-24 border-t border-white/5">
                            <h3 className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-slate-500">Vista Previa de Protocolo Público</h3>
                            <p className="text-4xl font-bold text-white leading-tight">
                                ¿Buscas establecer una conexión profesional?
                            </p>
                            <ContactSection
                                profileEmail={contactConfig.email}
                                profileName={profile.full_name || profile.username}
                                linkedinUrl={contactConfig.linkedin}
                            />
                        </div>
                    </section>
                </main>

                <footer className="border-t border-slate-800 py-12 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2 grayscale invert opacity-80">
                            <Image
                                src="/logo-prisma.png"
                                alt="Prisma Logo"
                                width={120}
                                height={32}
                                className="h-8 w-auto object-contain"
                            />
                        </div>
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em]">
                            © 2025 Somos Prisma
                        </p>
                        <div className="flex gap-8 font-mono text-[10px] uppercase font-bold text-slate-400">
                            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Modals */}
            <ExperienceFormModal
                isOpen={isExpModalOpen}
                onClose={() => setIsExpModalOpen(false)}
                userId={profile.id}
                experienceToEdit={editingExp}
                onSuccess={handleSuccess}
            />
            <ProjectFormModal
                isOpen={isProjModalOpen}
                onClose={() => setIsProjModalOpen(false)}
                userId={profile.id}
                projectToEdit={editingProj}
                onSuccess={handleSuccess}
            />
            <AchievementFormModal
                isOpen={isAchModalOpen}
                onClose={() => setIsAchModalOpen(false)}
                userId={profile.id}
                achievementToEdit={editingAch}
                onSuccess={handleSuccess}
            />
            <LanguagesModal
                isOpen={isLanguagesModalOpen}
                onClose={() => setIsLanguagesModalOpen(false)}
                initialLanguages={languages}
                userId={profile.id}
            />

            {/* Onboarding Tour */}
            <OnboardingTour
                profileId={profile.id}
                hasCompletedTour={profile.has_completed_tour ?? false}
            />
        </div>
    )
}
