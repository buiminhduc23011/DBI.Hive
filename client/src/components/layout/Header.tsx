import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, User, Menu } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useProjectStore, Task } from '../../stores/projectStore';
import { NotificationDropdown } from '../NotificationDropdown';
import { useI18nStore } from '../../stores/i18nStore';
import { TaskSearch } from '../TaskSearch';
import { TaskDetailModal } from '../TaskDetailModal';

interface HeaderProps {
    onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { projects, selectedProject, setSelectedProject } = useProjectStore();
    const { t } = useI18nStore();
    const [showProjectMenu, setShowProjectMenu] = React.useState(false);
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="flex items-center justify-between px-3 lg:px-6 py-3">
                {/* Left Section: Hamburger + Logo + Project Selector */}
                <div className="flex items-center space-x-2 lg:space-x-4">
                    {/* Hamburger menu - mobile only */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu size={24} className="text-gray-700 dark:text-gray-200" />
                    </button>

                    <div className="flex items-center space-x-2">
                        <img src="/logo.png" alt="DBI.Hive" className="h-8 w-8 object-contain" />
                        <h1 className="text-xl lg:text-2xl font-bold text-dbi-primary hidden sm:block">DBI.Hive</h1>
                    </div>

                    {/* Project Selector - hidden on small mobile */}
                    <div className="relative hidden sm:block" data-onboarding="project-selector">
                        <button
                            onClick={() => setShowProjectMenu(!showProjectMenu)}
                            className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            <span className="font-medium text-gray-700 dark:text-gray-200 text-sm lg:text-base truncate max-w-[100px] lg:max-w-[200px]">
                                {selectedProject ? selectedProject.name : t('common.allProjects')}
                            </span>
                            <ChevronDown size={16} className="text-gray-700 dark:text-gray-200 flex-shrink-0" />
                        </button>

                        {showProjectMenu && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 max-h-96 overflow-y-auto">
                                <button
                                    onClick={() => {
                                        setSelectedProject(null);
                                        setShowProjectMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
                                >
                                    {t('common.allProjects')}
                                </button>
                                {projects.filter(p => !p.isArchived).map((project) => (
                                    <button
                                        key={project.id}
                                        onClick={() => {
                                            setSelectedProject(project);
                                            setShowProjectMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2 text-gray-800 dark:text-gray-200"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: project.color || '#1e40af' }}
                                        />
                                        <span className="truncate">{project.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-2 lg:space-x-4">
                    {/* Task Search - hidden on small mobile */}
                    <div className="hidden md:block">
                        <TaskSearch onTaskSelect={(task) => setSelectedTask(task)} />
                    </div>

                    {/* Notifications */}
                    <div data-onboarding="notifications">
                        <NotificationDropdown />
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-1 lg:space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                        >
                            <div className="w-8 h-8 bg-dbi-primary rounded-full flex items-center justify-center text-white font-medium">
                                {user?.fullName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-200 hidden lg:block">{user?.fullName}</span>
                            <ChevronDown size={16} className="text-gray-700 dark:text-gray-200 hidden lg:block" />
                        </button>

                        {showUserMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                                <button
                                    onClick={() => {
                                        navigate('/settings');
                                        setShowUserMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2 text-gray-800 dark:text-gray-200"
                                >
                                    <User size={16} />
                                    <span>{t('nav.settings')}</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2 text-red-600"
                                >
                                    <LogOut size={16} />
                                    <span>{t('auth.logout')}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Task Detail Modal */}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onTaskUpdate={() => {
                        // Refresh data if needed
                        setSelectedTask(null);
                    }}
                />
            )}
        </header>
    );
};

