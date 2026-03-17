import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { getUniversityStudents, getUniversityCareers } from '../actions'
import Image from 'next/image'
import Link from 'next/link'
import { GraduationCap, FolderGit2, Briefcase, Sparkles, ExternalLink } from 'lucide-react'

interface StudentsPageProps {
    searchParams: Promise<{ carrera?: string }>
}

function StudentCard({ student }: { student: any }) {
    const initials = (student.full_name || student.username || '?')
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4">
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {student.avatar_url ? (
                        <Image
                            src={student.avatar_url}
                            alt=""
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    ) : initials}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate">
                        {student.full_name || student.username}
                    </h3>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                        {student.careerName || 'Sin carrera'}
                    </p>
                    {student.headline && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {student.headline}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 border-t border-slate-50 pt-3">
                <span className="flex items-center gap-1">
                    <FolderGit2 size={12} className="text-indigo-400" />
                    {student.projectCount} proyecto{student.projectCount !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                    <Briefcase size={12} className="text-purple-400" />
                    {student.experienceCount} exp.
                </span>
                <span className="flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-400" />
                    {student.skillCount} skills
                </span>
            </div>

            <a
                href={`/${student.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
            >
                <ExternalLink size={13} />
                Ver perfil completo
            </a>
        </div>
    )
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
    const params = await searchParams
    const careerFilter = params.carrera || ''

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const adminClient = createAdminClient()
    const { data: authUser } = await adminClient.auth.admin.getUserById(user!.id)
    const universityId = authUser?.user?.app_metadata?.university_id as number

    const [students, careers] = await Promise.all([
        getUniversityStudents(universityId, careerFilter || undefined),
        getUniversityCareers(universityId),
    ])

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Directorio de Estudiantes</h1>
                <p className="text-sm text-slate-500 mt-1">
                    {students.length} estudiante{students.length !== 1 ? 's' : ''} registrado{students.length !== 1 ? 's' : ''}
                    {careerFilter ? ` en ${careerFilter}` : ''}
                </p>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
                <Link
                    href="/university/students"
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!careerFilter
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                >
                    Todas
                </Link>
                {careers.map(career => (
                    <Link
                        key={career}
                        href={`/university/students?carrera=${encodeURIComponent(career)}`}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${careerFilter === career
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
                            }`}
                    >
                        {career}
                    </Link>
                ))}
            </div>

            {/* Grid */}
            {students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <GraduationCap size={40} className="text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">No hay estudiantes registrados</p>
                    <p className="text-slate-400 text-sm mt-1">
                        {careerFilter ? `No hay estudiantes en ${careerFilter}` : 'Aún no hay estudiantes asociados a tu universidad'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {students.map(student => (
                        <StudentCard key={student.id} student={student} />
                    ))}
                </div>
            )}
        </div>
    )
}
