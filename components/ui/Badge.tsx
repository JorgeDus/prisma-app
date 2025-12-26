import React from "react";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "outline" | "indigo" | "amber" | "slate";
    className?: string;
}

export const Badge = ({ children, variant = "default", className = "" }: BadgeProps) => {
    const variants = {
        default: "bg-slate-100 text-slate-700 border-slate-200",
        outline: "bg-transparent text-slate-500 border-slate-200",
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
        slate: "bg-slate-900 text-white border-transparent",
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded border font-mono text-[10px] uppercase tracking-wider ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};
