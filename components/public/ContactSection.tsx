
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
        <section className="animate-fade-in py-12">
            <div className="max-w-xl mx-auto">
                {/* Formulario */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-black/20 border border-slate-700/50 p-8 md:p-12">
                    {status === 'success' ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={40} className="text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-serif italic text-white mb-2">¡Mensaje Enviado!</h3>
                            <p className="text-slate-400 mb-8 max-w-xs">Gracias por contactarme. Te responderé lo antes posible.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors uppercase text-[10px] tracking-widest"
                            >
                                Enviar otro mensaje
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-serif italic text-white mb-3 tracking-tight">Conectémonos</h2>
                                <p className="text-slate-400 text-sm font-mono uppercase tracking-wide">Mensajería Directa</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono font-black text-slate-500 mb-3 px-1 uppercase tracking-widest">Tu Nombre</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Nombre completo"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-white font-medium placeholder-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono font-black text-slate-500 mb-3 px-1 uppercase tracking-widest">Tu Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="email@ejemplo.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-white font-medium placeholder-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono font-black text-slate-500 mb-3 px-1 uppercase tracking-widest">Mensaje</label>
                                <textarea
                                    required
                                    placeholder="¿Cómo podemos colaborar?"
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-white font-medium placeholder-slate-600 resize-none h-32"
                                />
                            </div>

                            {status === 'error' && (
                                <p className="text-rose-400 text-[10px] font-mono font-bold px-1 uppercase tracking-tight">❌ {errorMsg}</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'sending' || !profileEmail}
                                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-indigo-500 hover:scale-[1.01] active:scale-95 shadow-xl shadow-indigo-900/20 disabled:opacity-50 flex items-center justify-center gap-3 border border-indigo-400/20"
                            >
                                {status === 'sending' ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin opacity-50" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} className="opacity-70" />
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
