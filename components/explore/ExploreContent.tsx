'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Search, Users, UserCheck, Bell, Compass } from 'lucide-react';
import TalentCard from './TalentCard';
import { Connection } from '@/types/database.types';

interface ProfileWithCounts {
    id: string;
    username: string;
    full_name: string | null;
    headline: string | null;
    about: string | null;
    avatar_url: string | null;
    career_name?: string;
    university_name?: string;
    project_count: number;
    experience_count: number;
    skills: string[];
}

interface ExploreContentProps {
    currentUserId: string;
    currentUserName: string;
    profiles: ProfileWithCounts[];
    connections: Connection[];
}

type TabType = 'discover' | 'network' | 'requests';

export default function ExploreContent({
    currentUserId,
    currentUserName,
    profiles,
    connections: initialConnections,
}: ExploreContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('discover');
    const [connections, setConnections] = useState(initialConnections);

    // Read tab from URL query params
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'solicitudes') {
            setActiveTab('requests');
        } else if (tabParam === 'red') {
            setActiveTab('network');
        }
    }, [searchParams]);

    // Helper to get connection status for a profile
    const getConnectionStatus = useCallback((profileId: string): 'none' | 'pending_sent' | 'pending_received' | 'connected' => {
        const connection = connections.find(
            c => (c.sender_id === currentUserId && c.receiver_id === profileId) ||
                (c.receiver_id === currentUserId && c.sender_id === profileId)
        );

        if (!connection) return 'none';

        if (connection.status === 'accepted') return 'connected';

        if (connection.status === 'pending') {
            if (connection.sender_id === currentUserId) return 'pending_sent';
            return 'pending_received';
        }

        return 'none';
    }, [connections, currentUserId]);

    // Helper to get the message from a received connection request
    const getConnectionMessage = useCallback((profileId: string): string | null => {
        const connection = connections.find(
            c => c.sender_id === profileId && c.receiver_id === currentUserId && c.status === 'pending'
        );
        return connection?.message || null;
    }, [connections, currentUserId]);

    // Filter profiles based on search query
    const filteredProfiles = useMemo(() => {
        if (!searchQuery.trim()) return profiles;

        const query = searchQuery.toLowerCase();
        return profiles.filter(profile => {
            const nameMatch = profile.full_name?.toLowerCase().includes(query) ||
                profile.username.toLowerCase().includes(query);
            const careerMatch = profile.career_name?.toLowerCase().includes(query);
            const universityMatch = profile.university_name?.toLowerCase().includes(query);
            const skillsMatch = profile.skills.some(skill => skill.toLowerCase().includes(query));
            const headlineMatch = profile.headline?.toLowerCase().includes(query);

            return nameMatch || careerMatch || universityMatch || skillsMatch || headlineMatch;
        });
    }, [profiles, searchQuery]);

    // Get profiles for each tab
    const discoverProfiles = useMemo(() => {
        return filteredProfiles.filter(p => {
            const status = getConnectionStatus(p.id);
            return status !== 'connected';
        });
    }, [filteredProfiles, getConnectionStatus]);

    const networkProfiles = useMemo(() => {
        return profiles.filter(p => getConnectionStatus(p.id) === 'connected');
    }, [profiles, getConnectionStatus]);

    const requestProfiles = useMemo(() => {
        return profiles.filter(p => getConnectionStatus(p.id) === 'pending_received');
    }, [profiles, getConnectionStatus]);

    // Connection actions
    const handleConnect = async (receiverId: string, message?: string) => {
        const { data, error } = await supabase
            .from('connections')
            .insert({
                sender_id: currentUserId,
                receiver_id: receiverId,
                status: 'pending',
                message: message || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Error sending connection:', error);
            alert('Error al enviar la solicitud');
            return;
        }

        setConnections(prev => [...prev, data]);

        // Send email notification (fire and forget, don't block UI)
        fetch('/api/connections/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                receiverId,
                senderId: currentUserId,
                senderName: currentUserName,
                message: message || undefined,
            }),
        }).catch(err => console.error('Error sending notification:', err));
    };

    const handleAccept = async (senderId: string) => {
        const connection = connections.find(
            c => c.sender_id === senderId && c.receiver_id === currentUserId
        );

        if (!connection) return;

        const { error } = await supabase
            .from('connections')
            .update({ status: 'accepted' })
            .eq('id', connection.id);

        if (error) {
            console.error('Error accepting connection:', error);
            alert('Error al aceptar la solicitud');
            return;
        }

        setConnections(prev =>
            prev.map(c => c.id === connection.id ? { ...c, status: 'accepted' as const } : c)
        );
    };

    const handleReject = async (senderId: string) => {
        const connection = connections.find(
            c => c.sender_id === senderId && c.receiver_id === currentUserId
        );

        if (!connection) return;

        const { error } = await supabase
            .from('connections')
            .delete()
            .eq('id', connection.id);

        if (error) {
            console.error('Error rejecting connection:', error);
            alert('Error al rechazar la solicitud');
            return;
        }

        setConnections(prev => prev.filter(c => c.id !== connection.id));
    };

    const handleDisconnect = async (profileId: string) => {
        const connection = connections.find(
            c => (c.sender_id === currentUserId && c.receiver_id === profileId) ||
                (c.receiver_id === currentUserId && c.sender_id === profileId)
        );

        if (!connection) return;

        const { error } = await supabase
            .from('connections')
            .delete()
            .eq('id', connection.id);

        if (error) {
            console.error('Error disconnecting:', error);
            alert('Error al desconectar');
            return;
        }

        setConnections(prev => prev.filter(c => c.id !== connection.id));
    };

    const currentProfiles = activeTab === 'discover' ? discoverProfiles :
        activeTab === 'network' ? networkProfiles :
            requestProfiles;

    const tabs = [
        { id: 'discover' as TabType, label: 'Descubrir', icon: Compass, count: discoverProfiles.length },
        { id: 'network' as TabType, label: 'Mi Red', icon: UserCheck, count: networkProfiles.length },
        { id: 'requests' as TabType, label: 'Solicitudes', icon: Bell, count: requestProfiles.length },
    ];

    return (
        <div className="space-y-8">
            {/* Search Header */}
            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={20} className="text-slate-400" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre, carrera o habilidades..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-base font-mono placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-mono font-bold uppercase tracking-wider transition-all ${isActive
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${isActive
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-slate-200 text-slate-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Profiles Grid */}
            {currentProfiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentProfiles.map((profile) => (
                        <TalentCard
                            key={profile.id}
                            profile={profile}
                            projectCount={profile.project_count}
                            experienceCount={profile.experience_count}
                            connectionStatus={getConnectionStatus(profile.id)}
                            connectionMessage={getConnectionMessage(profile.id)}
                            onConnect={(message) => handleConnect(profile.id, message)}
                            onAccept={() => handleAccept(profile.id)}
                            onReject={() => handleReject(profile.id)}
                            onDisconnect={() => handleDisconnect(profile.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                        <Users size={24} className="text-slate-400" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-700">
                            {activeTab === 'discover' && (searchQuery ? 'Sin resultados' : 'No hay perfiles disponibles')}
                            {activeTab === 'network' && 'Tu red está vacía'}
                            {activeTab === 'requests' && 'Aún no hay conexiones pendientes'}
                        </h3>
                        <p className="text-sm text-slate-500 max-w-sm mx-auto">
                            {activeTab === 'discover' && (searchQuery ? 'Intenta con otros términos de búsqueda' : 'El talento que buscas está a un paso')}
                            {activeTab === 'network' && 'El talento que buscas está a un paso. Comienza a conectar con otros profesionales.'}
                            {activeTab === 'requests' && 'Cuando alguien te envíe una solicitud, aparecerá aquí.'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
