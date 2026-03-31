import React, { useEffect, useState } from 'react';
import { X, Calendar, User, Flag, MessageSquare, Send, Trash2, Edit2, Check, Clock } from 'lucide-react';
import { Task, TaskItemStatus, Priority, useProjectStore } from '../stores/projectStore';
import { useAuthStore } from '../stores/authStore';
import { useI18nStore } from '../stores/i18nStore';
import api from '../services/api';

interface Comment {
    id: string;
    content: string;
    taskId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    createdAt: string;
}

interface TaskDetailModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onTaskUpdate?: () => void;
}

const priorityColors = {
    [Priority.Low]: 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200',
    [Priority.Medium]: 'bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    [Priority.High]: 'bg-orange-200 text-orange-700 dark:bg-orange-900 dark:text-orange-200',
    [Priority.Critical]: 'bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-200',
};

const statusColors = {
    [TaskItemStatus.Backlog]: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    [TaskItemStatus.Todo]: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    [TaskItemStatus.InProgress]: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    [TaskItemStatus.Review]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
    [TaskItemStatus.Done]: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose, onTaskUpdate }) => {
    const { t, language } = useI18nStore();
    const { user } = useAuthStore();
    const { updateTask, deleteTask, users, fetchUsers, projects } = useProjectStore();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assignedToId: task.assignedToId || '',
        startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '',
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
    });

    // Check user role in project
    const taskProject = projects.find(p => p.id === task.projectId);
    const isOwner = taskProject?.ownerId === user?.id;
    const isManager = taskProject?.memberRoles?.[user?.id || ''] === 'Manager';
    const canEdit = isOwner || isManager;

    useEffect(() => {
        if (isOpen) {
            fetchComments();
            fetchUsers();
            setEditData({
                title: task.title,
                description: task.description || '',
                status: task.status,
                priority: task.priority,
                assignedToId: task.assignedToId || '',
                startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '',
                deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
            });
        }
    }, [isOpen, task.id]);

    const fetchComments = async () => {
        setIsLoadingComments(true);
        try {
            const response = await api.get(`/tasks/${task.id}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await api.post(`/tasks/${task.id}/comments`, { content: newComment });
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await api.delete(`/tasks/${task.id}/comments/${commentId}`);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const handleSaveEdit = async () => {
        try {
            await updateTask(task.id, {
                title: editData.title,
                description: editData.description || undefined,
                status: editData.status,
                priority: editData.priority,
                assignedToId: editData.assignedToId || undefined,
                startDate: editData.startDate || undefined,
                deadline: editData.deadline || undefined,
            });
            setIsEditing(false);
            onTaskUpdate?.();
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleDeleteTask = async () => {
        if (window.confirm(language === 'vi' ? 'Bạn có chắc chắn muốn xóa task này?' : 'Are you sure you want to delete this task?')) {
            try {
                await deleteTask(task.id);
                onClose();
                onTaskUpdate?.();
            } catch (error) {
                console.error('Failed to delete task:', error);
            }
        }
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
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 lg:p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-detail-title"
                className="bg-white dark:bg-gray-800 rounded-none lg:rounded-xl shadow-2xl w-full lg:max-w-3xl h-full lg:h-auto lg:max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
                            {getStatusLabel(task.status)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
                            {getPriorityLabel(task.priority)}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {canEdit && (
                            <>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title={t('common.edit')}
                                    aria-label={t('common.edit')}
                                >
                                    <Edit2 size={18} className="text-gray-600 dark:text-gray-400" />
                                </button>
                                <button
                                    onClick={handleDeleteTask}
                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title={t('common.delete')}
                                    aria-label={t('common.delete')}
                                >
                                    <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                                </button>
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            aria-label={t('common.close')}
                        >
                            <X size={20} className="text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Title & Description */}
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    id="task-detail-title"
                                    value={editData.title}
                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                    className="w-full text-xl font-semibold bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 dark:text-white"
                                />
                            ) : (
                                <h2 id="task-detail-title" className="text-xl font-semibold text-gray-800 dark:text-white">{task.title}</h2>
                            )}

                            {isEditing ? (
                                <textarea
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                    placeholder={language === 'vi' ? 'Mô tả...' : 'Description...'}
                                    rows={3}
                                    className="w-full mt-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 dark:text-white resize-none"
                                />
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    {task.description || (language === 'vi' ? 'Không có mô tả' : 'No description')}
                                </p>
                            )}
                        </div>

                        {/* Meta Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Status */}
                            <div className="space-y-1">
                                <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                    <Check size={14} />
                                    <span>{language === 'vi' ? 'Trạng thái' : 'Status'}</span>
                                </label>
                                {isEditing ? (
                                    <select
                                        value={editData.status}
                                        onChange={(e) => setEditData({ ...editData, status: Number(e.target.value) })}
                                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-sm dark:text-white"
                                    >
                                        <option value={TaskItemStatus.Backlog}>{t('kanban.backlog')}</option>
                                        <option value={TaskItemStatus.Todo}>{t('kanban.todo')}</option>
                                        <option value={TaskItemStatus.InProgress}>{t('kanban.inProgress')}</option>
                                        <option value={TaskItemStatus.Review}>{t('kanban.review')}</option>
                                        <option value={TaskItemStatus.Done}>{t('kanban.done')}</option>
                                    </select>
                                ) : (
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
                                        {getStatusLabel(task.status)}
                                    </span>
                                )}
                            </div>

                            {/* Priority */}
                            <div className="space-y-1">
                                <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                    <Flag size={14} />
                                    <span>{t('task.priority')}</span>
                                </label>
                                {isEditing ? (
                                    <select
                                        value={editData.priority}
                                        onChange={(e) => setEditData({ ...editData, priority: Number(e.target.value) })}
                                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-sm dark:text-white"
                                    >
                                        <option value={Priority.Low}>{t('priority.low')}</option>
                                        <option value={Priority.Medium}>{t('priority.medium')}</option>
                                        <option value={Priority.High}>{t('priority.high')}</option>
                                        <option value={Priority.Critical}>{t('priority.critical')}</option>
                                    </select>
                                ) : (
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
                                        {getPriorityLabel(task.priority)}
                                    </span>
                                )}
                            </div>

                            {/* Assignee */}
                            <div className="space-y-1">
                                <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                    <User size={14} />
                                    <span>{language === 'vi' ? 'Người thực hiện' : 'Assignee'}</span>
                                </label>
                                {isEditing && canEdit ? (
                                    <select
                                        value={editData.assignedToId}
                                        onChange={(e) => setEditData({ ...editData, assignedToId: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-sm dark:text-white"
                                    >
                                        <option value="">{language === 'vi' ? 'Chưa gán' : 'Unassigned'}</option>
                                        {(() => {
                                            const taskProject = projects.find(p => p.id === task.projectId);
                                            const projectMembers = users.filter(u =>
                                                taskProject && (
                                                    u.id === taskProject.ownerId ||
                                                    taskProject.memberIds.includes(u.id)
                                                )
                                            );
                                            return projectMembers.map(u => (
                                                <option key={u.id} value={u.id}>{u.fullName}</option>
                                            ));
                                        })()}
                                    </select>
                                ) : (
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {task.assignedToName || (language === 'vi' ? 'Chưa gán' : 'Unassigned')}
                                    </span>
                                )}
                            </div>

                            {/* Start Date */}
                            <div className="space-y-1">
                                <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                    <Calendar size={14} />
                                    <span>{t('task.startDate')}</span>
                                </label>
                                {isEditing && canEdit ? (
                                    <input
                                        type="date"
                                        value={editData.startDate}
                                        onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-sm dark:text-white"
                                    />
                                ) : (
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {formatDate(task.startDate) || (language === 'vi' ? 'Không có' : 'None')}
                                    </span>
                                )}
                            </div>

                            {/* Deadline */}
                            <div className="space-y-1">
                                <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                    <Calendar size={14} />
                                    <span>{language === 'vi' ? 'Hạn chót' : 'Deadline'}</span>
                                </label>
                                {isEditing && canEdit ? (
                                    <input
                                        type="date"
                                        value={editData.deadline}
                                        onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-sm dark:text-white"
                                    />
                                ) : (
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {formatDate(task.deadline) || (language === 'vi' ? 'Không có' : 'None')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Save Button for Edit Mode */}
                        {isEditing && (
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="btn-primary"
                                >
                                    {t('common.save')}
                                </button>
                            </div>
                        )}

                        {/* Project & Created Info */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <span className="flex items-center space-x-1">
                                <span>{language === 'vi' ? 'Dự án:' : 'Project:'}</span>
                                <span className="text-gray-700 dark:text-gray-300">{task.projectName}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <Clock size={14} />
                                <span>{formatDate(task.createdAt)}</span>
                            </span>
                        </div>

                        {/* Comments Section - Only for project members */}
                        {(() => {
                            const taskProject = projects.find(p => p.id === task.projectId);
                            const isProjectMember = taskProject && (
                                taskProject.ownerId === user?.id ||
                                taskProject.memberIds.includes(user?.id || '')
                            );

                            if (!isProjectMember) {
                                return (
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                            {language === 'vi'
                                                ? 'Chỉ thành viên dự án mới được xem bình luận'
                                                : 'Only project members can view comments'}
                                        </p>
                                    </div>
                                );
                            }

                            return (
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <h3 className="font-medium text-gray-800 dark:text-white flex items-center space-x-2 mb-4">
                                        <MessageSquare size={18} />
                                        <span>{language === 'vi' ? 'Bình luận' : 'Comments'} ({comments.length})</span>
                                    </h3>

                                    {/* Comment List */}
                                    <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                                        {isLoadingComments ? (
                                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                                {language === 'vi' ? 'Đang tải...' : 'Loading...'}
                                            </div>
                                        ) : comments.length === 0 ? (
                                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                                {language === 'vi' ? 'Chưa có bình luận' : 'No comments yet'}
                                            </div>
                                        ) : (
                                            comments.map((comment) => (
                                                <div key={comment.id} className="flex space-x-3">
                                                    {comment.userAvatar ? (
                                                        <img src={comment.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-dbi-primary flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                                                            {getInitials(comment.userName)}
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-medium text-gray-800 dark:text-white text-sm">{comment.userName}</span>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(comment.createdAt)}</span>
                                                            </div>
                                                            {comment.userId === user?.id && (
                                                                <button
                                                                    onClick={() => handleDeleteComment(comment.id)}
                                                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                                    aria-label={t('common.delete')}
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Add Comment Form */}
                                    <form onSubmit={handleAddComment} className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder={language === 'vi' ? 'Viết bình luận...' : 'Write a comment...'}
                                            className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:text-white focus:ring-2 focus:ring-dbi-primary focus:border-transparent"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !newComment.trim()}
                                            className="px-4 py-2 bg-dbi-primary text-white rounded-lg hover:bg-dbi-dark disabled:opacity-50 transition-colors"
                                            aria-label={t('common.send')}
                                        >
                                            <Send size={18} />
                                        </button>
                                    </form>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
};
