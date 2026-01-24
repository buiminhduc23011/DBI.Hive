import React, { useEffect, useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    useDroppable,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus } from 'lucide-react';
import { useProjectStore, Task, TaskItemStatus, Priority } from '../stores/projectStore';
import { useI18nStore } from '../stores/i18nStore';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';
import { TaskDetailModal } from '../components/TaskDetailModal';

const statusColumns = [
    { id: TaskItemStatus.Todo, titleKey: 'kanban.todo', color: 'bg-gray-100 dark:bg-gray-700' },
    { id: TaskItemStatus.InProgress, titleKey: 'kanban.inProgress', color: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: TaskItemStatus.Review, titleKey: 'kanban.review', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { id: TaskItemStatus.Done, titleKey: 'kanban.done', color: 'bg-green-100 dark:bg-green-900/30' },
];

const priorityColors = {
    [Priority.Low]: 'bg-gray-200 text-gray-700',
    [Priority.Medium]: 'bg-blue-200 text-blue-700',
    [Priority.High]: 'bg-orange-200 text-orange-700',
    [Priority.Critical]: 'bg-red-200 text-red-700',
};

interface TaskCardProps {
    task: Task;
    priorityLabel?: string;
    onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
    const { t } = useI18nStore();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-600 relative"
        >
            {/* Drag handle */}
            <div 
                {...attributes} 
                {...listeners} 
                className="absolute top-2 right-2 cursor-move p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                title="Drag to move"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gray-400">
                    <circle cx="4" cy="4" r="1.5"/>
                    <circle cx="4" cy="8" r="1.5"/>
                    <circle cx="4" cy="12" r="1.5"/>
                    <circle cx="8" cy="4" r="1.5"/>
                    <circle cx="8" cy="8" r="1.5"/>
                    <circle cx="8" cy="12" r="1.5"/>
                    <circle cx="12" cy="4" r="1.5"/>
                    <circle cx="12" cy="8" r="1.5"/>
                    <circle cx="12" cy="12" r="1.5"/>
                </svg>
            </div>
            
            {/* Clickable content */}
            <div
                onClick={(e) => {
                    if (!isDragging && onClick) {
                        e.stopPropagation();
                        onClick();
                    }
                }}
                className="cursor-pointer pr-8"
            >
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">{task.title}</h3>
            {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{task.description}</p>
            )}
            <div className="flex items-center justify-between">
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]
                        }`}
                >
                    {getPriorityLabel(task.priority)}
                </span>
                {task.assignedToName && (
                    <div className="flex items-center space-x-1">
                        <div className="w-6 h-6 bg-dbi-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {task.assignedToName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                )}
            </div>
            {task.deadline && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {t('task.dueDate')}: {new Date(task.deadline).toLocaleDateString()}
                </div>
            )}
            </div>
        </div>
    );
};

interface DroppableColumnProps {
    id: TaskItemStatus;
    title: string;
    color: string;
    tasks: Task[];
    isOver?: boolean;
    dropHereText?: string;
    onTaskClick?: (task: Task) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, title, color, tasks, dropHereText, onTaskClick }) => {
    const { setNodeRef, isOver } = useDroppable({ id: `column-${id}` });

    return (
        <div className={`rounded-lg ${color} p-4 transition-all ${isOver ? 'ring-2 ring-dbi-primary ring-opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 dark:text-white">{title}</h2>
                <span className="bg-white dark:bg-gray-600 px-2 py-1 rounded-full text-sm font-medium dark:text-white">
                    {tasks.length}
                </span>
            </div>

            <SortableContext
                items={tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
            >
                <div 
                    ref={setNodeRef}
                    className={`space-y-3 min-h-[200px] rounded-lg transition-colors ${isOver ? 'bg-dbi-primary/10' : ''}`}
                >
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
                    ))}
                    {tasks.length === 0 && (
                        <div className={`h-[200px] flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm border-2 border-dashed rounded-lg ${isOver ? 'border-dbi-primary bg-dbi-primary/5' : 'border-gray-300 dark:border-gray-600'}`}>
                            {dropHereText || 'Drop tasks here'}
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
};

export const KanbanBoard: React.FC = () => {
    const { tasks, fetchTasks, updateTask, createTask, selectedProject, projects } = useProjectStore();
    const { t, language } = useI18nStore();
    const { user } = useAuthStore();
    const { addToast } = useToastStore();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: Priority.Medium,
        projectId: '',
        status: TaskItemStatus.Todo,
        deadline: '',
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const filter = selectedProject ? { projectId: selectedProject.id } : {};
        fetchTasks(filter);
    }, [selectedProject]);

    const tasksByStatus = statusColumns.map((column) => ({
        ...column,
        title: t(column.titleKey),
        tasks: tasks.filter((task) => task.status === column.id),
    }));

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeTask = tasks.find((t) => t.id === active.id);
        if (!activeTask) return;

        const overId = over.id.toString();
        let targetStatus: TaskItemStatus | null = null;

        // Check if dropped on a column
        if (overId.startsWith('column-')) {
            targetStatus = Number(overId.replace('column-', '')) as TaskItemStatus;
        } else {
            // Dropped on a task - find which column that task belongs to
            const overTask = tasks.find((t) => t.id === overId);
            if (overTask) {
                targetStatus = overTask.status;
            }
        }

        if (targetStatus !== null && activeTask.status !== targetStatus) {
            // Find the project of the task being dragged
            const taskProject = selectedProject || projects.find(p => p.id === activeTask.projectId);
            
            // Permission check
            const isOwner = taskProject?.ownerId === user?.id;
            const isManager = taskProject?.memberRoles?.[user?.id || ''] === 'Manager';
            
            // If user is not owner and not manager, they are treated as member with restricted permissions
            const hasRestrictedAccess = !isOwner && !isManager;
            
            // Members (or anyone who is not owner/manager) can only move tasks assigned to them
            if (hasRestrictedAccess) {
                // Members cannot move unassigned tasks
                if (!activeTask.assignedToId) {
                    addToast(
                        language === 'vi'
                            ? 'Công việc chưa được giao cho ai, bạn không thể di chuyển'
                            : 'Task is not assigned to anyone, you cannot move it',
                        'warning'
                    );
                    return;
                }
                
                // Members can only move tasks assigned to them
                if (activeTask.assignedToId !== user?.id) {
                    addToast(
                        language === 'vi'
                            ? 'Bạn chỉ có thể di chuyển công việc được giao cho mình'
                            : 'You can only move tasks assigned to you',
                        'warning'
                    );
                    return;
                }
                
                // Members can only move between Todo, InProgress, and Review
                const allowedStatuses = [TaskItemStatus.Todo, TaskItemStatus.InProgress, TaskItemStatus.Review];
                if (!allowedStatuses.includes(targetStatus) || !allowedStatuses.includes(activeTask.status)) {
                    addToast(
                        language === 'vi'
                            ? 'Bạn chỉ có thể di chuyển công việc giữa: Cần làm, Đang thực hiện và Xem xét'
                            : 'You can only move tasks between: To Do, In Progress and Review',
                        'warning'
                    );
                    return;
                }
            }
            
            // Only project owner or manager can move to Done
            if (targetStatus === TaskItemStatus.Done) {
                if (!isOwner && !isManager) {
                    addToast(
                        language === 'vi' 
                            ? 'Chỉ chủ dự án hoặc quản lý mới có thể chuyển sang Hoàn thành'
                            : 'Only project owner or manager can move tasks to Done',
                        'warning'
                    );
                    return;
                }
            }
            
            // Optimistic update is handled in the store
            await updateTask(activeTask.id, { status: targetStatus });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTask({
                ...formData,
                projectId: formData.projectId || selectedProject?.id || projects[0]?.id,
            });
            fetchTasks(selectedProject ? { projectId: selectedProject.id } : {});
            setShowModal(false);
            setFormData({
                title: '',
                description: '',
                priority: Priority.Medium,
                projectId: '',
                status: TaskItemStatus.Todo,
                deadline: '',
            });
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('kanban.title')}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {selectedProject ? selectedProject.name : t('common.allProjects')}
                    </p>
                </div>
                {(() => {
                    const isOwner = selectedProject?.ownerId === user?.id;
                    const isManager = selectedProject?.memberRoles?.[user?.id || ''] === 'Manager';
                    const canCreateTask = isOwner || isManager;
                    
                    return canCreateTask ? (
                        <button 
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    projectId: selectedProject?.id || projects[0]?.id || '',
                                });
                                setShowModal(true);
                            }}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <Plus size={20} />
                            <span>{t('kanban.newTask')}</span>
                        </button>
                    ) : null;
                })()}
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tasksByStatus.map((column) => (
                        <DroppableColumn
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            color={column.color}
                            tasks={column.tasks}
                            dropHereText={t('kanban.dropHere')}
                            onTaskClick={(task) => setSelectedTask(task)}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeId ? (
                        <TaskCard task={tasks.find((t) => t.id === activeId)!} />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* New Task Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('kanban.newTask')}</h2>
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('task.status')}
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) as TaskItemStatus })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-dbi-primary focus:border-transparent"
                                >
                                    <option value={TaskItemStatus.Todo}>{t('kanban.todo')}</option>
                                    <option value={TaskItemStatus.InProgress}>{t('kanban.inProgress')}</option>
                                    <option value={TaskItemStatus.Review}>{t('kanban.review')}</option>
                                    <option value={TaskItemStatus.Done}>{t('kanban.done')}</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button type="submit" className="btn-primary">
                                    {t('task.createTask')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Task Detail Modal */}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onTaskUpdate={() => {
                        const filter = selectedProject ? { projectId: selectedProject.id } : {};
                        fetchTasks(filter);
                        setSelectedTask(null);
                    }}
                />
            )}
        </div>
    );
};
