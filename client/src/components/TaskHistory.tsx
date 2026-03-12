import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useI18nStore } from '../stores/i18nStore';
import api from '../services/api';

interface ActivityLog {
    id: string;
    action: string;
    description: string;
    userId: string;
    userName: string;
    createdAt: string;
}

interface TaskHistoryProps {
    taskId: string;
}

export const TaskHistory: React.FC<TaskHistoryProps> = ({ taskId }) => {
    const { language } = useI18nStore();
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, [taskId]);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/tasks/${taskId}/history`);
            setLogs(response.data);
        } catch (error) {
            console.error('Failed to fetch task history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US');
    };

    if (isLoading) {
        return <div className="py-4 text-center text-gray-500">{language === 'vi' ? 'Đang tải...' : 'Loading...'}</div>;
    }

    if (logs.length === 0) {
        return <div className="py-4 text-center text-gray-500">{language === 'vi' ? 'Chưa có lịch sử' : 'No history available'}</div>;
    }

    return (
        <div className="space-y-4 py-4">
            {logs.map((log) => (
                <div key={log.id} className="flex space-x-3 text-sm">
                    <div className="mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 mt-1.5"></div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                                {log.userName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                <Clock size={12} />
                                <span>{formatDateTime(log.createdAt)}</span>
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                            {log.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};
