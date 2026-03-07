'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, BookOpen, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AgentSidebar() {
    const pathname = usePathname()

    const navItems = [
        { name: 'Overview', href: '/Agent/dashboard', icon: LayoutDashboard },
        { name: 'Register Farmer', href: '/Agent/register-farmer', icon: Users },
        { name: 'Training Modules', href: '/Agent/training', icon: BookOpen },
        { name: 'Settings', href: '/Agent/settings', icon: Settings },
    ]

    return (
        <aside className="w-64 border-r border-gray-200 bg-white hidden md:flex flex-col h-full shrink-0 pt-6">
            <div className="px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/agent/dashboard' && pathname.startsWith(item.href))
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
                        </Link>
                    )
                })}
            </div>
        </aside>
    )
}
