import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type Notification = {
  id: string;
  user_id: string | null;
  for_admin: boolean;
  title: string;
  message: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
};

export const sendNotification = async (props: { userId?: string, forAdmin?: boolean, title: string, message: string, link?: string }) => {
  return await supabase.from("notifications" as any).insert({
    user_id: props.userId || null,
    for_admin: props.forAdmin || false,
    title: props.title,
    message: props.message,
    link: props.link || null
  });
};

export const useNotifications = () => {
  const { user, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;
    
    let query = supabase.from("notifications" as any).select("*").order("created_at", { ascending: false });
    
    if (isAdmin) {
      query = query.or(`user_id.eq.${user.id},for_admin.eq.true`);
    } else {
      query = query.eq("user_id", user.id);
    }
    
    const { data } = await query.limit(50);
    if (data) {
      setNotifications(data as unknown as Notification[]);
      setUnreadCount((data as unknown as any[]).filter((n: any) => !n.is_read).length);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    if (!user) return;
    
    const sub = supabase.channel('notifications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchNotifications(); // Refetch on any change
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(sub);
    };
  }, [user, isAdmin]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    await supabase.from("notifications" as any).update({ is_read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    let query = supabase.from("notifications" as any).update({ is_read: true }).eq("is_read", false);
    if (isAdmin) {
      query = query.or(`user_id.eq.${user.id},for_admin.eq.true`);
    } else {
      query = query.eq("user_id", user.id);
    }
    await query;
    
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications };
};
