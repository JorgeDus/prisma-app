"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon, ExternalLink, Calendar, MapPin, Award, Trash2, Edit2, CheckCircle2 } from "lucide-react";

interface BaseCardProps {
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    dateRange?: string;
    location?: string;
    href?: string;
    onClick?: () => void;
    is_featured?: boolean;
    is_learning_artifact?: boolean; // El concepto de FracasoLab
    isEditable?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    tags?: string[];
    evidenceCount?: number;
    overline?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
}

export const BaseCard = ({
    title,
    subtitle,
    description,
    imageUrl,
    dateRange,
    location,
    href,
    onClick,
    is_featured,
    is_learning_artifact,
    isEditable,
    onEdit,
    onDelete,
    tags = [],
    evidenceCount = 0,
    overline,
    className = "",
    children,
}: BaseCardProps) => {
    const commonClasses = `evidence-card group relative bg-white border border-slate-200 rounded-xl overflow-hidden transition-editorial hover:border-slate-300 hover:shadow-xl ${className} ${is_learning_artifact ? "border-l-4 border-l-amber-400" : ""}`;

    return (
        <div className={commonClasses}>
            {/* Click Surface (Stretched Link Pattern) */}
            {href ? (
                <Link
                    href={href}
                    className="absolute inset-0 z-10"
                    aria-label={`Ver detalle de ${title}`}
                />
            ) : onClick ? (
                <button
                    onClick={onClick}
                    className="absolute inset-0 z-10 w-full height-full cursor-pointer"
                    aria-label={`Acción para ${title}`}
                />
            ) : null}

            {/* Editorial Header / Image */}
            {imageUrl && (
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
                    />
                    {is_featured && (
                        <div className="absolute top-4 right-4 z-20">
                            <span className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-mono">
                                High Impact
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Content Area */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                        {is_learning_artifact && (
                            <span className="inline-flex items-center gap-1.5 text-amber-600 font-mono text-[10px] uppercase tracking-wider mb-2">
                                <Award size={12} strokeWidth={1.5} />
                                Learning Artifact
                            </span>
                        )}
                        {overline && (
                            <div className="mb-2">
                                {overline}
                            </div>
                        )}
                        <h3 className="text-2xl font-serif text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-slate-500 font-medium text-sm mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {isEditable && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-20">
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit?.(); }}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-colors"
                                title="Editar"
                            >
                                <Edit2 size={18} strokeWidth={1.5} />
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(); }}
                                className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-600 transition-colors"
                                title="Eliminar"
                            >
                                <Trash2 size={18} strokeWidth={1.5} />
                            </button>
                        </div>
                    )}
                </div>

                {description && (
                    <p className="mt-4 text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {description}
                    </p>
                )}

                {/* Metadata Rail */}
                <div className="mt-6 flex flex-wrap gap-4 items-center">
                    {dateRange && (
                        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                            <Calendar size={14} strokeWidth={1.5} />
                            {dateRange}
                        </div>
                    )}
                    {location && (
                        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                            <MapPin size={14} strokeWidth={1.5} />
                            {location}
                        </div>
                    )}
                    {evidenceCount > 0 && (
                        <div className="flex items-center gap-1.5 text-indigo-600 font-mono text-[11px] font-semibold">
                            <CheckCircle2 size={14} strokeWidth={1.5} />
                            {evidenceCount} VALIDACIONES
                        </div>
                    )}
                </div>

                {/* Tags Bento Style */}
                {tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-md font-mono text-[10px] uppercase tracking-tight border border-slate-100"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {children}
            </div>
        </div>
    );
};
