import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Task } from '../stores/projectStore';
import { useI18nStore } from '../stores/i18nStore';

interface UnassignedTasksModalProps {
    tasks: Task[];
    onClose: () => void;
}

export const UnassignedTasksModal: React.FC<UnassignedTasksModalProps> = ({ tasks, onClose }) => {
    const { t } = useI18nStore();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center space-x-2">
                        <AlertCircle size={24} className="text-orange-500" />
                        <span>{t('dashboard.unassignedTasks')}</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {tasks.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">🎉 {t('dashboard.allAssigned')}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500"
                                >
                                    <h3 className="font-medium text-gray-800 dark:text-white">{task.title}</h3>
                                    {task.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                                    )}
                                    <div className="flex items-center space-x-3 mt-2 text-sm">
                                        <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs">
                                            {task.projectName}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            task.status === 0 ? 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200' :
                                            task.status === 1 ? 'bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                                            task.status === 2 ? 'bg-yellow-200 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                                            'bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                                        }`}>
                                            {task.status === 0 ? t('kanban.todo') :
                                             task.status === 1 ? t('kanban.inProgress') :
                                             task.status === 2 ? t('kanban.review') : t('kanban.done')}
                                        </span>
                                        {task.deadline && (
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {new Date(task.deadline).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="btn-secondary w-full"
                    >
                        {t('common.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};
