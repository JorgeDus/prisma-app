"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Github, Linkedin, Mail, Globe } from "lucide-react";

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
}: ImpactHeaderProps) => {
    return (
        <header className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-start">
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
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300 font-serif text-5xl">
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
                <div className="flex-1 space-y-10">
                    {/* Identity Masthead */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h1 className="text-5xl md:text-7xl font-serif font-black text-slate-800 tracking-tight leading-[1.1]">
                                {name}
                            </h1>
                            {headline && (
                                <p className="text-xl md:text-2xl font-serif italic text-slate-500 leading-tight">
                                    {headline}
                                </p>
                            )}
                        </div>

                        {/* Credential Rail */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
                                <span className="text-[10px] font-mono font-black text-indigo-600 uppercase tracking-widest">{career}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest leading-none pt-0.5">{university}</span>
                                {academicStatus && (
                                    <span className="text-[9px] font-mono font-black text-slate-800 bg-slate-100/50 border border-slate-200/50 px-2 py-0.5 rounded uppercase tracking-tighter">
                                        {academicStatus}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Thesis Vision Paragraph */}
                    <div className="relative max-w-3xl">
                        <div className="absolute -left-6 top-1 w-1 h-full bg-indigo-50" />
                        <p className="text-xl md:text-2xl font-serif italic text-slate-600 leading-relaxed text-balance">
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
        </header>
    );
};
