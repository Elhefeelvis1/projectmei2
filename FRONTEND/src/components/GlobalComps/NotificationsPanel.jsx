import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { ArrowLeft, Bell, Loader2 } from "lucide-react";

export default function NotificationsPanel({ session, onBack }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user) return;

      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching notifications:", error);
        } else {
          setNotifications(data || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Optionally set up real-time subscription for new notifications
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${session?.user?.id}`
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const toggleExpand = async (notif) => {
    const isExpanding = expandedId !== notif.id;
    setExpandedId(isExpanding ? notif.id : null);

    // Optionally mark as read if expanding for the first time
    if (isExpanding && !notif.is_read) {
      try {
        const { error } = await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("id", notif.id);

        if (!error) {
          setNotifications(prev =>
            prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n)
          );
        }
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[400px]">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 sticky top-0 bg-white z-10 rounded-t-2xl">
        <button 
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2 font-medium text-gray-800">
          <Bell size={18} className="text-blue-500" />
          Notifications
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8 text-gray-400">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Bell size={32} className="text-gray-300 mb-2" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.map((notif) => {
              const isExpanded = expandedId === notif.id;
              return (
                <div 
                  key={notif.id}
                  onClick={() => toggleExpand(notif)}
                  className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${!notif.is_read ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm font-medium ${!notif.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap mt-1">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 text-gray-600 ${isExpanded ? 'whitespace-normal' : 'line-clamp-2'}`}>
                    {notif.message}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
