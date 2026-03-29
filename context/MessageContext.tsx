import { createContext, useContext, useEffect, useState } from 'react';
import { getUnreadMessageCount } from '@/services/chatService';
import { useAuth } from './AuthContext';

interface MessageContextType {
  unreadCount: number;
  refreshUnread: () => void;
}

const MessageContext = createContext<MessageContextType | null>(null);

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnread = async () => {
    if (user?.id) {
      const count = await getUnreadMessageCount(user.id);
      setUnreadCount(count);
    }
  };

  useEffect(() => {
    refreshUnread();
    // Optionally, poll every 30s
    const interval = setInterval(refreshUnread, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  return (
    <MessageContext.Provider value={{ unreadCount, refreshUnread }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) throw new Error('useMessage must be used within MessageProvider');
  return context;
};
