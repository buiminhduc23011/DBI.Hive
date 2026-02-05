import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, AlertCircle } from 'lucide-react';
import { useNotificationStore } from '../stores/notificationStore';
import { useProjectStore } from '../stores/projectStore';
import { useAuthStore } from '../stores/authStore';
import { useI18nStore } from '../stores/i18nStore';
import { UnassignedTasksModal } from './UnassignedTasksModal';
import { formatDistanceToNow } from 'date-fns';

export const NotificationDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUnassignedModal, setShowUnassignedModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const {
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
    } = useNotificationStore();
    const { tasks, projects } = useProjectStore();
    const { user } = useAuthStore();
    const { language } = useI18nStore();

    // Calculate unassigned tasks for owners/managers
    const unassignedTasks = tasks.filter(t => !t.assignedToId && t.status !== 3);
    const isOwnerOrManager = projects.some(p =>
        p.ownerId === user?.id || p.memberRoles?.[user?.id || ''] === 'Manager'
    );
    const unassignedCount = isOwnerOrManager ? unassignedTasks.length : 0;
    const totalBadgeCount = unreadCount + unassignedCount;

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'task_assigned':
                return '📋';
            case 'task_completed':
                return '✅';
            case 'comment_added':
                return '💬';
            case 'deadline_reminder':
                return '⏰';
            case 'project_update':
                return '📁';
            default:
                return '🔔';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
                <Bell size={22} className={unassignedCount > 0 ? 'animate-pulse' : ''} />
                {totalBadgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {totalBadgeCount > 9 ? '9+' : totalBadgeCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="text-sm text-dbi-primary hover:text-dbi-primary/80 flex items-center space-x-1"
                            >
                                <CheckCheck size={16} />
                                <span>Mark all read</span>
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {/* Unassigned Tasks Alert for Owners/Managers */}
                        {unassignedCount > 0 && (
                            <div
                                onClick={() => {
                                    setShowUnassignedModal(true);
                                    setIsOpen(false);
                                }}
                                className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer"
                            >
                                <div className="flex items-start space-x-3">
                                    <AlertCircle size={20} className="text-orange-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                                            {language === 'vi' ? 'Công việc cần giao' : 'Tasks need assignment'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {language === 'vi'
                                                ? `${unassignedCount} công việc chưa được giao cho ai`
                                                : `${unassignedCount} tasks not assigned to anyone`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <Bell size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                                        ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <span className="text-xl mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''} text-gray-800 dark:text-white`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                            <button className="w-full text-center text-sm text-dbi-primary hover:text-dbi-primary/80">
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Unassigned Tasks Modal */}
            {showUnassignedModal && (
                <UnassignedTasksModal
                    tasks={unassignedTasks}
                    onClose={() => setShowUnassignedModal(false)}
                />
            )}
        </div>
    );
};
