import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderKanban,
    Kanban,
    ListTodo,
    Calendar,
    Settings,
    X,
} from 'lucide-react';
import { useI18nStore } from '../../stores/i18nStore';

interface SidebarProps {
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
    const { t } = useI18nStore();

    const menuItems = [
        { to: '/', icon: LayoutDashboard, label: t('nav.dashboard'), onboardingId: 'nav-dashboard' },
        { to: '/projects', icon: FolderKanban, label: t('nav.projects'), onboardingId: 'nav-projects' },
        { to: '/kanban', icon: Kanban, label: t('nav.kanban'), onboardingId: 'nav-kanban' },
        { to: '/backlog', icon: ListTodo, label: t('nav.backlog'), onboardingId: 'nav-backlog' },
        { to: '/calendar', icon: Calendar, label: t('nav.calendar'), onboardingId: 'nav-calendar' },
        { to: '/settings', icon: Settings, label: t('nav.settings'), onboardingId: 'nav-settings' },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen flex flex-col" data-onboarding="sidebar">
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-semibold text-gray-800 dark:text-white">Menu</span>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Close menu"
                >
                    <X size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
            </div>

            <nav className="p-4 space-y-2 flex-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        data-onboarding={item.onboardingId}
                        onClick={onClose} // Close sidebar on mobile when navigating
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-dbi-primary text-white shadow-md'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

