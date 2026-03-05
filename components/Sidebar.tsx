'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, MessageSquare, BrainCircuit, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
    const pathname = usePathname()

    const navItems = [
        { name: 'Overview', href: '/buyer/overview', icon: LayoutDashboard },
        { name: 'Orders', href: '/buyer/order', icon: ShoppingBag },
        { name: 'Messages', href: '/message', icon: MessageSquare, badge: 3 },
        { name: 'AI Insights', href: '/buyer/insights', icon: BrainCircuit },
        { name: 'Settings', href: '/buyer/settings', icon: Settings },
    ]

    return (
        <aside className="w-64 border-r border-gray-200 bg-white hidden md:flex flex-col h-full shrink-0 pt-6">
            <div className="px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors cursor-pointer",
                                isActive
                                    ? "bg-emerald-50 text-emerald-800"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"
                            )}
                        >
                            <Icon size={20} className={cn("shrink-0", isActive ? "text-emerald-600" : "text-gray-400")} />
                            <span className="flex-1">{item.name}</span>
                            {item.badge && (
                                <span className="bg-emerald-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </div>
        </aside>
    )
}
