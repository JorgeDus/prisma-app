import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting (resets on server restart)
// For production, consider using Redis or a dedicated rate limiting service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        // First request or window expired - reset
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return true;
    }

    record.count++;
    return false;
}

export async function POST(request: Request) {
    try {
        // Get IP for rate limiting
        const forwardedFor = request.headers.get('x-forwarded-for');
        const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown';

        // Check rate limit
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const { name, email, message, toEmail, toName, website } = await request.json();

        // Honeypot validation - if filled, it's a bot
        if (website) {
            // Return success to not reveal the trap, but don't send email
            return NextResponse.json({ success: true, data: { id: 'honeypot-blocked' } });
        }

        if (!name || !email || !message || !toEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Verify the recipient exists in the database (prevent arbitrary email sending)
        const supabase = await createClient();
        const { data: recipient, error: recipientError } = await supabase
            .from('profiles')
            .select('id, email')
            .eq('email', toEmail)
            .single();

        if (recipientError || !recipient) {
            return NextResponse.json(
                { error: 'Recipient not found' },
                { status: 404 }
            );
        }

        const { data, error } = await resend.emails.send({
            from: 'Prisma <contacto@tuprisma.com>', // Usar dominio verificado en producción
            to: [toEmail],
            subject: `Nuevo mensaje de contacto de ${name} via Prisma`,
            replyTo: email,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 10px;">
                    <h2 style="color: #7c3aed;">Nuevo mensaje para ${toName}</h2>
                    <p>Has recibido un nuevo mensaje a través de tu perfil en <strong>Prisma</strong>.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p><strong>De:</strong> ${name} (${email})</p>
                    <p><strong>Mensaje:</strong></p>
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed;">
                        ${message.replace(/\n/g, '<br/>')}
                    </div>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #6b7280; text-align: center;">
                        Este correo fue enviado automáticamente por Prisma. <br/>
                        Puedes responder directamente a este correo para contactar a ${name}.
                    </p>
                </div>
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
