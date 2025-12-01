import React, { useEffect, useState } from 'react';
import {
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    Calendar,
    FolderKanban
} from 'lucide-react';
import api from '../services/api';

interface DashboardData {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    dueTodayTasks: number;
    dueThisWeekTasks: number;
    myTasks: number;
    recentTasks: any[];
    overdueTasksList: any[];
    projectProgress: any[];
}

export const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.get('/dashboard');
            setData(response.data);
        } catch (error: any) {
            console.error('Failed to fetch dashboard data:', error);
            setError(error.response?.data?.message || error.message || 'Failed to load dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dbi-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
                    <p className="text-gray-700 mb-4">{error}</p>
                    <button onClick={fetchDashboardData} className="btn-primary">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-600">No data available</p>
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Projects',
            value: data.totalProjects,
            icon: FolderKanban,
            color: 'bg-blue-500',
        },
        {
            label: 'Total Tasks',
            value: data.totalTasks,
            icon: CheckCircle2,
            color: 'bg-green-500',
        },
        {
            label: 'Overdue Tasks',
            value: data.overdueTasks,
            icon: AlertCircle,
            color: 'bg-red-500',
        },
        {
            label: 'Due This Week',
            value: data.dueThisWeekTasks,
            icon: Calendar,
            color: 'bg-yellow-500',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="card hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="text-white" size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Project Progress */}
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <TrendingUp size={20} />
                    <span>Project Progress</span>
                </h2>
                <div className="space-y-4">
                    {data.projectProgress && data.projectProgress.length > 0 ? (
                        data.projectProgress.map((project: any) => (
                            <div key={project.projectId}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-700">{project.projectName}</span>
                                    <span className="text-gray-600">
                                        {project.completedTasks}/{project.totalTasks} tasks ({project.progressPercentage}%)
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-dbi-primary h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${project.progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No projects yet</p>
                    )}
                </div>
            </div>

            {/* Recent Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                        <Clock size={20} />
                        <span>Recent Tasks</span>
                    </h2>
                    <div className="space-y-3">
                        {data.recentTasks && data.recentTasks.length > 0 ? (
                            data.recentTasks.map((task: any) => (
                                <div
                                    key={task.id}
                                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <p className="font-medium text-gray-800">{task.title}</p>
                                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                                        <span className="px-2 py-1 bg-white rounded text-xs font-medium">
                                            {task.projectName}
                                        </span>
                                        {task.deadline && (
                                            <span>{new Date(task.deadline).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent tasks</p>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                        <AlertCircle size={20} className="text-red-500" />
                        <span>Overdue Tasks</span>
                    </h2>
                    <div className="space-y-3">
                        {!data.overdueTasksList || data.overdueTasksList.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No overdue tasks! 🎉</p>
                        ) : (
                            data.overdueTasksList.map((task: any) => (
                                <div
                                    key={task.id}
                                    className="p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer border-l-4 border-red-500"
                                >
                                    <p className="font-medium text-gray-800">{task.title}</p>
                                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                                        <span className="px-2 py-1 bg-white rounded text-xs font-medium">
                                            {task.projectName}
                                        </span>
                                        {task.deadline && (
                                            <span className="text-red-600">
                                                Due: {new Date(task.deadline).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
