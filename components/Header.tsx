import React from "react";
import { Button } from "./ui/button";
import { CircleUserRound, Flower2, Globe, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function Header() {
    return (
        <header className="w-full fixed h-16  top-0 left-0 z-50 bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

                <div className="flex items-center space-x-2 cursor-pointer">
                    <div className="bg-emerald-500 p-2 rounded-lg">
                        <Flower2 className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-800">
                        AgriLink
                    </h1>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium">
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        Market insight
                    </p>
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        {/* How it works */}
                        My orders
                    </p>
                    <p className="hover:text-emerald-500 cursor-pointer transition-colors">
                        {/* About Us */}
                        Message
                    </p>

                    <Button
                        variant="outline"
                        className="flex items-center gap-2 border-gray-300 hover:border-emerald-500 hover:text-emerald-600"
                    >
                        <Globe className="w-4 h-4" />
                        EN
                    </Button>
                </nav>


                {/* for not logged in user */}

                {/* <div className="flex items-center">
                    <Link href="/login">
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 rounded-lg">
                            Get Started
                        </Button>
                    </Link>
                </div> */}
            

               {/* for logged in user */}
                <div className="">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <CircleUserRound size={32} className="cursor-pointer text-gray-600" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Settings size={16}/>
                                    Setting
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <LogOut size={16} />
                                    Logout
                                </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>





            </div>
        </header>
    );
}