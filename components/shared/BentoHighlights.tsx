"use client";

import React from "react";
import { Award, Heart, Zap, Briefcase, GraduationCap, Dumbbell, Palette, HeartPulse, Star, Code, Rocket, User } from 'lucide-react';
import { DEFAULT_EXP_IMAGES, DEFAULT_PROJECT_IMAGES } from "@/constants/images";

const EXP_CATEGORY_MAP: Record<string, { label: string, icon: any, color: string, bg: string, border: string }> = {
    liderazgo: { label: 'Liderazgo', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    social: { label: 'Social', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    emprendimiento: { label: 'Emprendimiento', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    empleo_sustento: { label: 'Trayectoria', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    academico: { label: 'Académico', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    deportivo: { label: 'Deportivo', icon: Dumbbell, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    creativo: { label: 'Creativo', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
    cuidado_vida: { label: 'Cuidado y Vida', icon: HeartPulse, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
    otro: { label: 'General', icon: Star, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' }
}

const PROJECT_CATEGORY_MAP: Record<string, { label: string, icon: any, color: string, bg: string, border?: string }> = {
    academic: { label: 'Portafolio Académico', icon: GraduationCap, color: 'text-purple-700', bg: 'bg-purple-100' },
    startup: { label: 'Startup Project', icon: Rocket, color: 'text-blue-700', bg: 'bg-blue-100' },
    personal: { label: 'Innovación Personal', icon: User, color: 'text-green-700', bg: 'bg-green-100' }
}

interface BentoHighlightsProps {
    items: any[];
    username: string;
    isEditable?: boolean;
    onEditItem?: (item: any) => void;
    onDeleteItem?: (id: string) => void;
    curatedItems?: any[]; // Pre-fetched curated items in order
}

export const BentoHighlights = ({
    items,
    username,
    isEditable,
    onEditItem,
    onDeleteItem,
    curatedItems
}: BentoHighlightsProps) => {
    // Use curated items if provided, otherwise fall back to sorting by is_featured and date
    const featured = curatedItems || [...items]
        .sort((a, b) => {
            if (a.is_featured && !b.is_featured) return -1;
            if (!a.is_featured && b.is_featured) return 1;
            return new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime();
        })
        .slice(0, 3);

    if (featured.length === 0 && !isEditable) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[500px]">
            {featured.map((item, index) => {
                const isLarge = index === 0;
                // Check itemType first (for curated items), then fall back to property detection
                const isProject = item.itemType
                    ? item.itemType === 'project'
                    : (item.hasOwnProperty('is_startup') || item.hasOwnProperty('github_url'));
                const href = isEditable
                    ? (isProject ? `/dashboard/project/${item.id}` : `/dashboard/experiencias/${item.id}`)
                    : (isProject ? `/${username}/proyectos/${item.id}` : `/${username}/experiencias/${item.id}`);

                // Get category info with icon and colors
                let categoryInfo;
                let CategoryIcon;

                if (isProject) {
                    categoryInfo = PROJECT_CATEGORY_MAP[item.type] || PROJECT_CATEGORY_MAP.personal;
                    CategoryIcon = categoryInfo.icon;
                } else {
                    categoryInfo = EXP_CATEGORY_MAP[item.type] || EXP_CATEGORY_MAP.otro;
                    CategoryIcon = categoryInfo.icon;
                }

                return (
                    <div
                        key={item.id}
                        className={`${isLarge ? "md:col-span-8 md:row-span-2" : "md:col-span-4"
                            } group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/10 min-h-[240px] md:min-h-0`}
                    >
                        {/* Background Image with Dark Overlay */}
                        <div className="absolute inset-0 z-0">
                            {(() => {
                                const displayImage = item.cover_image ||
                                    (isProject
                                        ? (DEFAULT_PROJECT_IMAGES[item.type] || DEFAULT_PROJECT_IMAGES.personal)
                                        : (DEFAULT_EXP_IMAGES[item.type] || DEFAULT_EXP_IMAGES.otro)
                                    );
                                return (
                                    <>
                                        <img
                                            src={displayImage}
                                            alt={item.title}
                                            className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
                                        />
                                        {/* Subtly darker overlay */}
                                        <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                                    </>
                                );
                            })()}
                        </div>

                        {/* Category Badge - Top Left */}
                        <div className="absolute top-4 left-4 z-20">
                            {isProject ? (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-mono font-black tracking-[0.15em] uppercase shadow-lg ${categoryInfo.bg} ${categoryInfo.color}`}>
                                    <CategoryIcon size={11} strokeWidth={2.5} />
                                    {categoryInfo.label}
                                </span>
                            ) : (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-mono font-black tracking-[0.15em] uppercase shadow-lg ${categoryInfo.bg} ${categoryInfo.color} ${categoryInfo.border}`}>
                                    <CategoryIcon size={11} strokeWidth={2.5} />
                                    {categoryInfo.label}
                                </span>
                            )}
                        </div>

                        {/* Content Overlay - Title at Bottom */}
                        <div className="relative z-10 h-full p-8 flex flex-col justify-end">
                            <div className="space-y-3 transform transition-transform duration-700 group-hover:-translate-y-2">
                                <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-[1.1] tracking-tight group-hover:text-indigo-50 transition-colors">
                                    {item.title}
                                </h3>
                            </div>
                        </div>

                        {/* Interactive Link Overlay - Always active now */}
                        <a
                            href={href}
                            className="absolute inset-0 z-20"
                            aria-label={`Ver ${item.title}`}
                        />

                        {isEditable && (
                            <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEditItem?.(item); }}
                                    className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-colors text-xs font-bold"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteItem?.(item.id); }}
                                    className="p-2 bg-rose-500/20 backdrop-blur-md rounded-lg text-rose-200 hover:bg-rose-500/40 transition-colors text-xs font-bold"
                                >
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
