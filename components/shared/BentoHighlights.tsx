"use client";

import React from "react";

const EXP_CATEGORY_MAP: Record<string, string> = {
    liderazgo: 'Liderazgo',
    social: 'Social',
    emprendimiento: 'Emprendimiento',
    empleo_sustento: 'Trayectoria',
    academico: 'Académico',
    deportivo: 'Deportivo',
    creativo: 'Creativo',
    cuidado_vida: 'Cuidado y Vida',
    otro: 'Otro'
}

interface BentoHighlightsProps {
    items: any[];
    username: string;
    isEditable?: boolean;
    onEditItem?: (item: any) => void;
    onDeleteItem?: (id: string) => void;
}

export const BentoHighlights = ({
    items,
    username,
    isEditable,
    onEditItem,
    onDeleteItem,
}: BentoHighlightsProps) => {
    // Sort by is_featured and then by date
    const featured = [...items]
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
                const isProject = item.hasOwnProperty('is_startup') || item.hasOwnProperty('github_url');
                const href = isEditable
                    ? (isProject ? `/dashboard/project/${item.id}` : `/dashboard/experiencias/${item.id}`)
                    : (isProject ? `/${username}/proyectos/${item.id}` : `/${username}/experiencias/${item.id}`);

                return (
                    <div
                        key={item.id}
                        className={`${isLarge ? "md:col-span-8 md:row-span-2" : "md:col-span-4"
                            } group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/10 min-h-[240px] md:min-h-0`}
                    >
                        {/* Background Image with Dark Overlay */}
                        <div className="absolute inset-0 z-0">
                            {item.cover_image ? (
                                <>
                                    <img
                                        src={item.cover_image}
                                        alt={item.title}
                                        className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
                                    />
                                    {/* Subtly darker overlay */}
                                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                                </>
                            ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                    <span className="font-serif text-slate-600 text-6xl italic">P</span>
                                </div>
                            )}
                        </div>

                        {/* Content Overlay - Purely Visual */}
                        <div className="relative z-10 h-full p-8 flex flex-col justify-end">
                            <div className="space-y-3 transform transition-transform duration-700 group-hover:-translate-y-2">
                                <span className="inline-block text-[9px] font-mono font-black tracking-[0.3em] uppercase text-indigo-300 opacity-80 group-hover:opacity-100 group-hover:text-white transition-all">
                                    {isProject ? 'PROYECTO' : (EXP_CATEGORY_MAP[item.type] || item.type).toUpperCase()}
                                </span>
                                <h3 className="text-3xl md:text-4xl font-serif font-black text-white leading-[1.1] tracking-tight group-hover:text-indigo-50 transition-colors">
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
