import React, { useState, useRef } from 'react';
import { User, Bell, Palette, Shield, LogOut, RotateCcw, Camera, Globe } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useI18nStore } from '../stores/i18nStore';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
    const { user, logout, updateProfile } = useAuthStore();
    const { isDarkMode, setDarkMode } = useThemeStore();
    const { t, language, setLanguage } = useI18nStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [profileData, setProfileData] = useState({
        fullName: user?.fullName || '',
        username: user?.username || '',
    });
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        taskReminders: true,
        deadlineAlerts: true,
        projectUpdates: false,
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setAvatarPreview(base64);
                // In a real app, upload to server and update profile
                updateProfile({ avatarUrl: base64 }).catch(console.error);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setSaveMessage(null);
        try {
            await updateProfile({
                fullName: profileData.fullName,
                username: profileData.username,
            });
            setSaveMessage({ type: 'success', text: language === 'vi' ? 'Đã lưu thay đổi!' : 'Changes saved!' });
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error: any) {
            setSaveMessage({ type: 'error', text: error.message || (language === 'vi' ? 'Lỗi khi lưu' : 'Failed to save') });
        } finally {
            setIsSaving(false);
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        const parts = name.split(' ').filter(Boolean);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    const tabs = [
        { id: 'profile', label: t('settings.profile'), icon: User },
        { id: 'notifications', label: t('settings.notifications'), icon: Bell },
        { id: 'appearance', label: t('settings.appearance'), icon: Palette },
        { id: 'security', label: t('settings.security'), icon: Shield },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('settings.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{t('settings.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                                    ${activeTab === tab.id
                                        ? 'bg-dbi-primary text-white'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                <tab.icon size={20} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut size={20} />
                            <span>{t('auth.logout')}</span>
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold dark:text-white">{t('settings.profileSettings')}</h2>
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    {avatarPreview ? (
                                        <img 
                                            src={avatarPreview} 
                                            alt="Avatar" 
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-dbi-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                            {getInitials(user?.fullName)}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 w-8 h-8 bg-dbi-primary rounded-full flex items-center justify-center text-white hover:bg-dbi-dark transition-colors shadow-lg"
                                    >
                                        <Camera size={16} />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg dark:text-white">{user?.fullName || 'User'}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500 capitalize">{user?.role || 'Member'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('auth.fullName')}
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.fullName}
                                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('auth.username')}
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.username}
                                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('auth.email')}
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue={user?.email}
                                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-100"
                                        disabled
                                    />
                                </div>
                            </div>

                            {saveMessage && (
                                <div className={`px-4 py-2 rounded-lg ${saveMessage.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {saveMessage.text}
                                </div>
                            )}

                            <button 
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="btn-primary disabled:opacity-50"
                            >
                                {isSaving ? (language === 'vi' ? 'Đang lưu...' : 'Saving...') : t('settings.saveChanges')}
                            </button>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold dark:text-white">{t('settings.notificationPrefs')}</h2>
                            <div className="space-y-4">
                                {Object.entries(notifications).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                                        <div>
                                            <h4 className="font-medium text-gray-800 dark:text-gray-200">
                                                {t(`notification.${key}`)}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {language === 'vi' ? 'Nhận thông báo về' : 'Receive notifications for'} {key.toLowerCase().replace(/([A-Z])/g, ' $1')}
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={() => setNotifications({ ...notifications, [key]: !value })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 dark:peer-focus:ring-blue-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dbi-primary"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold dark:text-white">{t('settings.appearanceSettings')}</h2>
                            <div className="space-y-6">
                                {/* Language */}
                                <div>
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center space-x-2">
                                        <Globe size={18} />
                                        <span>{t('settings.language')}</span>
                                    </h4>
                                    <div className="flex space-x-4">
                                        <button 
                                            onClick={() => {
                                                setLanguage('vi');
                                                updateProfile({ language: 'vi' }).catch(console.error);
                                            }}
                                            className={`px-6 py-3 border-2 rounded-lg transition-all flex items-center space-x-2 ${language === 'vi' ? 'border-dbi-primary bg-dbi-primary/10 dark:bg-dbi-primary/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
                                        >
                                            <span className="text-2xl">🇻🇳</span>
                                            <span className="text-gray-800 dark:text-gray-200">Tiếng Việt</span>
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setLanguage('en');
                                                updateProfile({ language: 'en' }).catch(console.error);
                                            }}
                                            className={`px-6 py-3 border-2 rounded-lg transition-all flex items-center space-x-2 ${language === 'en' ? 'border-dbi-primary bg-dbi-primary/10 dark:bg-dbi-primary/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
                                        >
                                            <span className="text-2xl">🇺🇸</span>
                                            <span className="text-gray-800 dark:text-gray-200">English</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Theme */}
                                <div>
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">{t('settings.theme')}</h4>
                                    <div className="flex space-x-4">
                                        <button 
                                            onClick={() => {
                                                setDarkMode(false);
                                                updateProfile({ theme: 'light' }).catch(console.error);
                                            }}
                                            className={`p-4 border-2 rounded-lg bg-white transition-all ${!isDarkMode ? 'border-dbi-primary ring-2 ring-dbi-primary/20' : 'border-gray-200'}`}
                                        >
                                            <div className="w-16 h-12 bg-gray-100 rounded mb-2 flex items-center justify-center">
                                                <div className="w-8 h-6 bg-white border border-gray-300 rounded"></div>
                                            </div>
                                            <span className="text-sm text-gray-800">{t('settings.light')}</span>
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setDarkMode(true);
                                                updateProfile({ theme: 'dark' }).catch(console.error);
                                            }}
                                            className={`p-4 border-2 rounded-lg bg-gray-800 transition-all ${isDarkMode ? 'border-dbi-primary ring-2 ring-dbi-primary/20' : 'border-gray-600'}`}
                                        >
                                            <div className="w-16 h-12 bg-gray-700 rounded mb-2 flex items-center justify-center">
                                                <div className="w-8 h-6 bg-gray-600 border border-gray-500 rounded"></div>
                                            </div>
                                            <span className="text-sm text-white">{t('settings.dark')}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">{t('settings.onboardingGuide')}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        {t('settings.onboardingDesc')}
                                    </p>
                                    <button 
                                        onClick={() => {
                                            localStorage.removeItem('dbi_hive_onboarding_completed');
                                            window.location.reload();
                                        }}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors dark:text-gray-200"
                                    >
                                        <RotateCcw size={18} />
                                        <span>{t('settings.restartOnboarding')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold dark:text-white">{t('settings.securitySettings')}</h2>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">{t('settings.changePassword')}</h4>
                                    <div className="space-y-3 max-w-md">
                                        <input
                                            type="password"
                                            placeholder={t('settings.currentPassword')}
                                            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        <input
                                            type="password"
                                            placeholder={t('settings.newPassword')}
                                            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        <input
                                            type="password"
                                            placeholder={t('settings.confirmNewPassword')}
                                            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        <button className="btn-primary">{t('settings.updatePassword')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
