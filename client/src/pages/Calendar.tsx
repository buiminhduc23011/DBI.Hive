import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjectStore, TaskItemStatus, Priority } from '../stores/projectStore';
import { useI18nStore } from '../stores/i18nStore';

const priorityColors = {
    [Priority.Low]: 'bg-gray-200 border-gray-400',
    [Priority.Medium]: 'bg-blue-200 border-blue-400',
    [Priority.High]: 'bg-orange-200 border-orange-400',
    [Priority.Critical]: 'bg-red-200 border-red-400',
};

const statusColors = {
    [TaskItemStatus.Todo]: 'border-l-gray-500',
    [TaskItemStatus.InProgress]: 'border-l-blue-500',
    [TaskItemStatus.Review]: 'border-l-yellow-500',
    [TaskItemStatus.Done]: 'border-l-green-500',
    [TaskItemStatus.Backlog]: 'border-l-purple-500',
};

export const Calendar: React.FC = () => {
    const { tasks, fetchTasks } = useProjectStore();
    const { t, language } = useI18nStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        return { daysInMonth, startingDay };
    };

    const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getTasksForDate = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return tasks.filter(task => {
            if (!task.deadline) return false;
            const taskDate = new Date(task.deadline);
            return taskDate.toDateString() === date.toDateString();
        });
    };

    const monthNames = language === 'vi'
        ? ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
        : ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

    const dayNames = language === 'vi'
        ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const today = new Date();
    const isToday = (day: number) => {
        return today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear();
    };

    const selectedDateTasks = selectedDate
        ? tasks.filter(task => {
            if (!task.deadline) return false;
            const taskDate = new Date(task.deadline);
            return taskDate.toDateString() === selectedDate.toDateString();
        })
        : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('calendar.title')}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{t('task.deadline')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={prevMonth}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} className="dark:text-gray-300" />
                        </button>
                        <h2 className="text-xl font-semibold dark:text-white">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button
                            onClick={nextMonth}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ChevronRight size={20} className="dark:text-gray-300" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {dayNames.map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                                {day}
                            </div>
                        ))}

                        {Array.from({ length: startingDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-24 bg-gray-50 dark:bg-gray-700/50 rounded-lg" />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dayTasks = getTasksForDate(day);
                            const isSelected = selectedDate?.getDate() === day &&
                                selectedDate?.getMonth() === currentDate.getMonth();

                            return (
                                <div
                                    key={day}
                                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                    className={`h-24 p-1 rounded-lg border cursor-pointer transition-all overflow-hidden
                                        ${isToday(day) ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                                        ${isSelected ? 'ring-2 ring-dbi-primary' : ''}`}
                                >
                                    <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {day}
                                    </div>
                                    <div className="space-y-0.5">
                                        {dayTasks.slice(0, 2).map(task => (
                                            <div
                                                key={task.id}
                                                className={`text-xs px-1 py-0.5 rounded truncate border-l-2 ${statusColors[task.status]} bg-gray-100 dark:bg-gray-700`}
                                            >
                                                {task.title}
                                            </div>
                                        ))}
                                        {dayTasks.length > 2 && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
                                                +{dayTasks.length - 2}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Task List for Selected Date */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">
                        {selectedDate
                            ? selectedDate.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                            : t('calendar.selectedDate')}
                    </h3>

                    {selectedDate ? (
                        selectedDateTasks.length > 0 ? (
                            <div className="space-y-3">
                                {selectedDateTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className={`p-3 rounded-lg border-l-4 ${statusColors[task.status]} bg-gray-50 dark:bg-gray-700`}
                                    >
                                        <h4 className="font-medium text-gray-800 dark:text-white">{task.title}</h4>
                                        {task.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{task.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
                                                {t(`priority.${Priority[task.priority].toLowerCase()}`)}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{task.projectName}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t('calendar.noTasks')}</p>
                        )
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t('calendar.tasksOnDate')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};
