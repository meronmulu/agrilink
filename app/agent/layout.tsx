import React from 'react'
import AgentSidebar from '@/components/AgentSidebar'

export default function AgentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-gray-50 flex-col md:flex-row mt-16 pb-16 md:pb-0">
            {/* Sidebar (desktop) */}
            <div className="hidden md:block">
                <AgentSidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8 h-full">
                    {children}
                </div>
            </main>

            {/* Mobile Nav could be added here later */}
        </div>
    )
}
