import React, { useEffect, useState } from 'react';
import { Plus, Calendar, User, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useProjectStore, TaskItemStatus, Priority } from '../stores/projectStore';
import { useI18nStore } from '../stores/i18nStore';

const priorityColors = {
    [Priority.Low]: 'bg-gray-200 text-gray-700',
    [Priority.Medium]: 'bg-blue-200 text-blue-700',
    [Priority.High]: 'bg-orange-200 text-orange-700',
    [Priority.Critical]: 'bg-red-200 text-red-700',
};

export const Backlog: React.FC = () => {
    const { tasks, fetchTasks, createTask, updateTask, projects, fetchProjects, selectedProject, setSelectedProject } = useProjectStore();
    const { t } = useI18nStore();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: Priority.Medium,
        projectId: '',
        deadline: '',
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        fetchTasks(selectedProject ? { projectId: selectedProject.id, includeBacklog: true } : { includeBacklog: true });
    }, [selectedProject]);

    const backlogTasks = tasks.filter(t => t.status === TaskItemStatus.Backlog);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTask({
                ...formData,
                status: TaskItemStatus.Backlog,
            });
            // Refresh tasks to get updated list
            await fetchTasks(selectedProject ? { projectId: selectedProject.id, includeBacklog: true } : { includeBacklog: true });
            closeModal();
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const moveToTodo = async (taskId: string) => {
        try {
            await updateTask(taskId, { status: TaskItemStatus.Todo });
        } catch (error) {
            console.error('Failed to move task:', error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({
            title: '',
            description: '',
            priority: Priority.Medium,
            projectId: selectedProject?.id || '',
            deadline: '',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('nav.backlog')}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {backlogTasks.length} {t('project.tasks')}
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedProject?.id || ''}
                        onChange={(e) => {
                            const project = projects.find(p => p.id === e.target.value);
                            setSelectedProject(project || null);
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-dbi-primary focus:border-transparent"
                    >
                        <option value="">{t('common.allProjects')}</option>
                        {projects.filter(p => !p.isArchived).map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => {
                            const defaultProjectId = selectedProject?.id || projects.filter(p => !p.isArchived)[0]?.id || '';
                            setFormData({
                                ...formData,
                                projectId: defaultProjectId,
                            });
                            setShowModal(true);
                        }}
                        className="btn-primary flex items-center space-x-2"
                        disabled={projects.filter(p => !p.isArchived).length === 0}
                    >
                        <Plus size={20} />
                        <span>{t('common.create')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                {backlogTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('common.noData')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('common.create')}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {backlogTasks.map((task) => (
                            <div
                                key={task.id}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="font-medium text-gray-800 dark:text-white">{task.title}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                                                {t(`priority.${Priority[task.priority].toLowerCase()}`)}
                                            </span>
                                        </div>
                                        {task.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                                                {task.description}
                                            </p>
                                        )}
                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center">
                                                <Calendar size={14} className="mr-1" />
                                                {task.projectName}
                                            </span>
                                            {task.assignedToName && (
                                                <span className="flex items-center">
                                                    <User size={14} className="mr-1" />
                                                    {task.assignedToName}
                                                </span>
                                            )}
                                            {task.deadline && (
                                                <span className="flex items-center">
                                                    <Clock size={14} className="mr-1" />
                                                    {new Date(task.deadline).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => moveToTodo(task.id)}
                                        className="px-4 py-2 bg-dbi-primary text-white rounded-lg hover:bg-dbi-secondary transition-colors flex items-center space-x-2"
                                    >
                                        <CheckCircle size={16} />
                                        <span>{t('kanban.todo')}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('nav.backlog')}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('task.title')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-dbi-primary focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('task.description')}
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-dbi-primary focus:border-transparent"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('task.project')}
                                </label>
                                <select
                                    value={formData.projectId}
                                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-dbi-primary focus:border-transparent"
                                    required
                                >
                                    <option value="">{t('task.selectProject')}</option>
                                    {projects.filter(p => !p.isArchived).map(project => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('task.priority')}
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) as Priority })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-dbi-primary focus:border-transparent"
                                >
                                    <option value={Priority.Low}>{t('priority.low')}</option>
                                    <option value={Priority.Medium}>{t('priority.medium')}</option>
                                    <option value={Priority.High}>{t('priority.high')}</option>
                                    <option value={Priority.Critical}>{t('priority.critical')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('task.deadline')}
                                </label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-dbi-primary focus:border-transparent"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button type="submit" className="btn-primary">
                                    {t('common.create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
