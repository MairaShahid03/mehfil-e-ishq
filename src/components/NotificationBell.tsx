import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2, ExternalLink } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { motion, AnimatePresence } from "framer-motion";

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gold/10 text-ivory/80 hover:text-gold transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 max-w-[20px] right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-noir bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-noir border border-gold/20 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col"
            style={{ maxHeight: "80vh" }}
          >
            <div className="p-4 border-b border-gold/10 flex items-center justify-between bg-black/40">
              <h3 className="font-heading text-gold text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={() => markAllAsRead()} className="text-xs text-ivory/40 hover:text-ivory flex items-center gap-1 transition-colors">
                  <Check size={14} /> Mark all read
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1 p-2" style={{ maxHeight: "400px" }}>
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-ivory/30 text-sm">
                  <Bell className="mx-auto mb-2 opacity-20" size={32} />
                  No notifications yet.
                </div>
              ) : (
                notifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`p-3 mb-1 rounded-lg text-sm transition-all ${
                      n.is_read ? "opacity-70 hover:bg-ivory/5" : "bg-gold/5 border border-gold/10"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <strong className={`block ${n.is_read ? "text-ivory/70" : "text-gold"}`}>{n.title}</strong>
                        <p className="mt-1 text-ivory/60 leading-relaxed text-xs">{n.message}</p>
                        <span className="block mt-2 text-[10px] text-ivory/30">{new Date(n.created_at).toLocaleString()}</span>
                      </div>
                      {!n.is_read && (
                        <button onClick={() => markAsRead(n.id)} className="p-1.5 text-gold/60 hover:text-gold hover:bg-gold/10 rounded-full" title="Mark as read">
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-3 bg-black/40 border-t border-gold/10 text-center">
                 <span className="text-xs text-ivory/30">End of notifications</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
