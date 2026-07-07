import { Bell, CheckCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useGetNotifications,
  useMarkNotificationRead,
} from '../../phase3/api/phase3Api';

export function NotificationsPage() {
  const { data = [], isLoading } = useGetNotifications();
  const markRead = useMarkNotificationRead();

  const unread = data.filter((n: any) => !n.read_at);
  const read = data.filter((n: any) => n.read_at);

  const typeColor: Record<string, string> = {
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
    success: 'bg-green-50 border-green-200',
  };

  const typeIcon: Record<string, string> = {
    info: '🔵',
    warning: '🟡',
    error: '🔴',
    success: '🟢',
  };

  function NotifCard({ n }: { n: any }) {
    return (
      <div
        className={`flex items-start gap-4 rounded-xl border p-4 transition-all ${
          n.read_at ? 'bg-gray-50 border-gray-200 opacity-60' : (typeColor[n.type] || 'bg-white border-gray-200')
        }`}
      >
        <span className="text-xl mt-0.5">{typeIcon[n.type] || '🔔'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm">{n.title || 'Notification'}</p>
            {!n.read_at && (
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {n.created_at ? new Date(n.created_at).toLocaleString() : '—'}
          </p>
        </div>
        {!n.read_at && (
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0 text-xs"
            onClick={() => markRead.mutate(n.id)}
            disabled={markRead.isPending}
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            Mark read
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-100">
          <Bell className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-0.5">
            {unread.length} unread · {data.length} total
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">Loading…</div>
      ) : data.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          No notifications yet. System events will appear here automatically.
        </div>
      ) : (
        <div className="space-y-6">
          {unread.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Unread ({unread.length})
              </h2>
              <div className="space-y-3">
                {unread.map((n: any) => <NotifCard key={n.id} n={n} />)}
              </div>
            </section>
          )}

          {read.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Read ({read.length})
              </h2>
              <div className="space-y-3">
                {read.map((n: any) => <NotifCard key={n.id} n={n} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
