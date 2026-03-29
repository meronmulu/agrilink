// 'use client' is not needed for a route handler
import { redirect } from 'next/navigation';

export default function MessageRootPage() {
  // Redirect to the first conversation or a placeholder
  // You may want to fetch the user's conversations and redirect to the first one
  // For now, just show a placeholder or redirect to /message if not implemented
  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      Select a conversation from the sidebar to start chatting.
    </div>
  );
}
