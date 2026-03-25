import React from "react"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function FarmerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
            // <ProtectedRoute roles={ ["AGENT"]}>
        
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
                    <main className="flex-1 overflow-y-auto p-7 ">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        //    </ProtectedRoute>

    )
}
