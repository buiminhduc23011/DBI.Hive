import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, Folder } from 'lucide-react';
import { Task, TaskItemStatus, Priority } from '../stores/projectStore';
import { useI18nStore } from '../stores/i18nStore';
import api from '../services/api';

interface TaskSearchProps {
    onTaskSelect: (task: Task) => void;
}

const priorityColors = {
    [Priority.Low]: 'bg-gray-200 text-gray-700',
    [Priority.Medium]: 'bg-blue-200 text-blue-700',
    [Priority.High]: 'bg-orange-200 text-orange-700',
    [Priority.Critical]: 'bg-red-200 text-red-700',
};

const statusColors = {
    [TaskItemStatus.Backlog]: 'bg-gray-100 text-gray-600',
    [TaskItemStatus.Todo]: 'bg-gray-100 text-gray-600',
    [TaskItemStatus.InProgress]: 'bg-blue-100 text-blue-600',
    [TaskItemStatus.Review]: 'bg-yellow-100 text-yellow-600',
    [TaskItemStatus.Done]: 'bg-green-100 text-green-600',
};

export const TaskSearch: React.FC<TaskSearchProps> = ({ onTaskSelect }) => {
    const { t, language } = useI18nStore();
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [shortcutLabel, setShortcutLabel] = useState('Ctrl K');
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)) {
            setShortcutLabel('⌘K');
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const searchTasks = async () => {
            if (searchText.trim().length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await api.get('/tasks', {
                    params: { searchText: searchText.trim(), includeBacklog: true }
                });
                setResults(response.data);
            } catch (error) {
                console.error('Search failed:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(searchTasks, 300);
        return () => clearTimeout(debounce);
    }, [searchText]);

    const handleSelect = (task: Task) => {
        onTaskSelect(task);
        setIsOpen(false);
        setSearchText('');
        setResults([]);
    };

    const getPriorityLabel = (priority: Priority) => {
        switch (priority) {
            case Priority.Low: return t('priority.low');
            case Priority.Medium: return t('priority.medium');
            case Priority.High: return t('priority.high');
            case Priority.Critical: return t('priority.critical');
            default: return '';
        }
    };

    const getStatusLabel = (status: TaskItemStatus) => {
        switch (status) {
            case TaskItemStatus.Backlog: return t('kanban.backlog');
            case TaskItemStatus.Todo: return t('kanban.todo');
            case TaskItemStatus.InProgress: return t('kanban.inProgress');
            case TaskItemStatus.Review: return t('kanban.review');
            case TaskItemStatus.Done: return t('kanban.done');
            default: return '';
        }
    };

    const formatDate = (dateString?: string | Date) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div ref={containerRef} className="relative" data-onboarding="search-task">
            {/* Search Button/Input */}
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={language === 'vi' ? 'Tìm kiếm công việc...' : 'Search tasks...'}
                    aria-label={language === 'vi' ? 'Tìm kiếm công việc' : 'Search tasks'}
                    className="w-full md:w-64 pl-10 pr-8 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-dbi-primary focus:bg-white dark:focus:bg-gray-600 rounded-lg text-sm dark:text-white transition-colors"
                />
                {!searchText && (
                    <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none"
                        aria-hidden="true"
                    >
                        <span className="text-gray-400 text-xs bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-500 font-sans opacity-70">
                            {shortcutLabel}
                        </span>
                    </div>
                )}
                {searchText && (
                    <button
                        onClick={() => {
                            setSearchText('');
                            setResults([]);
                            inputRef.current?.focus();
                        }}
                        aria-label={language === 'vi' ? 'Xóa tìm kiếm' : 'Clear search'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && (searchText.length >= 2 || results.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-dbi-primary mx-auto"></div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            {searchText.length < 2 
                                ? (language === 'vi' ? 'Nhập ít nhất 2 ký tự' : 'Enter at least 2 characters')
                                : (language === 'vi' ? 'Không tìm thấy kết quả' : 'No results found')
                            }
                        </div>
                    ) : (
                        <div className="py-2">
                            <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                                {results.length} {language === 'vi' ? 'kết quả' : 'results'}
                            </div>
                            {results.map((task) => (
                                <button
                                    key={task.id}
                                    onClick={() => handleSelect(task)}
                                    className="w-full px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-800 dark:text-white truncate">
                                                {task.title}
                                            </div>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className={`px-1.5 py-0.5 rounded text-xs ${statusColors[task.status]}`}>
                                                    {getStatusLabel(task.status)}
                                                </span>
                                                <span className={`px-1.5 py-0.5 rounded text-xs ${priorityColors[task.priority]}`}>
                                                    {getPriorityLabel(task.priority)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-2 flex flex-col items-end text-xs text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center space-x-1">
                                                <Folder size={12} />
                                                <span className="truncate max-w-20">{task.projectName}</span>
                                            </div>
                                            {task.deadline && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <Calendar size={12} />
                                                    <span>{formatDate(task.deadline)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
