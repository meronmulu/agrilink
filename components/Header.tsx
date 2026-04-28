'use client'

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Flower2,
  LogOut,
  UserIcon,
  Menu,
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  BrainCircuit,
  Settings,
  Sprout,
  Users,
  ShoppingCart,
  ListOrdered,
  Store,
  Bell
} from "lucide-react"

import LanguageDropdown from "./LanguageDropdown"
import { useLanguage } from "@/context/LanguageContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/CartContext"
import { useMessage } from "@/context/MessageContext"
import Image from "next/image"

import {
  getNewNotifications,
  getNotifications,
  markNotificationRead
} from "@/services/notificationService"

import { NotificationPayload } from "@/types/notification"

export default function Header() {
  const { user, logout, loading } = useAuth()

  const router = useRouter()
  const { t } = useLanguage()
  const pathname = usePathname()
  const { cartCount } = useCart()
  const { unreadCount } = useMessage()

  const [notifications, setNotifications] = useState<NotificationPayload[]>([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  /* =========================
     LOAD NEW NOTIFICATIONS (BADGE)
  ========================= */
  const loadUnreadNotifications = async () => {
    try {
      const data = await getNewNotifications()
      setUnreadNotifications(data?.length || 0)
    } catch (err) {
      console.log("new notifications error:", err)
    }
  }

  /* =========================
     LOAD ALL NOTIFICATIONS
  ========================= */
  const loadNotifications = async () => {
    try {
      const res = await getNotifications()
      const data = Array.isArray(res) ? res : []

      setNotifications(data)

      const unreadItems = data.filter((n) => !n.isRead)

      if (unreadItems.length > 0) {
        await Promise.all(
          unreadItems.map((item) => markNotificationRead(item.id))
        )
      }
    } catch (err) {
      console.error("Error loading notifications:", err)
    }
  }

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    if (user) {
      loadNotifications()
      loadUnreadNotifications()
    }
  }, [user])

  if (loading) return null

  const dashboardRoute =
    user?.role === "FARMER"
      ? "/farmer/crops"
      : user?.role === "BUYER"
        ? "/buyer/order"
        : "/"

  const role = user?.role
    ? roleCharFormat(user.role)
    : ""

  function roleCharFormat(role: string) {
    const lower = role.toLowerCase()
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  }

  const roleNav: Record<string, any[]> = {
    BUYER: [
      { name: t('orders') || "Orders", href: "/buyer/order", icon: ShoppingBag },
      { name: t('cart') || 'Cart', href: '/cart', icon: ShoppingCart, badge: cartCount },
      { name: t('messages') || "Messages", href: "/message", icon: MessageSquare, badge: unreadCount },
      { name: t('market_price'), href: "/buyer/insights", icon: BrainCircuit },
    ],
    FARMER: [
      { name: t('my_crops'), href: '/farmer/crops', icon: Sprout },
      { name: t('my_orders'), href: '/farmer/orders', icon: ListOrdered },
      { name: t('cart'), href: '/cart', icon: ShoppingCart, badge: cartCount },
      { name: t('messages'), href: '/message', icon: MessageSquare, badge: unreadCount },
      { name: 'Market Price', href: '/farmer/insights', icon: BrainCircuit },
    ],
    ADMIN: [
      { name: t('dashboard'), href: "/admin/dashboard", icon: LayoutDashboard },
      { name: t('user_management'), href: "/admin/user", icon: Users },
      { name: t('products'), href: "/admin/products", icon: Sprout },
      { name: t('categories'), href: "/admin/category", icon: Settings },
      { name: t('cart'), href: '/cart', icon: ShoppingCart, badge: cartCount },
      { name: t('messages'), href: '/message', icon: MessageSquare, badge: unreadCount },
      { name: 'Market Price', href: '/farmer/insights', icon: BrainCircuit },
    ],
  }

  const navItems = user?.role ? roleNav[user.role] || [] : []

  return (
    <header className="w-full fixed h-16 top-0 left-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-1 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="block md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <Menu className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-56 ml-4">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname.startsWith(item.href)

                    return (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 w-full px-2 py-2 rounded-lg",
                            isActive ? "bg-emerald-50 text-emerald-800" : "text-gray-600"
                          )}
                        >
                          <Icon size={18} />
                          <span className="flex-1">{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <div
            className="hidden md:flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Flower2 className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-semibold">AgriLink</h1>
          </div>
        </div>

        {/* RIGHT */}
        {user && (
          <div className="flex items-center gap-4">

            {/* CART */}
            <div
              className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            {/* NOTIFICATIONS */}
            <div
              onClick={() => router.push("/notification")}
              className="relative cursor-pointer p-2 hover:bg-emerald-50 rounded-lg"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </div>

            <LanguageDropdown />

            {/* PROFILE */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">

                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-emerald-500 flex items-center justify-center">
                    {user.profile?.imageUrl ? (
                      <Image
                        src={user.profile.imageUrl}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <UserIcon className="w-5 h-5 text-white" />
                    )}
                  </div>

                  <div className="hidden md:flex flex-col leading-tight">
                    <span className="text-sm font-medium">
                      {user.profile?.fullName || "User"}
                    </span>
                    <span className="text-xs text-emerald-700">
                      {role}
                    </span>
                  </div>

                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href={dashboardRoute}>{t('dashboard')}</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.id}`}>{t('profile')}</Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={logout} className="text-red-500 flex gap-2">
                  <LogOut size={16} />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  )
}