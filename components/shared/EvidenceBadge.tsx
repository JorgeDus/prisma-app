import React from "react";
import { ShieldCheck } from "lucide-react";

interface EvidenceBadgeProps {
    label: string;
    count?: number;
    className?: string;
}

export const EvidenceBadge = ({ label, count, className = "" }: EvidenceBadgeProps) => {
    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 border border-indigo-500 rounded-lg shadow-md font-mono text-[10px] font-black tracking-widest text-white ring-4 ring-indigo-500/10 ${className}`}>
            <ShieldCheck size={14} className="text-indigo-200" strokeWidth={3} />
            <span className="uppercase">{label}</span>
            {count !== undefined && (
                <span className="ml-1 w-5 h-5 flex items-center justify-center bg-white text-indigo-600 rounded-full text-[9px] font-bold">
                    {count}
                </span>
            )}
        </div>
    );
};
