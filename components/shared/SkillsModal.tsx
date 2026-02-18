'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Brain, GripVertical } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SkillsModalProps {
    isOpen: boolean
    onClose: () => void
    hardSkills: string[]
    softSkills: string[]
    skillCounts?: Record<string, number>
    onReorder?: (hardSkills: string[], softSkills: string[]) => void
    isEditable?: boolean
}

function SortableSkillItem({
    skill,
    type,
    count,
    isEditable,
}: {
    skill: string
    type: 'hard' | 'soft'
    count: number
    isEditable: boolean
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: skill })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const dotColor = type === 'hard' ? 'bg-indigo-400' : 'bg-blue-400'
    const hoverColor = type === 'hard' ? 'group-hover:text-indigo-600' : 'group-hover:text-blue-600'

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group flex items-center justify-between py-2 border-b border-slate-100 last:border-0 rounded-md transition-shadow ${isDragging ? 'bg-white shadow-lg ring-1 ring-indigo-200 z-10 relative' : ''
                }`}
        >
            <div className="flex items-center gap-2">
                {isEditable && (
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors touch-none"
                        title="Arrastra para reordenar"
                    >
                        <GripVertical size={14} />
                    </button>
                )}
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                <span className={`text-sm font-medium text-slate-700 ${hoverColor} transition-colors`}>
                    {skill}
                </span>
            </div>
            <span className={`font-mono text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] ${hoverColor} transition-colors`}>
                {count} {count === 1 ? 'evidencia' : 'evidencias'}
            </span>
        </div>
    )
}

export default function SkillsModal({
    isOpen,
    onClose,
    hardSkills: initialHardSkills,
    softSkills: initialSoftSkills,
    skillCounts = {},
    onReorder,
    isEditable = false,
}: SkillsModalProps) {
    const [hardSkills, setHardSkills] = useState(initialHardSkills)
    const [softSkills, setSoftSkills] = useState(initialSoftSkills)

    // Sync state when props change (e.g. modal re-opens with updated data)
    useEffect(() => {
        setHardSkills(initialHardSkills)
    }, [initialHardSkills])
    useEffect(() => {
        setSoftSkills(initialSoftSkills)
    }, [initialSoftSkills])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 4 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (type: 'hard' | 'soft') => (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        if (type === 'hard') {
            const oldIndex = hardSkills.indexOf(active.id as string)
            const newIndex = hardSkills.indexOf(over.id as string)
            const newOrder = arrayMove(hardSkills, oldIndex, newIndex)
            setHardSkills(newOrder)
            setTimeout(() => onReorder?.(newOrder, softSkills), 0)
        } else {
            const oldIndex = softSkills.indexOf(active.id as string)
            const newIndex = softSkills.indexOf(over.id as string)
            const newOrder = arrayMove(softSkills, oldIndex, newIndex)
            setSoftSkills(newOrder)
            setTimeout(() => onReorder?.(hardSkills, newOrder), 0)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Competencias Validadas"
            maxWidth="max-w-2xl"
        >
            <div className="space-y-6">
                {/* Stats Summary */}
                <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold text-indigo-600">{hardSkills.length}</div>
                        <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Técnicas</div>
                    </div>
                    <div className="w-px bg-slate-200" />
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold text-blue-600">{softSkills.length}</div>
                        <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Transversales</div>
                    </div>
                </div>

                {/* Drag hint for dashboard */}
                {isEditable && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <GripVertical size={14} className="text-indigo-400" />
                        <p className="text-xs text-indigo-700">
                            Arrastra las competencias para cambiar el orden en que aparecen en tu perfil.
                        </p>
                    </div>
                )}

                {/* Two Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hard Skills Column */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b-2 border-indigo-100">
                            <Sparkles size={14} className="text-indigo-500" />
                            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-indigo-600">
                                Competencias Técnicas
                            </h3>
                        </div>
                        <div className="space-y-0 max-h-64 overflow-y-auto pr-2">
                            {hardSkills.length > 0 ? (
                                isEditable ? (
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd('hard')}
                                    >
                                        <SortableContext items={hardSkills} strategy={verticalListSortingStrategy}>
                                            {hardSkills.map((skill) => (
                                                <SortableSkillItem
                                                    key={skill}
                                                    skill={skill}
                                                    type="hard"
                                                    count={skillCounts[skill] || 1}
                                                    isEditable={true}
                                                />
                                            ))}
                                        </SortableContext>
                                    </DndContext>
                                ) : (
                                    hardSkills.map((skill) => (
                                        <SortableSkillItem
                                            key={skill}
                                            skill={skill}
                                            type="hard"
                                            count={skillCounts[skill] || 1}
                                            isEditable={false}
                                        />
                                    ))
                                )
                            ) : (
                                <p className="text-sm text-slate-400 italic py-4 text-center">
                                    Sin competencias técnicas registradas
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Soft Skills Column */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-100">
                            <Brain size={14} className="text-blue-500" />
                            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-blue-600">
                                Habilidades Transversales
                            </h3>
                        </div>
                        <div className="space-y-0 max-h-64 overflow-y-auto pr-2">
                            {softSkills.length > 0 ? (
                                isEditable ? (
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd('soft')}
                                    >
                                        <SortableContext items={softSkills} strategy={verticalListSortingStrategy}>
                                            {softSkills.map((skill) => (
                                                <SortableSkillItem
                                                    key={skill}
                                                    skill={skill}
                                                    type="soft"
                                                    count={skillCounts[skill] || 1}
                                                    isEditable={true}
                                                />
                                            ))}
                                        </SortableContext>
                                    </DndContext>
                                ) : (
                                    softSkills.map((skill) => (
                                        <SortableSkillItem
                                            key={skill}
                                            skill={skill}
                                            type="soft"
                                            count={skillCounts[skill] || 1}
                                            isEditable={false}
                                        />
                                    ))
                                )
                            ) : (
                                <p className="text-sm text-slate-400 italic py-4 text-center">
                                    Sin habilidades transversales registradas
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
