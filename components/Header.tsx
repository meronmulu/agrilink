'use client'

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Flower2, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LanguageDropdown from "./LanguageDropdown";
import { CircleUserRound, Globe, } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

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
        <header className="w-full fixed h-16  top-0 left-0 z-50 bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
                    <div className="bg-emerald-500 p-2 rounded-lg">
                        <Flower2 className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-800">
                        AgriLink
                    </h1>
                </div>

                {/* for user not login */}
                <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium mx-auto">
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        {t('market')}
                    </p>
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        {t('howItWorks')}
                    </p>
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        {t('aboutUs')}
                    </p>

                    <LanguageDropdown />
                </nav>







                {/* for user not login */}
                {/* <div className="flex items-center">
                    <Link href="/login">
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 rounded-lg">
                            Get Started
                        </Button>
                    </Link>
                </div>  */}

                {/* for user login */}
                <div className="flex gap-2">
                    <LanguageDropdown />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <CircleUserRound size={32} className="cursor-pointer text-gray-600" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <Link href="/MarketInsight">
                                <DropdownMenuItem className="md:hidden">
                                    {t('nav_market_insight')}
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className="md:hidden">
                                {t('nav_orders')}
                            </DropdownMenuItem>
                            <Link href="/message">
                                <DropdownMenuItem className="md:hidden">
                                    {t('nav_message')}
                                </DropdownMenuItem>
                            </Link>

                            <DropdownMenuItem>
                                {/* <Settings size={16}/> */}
                                {t('nav_setting')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                                <LogOut size={16} className="text-red-500" />
                                {t('logout')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>





            </div>
        </header>
    );
}