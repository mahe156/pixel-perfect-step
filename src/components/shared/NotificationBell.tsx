import { useState, useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

const typeIcons: Record<string, string> = {
  campaign_live: "📣",
  views_milestone: "👁️",
  payout_sent: "💸",
  campaign_ending: "⏰",
  kyc_approved: "✅",
  kyc_rejected: "❌",
  submission_approved: "🎉",
  submission_rejected: "🚫",
};

const NotificationBell = () => {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!profile) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) setNotifications(data as Notification[]);
    };

    fetchNotifications();

    // Realtime subscription
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from("notifications").update({ is_read: true }).in("id", unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <h4 className="font-display font-bold text-sm text-foreground">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground" onClick={markAllRead}>
              <CheckCheck className="w-3 h-3 mr-1" />Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No notifications yet</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 border-b border-border/30 hover:bg-muted/30 transition-colors ${!n.is_read ? "bg-primary/5" : ""}`}
              >
                <div className="flex gap-2">
                  <span className="text-base shrink-0">{typeIcons[n.type] || "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
