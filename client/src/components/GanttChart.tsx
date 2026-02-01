import React, { useRef, useState, useMemo } from 'react';
import { useI18nStore } from '../stores/i18nStore';
import { Filter, BarChart3 } from 'lucide-react';

interface GanttTask {
    id: string;
    title: string;
    projectName: string;
    projectId?: string;
    startDate: Date;
    endDate: Date;
    progress: number;  // 0-100
    status: number;
    color?: string;
}

interface GanttChartProps {
    tasks: GanttTask[];
    viewMode?: 'day' | 'week' | 'month';
    onTaskClick?: (task: GanttTask) => void;
}

// Color palette for projects
const projectColors = [
    { bg: 'bg-blue-500', border: 'border-blue-600', text: 'text-blue-500' },
    { bg: 'bg-green-500', border: 'border-green-600', text: 'text-green-500' },
    { bg: 'bg-purple-500', border: 'border-purple-600', text: 'text-purple-500' },
    { bg: 'bg-orange-500', border: 'border-orange-600', text: 'text-orange-500' },
    { bg: 'bg-pink-500', border: 'border-pink-600', text: 'text-pink-500' },
    { bg: 'bg-cyan-500', border: 'border-cyan-600', text: 'text-cyan-500' },
    { bg: 'bg-amber-500', border: 'border-amber-600', text: 'text-amber-500' },
    { bg: 'bg-indigo-500', border: 'border-indigo-600', text: 'text-indigo-500' },
];

export const GanttChart: React.FC<GanttChartProps> = ({ tasks, viewMode = 'week', onTaskClick }) => {
    const { t, language } = useI18nStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentViewMode, setCurrentViewMode] = useState(viewMode);
    const [selectedProject, setSelectedProject] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    // Get unique projects
    const uniqueProjects = useMemo(() => {
        const projects = [...new Set(tasks.map(t => t.projectName).filter(Boolean))];
        return projects;
    }, [tasks]);

    // Assign colors to projects
    const projectColorMap = useMemo(() => {
        const map: Record<string, typeof projectColors[0]> = {};
        uniqueProjects.forEach((project, index) => {
            map[project] = projectColors[index % projectColors.length];
        });
        return map;
    }, [uniqueProjects]);

    // Filtered tasks based on selected project and status
    const filteredTasks = useMemo(() => {
        let filtered = tasks;
        if (selectedProject !== 'all') {
            filtered = filtered.filter(t => t.projectName === selectedProject);
        }
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(t => t.status === parseInt(selectedStatus));
        }
        return filtered;
    }, [tasks, selectedProject, selectedStatus]);

    // Calculate date range
    const getDateRange = () => {
        if (filteredTasks.length === 0) {
            const today = new Date();
            return {
                start: today,
                end: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
            };
        }

        const dates = filteredTasks.flatMap(t => [t.startDate, t.endDate]);
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

        // Add some padding
        minDate.setDate(minDate.getDate() - 2);
        maxDate.setDate(maxDate.getDate() + 7);

        return { start: minDate, end: maxDate };
    };

    const { start: startDate, end: endDate } = getDateRange();

    // Generate date columns
    const generateColumns = () => {
        const columns: Date[] = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            columns.push(new Date(current));
            if (currentViewMode === 'day') {
                current.setDate(current.getDate() + 1);
            } else if (currentViewMode === 'week') {
                current.setDate(current.getDate() + 1);
            } else {
                current.setDate(current.getDate() + 7);
            }
        }
        return columns;
    };

    const columns = generateColumns();
    // Tăng dayWidth để hiển thị tốt hơn
    const dayWidth = currentViewMode === 'day' ? 50 : currentViewMode === 'week' ? 45 : 70;

    // Calculate bar position and width
    const getBarStyle = (task: GanttTask) => {
        const taskStart = Math.max(task.startDate.getTime(), startDate.getTime());
        const taskEnd = Math.min(task.endDate.getTime(), endDate.getTime());

        const startOffset = (taskStart - startDate.getTime()) / (24 * 60 * 60 * 1000);
        let duration = (taskEnd - taskStart) / (24 * 60 * 60 * 1000);

        // Đảm bảo duration ít nhất 1 ngày nếu startDate = endDate
        if (duration <= 0) {
            duration = 1;
        }

        // Minimum width = 100px để text hiển thị được
        const minWidth = 100;
        const calculatedWidth = duration * dayWidth;

        return {
            left: `${startOffset * dayWidth}px`,
            width: `${Math.max(calculatedWidth, minWidth)}px`,
        };
    };

    const getProjectColor = (projectName: string) => {
        return projectColorMap[projectName] || projectColors[0];
    };

    // Status colors for task bars - with overdue detection
    const getStatusColor = (status: number, endDate?: Date) => {
        // Check if overdue (deadline passed and not done)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isOverdue = endDate && endDate < today && status !== 3;

        if (isOverdue) {
            return 'bg-red-500'; // Overdue = red
        }

        switch (status) {
            case 0: return 'bg-gray-400'; // Todo
            case 1: return 'bg-blue-500'; // InProgress  
            case 2: return 'bg-yellow-500'; // Review
            case 3: return 'bg-green-500'; // Done
            default: return 'bg-gray-400';
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit'
        });
    };

    // Format header với month name khi đổi tháng
    const formatHeader = (date: Date, idx: number) => {
        const prevDate = idx > 0 ? columns[idx - 1] : null;
        const showMonth = !prevDate || date.getMonth() !== prevDate.getMonth();

        if (currentViewMode === 'month') {
            return (
                <div className="flex flex-col items-center leading-tight">
                    {showMonth && <span className="font-semibold text-dbi-primary">Th{date.getMonth() + 1}</span>}
                    <span>{formatDate(date)}</span>
                </div>
            );
        }

        const weekday = date.toLocaleDateString('vi-VN', { weekday: 'short' });
        return (
            <div className="flex flex-col items-center leading-tight">
                {showMonth && <span className="font-semibold text-dbi-primary text-[10px]">Th{date.getMonth() + 1}</span>}
                <span className="text-[10px]">{weekday}</span>
                <span>{date.getDate()}</span>
            </div>
        );
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isWeekend = (date: Date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    if (tasks.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
                {t('common.noData')}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header: Title + Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <BarChart3 size={20} className="text-dbi-primary" />
                    {language === 'vi' ? 'Tiến độ dự án' : 'Project Progress'}
                </h2>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Project filter */}
                    {uniqueProjects.length > 1 && (
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-dbi-primary"
                        >
                            <option value="all">
                                {language === 'vi' ? 'Tất cả dự án' : 'All Projects'} ({tasks.length})
                            </option>
                            {uniqueProjects.map(project => (
                                <option key={project} value={project}>
                                    {project} ({tasks.filter(t => t.projectName === project).length})
                                </option>
                            ))}
                        </select>
                    )}


                </div>
            </div>

            {/* Controls: View mode */}
            <div className="flex flex-wrap items-center gap-4">
                {/* View mode selector */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'vi' ? 'Xem:' : 'View:'}
                    </span>
                    <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                        {(['day', 'week', 'month'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setCurrentViewMode(mode)}
                                className={`px-3 py-1 text-sm font-medium transition-colors ${currentViewMode === mode
                                    ? 'bg-dbi-primary text-white'
                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {mode === 'day'
                                    ? (language === 'vi' ? 'Ngày' : 'Day')
                                    : mode === 'week'
                                        ? (language === 'vi' ? 'Tuần' : 'Week')
                                        : (language === 'vi' ? 'Tháng' : 'Month')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status filter */}
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-500" />
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-dbi-primary"
                    >
                        <option value="all">{language === 'vi' ? 'Tất cả trạng thái' : 'All Status'}</option>
                        <option value="0">{language === 'vi' ? 'Cần làm' : 'Todo'}</option>
                        <option value="1">{language === 'vi' ? 'Đang làm' : 'In Progress'}</option>
                        <option value="2">Review</option>
                        <option value="3">{language === 'vi' ? 'Hoàn thành' : 'Done'}</option>
                    </select>
                </div>
            </div>

            {/* Project color legend */}
            {uniqueProjects.length > 1 && (
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{language === 'vi' ? 'Dự án:' : 'Projects:'}</span>
                    {uniqueProjects.map(project => (
                        <div key={project} className="flex items-center gap-1">
                            <div className={`w-3 h-3 rounded ${getProjectColor(project).bg}`}></div>
                            <span>{project}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Gantt container */}
            <div
                ref={containerRef}
                className="overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg max-h-[400px]"
            >
                <div className="min-w-max">
                    {/* Header row with dates */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky top-0 z-20">
                        <div className="w-56 flex-shrink-0 p-2 font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 sticky left-0 bg-gray-50 dark:bg-gray-800 z-30">
                            {language === 'vi' ? 'Công việc' : 'Task'}
                        </div>
                        <div className="flex">
                            {columns.map((date, idx) => (
                                <div
                                    key={idx}
                                    style={{ width: dayWidth }}
                                    className={`text-center text-xs py-1 border-r border-gray-100 dark:border-gray-700 ${isToday(date)
                                        ? 'bg-dbi-primary/20 font-bold text-dbi-primary'
                                        : isWeekend(date)
                                            ? 'bg-gray-100 dark:bg-gray-700/50'
                                            : ''
                                        }`}
                                >
                                    {formatHeader(date, idx)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Task rows */}
                    {filteredTasks.map((task) => {
                        const projectColor = getProjectColor(task.projectName);
                        return (
                            <div
                                key={task.id}
                                className="flex border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                                {/* Task name with project indicator - sticky */}
                                <div className={`w-56 flex-shrink-0 p-2 border-r border-gray-200 dark:border-gray-700 border-l-4 ${projectColor.border} sticky left-0 bg-white dark:bg-gray-800 z-10`}>
                                    <div className="text-sm font-medium text-gray-800 dark:text-white truncate" title={task.title}>
                                        {task.title}
                                    </div>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <div className={`w-2 h-2 rounded-full ${projectColor.bg}`}></div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {task.projectName}
                                        </span>
                                    </div>
                                </div>

                                {/* Gantt bar area */}
                                <div
                                    className="relative h-14 flex items-center"
                                    style={{ width: columns.length * dayWidth }}
                                >
                                    {/* Background grid */}
                                    <div className="absolute inset-0 flex">
                                        {columns.map((date, idx) => (
                                            <div
                                                key={idx}
                                                style={{ width: dayWidth }}
                                                className={`border-r border-gray-100 dark:border-gray-700 h-full ${isToday(date)
                                                    ? 'bg-dbi-primary/10'
                                                    : isWeekend(date)
                                                        ? 'bg-gray-50 dark:bg-gray-700/30'
                                                        : ''
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Task bar - using project color with status indicator */}
                                    <div
                                        className={`absolute h-8 rounded-md ${projectColor.bg} shadow-sm cursor-pointer transition-transform hover:scale-105`}
                                        style={getBarStyle(task)}
                                        onClick={() => onTaskClick?.(task)}
                                        title={`${task.title}\n${language === 'vi' ? 'Dự án' : 'Project'}: ${task.projectName}\n${formatDate(task.startDate)} - ${formatDate(task.endDate)}`}
                                    >
                                        {/* Task title inside bar */}
                                        <div className="absolute inset-0 flex items-center pl-2 pr-10 z-0">
                                            <span className="text-xs text-white font-medium truncate w-full">
                                                {task.title}
                                            </span>
                                        </div>
                                        {/* Status indicator square at the end - z-10 to stay on top */}
                                        <div className={`absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-sm ${getStatusColor(task.status, task.endDate)} ring-2 ring-white z-10 shadow-sm`}></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Status Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">{language === 'vi' ? 'Trạng thái:' : 'Status:'}</span>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gray-400"></div>
                    <span>{language === 'vi' ? 'Cần làm' : 'Todo'}</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span>{language === 'vi' ? 'Đang làm' : 'In Progress'}</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-yellow-500"></div>
                    <span>Review</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span>{language === 'vi' ? 'Hoàn thành' : 'Done'}</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-500"></div>
                    <span>{language === 'vi' ? 'Quá hạn' : 'Overdue'}</span>
                </div>
            </div>
        </div>
    );
};
