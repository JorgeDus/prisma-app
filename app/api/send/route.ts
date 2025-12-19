
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, message, toEmail, toName } = await request.json();

        if (!name || !email || !message || !toEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'Prisma <onboarding@resend.dev>', // Usar dominio verificado en producción
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
