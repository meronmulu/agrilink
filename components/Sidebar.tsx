// components/Sidebar.tsx
'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, BrainCircuit, Settings, Sprout, BookOpen, Users, ShoppingCart, ListOrdered, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useMessage } from '@/context/MessageContext'
import { useLanguage } from '@/context/LanguageContext'

type NavItem = {
  name: string
  href: string
  icon: React.ElementType
  badge?: number
}

export default function Sidebar() {
  const pathname = usePathname()
  const { cartCount } = useCart()
  const { unreadCount, markAsRead } = useMessage()
  const { user } = useAuth()
  const { t } = useLanguage()

  // Clear the message badge whenever the user navigates to the message page
  useEffect(() => {
    if (pathname === '/message') {
      markAsRead()
    }
  }, [pathname, markAsRead])

  const roleNav: Record<string, NavItem[]> = {
    BUYER: [
      { name: t('nav_orders') || 'Orders', href: '/buyer/order', icon: ListOrdered },
      { name: t('cart') || 'Cart', href: '/cart', icon: ShoppingCart, badge: cartCount },
      { name: t('nav_message') || 'Messages', href: '/message', icon: MessageSquare, badge: unreadCount },
      { name: t('nav_market_insight') || 'Market Insights', href: '/buyer/insights', icon: BrainCircuit },
    ],

    FARMER: [
      { name: t('my_crops') || 'My Crops', href: '/farmer/crops', icon: Sprout },
      { name: t('my_orders') || 'My Orders', href: '/farmer/orders', icon: ListOrdered },
      { name: t('cart') || 'Cart', href: '/cart', icon: ShoppingCart, badge: cartCount },
      { name: t('nav_message') || 'Messages', href: '/message', icon: MessageSquare, badge: unreadCount },
      { name: t('nav_market_insight') || 'Market Insights', href: '/farmer/insights', icon: BrainCircuit },
    ],

    AGENT: [
      { name: t('dashboard') || 'Dashboard', href: '/agent/dashboard', icon: LayoutDashboard },
      { name: t('farmers') || 'Farmers', href: '/agent/farmer', icon: Users },
      { name: t('nav_orders') || 'Orders', href: '/agent/order', icon: ListOrdered },
      { name: t('nav_message') || 'Messages', href: '/message', icon: MessageSquare, badge: unreadCount },
      { name: t('nav_marketplace') || 'Market Place', href: '/agent', icon: Store },

    ],

    ADMIN: [
      { name: t('dashboard') || 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: t('user_management') || 'User Management', href: '/admin/user', icon: Users },
      { name: t('products') || 'Products', href: '/admin/products', icon: BookOpen },
      { name: t('agent_approval') || 'Agent Approval', href: '/admin/agent-approval', icon: Settings },
      { name: t('categories') || 'Categories', href: '/admin/catagory', icon: Settings },
    ],
  }

  const navItems = roleNav[user?.role as keyof typeof roleNav] || []

  return (
    <aside className="w-64 h-full border-r border-gray-200 bg-white hidden md:flex flex-col pt-6">
      <div className="px-4 space-y-2">
        {navItems.map((item) => {
          const isActive =
            item.href === '/agent'
              ? pathname === '/agent'
              : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"
              )}
            >
              <Icon
                size={20}
                className={cn(
                  "shrink-0",
                  isActive ? "text-emerald-600" : "text-gray-400"
                )}
              />

              <span className="flex-1">{item.name}</span>

              {/* Show badge if count is > 0 */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className={cn(
                  "bg-emerald-500 text-white text-xs font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full",
                  // Logic: If this is the message link AND we are currently on the message page, hide it
                  (item.href === '/message' && pathname === '/message') ? "hidden" : "flex"
                )}>
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