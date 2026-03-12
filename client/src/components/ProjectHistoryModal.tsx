import React, { useEffect, useState } from 'react';
import { X, Calendar, User } from 'lucide-react';
import { useI18nStore } from '../stores/i18nStore';
import api from '../services/api';
import { Project } from '../stores/projectStore';

interface ProjectReport {
    id: string;
    projectId: string;
    reporterName: string;
    content: string;
    status: string;
    progressPercentage: number;
    reportDate: string;
}

interface ProjectHistoryModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

const statusColors: Record<string, string> = {
    'OnTrack': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    'AtRisk': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
    'Delayed': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
    'Completed': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
};

export const ProjectHistoryModal: React.FC<ProjectHistoryModalProps> = ({ project, isOpen, onClose }) => {
    const { language } = useI18nStore();
    const [reports, setReports] = useState<ProjectReport[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchReports();
        }
    }, [isOpen, project.id]);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/projectReports/${project.id}`);
            setReports(response.data);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold dark:text-white">
                        {language === 'vi' ? 'Lịch sử báo cáo' : 'Report History'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                    {isLoading ? (
                        <div className="text-center py-4 text-gray-500">{language === 'vi' ? 'Đang tải...' : 'Loading...'}</div>
                    ) : reports.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">{language === 'vi' ? 'Chưa có báo cáo nào' : 'No reports found'}</div>
                    ) : (
                        reports.map((report) => (
                            <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[report.status] || 'bg-gray-100'}`}>
                                            {report.status}
                                        </span>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {report.progressPercentage}%
                                        </span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                                        <span className="flex items-center space-x-1">
                                            <User size={12} />
                                            <span>{report.reporterName}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <Calendar size={12} />
                                            <span>{formatDate(report.reportDate)}</span>
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap">
                                    {report.content}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
