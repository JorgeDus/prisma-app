import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // Verify the user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Authentication required to send connection requests' },
                { status: 401 }
            );
        }

        const { receiverId, message } = await request.json();

        if (!receiverId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // The sender is always the authenticated user - prevents impersonation
        const senderId = user.id;

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tuprisma.com';

        // Get sender's profile info
        const { data: sender, error: senderError } = await supabase
            .from('profiles')
            .select(`
                full_name,
                headline,
                avatar_url,
                careers(name),
                universities(name)
            `)
            .eq('id', senderId)
            .single();

        if (senderError || !sender) {
            return NextResponse.json({ error: 'Sender profile not found' }, { status: 404 });
        }

        const senderName = sender.full_name || 'Un usuario';

        // Get receiver's email
        const { data: receiver, error: fetchError } = await supabase
            .from('profiles')
            .select('email, full_name, username')
            .eq('id', receiverId)
            .single();

        if (fetchError || !receiver) {
            console.error('Error fetching receiver:', fetchError);
            return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
        }

        if (!receiver.email) {
            console.log('Receiver has no email configured, skipping notification');
            return NextResponse.json({ success: true, skipped: true, reason: 'no_email' });
        }

        const senderInfo = {
            career_name: (sender.careers as any)?.name || '',
            university_name: (sender.universities as any)?.name || '',
            avatar_url: sender.avatar_url || '',
            headline: sender.headline || ''
        };

        const exploreUrl = `${baseUrl}/explorar?tab=solicitudes`;
        const logoUrl = `${baseUrl}/logo-prisma.png`;

        // Subtitle: career + university or headline
        const senderSubtitle = senderInfo.career_name && senderInfo.university_name
            ? `${senderInfo.career_name} · ${senderInfo.university_name}`
            : senderInfo.headline || '';

        // Message section (only if message exists)
        const messageSection = message ? `
            <p style="
                margin: 16px 0 0 0;
                font-family: Georgia, 'Times New Roman', serif;
                font-size: 14px;
                line-height: 1.6;
                font-style: italic;
                color: #64748B;
                padding-left: 16px;
                border-left: 2px solid #E2E8F0;
            ">
                "${message}"
            </p>
        ` : '';

        // Avatar section
        const avatarSection = senderInfo.avatar_url
            ? `<img src="${senderInfo.avatar_url}" alt="${senderName}" width="56" height="56" style="border-radius: 16px; object-fit: cover;">`
            : `<div style="width: 56px; height: 56px; border-radius: 16px; background-color: #F1F5F9; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 20px; color: #94A3B8;">👤</span>
               </div>`;

        const { data, error } = await resend.emails.send({
            from: 'Prisma <contacto@tuprisma.com>',
            to: [receiver.email],
            subject: `${senderName} quiere conectar contigo en Prisma`,
            html: `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva solicitud de conexión</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <!-- Preheader (hidden text for inbox preview) -->
    <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
        Ha visto tu perfil y quiere añadirte a su red de talento.
    </div>
    <!-- Preheader spacer (prevents Gmail from showing other content) -->
    <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F9FAFB;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 480px; margin: 0 auto;">
                    
                    <!-- Logo -->
                    <tr>
                        <td style="padding: 0 0 32px 0; text-align: center;">
                            <img src="${logoUrl}" alt="Prisma" height="28" style="height: 28px; width: auto;">
                        </td>
                    </tr>
                    
                    <!-- Header Text -->
                    <tr>
                        <td style="padding: 0 0 24px 0; text-align: center;">
                            <p style="
                                margin: 0;
                                font-size: 11px;
                                font-weight: 700;
                                letter-spacing: 0.15em;
                                text-transform: uppercase;
                                color: #64748B;
                            ">
                                NUEVA SOLICITUD DE CONEXIÓN
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Card Container -->
                    <tr>
                        <td>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="
                                background-color: #FFFFFF;
                                border: 1px solid #E2E8F0;
                                border-radius: 16px;
                                overflow: hidden;
                            ">
                                <!-- Card Content -->
                                <tr>
                                    <td style="padding: 24px;">
                                        <!-- Profile Row -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td width="56" style="vertical-align: top;">
                                                    ${avatarSection}
                                                </td>
                                                <td style="padding-left: 16px; vertical-align: top;">
                                                    <p style="
                                                        margin: 0;
                                                        font-size: 16px;
                                                        font-weight: 600;
                                                        color: #1E293B;
                                                    ">
                                                        ${senderName}
                                                    </p>
                                                    ${senderSubtitle ? `
                                                    <p style="
                                                        margin: 4px 0 0 0;
                                                        font-size: 13px;
                                                        color: #64748B;
                                                    ">
                                                        ${senderSubtitle}
                                                    </p>
                                                    ` : ''}
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Message (if exists) -->
                                        ${messageSection}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Intro Text -->
                    <tr>
                        <td style="padding: 24px 0; text-align: center;">
                            <p style="
                                margin: 0;
                                font-family: Georgia, 'Times New Roman', serif;
                                font-size: 15px;
                                line-height: 1.6;
                                color: #475569;
                            ">
                                Quiere añadirte a su red de talento en Prisma.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td style="text-align: center;">
                            <a href="${exploreUrl}" target="_blank" style="
                                display: inline-block;
                                padding: 14px 40px;
                                background-color: #0F172A;
                                color: #FFFFFF;
                                font-size: 13px;
                                font-weight: 600;
                                letter-spacing: 0.05em;
                                text-transform: uppercase;
                                text-decoration: none;
                                border-radius: 8px;
                            ">
                                Ver Solicitud
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 40px 0 0 0; text-align: center;">
                            <p style="
                                margin: 0;
                                font-size: 11px;
                                color: #94A3B8;
                            ">
                                Has recibido este correo porque eres un usuario validado en Prisma.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
