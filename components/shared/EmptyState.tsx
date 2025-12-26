"use client";

import React from "react";
import { Plus } from "lucide-react";

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    isEditable?: boolean;
}

export const EmptyState = ({
    title,
    description,
    actionLabel,
    onAction,
    isEditable,
}: EmptyStateProps) => {
    if (!isEditable) return null;

    return (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 group hover:border-indigo-200 hover:bg-slate-50 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                <Plus size={20} strokeWidth={1.5} />
            </div>
            <h4 className="text-lg font-serif text-slate-800 mb-1">{title}</h4>
            <p className="text-slate-500 text-sm font-mono uppercase tracking-tight text-center max-w-[280px]">
                {description}
            </p>
            {actionLabel && (
                <button
                    onClick={onAction}
                    className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-mono tracking-widest uppercase hover:bg-indigo-700 transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};
