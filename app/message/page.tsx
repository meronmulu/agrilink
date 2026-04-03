import { redirect } from 'next/navigation';

export default function MessageRootPage() {
  
  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      Select a conversation from the sidebar to start chatting.
    </div>
  );
}
