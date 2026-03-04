'use client'

import React from "react"
import { Facebook, Twitter, Linkedin, Mail, Flower2, } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export default function Footer() {
    const { t } = useLanguage()
    return (
        <footer className="bg-gray-50 ">

            {/* Top Section */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto py-20 px-6 text-gray-600 text-sm">

                {/* Brand */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-emerald-500 p-2 rounded-lg">
                            <Flower2 className="text-white w-4 h-4" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 pt-1">

                            AgriLink
                        </h3>
                    </div>

                    <p className="leading-relaxed">
                        {t('footer_desc')}
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-6">
                        <Facebook className="w-5 h-5 hover:text-green-600 cursor-pointer transition" />
                        <Twitter className="w-5 h-5 hover:text-green-600 cursor-pointer transition" />
                        <Linkedin className="w-5 h-5 hover:text-green-600 cursor-pointer transition" />
                    </div>
                </div>

                {/* Quick Links */}
                <div className="md:text-center">
                    <h4 className="font-semibold text-gray-900 mb-4">
                        {t('footer_links_title')}
                    </h4>
                    <ul className="space-y-3">
                        <li className="hover:text-green-600 cursor-pointer transition">{t('footer_link_home')}</li>
                        <li className="hover:text-green-600 cursor-pointer transition">{t('footer_link_about')}</li>
                        <li className="hover:text-green-600 cursor-pointer transition">{t('footer_link_market')}</li>
                        <li className="hover:text-green-600 cursor-pointer transition">{t('footer_link_contact')}</li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                        {t('footer_contact_title')}
                    </h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Mail size={16} />
                            <span>support@agrilink.et</span>
                        </div>
                        <p>{t('footer_location')}</p>
                    </div>
                </div>

            </div>

            {/* Bottom Section */}
            <div className="text-center text-gray-400 text-xs py-4 border-t">
                &copy; {new Date().getFullYear()} {t('footer_rights')}
            </div>

        </footer>
    )
}