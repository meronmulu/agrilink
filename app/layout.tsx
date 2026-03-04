// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgriLink",
  description:
    "AgriLink connects farmers and buyers with real-time market intelligence, AI-powered support, and a unified agricultural marketplace.",
  keywords: [
    "AgriLink",
    "Ethiopia agriculture",
    "market prices",
    "AI farming",
    "Afaan Oromo",
    "Amharic",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        {/* ClientProviders is a client component that wraps Auth + Language + i18n init */}
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}