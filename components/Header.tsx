'use client'

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Flower2, LogOut, ShoppingCart } from "lucide-react";
import { CircleUserRound } from "lucide-react";
import LanguageDropdown from "./LanguageDropdown";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

type UserProfile = {
  id?: string;
  name?: string;
  email?: string;
  role?: string; // e.g., 'BUYER' | 'SELLER' | 'AGENT'
  avatarUrl?: string;
};

const PROFILE_ENDPOINTS = ["/auth/profile", "/auth/me", "/user/profile"];

export default function Header() {
  const router = useRouter();
  const { t } = useLanguage();
  const { summary } = useCart();

  // token presence drives "not authenticated" UI immediately
  const getTokenFromStorage = () => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  };

  const [token, setToken] = useState<string | null>(() => getTokenFromStorage());
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const normalizeRole = (r?: string) => (r ? r.toUpperCase() : "");

  const fetchProfile = useCallback(
    async (tok: string) => {
      setLoadingProfile(true);
      setUser(null);

      for (const ep of PROFILE_ENDPOINTS) {
        try {
          const res = await fetch(ep, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tok}`,
            },
          });

          if (!res.ok) {
            // try next endpoint
            continue;
          }

          const data = await res.json();

          const profile: UserProfile = {
            id: data.id || data._id || data.userId,
            name: data.name || data.fullName || data.username,
            email: data.email,
            role: normalizeRole(data.role || data.userRole || data.roleName),
            avatarUrl: data.avatarUrl || data.avatar || data.profilePicture || "",
          };

          setUser(profile);
          setLoadingProfile(false);
          return;
        } catch (err) {
          // try next endpoint
          continue;
        }
      }

      // none succeeded
      setUser(null);
      setLoadingProfile(false);
    },
    []
  );

  // initialize and keep in sync
  useEffect(() => {
    // if token exists, fetch profile
    if (token) {
      fetchProfile(token);
    } else {
      // no token -> ensure profile cleared
      setUser(null);
      setLoadingProfile(false);
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "isAuthenticated") {
        const newToken = getTokenFromStorage();
        setToken(newToken);
      }
    };
    window.addEventListener("storage", onStorage);

    const onAuthChange = () => {
      const newToken = getTokenFromStorage();
      setToken(newToken);
    };
    window.addEventListener("authChange", onAuthChange);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChange", onAuthChange);
    };
  }, [token, fetchProfile]);

  const handleLogout = async () => {
    // Optionally call backend logout endpoint here
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
    } catch {}
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
    router.push("/");
  };

  const goToCart = () => router.push("/cart");
  const goToSignin = () => router.push("/login");
  const goToSignup = () => router.push("/signup");

  const isAuthenticated = Boolean(token && user); // token present and profile loaded

  return (
    <header className="w-full fixed h-16 top-0 left-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Flower2 className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">AgriLink</h1>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium mx-auto">
          <p className="hover:text-emerald-500 cursor-pointer transition-colors">{t("market")}</p>
          <p className="hover:text-emerald-500 cursor-pointer transition-colors">{t("howItWorks")}</p>
          <p className="hover:text-emerald-500 cursor-pointer transition-colors">{t("aboutUs")}</p>
          <LanguageDropdown />
        </nav>

        <div className="flex items-center gap-4">
          {/* Not authenticated: show Get Started immediately when no token */}
          {!token && (
            <div className="hidden md:flex items-center gap-3">
              <Button onClick={goToSignin} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 rounded-lg">
                {t("getStarted") || "Get Started"}
              </Button>
            </div>
          )}

          {/* If token exists but profile is loading, show a small loader */}
          {token && loadingProfile && <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />}

          {/* Authenticated: token present and profile loaded */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3">
              {user.role === "BUYER" && (
                <div className="relative">
                  <Button
                    onClick={goToCart}
                    variant="ghost"
                    size="sm"
                    className="relative p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ShoppingCart size={20} className="text-gray-600" />
                    {summary.itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {summary.itemCount > 99 ? '99+' : summary.itemCount}
                      </span>
                    )}
                  </Button>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {user.avatarUrl ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer">
                      <Image src={user.avatarUrl} alt={user.name || "avatar"} width={32} height={32} />
                    </div>
                  ) : (
                    <CircleUserRound size={32} className="cursor-pointer text-gray-600" />
                  )}
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="min-w-[180px]">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{user.name || user.email}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>

                  <Link href="/profile">
                    <DropdownMenuItem>{t("nav_profile") || "Profile"}</DropdownMenuItem>
                  </Link>

                  <Link href="/orders">
                    <DropdownMenuItem>{t("nav_orders") || "Orders"}</DropdownMenuItem>
                  </Link>

                  {user.role === "AGENT" && (
                    <Link href="/agent/dashboard">
                      <DropdownMenuItem>{t("agent_dashboard") || "Agent Dashboard"}</DropdownMenuItem>
                    </Link>
                  )}

                  {user.role === "BUYER" && (
                    <DropdownMenuItem onClick={() => router.push("/cart")} className="flex items-center justify-between">
                      <span>{t("nav_cart") || "Cart"}</span>
                      {summary.itemCount > 0 && (
                        <span className="bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {summary.itemCount > 99 ? '99+' : summary.itemCount}
                        </span>
                      )}
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem onClick={() => router.push("/settings")}>{t("nav_setting") || "Settings"}</DropdownMenuItem>

                  <DropdownMenuItem className="text-red-500 flex items-center gap-2" onClick={handleLogout}>
                    <LogOut size={16} className="text-red-500" />
                    {t("logout") || "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}