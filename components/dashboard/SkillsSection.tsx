
'use client'

import { Project } from '@/types/database.types'

interface SkillsSectionProps {
    projects: Project[]
}

export default function SkillsSection({ projects }: SkillsSectionProps) {
    // 1. Recolectar todas las skills y contar sus apariciones
    const skillCounts: Record<string, number> = {}

    projects.forEach(project => {
        project.skills?.forEach(skill => {
            const normalizedSkill = skill.trim()
            if (normalizedSkill) {
                skillCounts[normalizedSkill] = (skillCounts[normalizedSkill] || 0) + 1
            }
        })
    })

    // 2. Convertir a array y ordenar por frecuencia (opcional, aquí las dejamos)
    const sortedSkills = Object.keys(skillCounts).sort((a, b) => skillCounts[b] - skillCounts[a])

    if (sortedSkills.length === 0) return null

    return (
        <section className="w-full">
            <h2 className="font-mono text-[10px] font-black tracking-[0.2em] uppercase text-indigo-600/60 mb-6 pb-4 border-b border-slate-200">
                Ecosistema de Competencias
            </h2>

            <div className="space-y-4">
                {sortedSkills.map((skill) => {
                    const count = skillCounts[skill]
                    return (
                        <div
                            key={skill}
                            className="group flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                        >
                            <span className="font-serif text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">
                                {skill}
                            </span>
                            <span className="font-mono text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-100/50 px-2 py-0.5 rounded border border-slate-200/50 transition-colors group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                                {count} {count === 1 ? 'Proyecto' : 'Proyectos'}
                            </span>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
