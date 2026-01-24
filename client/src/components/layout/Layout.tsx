import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Auto-close sidebar khi navigate tới page khác (mobile)
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const openSidebar = () => setIsSidebarOpen(true);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Header onMenuClick={openSidebar} />
            <div className="flex relative">
                {/* Mobile overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
                        onClick={closeSidebar}
                    />
                )}

                {/* Sidebar - hidden on mobile by default, slide-in when open */}
                <div className={`
                    fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0
                `}>
                    <Sidebar onClose={closeSidebar} />
                </div>

                <main className="flex-1 p-4 lg:p-6 min-w-0 w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
