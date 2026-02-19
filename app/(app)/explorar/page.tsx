import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
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
        .select('id, username, full_name')
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
        <div className="pb-24 md:pb-24">
            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 md:px-6 pt-24 md:pt-28">
                {/* Page Header */}
                <div className="text-center space-y-3 md:space-y-4 mb-8 md:mb-12">
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-800">
                        Explora el Talento
                    </h1>
                    <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto">
                        Descubre profesionales, amplía tu red y conecta con perfiles que comparten tus intereses.
                    </p>
                </div>

                <Suspense fallback={<div className="text-center py-12 text-slate-400">Cargando...</div>}>
                    <ExploreContent
                        currentUserId={user.id}
                        currentUserName={currentProfile.full_name || currentProfile.username}
                        profiles={profilesWithCounts}
                        connections={connections || []}
                    />
                </Suspense>
            </main>
        </div>
    );
}
