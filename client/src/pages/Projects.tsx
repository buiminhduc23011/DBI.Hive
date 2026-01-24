import React, { useEffect, useState } from 'react';
import { Plus, FolderKanban, MoreVertical, Edit2, Trash2, Archive, Users } from 'lucide-react';
import { useProjectStore, Project } from '../stores/projectStore';
import { useI18nStore } from '../stores/i18nStore';
import { useAuthStore } from '../stores/authStore';
import { ProjectMembers } from '../components/ProjectMembers';

export const Projects: React.FC = () => {
    const { projects, fetchProjects, createProject, updateProject, deleteProject, isLoading } = useProjectStore();
    const { t } = useI18nStore();
    const { user } = useAuthStore();
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', color: '#1e40af' });
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [showArchived, setShowArchived] = useState(false);
    const [selectedProjectForMembers, setSelectedProjectForMembers] = useState<Project | null>(null);

    useEffect(() => {
        fetchProjects(showArchived);
    }, [showArchived]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProject) {
                await updateProject(editingProject.id, formData);
            } else {
                await createProject(formData);
            }
            closeModal();
        } catch (error) {
            console.error('Failed to save project:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id);
            } catch (error) {
                console.error('Failed to delete project:', error);
            }
        }
        setOpenMenu(null);
    };

    const handleArchive = async (project: Project) => {
        try {
            await updateProject(project.id, { isArchived: !project.isArchived });
        } catch (error) {
            console.error('Failed to archive project:', error);
        }
        setOpenMenu(null);
    };

    const openEditModal = (project: Project) => {
        setEditingProject(project);
        setFormData({ name: project.name, description: project.description || '', color: project.color || '#1e40af' });
        setShowModal(true);
        setOpenMenu(null);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProject(null);
        setFormData({ name: '', description: '', color: '#1e40af' });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dbi-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('project.title')}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{t('project.description')}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showArchived}
                            onChange={(e) => setShowArchived(e.target.checked)}
                            className="w-4 h-4 text-dbi-primary bg-gray-100 border-gray-300 rounded focus:ring-dbi-primary dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('project.showArchived')}</span>
                    </label>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus size={20} />
                        <span>{t('project.newProject')}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: project.color || '#1e40af' }}
                                >
                                    <FolderKanban className="text-white" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-white">{project.name}</h3>
                                    {project.isArchived && (
                                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                            {t('project.archived')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setOpenMenu(openMenu === project.id ? null : project.id)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                    <MoreVertical size={20} className="text-gray-500 dark:text-gray-400" />
                                </button>
                                {openMenu === project.id && (() => {
                                    const isOwner = project.ownerId === user?.id;
                                    const isManager = project.memberRoles?.[user?.id || ''] === 'Manager';
                                    const canManage = isOwner || isManager;
                                    
                                    return (
                                    <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                                        {canManage && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProjectForMembers(project);
                                                        setOpenMenu(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 dark:text-gray-200"
                                                >
                                                    <Users size={16} />
                                                    <span>{t('project.manageMembers')}</span>
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(project)}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 dark:text-gray-200"
                                                >
                                                    <Edit2 size={16} />
                                                    <span>{t('common.edit')}</span>
                                                </button>
                                                <button
                                                    onClick={() => handleArchive(project)}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 dark:text-gray-200"
                                                >
                                                    <Archive size={16} />
                                                    <span>{project.isArchived ? t('project.unarchive') : t('project.archive')}</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600"
                                                >
                                                    <Trash2 size={16} />
                                                    <span>{t('common.delete')}</span>
                                                </button>
                                            </>
                                        )}
                                        {!canManage && (
                                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                {t('project.noPermission')}
                                            </div>
                                        )}
                                    </div>
                                    );
                                })()}
                            </div>
                        </div>
                        {project.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 line-clamp-2">{project.description}</p>
                        )}
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t('project.tasks')}</span>
                                <span className="font-medium dark:text-white">
                                    {project.completedTaskCount} / {project.taskCount}
                                </span>
                            </div>
                            {project.taskCount > 0 && (
                                <div className="mt-2 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full transition-all"
                                        style={{
                                            width: `${(project.completedTaskCount / project.taskCount) * 100}%`,
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-12">
                    <FolderKanban size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('common.noData')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{t('project.newProject')}</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">
                            {editingProject ? t('project.editProject') : t('project.newProject')}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('project.name')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-dbi-primary focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('project.description')}
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
                                    {t('project.color')}
                                </label>
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="w-12 h-10 p-1 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
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
                                    {editingProject ? t('common.save') : t('common.create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Project Members Modal */}
            {selectedProjectForMembers && (
                <ProjectMembers
                    project={selectedProjectForMembers}
                    isOpen={!!selectedProjectForMembers}
                    onClose={() => setSelectedProjectForMembers(null)}
                />
            )}
        </div>
    );
};
