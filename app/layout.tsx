import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import  "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AgriLink",
  description:
    "AgriLink connects farmers and buyers with real-time market intelligence, AI-powered support, and a unified agricultural marketplace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${outfit.variable} antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
      >
        <ClientProviders>
          <CartProvider>
            {children}
          </CartProvider>
          <Toaster position="top-center" richColors />
        </ClientProviders>
      </body>
    </html>
  );
}