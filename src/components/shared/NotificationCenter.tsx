import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import useAppStore from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { Bell, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const typeConfig = {
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  danger: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
};

export function NotificationCenter() {
  const { notifications, markNotifRead, markAllNotifRead, clearNotifications } = useAppStore();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.dibaca).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="relative h-9 w-9 p-0 text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-200"
      >
        <Bell className="w-[18px] h-[18px]" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[9px] bg-red-500 text-white border-0">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-[380px] max-h-[500px] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">Notifikasi</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={markAllNotifRead} className="h-7 px-2 text-xs text-gray-500">
                  <CheckCheck className="w-3.5 h-3.5 mr-1" /> Baca Semua
                </Button>
                <Button variant="ghost" size="sm" onClick={clearNotifications} className="h-7 w-7 p-0 text-gray-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <ScrollArea className="max-h-[400px]">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-400 dark:text-neutral-600">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Tidak ada notifikasi</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-neutral-800">
                  {notifications.map((n) => {
                    const cfg = typeConfig[n.type];
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={n.id}
                        onClick={() => { markNotifRead(n.id); if (n.link) window.location.href = n.link; }}
                        className={cn(
                          "flex gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors",
                          !n.dibaca && "bg-amber-50/30 dark:bg-amber-950/10"
                        )}
                      >
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", cfg.bg)}>
                          <Icon className={cn("w-4 h-4", cfg.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm", !n.dibaca ? "font-semibold text-gray-800 dark:text-neutral-200" : "text-gray-600 dark:text-neutral-400")}>{n.judul}</p>
                          <p className="text-xs text-gray-400 dark:text-neutral-600 line-clamp-2">{n.pesan}</p>
                          <p className="text-[10px] text-gray-300 dark:text-neutral-700 mt-1">{n.waktu}</p>
                        </div>
                        {!n.dibaca && <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}
