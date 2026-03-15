'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { Flower2, LogOut, UserIcon } from "lucide-react";
import LanguageDropdown from "./LanguageDropdown";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "@/context/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { createRoleRequest } from "@/services/roleRequestService";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const dashboardRoute =
    user?.role === "FARMER"
      ? "/farmer/crops"
      : user?.role === "BUYER"
        ? "/buyer/overview"
        : "/";

  const handleRoleRequest = async () => {
    try {
      const res = await createRoleRequest()
      console.log("Request sent:", res)
      alert("Role request submitted successfully")
    } catch (error) {
    console.log(error)
      alert("Failed to send request")
    }
  }


  return (
    <header className="w-full fixed h-16 top-0 left-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

        {/* Logo - always visible */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Flower2 className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">AgriLink</h1>
        </div>

        {/* Navigation - ONLY if NOT logged in */}
        {!user && (
          <>
            <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium mx-auto">
              <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                {t("market")}
              </p>
              <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                {t("howItWorks")}
              </p>
              <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                {t("aboutUs")}
              </p>
              <LanguageDropdown />
              {/* <ThemeToggle /> */}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Button
                onClick={() => router.push("/login")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 rounded-lg"
              >
                {t("getStarted") || "Get Started"}
              </Button>
            </div>
          </>
        )}

        {/* Authenticated User Section */}
        {user && (
          <div className="flex items-center gap-4">


            {user?.role === "BUYER" && (
              <Button
                onClick={handleRoleRequest}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 rounded-lg"
              >
                Ask to agent
              </Button>
            )}




            <LanguageDropdown />
            {/* <ThemeToggle /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-medium text-sm cursor-pointer hover:ring-2 hover:ring-emerald-600 transition">
                  <UserIcon className="w-4 h-4" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-gray-800 border dark:border-gray-700">
                <DropdownMenuItem className="hover:bg-gray-50 focus:bg-gray-50 dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                  {(user?.role === "BUYER" || user?.role === "FARMER") && (

                    <Link href={dashboardRoute}>
                      <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        Dashboard
                      </p>
                    </Link>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-50 focus:bg-gray-50 dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                  <Link href="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>


                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 text-red-500 hover:bg-gray-50 focus:bg-gray-50 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
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
  );
}