import React from "react"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import ProtectedRoute from "@/components/ProtectedRoute"
import Footer from "@/components/Footer"

export default function BuyerDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
    <ProtectedRoute roles={ ["BUYER"]}>
        <div className="flex flex-col min-h-screen bg-gray-50">
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
                    <div className="max-w-7xl mx-auto min-h-[calc(100vh-16rem)]">
                        {children}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    </ProtectedRoute>
    )
}
