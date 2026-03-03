import React from "react"
import FarmerHeader from "@/components/FarmerHeader"
import FarmerSidebar from "@/components/FarmerSidebar"
import Link from "next/link"

export default function FarmerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Top Navbar */}
            <div className="flex items-center h-16 shrink-0 border-b border-gray-200 bg-white">
                {/* Brand Logo area (matches sidebar width) */}
                <div className="w-64 shrink-0 px-6 flex items-center h-full">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center transform hover:rotate-12 transition-transform">
                            <span className="text-white font-bold text-xl leading-none">A</span>
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-gray-900">
                            Agri<span className="text-emerald-600">Link</span>
                        </span>
                    </Link>
                </div>

                {/* Header fills the rest */}
                <div className="flex-1">
                    <FarmerHeader />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <FarmerSidebar />

                {/* Page Content Scrollable */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
