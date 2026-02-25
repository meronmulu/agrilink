'use client'

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Flower2, Globe, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
        };

        checkAuth();
        // Listen for storage events in case login happens in another tab
        window.addEventListener('storage', checkAuth);

        // Custom event for same-tab login updates
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
        // Dispatch custom event so other components (like another header instance if any) update
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

                <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium">
                    <Link href="/market" className="hover:text-emerald-500 transition-colors">
                        Market
                    </Link>
                    <Link href="/how-it-works" className="hover:text-emerald-500 transition-colors">
                        How it works
                    </Link>
                    <Link href="/about" className="hover:text-emerald-500 transition-colors">
                        About Us
                    </Link>

                    <Button
                        variant="outline"
                        className="flex items-center justify-center gap-2 border-gray-300 hover:border-emerald-500 hover:text-emerald-600"
                    >
                        <Globe className="w-4 h-4" />
                        EN
                    </Button>
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
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 rounded-lg">
                                Get Started
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}