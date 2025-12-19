import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    // Sign out the user
    await supabase.auth.signOut()

    // Build the absolute URL for the homepage
    const url = new URL(request.url)
    const origin = url.origin

    return NextResponse.redirect(`${origin}/`, {
        status: 302,
    })
}
