'use client'

import { useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import AiAssistant from "@/components/AiAssistance";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <>
      <CartProvider>
        {children}
      </CartProvider>

      <Toaster position="top-center" richColors />

      {user && <AiAssistant />}
    </>
  );
}