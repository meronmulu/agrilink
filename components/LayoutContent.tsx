'use client'

import { useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import AiAssistant from "@/components/AiAssistance";
import { usePathname } from "next/navigation";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();

  const hiddenRoutes = [
    '/',
    '/login',
    '/register',
    '/signup',
    '/other-register',
    '/forgotPassword',
    '/verify-otp',
    '/resetPassword'
  ];

  const hideAi = hiddenRoutes.includes(pathname);

  return (
    <>
      <CartProvider>
        {children}
      </CartProvider>

      <Toaster position="top-center" richColors />

=      {user && !hideAi && <AiAssistant />}
    </>
  );
}