import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useI18nStore } from '../stores/i18nStore';
import api from '../services/api';
import { Project } from '../stores/projectStore';

interface ProjectReportModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const ProjectReportModal: React.FC<ProjectReportModalProps> = ({ project, isOpen, onClose, onSuccess }) => {
    const { t, language } = useI18nStore();
    const [status, setStatus] = useState('OnTrack');
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/projectReports', {
                projectId: project.id,
                content,
                status,
                progressPercentage
            });
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Failed to submit report:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold dark:text-white">
                        {language === 'vi' ? 'Báo cáo tiến độ' : 'Progress Report'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {language === 'vi' ? 'Trạng thái' : 'Status'}
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 dark:text-white"
                        >
                            <option value="OnTrack">{language === 'vi' ? 'Đúng tiến độ' : 'On Track'}</option>
                            <option value="AtRisk">{language === 'vi' ? 'Có rủi ro' : 'At Risk'}</option>
                            <option value="Delayed">{language === 'vi' ? 'Chậm trễ' : 'Delayed'}</option>
                            <option value="Completed">{language === 'vi' ? 'Hoàn thành' : 'Completed'}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {language === 'vi' ? 'Tiến độ (%)' : 'Progress (%)'}
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={progressPercentage}
                            onChange={(e) => setProgressPercentage(parseInt(e.target.value))}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {language === 'vi' ? 'Nội dung báo cáo' : 'Report Content'}
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={4}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary"
                        >
                            {t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
