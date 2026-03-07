'use client'

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Flower2,  } from "lucide-react";
import LanguageDropdown from "./LanguageDropdown";
import { useLanguage } from "@/context/LanguageContext";




export default function Header() {
  const router = useRouter();
  const { t } = useLanguage();

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
            <div className="hidden md:flex items-center gap-3">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 rounded-lg">
                {t("getStarted") || "Get Started"}
              </Button>
            </div>
     

          
            
        
        </div>
      </div>
    </header>
  );
}