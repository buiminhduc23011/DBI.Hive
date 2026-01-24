import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderKanban,
    Kanban,
    ListTodo,
    Calendar,
    Settings,
} from 'lucide-react';
import { useI18nStore } from '../../stores/i18nStore';

export const Sidebar: React.FC = () => {
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
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen" data-onboarding="sidebar">
            <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        data-onboarding={item.onboardingId}
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
