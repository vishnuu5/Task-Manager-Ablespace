import useSWR from "swr";
import { api } from "@/lib/api";
import type { Notification } from "@/types";

export function useNotifications() {
  const { data, error, mutate } = useSWR<{ notifications: Notification[] }>(
    "/notifications",
    async () => {
      const response = await api.notifications.getAll();
      return response as { notifications: Notification[] };
    }
  );

  const markAsRead = async (id: string) => {
    await api.notifications.markAsRead(id);
    await mutate();
  };

  const deleteNotification = async (id: string) => {
    await api.notifications.delete(id);
    await mutate();
  };

  const deleteAllNotifications = async () => {
    await api.notifications.deleteAll();
    await mutate();
  };

  return {
    notifications: data?.notifications || [],
    unreadCount: data?.notifications.filter((n) => !n.read).length || 0,
    isLoading: !error && !data,
    isError: error,
    markAsRead,
    deleteNotification,
    deleteAllNotifications,
    mutate,
  };
}
