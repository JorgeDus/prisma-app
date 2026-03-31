'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
    X,
    UserPlus,
    Check,
    Clock,
    UserMinus,
    ExternalLink,
    Briefcase,
    Sparkles,
    GraduationCap,
    MapPin,
    Send,
    Trophy,
    Award,
    Heart,
    Zap,
    Dumbbell,
    Palette,
    HeartPulse,
    Star,
    FileBadge,
    Users,
    Calendar,
    Stethoscope,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// ── Types ──

interface ProfilePreviewPanelProps {
    username: string | null;
    isOpen: boolean;
    onClose: () => void;
    connectionStatus: 'none' | 'pending_sent' | 'pending_received' | 'connected';
    onConnect: (message?: string) => Promise<void>;
    onAccept: () => Promise<void>;
    onReject: () => Promise<void>;
    onDisconnect: () => Promise<void>;
}

interface ProfileData {
    id: string;
    username: string;
    full_name: string | null;
    headline: string | null;
    about: string | null;
    avatar_url: string | null;
    career_start_date: string | null;
    career_end_date: string | null;
    interests: string[] | null;
    social_links: any;
    featured_items: any;
    universities: { name: string } | null;
    careers: { name: string } | null;
}

interface TimelineItem {
    id: string;
    title: string;
    subtitle: string | null;
    date: string;
    type: 'experience' | 'project' | 'achievement';
    category?: string;
}

const EXP_CATEGORY_MAP: Record<string, { label: string; icon: any; color: string; bg: string }> = {
    liderazgo: { label: 'Liderazgo', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
    social: { label: 'Social', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
    emprendimiento: { label: 'Emprendimiento', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
    empleo_sustento: { label: 'Empleo', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    academico: { label: 'Académico', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    deportivo: { label: 'Deportivo', icon: Dumbbell, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    creativo: { label: 'Creativo', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50' },
    cuidado_vida: { label: 'Cuidado y Vida', icon: HeartPulse, color: 'text-teal-600', bg: 'bg-teal-50' },
    practica: { label: 'Práctica Profesional y Pasantías', icon: Stethoscope, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    otro: { label: 'Otro', icon: Star, color: 'text-slate-600', bg: 'bg-slate-50' },
};

const ACHIEVEMENT_CATEGORY_MAP: Record<string, string> = {
    certification: 'Certificación',
    award: 'Premio',
    course_chair: 'Cátedra',
    academic_role: 'Investigación',
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        timeZone: 'UTC',
    });
};

// ── Component ──

export default function ProfilePreviewPanel({
    username,
    isOpen,
    onClose,
    connectionStatus,
    onConnect,
    onAccept,
    onReject,
    onDisconnect,
}: ProfilePreviewPanelProps) {
    const supabase = createClient();
    const panelRef = useRef<HTMLDivElement>(null);

    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [hardSkills, setHardSkills] = useState<string[]>([]);
    const [softSkills, setSoftSkills] = useState<string[]>([]);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [projectCount, setProjectCount] = useState(0);
    const [experienceCount, setExperienceCount] = useState(0);
    const [achievementCount, setAchievementCount] = useState(0);
    const [careerInfo, setCareerInfo] = useState<{ name: string; institution: string; status: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [showMessageInput, setShowMessageInput] = useState(false);
    const [connectMessage, setConnectMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    // Fetch profile data
    const fetchProfileData = useCallback(async (uname: string) => {
        setIsLoading(true);
        setProfile(null);

        try {
            // Fetch profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select(`
                    id, username, full_name, headline, about, avatar_url,
                    career_start_date, career_end_date, interests, social_links, featured_items,
                    universities(name),
                    careers(name)
                `)
                .eq('username', uname)
                .single();

            if (!profileData) return;
            setProfile(profileData as any);

            // Fetch related data in parallel
            const [projectsRes, experiencesRes, achievementsRes, userCareersRes] = await Promise.all([
                supabase.from('projects').select('id, title, type, hard_skills, soft_skills, created_at').eq('user_id', profileData.id).order('created_at', { ascending: false }),
                supabase.from('experiences').select('id, title, organization, type, hard_skills, soft_skills, start_date, show_in_timeline, created_at').eq('user_id', profileData.id).order('start_date', { ascending: false }),
                supabase.from('achievements').select('id, title, organization, category, date, created_at').eq('user_id', profileData.id).order('date', { ascending: false }),
                supabase.from('user_careers').select('*, career:careers(id, name)').eq('user_id', profileData.id).order('is_primary', { ascending: false }),
            ]);

            const projects = projectsRes.data || [];
            const experiences = experiencesRes.data || [];
            const achievements = achievementsRes.data || [];
            const userCareers = userCareersRes.data || [];

            setProjectCount(projects.length);
            setExperienceCount(experiences.length);
            setAchievementCount(achievements.length);

            // Career info
            const primary = userCareers.find((uc: any) => uc.is_primary) || userCareers[0];
            if (primary) {
                const cName = (primary as any).career?.name || primary.custom_career || 'Carrera';
                const inst = primary.institution || (profileData as any).universities?.name || '';
                const today = new Date();
                let status = 'EN CURSO';
                if (!primary.is_current && primary.end_year) {
                    status = primary.end_year <= today.getFullYear() ? 'EGRESADO' : `EGRESA ${primary.end_year}`;
                } else if (primary.is_current && primary.start_year) {
                    const diff = today.getFullYear() - primary.start_year + 1;
                    status = diff > 0 ? `${diff}º AÑO` : 'EN CURSO';
                }
                setCareerInfo({ name: cName, institution: inst, status });
            } else {
                const cName = (profileData as any).careers?.name || 'Carrera';
                const inst = (profileData as any).universities?.name || '';
                setCareerInfo({ name: cName, institution: inst, status: 'EN CURSO' });
            }

            // Aggregate skills
            const hardSet = new Set<string>();
            const softSet = new Set<string>();
            projects.forEach((p: any) => {
                (p.hard_skills || []).forEach((s: string) => hardSet.add(s.trim()));
                (p.soft_skills || []).forEach((s: string) => softSet.add(s.trim()));
            });
            experiences.forEach((e: any) => {
                (e.hard_skills || []).forEach((s: string) => hardSet.add(s.trim()));
                (e.soft_skills || []).forEach((s: string) => softSet.add(s.trim()));
            });
            setHardSkills(Array.from(hardSet).slice(0, 8));
            setSoftSkills(Array.from(softSet).slice(0, 6));

            // Build timeline (last 5 items)
            const items: TimelineItem[] = [];
            experiences.filter((e: any) => e.show_in_timeline !== false).forEach((e: any) => {
                items.push({ id: e.id, title: e.title, subtitle: e.organization, date: e.start_date || e.created_at, type: 'experience', category: e.type });
            });
            projects.forEach((p: any) => {
                items.push({ id: p.id, title: p.title, subtitle: 'Proyecto', date: p.created_at, type: 'project', category: p.type });
            });
            achievements.forEach((a: any) => {
                items.push({ id: a.id, title: a.title, subtitle: a.organization || 'Logro', date: a.date || a.created_at, type: 'achievement', category: a.category });
            });
            items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setTimeline(items.slice(0, 5));
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    // Open/close animation
    useEffect(() => {
        if (isOpen && username) {
            fetchProfileData(username);
            // Small delay for CSS transition
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setIsVisible(true));
            });
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, username, fetchProfileData]);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setShowMessageInput(false);
        setConnectMessage('');
        setTimeout(onClose, 300); // Wait for animation
    };

    const handleConnectClick = async () => {
        if (showMessageInput) {
            setIsActionLoading(true);
            try {
                await onConnect(connectMessage || undefined);
                setShowMessageInput(false);
                setConnectMessage('');
            } finally {
                setIsActionLoading(false);
            }
        } else {
            setShowMessageInput(true);
        }
    };

    const handleAcceptClick = async () => {
        setIsActionLoading(true);
        try { await onAccept(); } finally { setIsActionLoading(false); }
    };

    const handleRejectClick = async () => {
        setIsActionLoading(true);
        try { await onReject(); } finally { setIsActionLoading(false); }
    };

    const handleDisconnectClick = async () => {
        if (confirm('¿Estás seguro de que quieres desconectar de este contacto?')) {
            setIsActionLoading(true);
            try { await onDisconnect(); } finally { setIsActionLoading(false); }
        }
    };

    if (!isOpen) return null;

    const getTimelineIcon = (type: string, category?: string) => {
        if (type === 'achievement') return <Trophy size={14} className="text-amber-500" />;
        if (type === 'project') return <Briefcase size={14} className="text-blue-500" />;
        if (type === 'experience' && category) {
            const cat = EXP_CATEGORY_MAP[category];
            if (cat) {
                const Icon = cat.icon;
                return <Icon size={14} className={cat.color} />;
            }
        }
        return <Sparkles size={14} className="text-indigo-500" />;
    };

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className={`absolute right-0 top-0 h-full w-full md:w-[560px] lg:w-[620px] bg-white shadow-2xl transition-transform duration-300 ease-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-white transition-all shadow-sm"
                >
                    <X size={18} />
                </button>

                {/* Scrollable content */}
                <div className="h-full overflow-y-auto overscroll-contain">
                    {isLoading ? (
                        /* Loading skeleton */
                        <div className="p-6 space-y-6 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-slate-200" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 w-40 bg-slate-200 rounded" />
                                    <div className="h-3 w-56 bg-slate-100 rounded" />
                                    <div className="h-3 w-32 bg-slate-100 rounded" />
                                </div>
                            </div>
                            <div className="h-16 bg-slate-100 rounded-xl" />
                            <div className="space-y-2">
                                <div className="h-3 w-full bg-slate-100 rounded" />
                                <div className="h-3 w-3/4 bg-slate-100 rounded" />
                            </div>
                            <div className="flex gap-2">
                                {[...Array(4)].map((_, i) => <div key={i} className="h-6 w-16 bg-slate-100 rounded-full" />)}
                            </div>
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-lg" />)}
                            </div>
                        </div>
                    ) : profile ? (
                        <div className="pb-32">
                            {/* ── Header ── */}
                            <div className="px-6 pt-6 pb-5 border-b border-slate-100">
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="shrink-0">
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-sm">
                                            {profile.avatar_url ? (
                                                <img
                                                    src={profile.avatar_url}
                                                    alt={profile.full_name || profile.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-500 font-bold text-2xl">
                                                    {(profile.full_name || profile.username).charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <h2 className="text-xl font-bold text-slate-800 truncate">
                                            {profile.full_name || profile.username}
                                        </h2>
                                        {profile.headline && (
                                            <p className="text-sm text-slate-600 line-clamp-2">{profile.headline}</p>
                                        )}
                                        {careerInfo && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-500">
                                                    <GraduationCap size={12} className="text-indigo-400" />
                                                    {careerInfo.name}
                                                </span>
                                                {careerInfo.institution && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400">
                                                        <MapPin size={11} />
                                                        {careerInfo.institution}
                                                    </span>
                                                )}
                                                <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
                                                    {careerInfo.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-4 mt-4">
                                    {projectCount > 0 && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                            <Briefcase size={12} /> {projectCount} proyecto{projectCount !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                    {experienceCount > 0 && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                            <Sparkles size={12} /> {experienceCount} experiencia{experienceCount !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                    {achievementCount > 0 && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                            <Trophy size={12} /> {achievementCount} logro{achievementCount !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* ── Bio ── */}
                            {profile.about && (
                                <div className="px-6 py-5 border-b border-slate-100">
                                    <p className="text-sm text-slate-600 italic leading-relaxed">
                                        &ldquo;{profile.about}&rdquo;
                                    </p>
                                </div>
                            )}

                            {/* ── Timeline Preview ── */}
                            {timeline.length > 0 && (
                                <div className="px-6 py-5 border-b border-slate-100 space-y-3">
                                    <h3 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Trayectoria Reciente
                                    </h3>
                                    <div className="space-y-0">
                                        {timeline.map((item, i) => (
                                            <div key={item.id} className="flex items-start gap-3 py-2.5 group/item">
                                                {/* Timeline line */}
                                                <div className="flex flex-col items-center pt-0.5">
                                                    <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                                        {getTimelineIcon(item.type, item.category)}
                                                    </div>
                                                    {i < timeline.length - 1 && (
                                                        <div className="w-px h-full bg-slate-200 mt-1 min-h-[8px]" />
                                                    )}
                                                </div>
                                                {/* Content */}
                                                <div className="flex-1 min-w-0 pb-1">
                                                    <p className="text-sm font-semibold text-slate-700 truncate">
                                                        {item.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                                                        {item.subtitle && <span className="truncate">{item.subtitle}</span>}
                                                        <span className="shrink-0">· {formatDate(item.date)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Skills ── */}
                            {(hardSkills.length > 0 || softSkills.length > 0) && (
                                <div className="px-6 py-5 border-b border-slate-100 space-y-3">
                                    <h3 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Competencias
                                    </h3>
                                    {hardSkills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {hardSkills.map((skill) => (
                                                <span key={skill} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-mono font-semibold rounded-full border border-indigo-100">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {softSkills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {softSkills.map((skill) => (
                                                <span key={skill} className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-mono font-semibold rounded-full border border-amber-100">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Interests ── */}
                            {profile.interests && profile.interests.length > 0 && (
                                <div className="px-6 py-5 border-b border-slate-100 space-y-3">
                                    <h3 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Intereses
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {profile.interests.map((interest: string) => (
                                            <span key={interest} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-mono rounded-full border border-slate-200">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── View Full Profile Link ── */}
                            <div className="px-6 py-4">
                                <Link
                                    href={`/${profile.username}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    <ExternalLink size={13} />
                                    Ver perfil completo
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-sm text-slate-400">No se encontró el perfil</p>
                        </div>
                    )}
                </div>

                {/* ── Fixed bottom action bar ── */}
                {profile && !isLoading && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 space-y-3">
                        {/* Message input */}
                        {showMessageInput && connectionStatus === 'none' && (
                            <div className="space-y-2">
                                <textarea
                                    value={connectMessage}
                                    onChange={(e) => setConnectMessage(e.target.value)}
                                    placeholder="Escribe un mensaje de presentación (opcional)..."
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    rows={2}
                                    maxLength={280}
                                    autoFocus
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-slate-400">{connectMessage.length}/280</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setShowMessageInput(false); setConnectMessage(''); }}
                                            className="px-3 py-1.5 text-xs font-mono font-bold text-slate-500 hover:text-slate-700 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleConnectClick}
                                            disabled={isActionLoading}
                                            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-full transition-all disabled:opacity-50"
                                        >
                                            <Send size={12} />
                                            {connectMessage ? 'Enviar con mensaje' : 'Conectar sin mensaje'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        {!showMessageInput && (
                            <div className="flex items-center justify-between">
                                <Link
                                    href={`/${profile.username}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors"
                                >
                                    <ExternalLink size={13} />
                                    Perfil Completo
                                </Link>

                                {connectionStatus === 'none' && (
                                    <button
                                        onClick={() => setShowMessageInput(true)}
                                        disabled={isActionLoading}
                                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-full transition-all disabled:opacity-50"
                                    >
                                        <UserPlus size={14} />
                                        Conectar
                                    </button>
                                )}

                                {connectionStatus === 'pending_sent' && (
                                    <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 text-slate-500 text-xs font-mono font-bold uppercase tracking-wider rounded-full cursor-default">
                                        <Clock size={14} />
                                        Solicitud Pendiente
                                    </span>
                                )}

                                {connectionStatus === 'pending_received' && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleRejectClick}
                                            disabled={isActionLoading}
                                            className="inline-flex items-center gap-1 px-3 py-2.5 border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-600 text-xs font-mono font-bold uppercase tracking-wider rounded-full transition-all disabled:opacity-50"
                                        >
                                            <X size={12} />
                                            Ignorar
                                        </button>
                                        <button
                                            onClick={handleAcceptClick}
                                            disabled={isActionLoading}
                                            className="inline-flex items-center gap-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-full transition-all disabled:opacity-50"
                                        >
                                            <Check size={12} />
                                            Aceptar
                                        </button>
                                    </div>
                                )}

                                {connectionStatus === 'connected' && (
                                    <button
                                        onClick={handleDisconnectClick}
                                        disabled={isActionLoading}
                                        className="group/btn inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-mono font-bold uppercase tracking-wider rounded-full transition-all disabled:opacity-50"
                                    >
                                        <Check size={14} className="group-hover/btn:hidden" />
                                        <UserMinus size={14} className="hidden group-hover/btn:block" />
                                        <span className="group-hover/btn:hidden">En tu red</span>
                                        <span className="hidden group-hover/btn:inline">Desconectar</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
