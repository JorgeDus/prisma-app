'use client';

import React, { useState } from 'react';
import { UserPlus, Check, Clock, UserMinus, X, Briefcase, Sparkles, Send } from 'lucide-react';

interface TalentCardProps {
    profile: {
        id: string;
        username: string;
        full_name: string | null;
        headline: string | null;
        about: string | null;
        avatar_url: string | null;
        career_name?: string;
        university_name?: string;
    };
    projectCount: number;
    experienceCount: number;
    connectionStatus: 'none' | 'pending_sent' | 'pending_received' | 'connected';
    connectionMessage?: string | null;
    onConnect: (message?: string) => Promise<void>;
    onAccept: () => Promise<void>;
    onReject: () => Promise<void>;
    onDisconnect: () => Promise<void>;
    onViewProfile?: (username: string) => void;
}

export default function TalentCard({
    profile,
    projectCount,
    experienceCount,
    connectionStatus,
    connectionMessage,
    onConnect,
    onAccept,
    onReject,
    onDisconnect,
    onViewProfile,
}: TalentCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showMessageInput, setShowMessageInput] = useState(false);
    const [message, setMessage] = useState('');
    const [isHoveringConnected, setIsHoveringConnected] = useState(false);

    const totalArtifacts = projectCount + experienceCount;

    const handleConnect = async () => {
        if (showMessageInput) {
            setIsLoading(true);
            try {
                await onConnect(message || undefined);
                setShowMessageInput(false);
                setMessage('');
            } finally {
                setIsLoading(false);
            }
        } else {
            setShowMessageInput(true);
        }
    };

    const handleQuickConnect = async () => {
        setIsLoading(true);
        try {
            await onConnect();
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = async () => {
        setIsLoading(true);
        try {
            await onAccept();
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        setIsLoading(true);
        try {
            await onReject();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
            <div className="flex gap-4">
                {/* Avatar */}
                <div className="shrink-0">
                    <button onClick={() => onViewProfile?.(profile.username)} className="cursor-pointer">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 bg-slate-50">
                            {profile.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.full_name || profile.username}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-xl">
                                    {(profile.full_name || profile.username).charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                    {/* Name & Headline */}
                    <div>
                        <button onClick={() => onViewProfile?.(profile.username)} className="text-left cursor-pointer">
                            <h3 className="font-bold text-lg text-slate-800 hover:text-indigo-600 transition-colors truncate">
                                {profile.full_name || profile.username}
                            </h3>
                        </button>
                        {(profile.career_name || profile.university_name) && (
                            <p className="text-xs font-mono text-slate-500 truncate">
                                {profile.career_name}
                                {profile.career_name && profile.university_name && ' · '}
                                {profile.university_name}
                            </p>
                        )}
                    </div>

                    {/* Bio / Thesis */}
                    {profile.about && (
                        <p className="text-sm text-slate-600 italic line-clamp-1">
                            "{profile.about}"
                        </p>
                    )}

                    {/* Artifacts Count */}
                    {totalArtifacts > 0 && (
                        <div className="flex items-center gap-3 pt-1">
                            {projectCount > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                    <Briefcase size={12} className="text-slate-400" />
                                    {projectCount} proyecto{projectCount !== 1 ? 's' : ''}
                                </span>
                            )}
                            {experienceCount > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                    <Sparkles size={12} className="text-slate-400" />
                                    {experienceCount} experiencia{experienceCount !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Connection Message (for received requests) */}
                    {connectionStatus === 'pending_received' && connectionMessage && (
                        <div className="mt-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                            <p className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-wider mb-1">
                                Mensaje de presentación
                            </p>
                            <p className="text-sm text-slate-700 italic">
                                "{connectionMessage}"
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Message Input (when connecting) */}
            {showMessageInput && connectionStatus === 'none' && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribe un mensaje de presentación (opcional)..."
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        rows={2}
                        maxLength={280}
                    />
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-400">
                            {message.length}/280
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setShowMessageInput(false); setMessage(''); }}
                                className="px-3 py-1.5 text-xs font-mono font-bold text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    setIsLoading(true);
                                    try {
                                        await onConnect(message || undefined);
                                        setShowMessageInput(false);
                                        setMessage('');
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-full transition-all disabled:opacity-50"
                            >
                                <Send size={12} />
                                {message ? 'Enviar con mensaje' : 'Conectar sin mensaje'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {!showMessageInput && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                        onClick={() => onViewProfile?.(profile.username)}
                        className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                        Ver Perfil
                    </button>

                    {connectionStatus === 'none' && (
                        <button
                            onClick={() => setShowMessageInput(true)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded-full transition-all disabled:opacity-50"
                        >
                            <UserPlus size={14} />
                            Conectar
                        </button>
                    )}

                    {connectionStatus === 'pending_sent' && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full cursor-default">
                            <Clock size={14} />
                            Pendiente
                        </span>
                    )}

                    {connectionStatus === 'pending_received' && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleReject}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1 px-3 py-2 border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-600 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full transition-all disabled:opacity-50"
                            >
                                <X size={12} />
                                Ignorar
                            </button>
                            <button
                                onClick={handleAccept}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded-full transition-all disabled:opacity-50"
                            >
                                <Check size={12} />
                                Aceptar
                            </button>
                        </div>
                    )}

                    {connectionStatus === 'connected' && (
                        <button
                            onClick={async () => {
                                if (confirm('¿Estás seguro de que quieres desconectar de este contacto?')) {
                                    setIsLoading(true);
                                    try {
                                        await onDisconnect();
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }
                            }}
                            disabled={isLoading}
                            onMouseEnter={() => setIsHoveringConnected(true)}
                            onMouseLeave={() => setIsHoveringConnected(false)}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full transition-all disabled:opacity-50 ${isHoveringConnected
                                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                        >
                            {isHoveringConnected ? (
                                <>
                                    <UserMinus size={14} />
                                    Desconectar
                                </>
                            ) : (
                                <>
                                    <Check size={14} />
                                    En tu red
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
