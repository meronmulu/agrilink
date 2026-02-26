'use client'

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Flower2, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LanguageDropdown from "./LanguageDropdown";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    const handleAuthChange = () => checkAuth();
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('authChange'));
    router.push('/');
  }

  return (
    <header className="w-full fixed h-16 top-0 left-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Flower2 className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">AgriLink</h1>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium">
          <Link href="/market" className="hover:text-emerald-500 transition-colors">{t('market')}</Link>
          <Link href="/how-it-works" className="hover:text-emerald-500 transition-colors">{t('howItWorks')}</Link>
          <Link href="/about" className="hover:text-emerald-500 transition-colors">{t('aboutUs')}</Link>

          <LanguageDropdown />
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <User size={20} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 hover:bg-red-50"
                title={t('logout')}
              >
                <LogOut size={20} />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 rounded-lg">
                {t('getStarted')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}