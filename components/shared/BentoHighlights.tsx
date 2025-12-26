"use client";

import React from "react";

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
                        {/* Background Image with Grayscale Logic */}
                        <div className="absolute inset-0 z-0">
                            {item.cover_image ? (
                                <>
                                    <img
                                        src={item.cover_image}
                                        alt={item.title}
                                        className="w-full h-full object-cover grayscale brightness-50 contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                </>
                            ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center opacity-40">
                                    <span className="font-serif text-slate-600 text-6xl italic">P</span>
                                </div>
                            )}
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-10 h-full p-8 flex flex-col justify-end">
                            <div className="space-y-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {isProject ? 'Proyecto' : item.type}
                                </span>
                                <h3 className="text-2xl md:text-3xl font-serif italic text-white leading-tight">
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
