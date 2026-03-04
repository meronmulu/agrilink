import React from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BuyerSidebar from "@/components/BuyerSidebar"

export default function BuyerDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            {/* Top Main Navbar */}
            <div className="shrink-0 h-16 w-full">
                <Header />
            </div>

            {/* Dashboard Body */}
            <div className="flex flex-1 pt-4 max-w-7xl h-screen mx-auto w-full sm:px-6 ">

                {/* Sidebar */}
                <BuyerSidebar />

                {/* Main Content Area */}
                <main className="flex-1 pb-16 pl-0 md:pl-6 overflow-hidden">
                    {children}
                </main>

            </div>

            {/* Bottom Main Footer - Can be hidden on dashboard if preferred, but included for consistency as requested */}
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    )
}
