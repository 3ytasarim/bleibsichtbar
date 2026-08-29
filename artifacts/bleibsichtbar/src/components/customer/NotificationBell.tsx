import { useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Bell, Receipt, BarChart3, CheckCheck, LifeBuoy, Kanban } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  useGetPortalNotifications,
  useMarkPortalNotificationRead,
  useMarkAllPortalNotificationsRead,
  getGetPortalNotificationsQueryKey,
  type Notification,
} from "@workspace/api-client-react";

function notificationIcon(type: string) {
  if (type === "invoice") return Receipt;
  if (type === "monthly_report") return BarChart3;
  if (type === "support_ticket") return LifeBuoy;
  if (type === "roadmap_update") return Kanban;
  return Bell;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useGetPortalNotifications({
    query: { refetchInterval: 60_000 },
  });
  const markReadMut = useMarkPortalNotificationRead();
  const markAllReadMut = useMarkAllPortalNotificationsRead();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetPortalNotificationsQueryKey() });

  const handleOpen = (notification: Notification) => {
    if (!notification.read) {
      markReadMut.mutate({ id: notification.id }, { onSuccess: invalidate });
    }
    if (notification.link) {
      setLocation(notification.link);
    }
    setOpen(false);
  };

  const handleMarkAllRead = () => {
    markAllReadMut.mutate(undefined, { onSuccess: invalidate });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative w-9 h-9 rounded-full flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Benachrichtigungen"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="font-semibold text-sm">Benachrichtigungen</p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Alle gelesen
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-border">
          {notifications.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Bell className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">Keine Benachrichtigungen.</p>
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = notificationIcon(n.type);
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleOpen(n)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors ${!n.read ? "bg-accent/5" : ""}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
                      <p className="text-sm font-medium truncate">{n.title}</p>
                    </div>
                    {n.message && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>}
                    <p className="text-[11px] text-muted-foreground/70 mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: de })}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
