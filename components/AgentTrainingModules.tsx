'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { BookOpen, Video, FileText, Download, Calendar, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

// Mock Data
const modules = [
    {
        id: 1,
        title: 'Modern Irrigation Techniques',
        category: 'Water Management',
        type: 'Video',
        duration: '45 mins',
        farmersTrained: 120,
        icon: Video,
        color: 'text-blue-500',
        bg: 'bg-blue-50'
    },
    {
        id: 2,
        title: 'Soil Health Assessment Basics',
        category: 'Agronomy',
        type: 'Interactive Guide',
        duration: '1.5 hrs',
        farmersTrained: 85,
        icon: BookOpen,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50'
    },
    {
        id: 3,
        title: 'Pest Control Best Practices',
        category: 'Crop Protection',
        type: 'Document',
        duration: '30 mins',
        farmersTrained: 210,
        icon: FileText,
        color: 'text-amber-500',
        bg: 'bg-amber-50'
    },
    {
        id: 4,
        title: 'Using the AgriLink System',
        category: 'Technology',
        type: 'Video',
        duration: '20 mins',
        farmersTrained: 350,
        icon: Video,
        color: 'text-purple-500',
        bg: 'bg-purple-50'
    }
]

export default function AgentTrainingModules() {
    const { t } = useLanguage()
    const [searchTerm, setSearchTerm] = useState('')

    const filteredModules = modules.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('training_modules') || 'Training Modules'}</h2>
                    <p className="text-slate-500 mt-1">{t('access_materials_desc') || 'Access materials to facilitate farmer training sessions.'}</p>
                </div>

                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                    <Calendar size={18} />
                    {t('schedule_session') || 'Schedule Session'}
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                    type="text"
                    placeholder={t('search_modules') || "Search modules..."}
                    className="pl-10 h-11"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map((module) => {
                    const Icon = module.icon
                    return (
                        <Card key={module.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`p-3 rounded-lg ${module.bg} ${module.color}`}>
                                        <Icon size={24} />
                                    </div>
                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                                        {module.type}
                                    </span>
                                </div>
                                <CardTitle className="text-lg">{module.title}</CardTitle>
                                <CardDescription>{module.category}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={16} className="text-gray-400" />
                                        {module.duration}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users size={16} className="text-gray-400" />
                                        {module.farmersTrained} {t('trained') || 'trained'}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0 border-t border-gray-100 mt-4 flex justify-between items-center">
                                <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 mt-4">
                                    {t('view_materials') || 'View Materials'}
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full mt-4 transition-colors">
                                    <Download size={18} />
                                </button>
                            </CardFooter>
                        </Card>
                    )
                })}

                {filteredModules.length === 0 && (
                    <div className="col-span-full py-12 text-center">
                        <p className="text-gray-500">No training modules found for "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    )
}
