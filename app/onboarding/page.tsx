import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import OnboardingForm from '@/components/onboarding/OnboardingForm'

export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
    const supabase = await createClient()

    // 1. Verificar Autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        redirect('/login')
    }

    // 2. Obtener Perfil Actual
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // 3. Obtener Listas de Datos (Universidades y Carreras)
    const { data: universities } = await supabase
        .from('universities')
        .select('*')
        .order('name')

    const { data: careers } = await supabase
        .from('careers')
        .select('*')
        .order('name')

    // Si ya tiene todo completo, quizá deberíamos mandarlo al dashboard directamente?
    // Por ahora dejaremos que el usuario edite siempre si entra aquí.

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <Image
                        src="/logo-prisma.png"
                        alt="Prisma"
                        width={180}
                        height={60}
                        className="h-12 w-auto"
                        priority
                    />
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    Completa tu perfil académico
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Para conectar mejor con oportunidades y pares
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                    <OnboardingForm
                        universities={universities || []}
                        careers={careers || []}
                        userProfile={profile!}
                    />
                </div>
                <div className="mt-8 text-center text-xs text-gray-400">
                    <p>Estos datos serán visibles en tu perfil público.</p>
                </div>
            </div>
        </div>
    )
}
