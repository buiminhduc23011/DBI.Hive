import React, { useEffect, useState } from 'react';
import { X, UserPlus, Trash2 } from 'lucide-react';
import { Project, useProjectStore } from '../stores/projectStore';
import { useAuthStore } from '../stores/authStore';
import { useI18nStore } from '../stores/i18nStore';

interface ProjectMembersProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

export const ProjectMembers: React.FC<ProjectMembersProps> = ({ project, isOpen, onClose }) => {
    const { users, fetchUsers, addProjectMember, removeProjectMember } = useProjectStore();
    const { user } = useAuthStore();
    const { language } = useI18nStore();
    const [memberEmail, setMemberEmail] = useState('');
    const [memberRole, setMemberRole] = useState('Member');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const isOwner = user?.id === project.ownerId;
    const projectMembers = users.filter(u => project.memberIds.includes(u.id));

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!memberEmail.trim()) return;

        setIsSubmitting(true);
        setError('');
        try {
            await addProjectMember(project.id, memberEmail.trim(), memberRole);
            setMemberEmail('');
            setMemberRole('Member');
        } catch (error: any) {
            console.error('Failed to add member:', error);
            setError(error.response?.data?.message || (language === 'vi' ? 'Không tìm thấy người dùng với email này' : 'User not found with this email'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (window.confirm(language === 'vi' ? 'Xóa thành viên khỏi dự án?' : 'Remove member from project?')) {
            try {
                await removeProjectMember(project.id, userId);
            } catch (error) {
                console.error('Failed to remove member:', error);
            }
        }
    };

    const getInitials = (name: string) => {
        const parts = name.split(' ').filter(Boolean);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {language === 'vi' ? 'Thành viên dự án' : 'Project Members'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {/* Owner */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            {language === 'vi' ? 'Chủ dự án' : 'Owner'}
                        </h3>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="w-10 h-10 bg-dbi-primary rounded-full flex items-center justify-center text-white font-medium">
                                {getInitials(users.find(u => u.id === project.ownerId)?.fullName || 'O')}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {users.find(u => u.id === project.ownerId)?.fullName || language === 'vi' ? 'Chủ dự án' : 'Owner'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {users.find(u => u.id === project.ownerId)?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Members */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            {language === 'vi' ? 'Thành viên' : 'Members'} ({projectMembers.length})
                        </h3>
                        {projectMembers.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                {language === 'vi' ? 'Chưa có thành viên' : 'No members yet'}
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {projectMembers.map(member => {
                                    const role = project.memberRoles?.[member.id] || 'Member';
                                    return (
                                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                                    {getInitials(member.fullName)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <p className="font-medium text-gray-800 dark:text-white">{member.fullName}</p>
                                                        <span className={`text-xs px-2 py-0.5 rounded ${
                                                            role === 'Manager' 
                                                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                                                                : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
                                                        }`}>
                                                            {role === 'Manager' 
                                                                ? (language === 'vi' ? 'Quản lý' : 'Manager')
                                                                : (language === 'vi' ? 'Nhân viên' : 'Member')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                                                </div>
                                            </div>
                                            {isOwner && (
                                                <button
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Add Member Form (Only for owner) */}
                    {isOwner && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                {language === 'vi' ? 'Thêm thành viên' : 'Add Member'}
                            </h3>
                            {error && (
                                <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleAddMember} className="space-y-2">
                                <input
                                    type="email"
                                    value={memberEmail}
                                    onChange={(e) => setMemberEmail(e.target.value)}
                                    placeholder={language === 'vi' ? 'Nhập email người dùng' : 'Enter user email'}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-dbi-primary focus:border-transparent"
                                    required
                                />
                                <div className="flex space-x-2">
                                    <select
                                        value={memberRole}
                                        onChange={(e) => setMemberRole(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-dbi-primary focus:border-transparent"
                                    >
                                        <option value="Member">{language === 'vi' ? 'Nhân viên' : 'Member'}</option>
                                        <option value="Manager">{language === 'vi' ? 'Quản lý' : 'Manager'}</option>
                                    </select>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !memberEmail.trim()}
                                        className="px-4 py-2 bg-dbi-primary text-white rounded-lg hover:bg-dbi-dark disabled:opacity-50 transition-colors flex items-center space-x-2"
                                    >
                                        <UserPlus size={18} />
                                        <span>{language === 'vi' ? 'Thêm' : 'Add'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
