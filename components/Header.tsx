'use client'

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Flower2, Globe } from "lucide-react";
import Link from "next/link";

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
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        Market
                    </p>
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        How it works
                    </p>
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        About Us
                    </p>

                    <Button
                        variant="outline"
                        className="flex items-center justify-center gap-2 border-gray-300 hover:border-emerald-500 hover:text-emerald-600"
                    >
                        <Globe className="w-4 h-4" />
                        EN
                    </Button>
                </nav>

                <div className="flex items-center">
                    <Link href="/login">
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 rounded-lg">
                            Get Started
                        </Button>
                    </Link>
                </div>





            </div>
        </header>
    );
}