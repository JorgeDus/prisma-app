import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { LogOut, Users, LayoutDashboard } from 'lucide-react';
import ExploreContent from '@/components/explore/ExploreContent';

export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
    const supabase = await createClient();

    // 1. Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) redirect('/login');

    // 2. Obtener perfil del usuario actual
    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user.id)
        .single();

    if (!currentProfile) redirect('/onboarding');

    // 3. Obtener todos los perfiles (excepto el usuario actual, pausados y en eliminación)
    const { data: profiles } = await supabase
        .from('profiles')
        .select(`
            id,
            username,
            full_name,
            headline,
            about,
            avatar_url,
            universities(name),
            careers(name)
        `)
        .neq('id', user.id)
        .or('is_paused.eq.false,is_paused.is.null')
        .is('deletion_requested_at', null)
        .order('created_at', { ascending: false });

    // 4. Obtener conexiones del usuario actual
    const { data: connections } = await supabase
        .from('connections')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    // 5. Obtener conteo de proyectos y experiencias para cada perfil
    const profileIds = profiles?.map(p => p.id) || [];

    const { data: projectCounts } = await supabase
        .from('projects')
        .select('user_id')
        .in('user_id', profileIds);

    const { data: experienceCounts } = await supabase
        .from('experiences')
        .select('user_id')
        .in('user_id', profileIds);

    // 6. Obtener skills de proyectos y experiencias para búsqueda
    const { data: projectSkills } = await supabase
        .from('projects')
        .select('user_id, hard_skills, soft_skills')
        .in('user_id', profileIds);

    const { data: experienceSkills } = await supabase
        .from('experiences')
        .select('user_id, hard_skills, soft_skills')
        .in('user_id', profileIds);

    // Process profiles with counts and skills
    const profilesWithCounts = (profiles || []).map(profile => {
        const projCount = projectCounts?.filter(p => p.user_id === profile.id).length || 0;
        const expCount = experienceCounts?.filter(e => e.user_id === profile.id).length || 0;

        // Aggregate skills
        const userProjectSkills = projectSkills?.filter(p => p.user_id === profile.id) || [];
        const userExpSkills = experienceSkills?.filter(e => e.user_id === profile.id) || [];

        const allSkills = new Set<string>();
        userProjectSkills.forEach(p => {
            (p.hard_skills || []).forEach((s: string) => allSkills.add(s.toLowerCase()));
            (p.soft_skills || []).forEach((s: string) => allSkills.add(s.toLowerCase()));
        });
        userExpSkills.forEach(e => {
            (e.hard_skills || []).forEach((s: string) => allSkills.add(s.toLowerCase()));
            (e.soft_skills || []).forEach((s: string) => allSkills.add(s.toLowerCase()));
        });

        return {
            id: profile.id,
            username: profile.username,
            full_name: profile.full_name,
            headline: profile.headline,
            about: profile.about,
            avatar_url: profile.avatar_url,
            career_name: (profile as any).careers?.name || null,
            university_name: (profile as any).universities?.name || null,
            project_count: projCount,
            experience_count: expCount,
            skills: Array.from(allSkills),
        };
    });

    return (
        <div className="bg-[#F9FAFB] min-h-screen pb-24 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo-prisma.png"
                                alt="Prisma Logo"
                                width={120}
                                height={32}
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                        <div className="h-4 w-px bg-slate-200" />
                        <div className="flex items-center gap-1 text-indigo-600">
                            <Users size={16} />
                            <span className="font-mono text-xs font-bold tracking-tighter uppercase">Explorar Talento</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                            <LayoutDashboard size={14} />
                            Mi Dashboard
                        </Link>
                        <form action="/auth/signout" method="post">
                            <button className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 hover:text-red-600 transition-colors">
                                <LogOut size={14} />
                                Cerrar Sesión
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 pt-28">
                {/* Page Header */}
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-bold text-slate-800">
                        Explora el Talento
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Descubre profesionales, amplía tu red y conecta con perfiles que comparten tus intereses.
                    </p>
                </div>

                <ExploreContent
                    currentUserId={user.id}
                    profiles={profilesWithCounts}
                    connections={connections || []}
                />
            </main>
        </div>
    );
}
