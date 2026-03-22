'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, LayoutDashboard, Brain, PieChart } from 'lucide-react'
import GeneralTab from './tabs/GeneralTab'
import ContentTab from './tabs/ContentTab'
import SkillsTab from './tabs/SkillsTab'
import DataGrid from './DataGrid'

export default function DashboardInteractive({ university, stats }: any) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [activeTab, setActiveTab] = useState<'general' | 'content' | 'skills'>('general')
    const [selectedCareer, setSelectedCareer] = useState<string>(searchParams.get('career') || '')
    const [selectedCohort, setSelectedCohort] = useState<string>(searchParams.get('cohort') || '')

    // Actualiza URL en base a los filtros
    const handleFilterChange = (type: 'career' | 'cohort', value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (value) {
            params.set(type, value)
        } else {
            params.delete(type)
        }
        
        // Actualiza el estado local también para evitar desfases
        if(type === 'career') setSelectedCareer(value)
        if(type === 'cohort') setSelectedCohort(value)

        // Navega a la nueva URL (refresh silencioso gracias a Next App Router)
        router.push(`/university?${params.toString()}`)
    }
    
    return (
        <div className="space-y-6">
            {/* Header Identity */}
            <div className="flex items-center gap-4">
                {university?.logo_url && (
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                        <Image
                            src={university.logo_url.startsWith('http') ? university.logo_url : (university.logo_url.startsWith('/') ? university.logo_url : `/${university.logo_url}`)}
                            alt={university.name || 'Universidad'}
                            width={56}
                            height={56}
                            className="object-contain w-full h-full"
                        />
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{university?.name || 'Portal Institucional'}</h1>
                    <p className="text-sm text-slate-500">
                        Centro de Inteligencia y Control de Datos
                    </p>
                </div>
            </div>

            {/* Global Filters & Tabs Bar */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Headers / Filtros */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-center justify-between">
                     <div className="flex items-center gap-2">
                         <Filter size={18} className="text-indigo-500" />
                         <span className="text-sm font-semibold text-slate-700">Filtros Globales:</span>
                     </div>
                     <div className="flex flex-wrap gap-3">
                         <select 
                            className="text-sm border-slate-200 rounded-lg text-slate-700 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                            value={selectedCareer}
                            onChange={e => handleFilterChange('career', e.target.value)}
                         >
                            <option value="">Todas las Carreras</option>
                            {stats.filterOptions?.careers?.map((c: string) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                         </select>

                         <select 
                            className="text-sm border-slate-200 rounded-lg text-slate-700 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                            value={selectedCohort}
                            onChange={e => handleFilterChange('cohort', e.target.value)}
                         >
                            <option value="">Todas las Cohortes</option>
                            {stats.filterOptions?.cohorts?.map((c: string) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                         </select>
                     </div>
                </div>

                {/* Tabs Nav */}
                <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
                    <TabButton 
                        active={activeTab === 'general'} 
                        onClick={() => setActiveTab('general')}
                        icon={LayoutDashboard}
                        label="Vista General"
                    />
                    <TabButton 
                        active={activeTab === 'content'} 
                        onClick={() => setActiveTab('content')}
                        icon={PieChart}
                        label="Producción y Brechas"
                    />
                    <TabButton 
                        active={activeTab === 'skills'} 
                        onClick={() => setActiveTab('skills')}
                        icon={Brain}
                        label="Competencias"
                    />
                </div>
            </div>

            {/* Tab Content */}
            <div className="pt-2">
                {activeTab === 'general' && <GeneralTab stats={stats} />}
                {activeTab === 'content' && <ContentTab stats={stats} />}
                {activeTab === 'skills' && <SkillsTab stats={stats} />}
            </div>

            {/* DataGrid interactiva cruzada */}
            {stats.deepDiveData && stats.deepDiveData.length > 0 && (
                <div className="pt-8">
                    <DataGrid data={stats.deepDiveData} />
                </div>
            )}
        </div>
    )
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                active 
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
        >
            <Icon size={18} className={active ? 'text-indigo-600' : 'text-slate-400'} />
            {label}
        </button>
    )
}
