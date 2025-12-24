
'use client'

import { useState } from 'react'
import { Mail, Send, CheckCircle2, Loader2, Linkedin, Copy, Check } from 'lucide-react'

interface ContactSectionProps {
    profileEmail: string | null
    profileName: string
    linkedinUrl?: string | null
}

export default function ContactSection({ profileEmail, profileName, linkedinUrl }: ContactSectionProps) {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
    const [copiedEmail, setCopiedEmail] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })

    const handleCopyEmail = () => {
        if (!profileEmail) return
        navigator.clipboard.writeText(profileEmail)
        setCopiedEmail(true)
        setTimeout(() => setCopiedEmail(false), 2000)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profileEmail) {
            alert('Este perfil no tiene un correo configurado para recibir mensajes.')
            return
        }

        setStatus('sending')
        try {
            const res = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    toEmail: profileEmail,
                    toName: profileName
                })
            })

            const data = await res.json()
            if (data.success) {
                setStatus('success')
                setFormData({ name: '', email: '', message: '' })
            } else {
                throw new Error(data.error || 'Error al enviar el mensaje')
            }
        } catch (err: any) {
            console.error(err)
            setStatus('error')
            setErrorMsg(err.message)
        }
    }

    return (
        <section className="animate-fade-in py-4">
            <div className="max-w-xl mx-auto">
                {/* Formulario */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-purple-100/20 border border-gray-100 p-8 md:p-10">
                    {status === 'success' ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={40} className="text-green-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">¡Mensaje Enviado!</h3>
                            <p className="text-gray-600 mb-8 max-w-xs">Gracias por contactarme. Te responderé lo antes posible.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="text-purple-600 font-bold hover:underline"
                            >
                                Enviar otro mensaje
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-black text-gray-900 mb-2">Envíame un mensaje 💬</h2>
                                <p className="text-gray-500 text-sm">Completa el formulario y me pondré en contacto contigo.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Tu Nombre</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Juan Pérez"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Tu Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="juan@ejemplo.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Mensaje</label>
                                <textarea
                                    required
                                    placeholder="¿En qué puedo ayudarte?"
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 font-medium placeholder-gray-400 resize-none"
                                />
                            </div>

                            {status === 'error' && (
                                <p className="text-rose-500 text-sm font-bold px-1">❌ {errorMsg}</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'sending' || !profileEmail}
                                className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black text-lg transition-all hover:bg-purple-700 hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-200 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
                            >
                                {status === 'sending' ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Enviar Mensaje
                                    </>
                                )}
                            </button>
                            {!profileEmail && (
                                <p className="text-center text-xs text-amber-600 font-medium italic">
                                    Este perfil no ha configurado un email de recepción.
                                </p>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}
