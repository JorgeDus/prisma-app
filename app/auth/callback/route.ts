import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // UX Improvement: Check profile status for smart redirection
            const { data: { user } } = await supabase.auth.getUser()
            let targetPath = next // Default fallback

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('university_id, career_id, full_name')
                    .eq('id', user.id)
                    .single()

                // Also check the new multi-career table
                const { count: careerCount } = await supabase
                    .from('user_careers')
                    .select('id', { count: 'exact', head: true })
                    .eq('user_id', user.id)

                const hasLegacyCareer = profile?.university_id && profile?.career_id
                const hasNewCareer = (careerCount ?? 0) > 0
                const hasName = !!profile?.full_name

                // Logic: Complete profile -> Dashboard, Incomplete -> Onboarding
                if (profile && hasName && (hasLegacyCareer || hasNewCareer)) {
                    targetPath = '/dashboard'
                } else {
                    targetPath = '/onboarding'
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${targetPath}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${targetPath}`)
            } else {
                return NextResponse.redirect(`${origin}${targetPath}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
