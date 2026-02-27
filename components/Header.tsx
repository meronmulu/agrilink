'use client'

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CircleUserRound, Flower2, Globe, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";

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

                {/* for user not login */}
                {/* <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium mx-auto">
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
                </nav> */}

                {/* for user farmer */}
                {/* <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium mx-auto">
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        Market insight
                    </p>
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        Orders
                    </p>
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        Ai assistant
                    </p>
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        Message
                     </p>

                    <Button
                        variant="outline"
                        className="flex items-center justify-center gap-2 border-gray-300 hover:border-emerald-500 hover:text-emerald-600"
                    >
                        <Globe className="w-4 h-4" />
                        EN
                    </Button>
                </nav> */}


                {/* for user buyer */}
                <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium mx-auto">
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        Market insight
                    </p>
                   <Link href="/order">
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        Orders
                    </p>
                   </Link>         

                    <Link href="/message">
                     <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        Message
                    </p> 
                    </Link>         
                    

                    <Button
                        variant="outline"
                        className="flex items-center justify-center gap-2 border-gray-300 hover:border-emerald-500 hover:text-emerald-600"
                    >
                        <Globe className="w-4 h-4" />
                        EN
                    </Button>
                </nav>
                <div>

                </div>

                {/* for user not login */}
                {/* <div className="flex items-center">
                    <Link href="/login">
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 rounded-lg">
                            Get Started
                        </Button>
                    </Link>
                </div> */}

                {/* for user login */}
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <CircleUserRound size={32} className="cursor-pointer text-gray-600" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuItem className="md:hidden">
                                Market Insight
                            </DropdownMenuItem>
                            <DropdownMenuItem className="md:hidden">
                                Orders
                            </DropdownMenuItem>
                            <Link href="/message">
                                <DropdownMenuItem className="md:hidden">
                                    Message
                                </DropdownMenuItem>
                            </Link>

                            <DropdownMenuItem>
                                {/* <Settings size={16}/> */}
                                Setting
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                                <LogOut size={16} className="text-red-500" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>





            </div>
        </header>
    );
}