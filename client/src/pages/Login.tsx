import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useI18nStore } from '../stores/i18nStore';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, isAuthenticated } = useAuthStore();
    const { t, language, setLanguage } = useI18nStore();
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(emailOrUsername, password);
            navigate('/');
        } catch {
            // Error handled in store
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dbi-primary to-dbi-secondary flex items-center justify-center p-4">
            <div className="absolute top-4 right-4">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'vi')}
                    className="bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/30 backdrop-blur-sm"
                >
                    <option value="vi" className="text-gray-800">🇻🇳 Tiếng Việt</option>
                    <option value="en" className="text-gray-800">🇺🇸 English</option>
                </select>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="h-20 w-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src="/logo.png" alt="DBI.Hive" className="h-16 w-16 object-contain" />
                    </div>
                    <h1 className="text-4xl font-bold text-dbi-primary mb-2">DBI.Hive</h1>
                    <p className="text-gray-600">Task Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('auth.emailOrUsername')}
                        </label>
                        <input
                            type="text"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            className="input-field"
                            placeholder="email@example.com hoặc username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('auth.password')}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? t('auth.signingIn') : t('auth.login')}
                    </button>

                    <p className="text-center text-gray-600">
                        {t('auth.noAccount')}{' '}
                        <Link to="/register" className="text-dbi-primary font-medium hover:underline">
                            {t('auth.register')}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
