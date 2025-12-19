
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Linkedin, Mail, Save, Loader2, ExternalLink, ShieldCheck, Github, Globe } from 'lucide-react'
import ContactSection from '@/components/public/ContactSection'

interface ContactSettingsProps {
    profile: any
    userId: string
}

export default function ContactSettings({ profile, userId }: ContactSettingsProps) {
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    // Parse social links
    const socialLinks = typeof profile.social_links === 'string'
        ? JSON.parse(profile.social_links)
        : (profile.social_links || {})

    const [formData, setFormData] = useState({
        email: profile.email || '',
        linkedin: socialLinks.linkedin || '',
        github: socialLinks.github || '',
        website: socialLinks.website || ''
    })

    const handleSave = async () => {
        setIsLoading(true)
        setIsSaved(false)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    email: formData.email,
                    social_links: {
                        ...socialLinks,
                        linkedin: formData.linkedin,
                        github: formData.github,
                        website: formData.website
                    },
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)

            if (error) throw error
            setIsSaved(true)
            setTimeout(() => setIsSaved(false), 3000)
        } catch (error: any) {
            console.error(error)
            alert('Error al guardar: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-12 animate-fade-in">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Configuración */}
                <div className="lg:col-span-12">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <span className="text-purple-500">⚙️</span> Configuración de Contacto
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Define cómo quieres que las personas se conecten contigo.
                            </p>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Email de Recepción */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <Mail size={16} className="text-purple-500" /> Email de Recepción
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 font-medium"
                                        placeholder="tu@correo.com"
                                    />
                                    <div className="absolute top-full left-0 mt-2 flex items-center gap-1.5 text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                                        <ShieldCheck size={12} />
                                        Aquí llegarán los mensajes del formulario
                                    </div>
                                </div>
                            </div>

                            {/* LinkedIn URL */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <Linkedin size={16} className="text-blue-600" /> LinkedIn Profile
                                </label>
                                <input
                                    type="url"
                                    value={formData.linkedin}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 font-medium"
                                    placeholder="https://linkedin.com/in/tu-perfil"
                                />
                            </div>

                            {/* GitHub URL (Opcional) */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <Github size={16} className="text-gray-900" /> GitHub URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.github}
                                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 font-medium"
                                    placeholder="https://github.com/tu-usuario"
                                />
                            </div>

                            {/* Personal Website */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <Globe size={16} className="text-emerald-500" /> Sitio Web Personal
                                </label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 font-medium"
                                    placeholder="https://tu-sitio.com"
                                />
                            </div>

                        </div>

                        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-xs text-gray-400 font-medium">
                                * Estos datos son públicos para que otros puedan encontrarte.
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                {isSaved ? '¡Guardado!' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vista Previa */}
                <div className="lg:col-span-12">
                    <div className="flex items-center justify-between mb-6 px-4">
                        <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">
                            👀 VISTA PREVIA DEL FORMULARIO
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] text-purple-600 font-bold bg-purple-50 px-3 py-1 rounded-full">
                            <ExternalLink size={12} />
                            Así lo verán tus visitantes
                        </div>
                    </div>

                    <div className="p-10 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 opacity-80 pointer-events-none select-none">
                        <ContactSection
                            profileEmail={formData.email}
                            profileName={profile.full_name || profile.username}
                            linkedinUrl={formData.linkedin}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
