import { create } from 'zustand';
import api from '../services/api';

export interface Notification {
    id: number;
    title: string;
    message: string;
    taskId?: number;
    isRead: boolean;
    createdAt: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;

    fetchNotifications: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    fetchNotifications: async () => {
        try {
            set({ isLoading: true });
            const response = await api.get('/notifications');
            const notifications = response.data;
            const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;
            set({ notifications, unreadCount, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    markAsRead: async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            set({
                notifications: get().notifications.map((n) =>
                    n.id === id ? { ...n, isRead: true } : n
                ),
                unreadCount: get().unreadCount - 1,
            });
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    },

    markAllAsRead: async () => {
        try {
            await api.put('/notifications/read-all');
            set({
                notifications: get().notifications.map((n) => ({ ...n, isRead: true })),
                unreadCount: 0,
            });
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    },
}));
