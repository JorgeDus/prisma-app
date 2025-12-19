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
                    .select('university_id, career_id')
                    .eq('id', user.id)
                    .single()

                // Logic: Complete profile -> Dashboard, Incomplete -> Onboarding
                if (profile && profile.university_id && profile.career_id) {
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
