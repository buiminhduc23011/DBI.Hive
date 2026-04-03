import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useI18nStore } from '../stores/i18nStore';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register, isLoading, error, isAuthenticated } = useAuthStore();
    const { t, language, setLanguage } = useI18nStore();
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (password !== confirmPassword) {
            setLocalError(language === 'vi' ? 'Mật khẩu không khớp' : 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setLocalError(language === 'vi' ? 'Mật khẩu phải ít nhất 6 ký tự' : 'Password must be at least 6 characters');
            return;
        }

        try {
            await register(email, password, fullName, username);
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
                    <img src="/logo.png" alt="DBI.Hive" className="h-20 w-20 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-dbi-primary mb-2">DBI.Hive</h1>
                    <p className="text-gray-600">{language === 'vi' ? 'Tạo tài khoản mới' : 'Create your account'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {(error || localError) && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {localError || error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('auth.fullName')}
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="input-field"
                            placeholder="Nguyễn Văn A"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('auth.username')}
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field"
                            placeholder="nguyenvana"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('auth.email')}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="email@example.com"
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
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('auth.confirmPassword')}
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {isLoading ? t('auth.signingUp') : t('auth.register')}
                    </button>

                    <p className="text-center text-gray-600">
                        {t('auth.hasAccount')}{' '}
                        <Link to="/login" className="text-dbi-primary font-medium hover:underline">
                            {t('auth.login')}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
