'use client'

import React from 'react'
import { Search, Bell, Globe } from 'lucide-react'
import { Input } from './ui/input'
import Image from 'next/image'

export default function FarmerHeader() {
    return (
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-8 shrink-0">

            {/* Search Bar - Hidden on small screens */}
            <div className="hidden md:flex relative max-w-md w-full ml-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                    type="text"
                    placeholder="Search orders, buyers..."
                    className="pl-10 h-10 w-full bg-gray-50 border-gray-200 focus:bg-white focus:ring-emerald-500/20 rounded-lg"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-auto">
                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell size={20} />
                    {/* Notification Dot */}
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <span className="hidden md:inline-block font-medium text-sm text-gray-700">Marketplace</span>

                <button className="flex items-center gap-1.5 p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors font-medium text-sm">
                    <Globe size={18} className="text-gray-500" />
                    <span>EN</span>
                </button>

                {/* Profile Avatar */}
                <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-green-500 hover:ring-2 hover:ring-green-500/30 transition-shadow">
                    <Image
                        src="https://images.unsplash.com/photo-1595804562098-b807df4567ac?q=80&w=2071&auto=format&fit=crop"
                        alt="Farmer Profile"
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                    />
                </button>
            </div>
        </header>
    )
}
