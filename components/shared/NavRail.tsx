"use client";

import React, { useEffect, useState } from "react";
import {
    User,
    Briefcase,
    FolderGit2,
    Trophy,
    MessageSquare,
    Mail,
    Sparkles,
    LayoutGrid
} from "lucide-react";

interface NavRailProps {
    sections: { id: string; label: string }[];
}

const getIcon = (id: string, isActive: boolean) => {
    const props = { size: 18, strokeWidth: isActive ? 2 : 1.5 };
    switch (id) {
        case "highlights": return <LayoutGrid {...props} />;
        case "experiencia": return <Briefcase {...props} />;
        case "proyectos": return <FolderGit2 {...props} />;
        case "logros": return <Trophy {...props} />;
        case "testimonios": return <MessageSquare {...props} />;
        case "contacto": return <Mail {...props} />;
        default: return <Sparkles {...props} />;
    }
};

export const NavRail = ({ sections }: NavRailProps) => {
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            // Check if we are at the bottom of the page
            const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
            if (isAtBottom && sections.length > 0) {
                setActiveSection(sections[sections.length - 1].id);
                return;
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                // Find all intersecting sections and pick the one that is most visible
                // or just follow the last one that triggered 'isIntersecting'
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                // rootMargin centered to trigger when section passes the middle of the viewport
                rootMargin: "-20% 0px -60% 0px",
                threshold: 0.1
            }
        );

        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        window.addEventListener('scroll', handleScroll);

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, [sections]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav className="fixed left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-6 z-50">
            {sections.map((section) => {
                const isActive = activeSection === section.id;

                return (
                    <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className="group relative flex items-center"
                    >
                        <div
                            className={`w-10 h-10 rounded-full border transition-all duration-500 flex items-center justify-center ${isActive
                                ? "bg-slate-900 border-slate-900 text-white shadow-lg scale-110"
                                : "bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600"
                                }`}
                        >
                            {getIcon(section.id, isActive)}
                        </div>

                        {/* Label Tooltip */}
                        <span className={`absolute left-14 px-3 py-1 bg-slate-900 text-white text-[10px] font-mono uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ${isActive ? "opacity-100" : ""
                            }`}>
                            {section.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};
