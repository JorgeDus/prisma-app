
'use client'

import { Project, Experience } from '@/types/database.types'

interface SkillsSectionProps {
    projects: Project[]
    experiences?: Experience[]
}

export default function SkillsSection({ projects, experiences = [] }: SkillsSectionProps) {
    // 1. Recolectar todas las hard_skills y contar apariciones
    const hardSkillCounts: Record<string, number> = {}
    const softSkillCounts: Record<string, number> = {}

    projects.forEach(project => {
        project.hard_skills?.forEach(skill => {
            const normalizedSkill = skill.trim()
            if (normalizedSkill) {
                hardSkillCounts[normalizedSkill] = (hardSkillCounts[normalizedSkill] || 0) + 1
            }
        })
        project.soft_skills?.forEach(skill => {
            const normalizedSkill = skill.trim()
            if (normalizedSkill) {
                softSkillCounts[normalizedSkill] = (softSkillCounts[normalizedSkill] || 0) + 1
            }
        })
    })

    experiences.forEach(exp => {
        exp.hard_skills?.forEach(skill => {
            const normalizedSkill = skill.trim()
            if (normalizedSkill) {
                hardSkillCounts[normalizedSkill] = (hardSkillCounts[normalizedSkill] || 0) + 1
            }
        })
        exp.soft_skills?.forEach(skill => {
            const normalizedSkill = skill.trim()
            if (normalizedSkill) {
                softSkillCounts[normalizedSkill] = (softSkillCounts[normalizedSkill] || 0) + 1
            }
        })
    })

    // Combinar y ordenar por frecuencia
    const allSkillCounts = { ...hardSkillCounts }
    Object.entries(softSkillCounts).forEach(([skill, count]) => {
        allSkillCounts[skill] = (allSkillCounts[skill] || 0) + count
    })

    const sortedSkills = Object.keys(allSkillCounts).sort((a, b) => allSkillCounts[b] - allSkillCounts[a])

    if (sortedSkills.length === 0) return null

    return (
        <section className="w-full">
            <h2 className="font-mono text-[10px] font-black tracking-[0.2em] uppercase text-indigo-600/60 mb-6 pb-4 border-b border-slate-200">
                Ecosistema de Competencias
            </h2>

            <div className="space-y-4">
                {sortedSkills.slice(0, 8).map((skill) => {
                    const count = allSkillCounts[skill]
                    const isHard = hardSkillCounts[skill] !== undefined
                    return (
                        <div
                            key={skill}
                            className="group flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0"
                        >
                            <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${isHard ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                                <span className="font-medium text-base text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {skill}
                                </span>
                            </div>
                            <span className="font-mono text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors group-hover:text-indigo-600">
                                {count} {count === 1 ? 'EVIDENCIA' : 'EVIDENCIAS'}
                            </span>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

