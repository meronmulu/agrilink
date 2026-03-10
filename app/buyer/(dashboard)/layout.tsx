import React from "react"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"

export default function BuyerDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Top Navbar */}
            <div className="flex items-center h-16 shrink-0 border-b border-gray-200 bg-white">
                <div className="flex-1">
                    <Header />
                </div>
            </div>
            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Page Content Scrollable */}
                <main className="flex-1 overflow-y-auto ">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
