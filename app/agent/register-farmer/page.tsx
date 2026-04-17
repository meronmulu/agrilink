'use client'

import AgentFarmerRegistration from '@/components/AgentFarmerRegistration'
import { useLanguage } from '@/context/LanguageContext'

export default function RegisterFarmerPage() {
    const { t } = useLanguage()
    
    return (
        
        <div className="min-h-screen flex flex-col items-center justify-start md:justify-center bg-gray-50 p-4 md:p-8 pt-8 md:pt-4">
            
            {/* Card */}
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {t('registration_farmer') || 'Registration Farmer'}
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Please fill in the details below to create a new farmer account.
                    </p>
                </div>

                {/* Content */}
                <div className="w-full">
                    <AgentFarmerRegistration />
                </div>

            </div>

            <div className="h-10 md:hidden" />
        </div>
    )
}