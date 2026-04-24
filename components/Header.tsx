'use client'

import React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "./ui/button"
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
  Store
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

export default function Header() {
  const { user, logout, loading } = useAuth()

  const router = useRouter()
  const { t } = useLanguage()
  const pathname = usePathname()
  const { cartCount } = useCart()
  const { unreadCount } = useMessage()

  if (loading) return null

  const dashboardRoute =
    user?.role === "FARMER"
      ? "/farmer/crops"
      : user?.role === "BUYER"
        ? "/buyer/order"
        : "/"

  const handleRoleRequest = () => {
    router.push("/ask-request")
  }

  type NavItem = {
    name: string
    href: string
    icon: React.ElementType
    badge?: number
  }

  const roleNav: Record<string, NavItem[]> = {
    BUYER: [
      { name: t('orders') || "Orders", href: "/buyer/order", icon: ShoppingBag },
      { name: t('cart') || 'Cart', href: '/cart', icon: ShoppingCart, badge: cartCount },
      { name: t('messages') || "Messages", href: "/message", icon: MessageSquare, badge: unreadCount },
      { name: "Market Price ", href: "/buyer/insights", icon: BrainCircuit },
    ],
    FARMER: [
      { name: t('my_crops') || 'My Crops', href: '/farmer/crops', icon: Sprout },
      { name: t('my_orders') || 'My Orders', href: '/farmer/orders', icon: ListOrdered },
      { name: t('cart') || 'Cart', href: '/cart', icon: ShoppingCart, badge: cartCount },
      { name: t('messages') || 'Messages', href: '/message', icon: MessageSquare, badge: unreadCount },
      { name:  'Market Price', href: '/farmer/insights', icon: BrainCircuit },
    ],
    AGENT: [
      { name: t('farmers') || 'Farmers', href: '/agent/farmer', icon: Users },
      { name: t('nav_orders') || 'Orders', href: '/agent/order', icon: ListOrdered },
      { name: t('cart') || 'Cart', href: '/cart', icon: ShoppingCart, badge: cartCount },
      { name: t('nav_message') || 'Messages', href: '/message', icon: MessageSquare, badge: unreadCount },
      { name: 'Market Place', href: '/MarketInsight', icon: Store },
      { name:  'Market Price', href: '/farmer/insights', icon: BrainCircuit },

    ],
    ADMIN: [
      { name: t('dashboard') || "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: t('user_management') || "User Management", href: "/admin/user", icon: Users },
      { name: t('products') || "Products", href: "/admin/products", icon: Sprout },
      { name: t('categories') || "Categories", href: "/admin/category", icon: Settings },
      { name: 'Market Place', href: '/MarketPlace', icon: Store },
      { name: t('cart') || 'Cart', href: '/cart', icon: ShoppingCart, badge: cartCount },
      { name: t('nav_message') || 'Messages', href: '/message', icon: MessageSquare, badge: unreadCount },
      { name:  'Market Price', href: '/farmer/insights', icon: BrainCircuit },


    ],
  }

  const navItems = user?.role ? roleNav[user.role] || [] : []

  return (
    <header className="w-full fixed h-16 top-0 left-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-1 flex items-center justify-between">

        {/* LEFT SIDE */}
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
                    const isActive = pathname.startsWith(item.href)
                    const Icon = item.icon
                    return (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 w-full px-2 py-2 rounded-lg",
                            isActive ? "bg-emerald-50 text-emerald-800" : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          <Icon size={18} />
                          <span className="flex-1">{item.name}</span>
                          {!!item.badge && item.badge > 0 && (
                            <span className="bg-emerald-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <div className="hidden md:flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Flower2 className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-semibold">AgriLink</h1>
          </div>
        </div>

        {/* GUEST */}
        {!user && (
          <>
            <nav className="hidden md:flex items-center gap-6 mx-auto">
              <p>{t("market")}</p>
              <p>{t("howItWorks")}</p>
              <p>{t("aboutUs")}</p>
              <LanguageDropdown />
            </nav>

            <div className="flex items-center gap-3">
              <Button className="bg-linear-to-r from-emerald-600 to-teal-600
                  hover:from-emerald-700 hover:to-teal-700 text-white" onClick={() => router.push("/login")}>
                {t("getStarted") || "Get Started"}
              </Button>
            </div>
          </>
        )}

        {/* USER */}
        {user && (
          <div className="flex items-center gap-4">
            {user.role === "BUYER" && (
              <Button className="bg-linear-to-r from-emerald-600 to-teal-600
                  hover:from-emerald-700 hover:to-teal-700 text-white" onClick={handleRoleRequest}>
                Request Role
              </Button>
            )}
            <div
              className="relative cursor-pointer p-2 rounded-lg hover:bg-gray-100"
              onClick={() =>
                router.push(
                  "/cart"
                )
              }
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />

              {/* Badge */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            <LanguageDropdown />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-emerald-500 flex items-center justify-center">
                    {user.profile?.imageUrl ? (
                      <Image src={user.profile.imageUrl} alt="Profile" fill className="object-cover" />
                    ) : (
                      <UserIcon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="hidden sm:block text-sm leading-4 text-gray-800 dark:text-white">
                    <p className="font-medium">
                      {user?.profile?.fullName
                        ? user.profile.fullName.charAt(0).toUpperCase() +
                        user.profile.fullName.slice(1).toLowerCase()
                        : 'User'}
                    </p>

                    <p className="text-emerald-600 text-xs capitalize">
                      {user?.role?.toLowerCase() || 'user'}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                {(user.role === "BUYER" || user.role === "FARMER") && (
                  <DropdownMenuItem asChild>
                    <Link href={dashboardRoute}>{t('dashboard') || 'Dashboard'}</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.id}`}>{t('profile') || 'Profile'}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-red-500">
                  <LogOut size={16} />
                  {t('logout') || 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  )
}