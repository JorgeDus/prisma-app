"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Github, Globe, Sparkles, Blocks, GraduationCap, ChevronDown, FolderGit2, Briefcase } from "lucide-react";
import { Icon } from "@iconify/react";
import SkillsModal from "@/components/shared/SkillsModal";
import { createClient } from "@/utils/supabase/client";

export type SkillEvidenceItem = { id: string; title: string; type: 'project' | 'experience' }

interface ImpactHeaderProps {
    name: string;
    headline?: string;
    thesis: string;
    career: string;
    university: string;
    academicStatus?: string;
    avatarUrl?: string;
    socialLinks?: any;
    isEditable?: boolean;
    onEdit?: () => void;
    hardSkills?: string[];
    softSkills?: string[];
    interests?: string[];
    skillCounts?: Record<string, number>;
    skillEvidence?: Record<string, SkillEvidenceItem[]>;
    username?: string;
    allCareers?: {
        id: string;
        career_id: number | null;
        custom_career: string | null;
        institution: string | null;
        is_current: boolean;
        is_primary: boolean;
        start_year: number | null;
        end_year: number | null;
        degree_type?: string | null;
        career?: { id: number; name: string } | null;
    }[];
    pinnedSkills?: string[];
    profileId?: string;
}

export const ImpactHeader = ({
    name,
    headline,
    thesis,
    career,
    university,
    academicStatus,
    avatarUrl,
    socialLinks,
    isEditable,
    onEdit,
    hardSkills = [],
    softSkills = [],
    interests = [],
    skillCounts = {},
    skillEvidence = {},
    username,
    allCareers = [],
    pinnedSkills: initialSkillsOrder = [],
    profileId,
}: ImpactHeaderProps) => {
    const [activeTab, setActiveTab] = useState<'hard' | 'soft'>('hard');
    const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
    const [showCareersTooltip, setShowCareersTooltip] = useState(false);
    const [skillsOrder, setSkillsOrder] = useState<string[]>(initialSkillsOrder);
    const [activeEvidenceSkill, setActiveEvidenceSkill] = useState<string | null>(null);
    const evidenceRef = useRef<HTMLDivElement>(null);

    // Close evidence popover on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (evidenceRef.current && !evidenceRef.current.contains(event.target as Node)) {
                setActiveEvidenceSkill(null);
            }
        }
        if (activeEvidenceSkill) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [activeEvidenceSkill]);

    // Check if there are secondary careers to show
    const secondaryCareers = allCareers.filter(c => !c.is_primary);
    const hasMultipleCareers = secondaryCareers.length > 0;

    // Sort skills by saved order, then by evidence count for unordered ones
    const sortSkills = (skills: string[]) => {
        return [...skills].sort((a, b) => {
            const aIndex = skillsOrder.indexOf(a);
            const bIndex = skillsOrder.indexOf(b);
            const aHasOrder = aIndex !== -1;
            const bHasOrder = bIndex !== -1;
            // Both have saved order → use that order
            if (aHasOrder && bHasOrder) return aIndex - bIndex;
            // Only one has order → ordered one comes first
            if (aHasOrder && !bHasOrder) return -1;
            if (!aHasOrder && bHasOrder) return 1;
            // Neither has order → sort by evidence count
            return (skillCounts[b] || 0) - (skillCounts[a] || 0);
        });
    };

    const sortedHardSkills = sortSkills(hardSkills);
    const sortedSoftSkills = sortSkills(softSkills);
    const displaySkills = activeTab === 'hard' ? sortedHardSkills : sortedSoftSkills;
    const hasAnySkills = hardSkills.length > 0 || softSkills.length > 0;
    const SKILLS_LIMIT = 5;
    const visibleSkills = displaySkills.slice(0, SKILLS_LIMIT);
    const hasMoreSkills = displaySkills.length > SKILLS_LIMIT;

    const handleReorder = async (newHardOrder: string[], newSoftOrder: string[]) => {
        if (!profileId) return;
        const supabase = createClient();
        const combined = [...newHardOrder, ...newSoftOrder];
        setSkillsOrder(combined);
        await supabase
            .from('profiles')
            .update({ skills_order: combined })
            .eq('id', profileId);
    };

    return (
        <header className="relative pt-20 pb-8 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Left: Avatar + Content */}
                <div className="flex flex-col md:flex-row gap-12 items-start flex-1">
                    {/* Profile Avatar Editorial */}
                    <div className="relative group shrink-0">
                        <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm bg-white">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={name}
                                    className="w-full h-full object-cover transition-all duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300 font-bold text-5xl">
                                    {name.charAt(0)}
                                </div>
                            )}
                        </div>
                        {isEditable && (
                            <button
                                onClick={onEdit}
                                className="absolute -bottom-2 -right-2 w-12 h-12 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center border-4 border-white cursor-pointer hover:bg-indigo-600 hover:scale-110 transition-all shadow-xl group/edit"
                                title="Editar Perfil"
                            >
                                <span className="text-[8px] font-mono font-black border-b border-white/20 pb-0.5 mb-0.5 leading-none">EDIT</span>
                                <span className="text-[7px] font-mono opacity-50 font-bold leading-none">PRFL</span>
                            </button>
                        )}
                    </div>

                    {/* Impact Content */}
                    <div className="flex-1 space-y-8">
                        {/* Identity Masthead */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight leading-[1.1]">
                                    {name}
                                </h1>
                                {headline && (
                                    <p className="text-xl md:text-2xl font-medium text-slate-500 leading-tight">
                                        {headline}
                                    </p>
                                )}
                            </div>

                            {/* Credential Rail */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                                {/* Career Badge with Tooltip */}
                                <div
                                    className="relative"
                                    onMouseEnter={() => hasMultipleCareers && setShowCareersTooltip(true)}
                                    onMouseLeave={() => setShowCareersTooltip(false)}
                                >
                                    <div className={`flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm transition-all ${hasMultipleCareers ? 'cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/50' : ''}`}>
                                        <span className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest">{career}</span>
                                        {hasMultipleCareers && (
                                            <ChevronDown size={12} className={`text-indigo-400 transition-transform ${showCareersTooltip ? 'rotate-180' : ''}`} />
                                        )}
                                    </div>

                                    {/* Tooltip showing all careers */}
                                    {showCareersTooltip && hasMultipleCareers && (
                                        <div className="absolute top-full left-0 mt-2 z-50 min-w-[280px] bg-white rounded-xl border border-slate-200 shadow-xl p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                <GraduationCap size={12} />
                                                Formación Académica
                                            </p>
                                            <div className="space-y-2">
                                                {allCareers.map((c) => (
                                                    <div key={c.id} className={`p-2 rounded-lg ${c.is_primary ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50'}`}>
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className={`text-sm font-semibold ${c.is_primary ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                                {c.degree_type && c.degree_type !== 'Carrera de Pregrado'
                                                                    ? `${c.degree_type} en ${c.career?.name || c.custom_career}`
                                                                    : (c.career?.name || c.custom_career)
                                                                }
                                                            </span>
                                                            {c.is_primary && (
                                                                <span className="text-[9px] font-bold text-indigo-500 uppercase">Principal</span>
                                                            )}
                                                        </div>
                                                        {c.institution && (
                                                            <p className="text-xs text-slate-500">{c.institution}</p>
                                                        )}
                                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                                            {c.start_year} - {c.is_current ? 'Presente' : c.end_year}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest leading-none pt-0.5">{university}</span>
                                    {academicStatus && (
                                        <span className="text-[11px] font-mono font-black text-slate-800 bg-slate-100/50 border border-slate-200/50 px-2 py-0.5 rounded uppercase tracking-tighter">
                                            {academicStatus}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Thesis Vision Paragraph */}
                        <div className="relative max-w-2xl overflow-hidden">
                            <div className="absolute -left-6 top-1 w-1 h-full bg-indigo-50" />
                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed text-balance italic break-words whitespace-normal">
                                "{thesis}"
                            </p>
                        </div>

                        {/* Social Rail */}
                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex items-center gap-4">
                                {socialLinks?.linkedin && (
                                    <a href={socialLinks.linkedin} target="_blank" className="text-slate-400 hover:text-indigo-600 transition-all hover:scale-110">
                                        <Icon icon="mdi:linkedin" width="22" />
                                    </a>
                                )}
                                {socialLinks?.github && (
                                    <a href={socialLinks.github} target="_blank" className="text-slate-400 hover:text-slate-900 transition-all hover:scale-110">
                                        <Github size={22} strokeWidth={1.5} />
                                    </a>
                                )}
                                {socialLinks?.website && (
                                    <a href={socialLinks.website} target="_blank" className="text-slate-400 hover:text-indigo-500 transition-all hover:scale-110">
                                        <Globe size={22} strokeWidth={1.5} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Competencias Validadas */}
                <aside className="w-full lg:w-64 xl:w-72 shrink-0">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Blocks size={14} className="text-indigo-500" />
                            <h3 className="text-[10px] font-mono font-black tracking-[0.15em] uppercase text-slate-500">
                                Competencias Validadas
                            </h3>
                        </div>

                        {hasAnySkills ? (
                            <>
                                {/* Toggle Tabs */}
                                <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-4">
                                    <button
                                        onClick={() => setActiveTab('hard')}
                                        className={`flex-1 py-2 px-3 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'hard'
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        Técnicas
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('soft')}
                                        className={`flex-1 py-2 px-3 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'soft'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        Transversales
                                    </button>
                                </div>

                                {/* Skills List */}
                                <div className="space-y-2">
                                    {visibleSkills.length > 0 ? (
                                        <>
                                            {visibleSkills.map((skill) => {
                                                const count = skillCounts?.[skill] || 1
                                                const evidence = skillEvidence?.[skill] || []
                                                return (
                                                    <div
                                                        key={skill}
                                                        className="relative"
                                                    >
                                                        <div
                                                            className="group flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0 cursor-pointer"
                                                            onClick={() => setActiveEvidenceSkill(activeEvidenceSkill === skill ? null : skill)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'hard' ? 'bg-indigo-400' : 'bg-blue-400'}`} />
                                                                <span
                                                                    title={skill}
                                                                    className="text-sm font-medium text-slate-700 truncate max-w-[120px] group-hover:text-indigo-600 transition-colors"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            </div>
                                                            <span className="font-mono text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] group-hover:text-indigo-600 transition-colors">
                                                                {count} {count === 1 ? 'EVIDENCIA' : 'EVIDENCIAS'}
                                                            </span>
                                                        </div>

                                                        {/* Evidence Popover */}
                                                        {activeEvidenceSkill === skill && evidence.length > 0 && (
                                                            <div ref={evidenceRef} className="absolute right-0 top-full mt-1 w-72 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                                                                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                                                                    <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">
                                                                        Evidencias de "{skill}"
                                                                    </p>
                                                                </div>
                                                                <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                                                                    {evidence.map((item, idx) => {
                                                                        const href = isEditable
                                                                            ? (item.type === 'project' ? `/dashboard/project/${item.id}` : `/dashboard/experiencias/${item.id}`)
                                                                            : (username ? `/${username}#${item.type === 'project' ? 'proyectos' : 'experiencia'}` : '#');
                                                                        return (
                                                                            <Link
                                                                                key={`${item.id}-${idx}`}
                                                                                href={href}
                                                                                className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors"
                                                                                onClick={() => setActiveEvidenceSkill(null)}
                                                                            >
                                                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === 'project' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'
                                                                                    }`}>
                                                                                    {item.type === 'project' ? <FolderGit2 size={13} /> : <Briefcase size={13} />}
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="text-sm font-medium text-slate-700 truncate">{item.title}</p>
                                                                                    <p className="text-[10px] text-slate-400 font-mono uppercase">
                                                                                        {item.type === 'project' ? 'Proyecto' : 'Experiencia'}
                                                                                    </p>
                                                                                </div>
                                                                            </Link>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                            {hasMoreSkills && (
                                                <button
                                                    onClick={() => setIsSkillsModalOpen(true)}
                                                    className="w-full py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 transition-colors"
                                                >
                                                    Ver todas ({hardSkills.length + softSkills.length})
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic text-center py-4">
                                            {activeTab === 'hard'
                                                ? 'Sin competencias técnicas registradas'
                                                : 'Sin habilidades transversales registradas'
                                            }
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-xs text-slate-400 italic">
                                    Pendiente de validación de evidencia
                                </p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* Skills Modal */}
            <SkillsModal
                isOpen={isSkillsModalOpen}
                onClose={() => setIsSkillsModalOpen(false)}
                hardSkills={sortedHardSkills}
                softSkills={sortedSoftSkills}
                skillCounts={skillCounts}
                skillEvidence={skillEvidence}
                username={username}
                onReorder={handleReorder}
                isEditable={isEditable || false}
            />
        </header>
    );
};
