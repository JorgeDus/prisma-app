
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
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <span className="text-3xl">⚡</span>
                Skills
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {sortedSkills.map((skill) => {
                    const count = skillCounts[skill]
                    return (
                        <div
                            key={skill}
                            className="group flex flex-col gap-1"
                        >
                            <span className="font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                                {skill}
                            </span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {count} {count === 1 ? 'Proyecto' : 'Proyectos'}
                            </span>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
