"use client";

import React, { useState } from "react";
import { Github, Linkedin, Globe, Sparkles, Blocks } from "lucide-react";

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
}: ImpactHeaderProps) => {
    const [activeTab, setActiveTab] = useState<'hard' | 'soft'>('hard');
    const [isExpanded, setIsExpanded] = useState(false);

    const displaySkills = activeTab === 'hard' ? hardSkills : softSkills;
    const hasAnySkills = hardSkills.length > 0 || softSkills.length > 0;
    const SKILLS_LIMIT = 5;
    const visibleSkills = isExpanded ? displaySkills : displaySkills.slice(0, SKILLS_LIMIT);
    const hasMoreSkills = displaySkills.length > SKILLS_LIMIT;

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
                                    className="w-full h-full object-cover transition-all duration-700 filter grayscale group-hover:grayscale-0"
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
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
                                    <span className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest">{career}</span>
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
                                        <Linkedin size={22} strokeWidth={1.5} />
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
                                                // Count evidences for this skill
                                                const count = skillCounts?.[skill] || 1
                                                return (
                                                    <div
                                                        key={skill}
                                                        className="group flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'hard' ? 'bg-indigo-400' : 'bg-blue-400'}`} />
                                                            <span className="text-sm font-medium text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                                                                {skill}
                                                            </span>
                                                        </div>
                                                        <span className="font-mono text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] group-hover:text-indigo-600 transition-colors">
                                                            {count} {count === 1 ? 'EVIDENCIA' : 'EVIDENCIAS'}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                            {hasMoreSkills && (
                                                <button
                                                    onClick={() => setIsExpanded(!isExpanded)}
                                                    className="w-full py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 transition-colors"
                                                >
                                                    {isExpanded ? 'Ver menos' : `Ver todas (${displaySkills.length})`}
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
        </header>
    );
};
