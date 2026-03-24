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
  DollarSign,
  BookOpen,
  Users,
  ShoppingCart,
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
import { createRoleRequest } from "@/services/roleRequestService"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const pathname = usePathname()

  const dashboardRoute =
    user?.role === "FARMER"
      ? "/farmer/crops"
      : user?.role === "BUYER"
      ? "/buyer/overview"
      : "/"

 const handleRoleRequest = async () => {
  try {
    await createRoleRequest();

    toast.success("Role request submitted successfully ");

  } catch (error: any) {
    console.log(error);

    toast.error(error?.message || "Failed to send request");
  }
};

  type NavItem = {
    name: string
    href: string
    icon: React.ElementType
    badge?: number
  }

  const roleNav: Record<string, NavItem[]> = {
    BUYER: [
      { name: "Overview", href: "/buyer/overview", icon: LayoutDashboard },
      { name: "Orders", href: "/buyer/order", icon: ShoppingBag },
      { name: 'Cart', href: '/buyer/cart', icon: ShoppingCart },
      { name: "Messages", href: "/message", icon: MessageSquare, badge: 3 },
      { name: "AI Insights", href: "/buyer/insights", icon: BrainCircuit },
    ],

    FARMER: [
      { name: "My Crops", href: "/farmer/crops", icon: Sprout },
      { name: "Sales", href: "/farmer/sales", icon: DollarSign },
      { name: "Messages", href: "/message", icon: MessageSquare, badge: 5 },
      { name: "AI Insights", href: "/farmer/insights", icon: BrainCircuit },
    ],

    AGENT: [
      { name: "Overview", href: "/agent/dashboard", icon: LayoutDashboard },
      { name: "Register Farmer", href: "/agent/register-farmer", icon: Users },
      // { name: "Training Modules", href: "/agent/training", icon: BookOpen },
    ],

    ADMIN: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "User Management", href: "/admin/user", icon: Users },
      { name: "Products", href: "/admin/products", icon: BookOpen },
      { name: "Agent Approval", href: "/admin/agent-approval", icon: Settings },
      { name: "Categories", href: "/admin/category", icon: Settings },
    ],
  }

  const navItems = user?.role ? roleNav[user.role] || [] : []

  return (
    <header className="w-full fixed h-16 top-0 left-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">

          {/* MOBILE MENU */}
          {user && (
            <div className="block md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
                    <Menu className="w-5 h-5 text-gray-800" />
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
                            isActive
                              ? "bg-emerald-50 text-emerald-800"
                              : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          <Icon
                            size={18}
                            className={cn(
                              isActive
                                ? "text-emerald-600"
                                : "text-gray-400"
                            )}
                          />

                          <span className="flex-1">{item.name}</span>

                          {item.badge && (
                            <span className="bg-emerald-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
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

          {/* LOGO */}
          <div
            className="hidden md:flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Flower2 className="text-white w-5 h-5" />
            </div>

            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
              AgriLink
            </h1>
          </div>
        </div>

        {/* NOT LOGGED IN */}
        {!user && (
          <>
            <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium mx-auto">
              <p className="hover:text-emerald-500 cursor-pointer">
                {t("market")}
              </p>

              <p className="hover:text-emerald-500 cursor-pointer">
                {t("howItWorks")}
              </p>

              <p className="hover:text-emerald-500 cursor-pointer">
                {t("aboutUs")}
              </p>

              <LanguageDropdown />
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Button
                onClick={() => router.push("/login")}
                className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-4 rounded-lg"
              >
                {t("getStarted") || "Get Started"}
              </Button>
            </div>
          </>
        )}

        {/* USER SECTION */}
        {user && (
          <div className="flex items-center gap-4">

            {user.role === "BUYER" && (
              <Button
                onClick={handleRoleRequest}
                className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 rounded-lg"
              >
                Ask to agent
              </Button>
            )}

            <LanguageDropdown />

            {/* USER MENU */}
            <DropdownMenu>

              <DropdownMenuTrigger asChild>
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center cursor-pointer">
                  <UserIcon className="w-4 h-4" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">

                {(user.role === "BUYER" || user.role === "FARMER") && (
                  <DropdownMenuItem asChild>
                    <Link href={dashboardRoute}>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.id}`}>
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 text-red-500"
                >
                  <LogOut size={16} />
                  Logout
                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>

          </div>
        )}

      </div>
    </header>
  )
}