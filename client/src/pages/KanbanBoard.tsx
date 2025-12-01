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
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus } from 'lucide-react';
import { useProjectStore, Task, TaskItemStatus, Priority } from '../stores/projectStore';

const statusColumns = [
    { id: TaskItemStatus.Todo, title: 'To Do', color: 'bg-gray-100' },
    { id: TaskItemStatus.InProgress, title: 'In Progress', color: 'bg-blue-100' },
    { id: TaskItemStatus.Review, title: 'Review', color: 'bg-yellow-100' },
    { id: TaskItemStatus.Done, title: 'Done', color: 'bg-green-100' },
];

const priorityColors = {
    [Priority.Low]: 'bg-gray-200 text-gray-700',
    [Priority.Medium]: 'bg-blue-200 text-blue-700',
    [Priority.High]: 'bg-orange-200 text-orange-700',
    [Priority.Critical]: 'bg-red-200 text-red-700',
};

const priorityLabels = {
    [Priority.Low]: 'Low',
    [Priority.Medium]: 'Medium',
    [Priority.High]: 'High',
    [Priority.Critical]: 'Critical',
};

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing border border-gray-200"
        >
            <h3 className="font-medium text-gray-800 mb-2">{task.title}</h3>
            {task.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
            )}
            <div className="flex items-center justify-between">
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]
                        }`}
                >
                    {priorityLabels[task.priority]}
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
                <div className="mt-2 text-xs text-gray-500">
                    Due: {new Date(task.deadline).toLocaleDateString()}
                </div>
            )}
        </div>
    );
};

export const KanbanBoard: React.FC = () => {
    const { tasks, fetchTasks, updateTask, selectedProject } = useProjectStore();
    const [activeId, setActiveId] = useState<number | null>(null);

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
        tasks: tasks.filter((task) => task.status === column.id),
    }));

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as number);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeTask = tasks.find((t) => t.id === active.id);
        if (!activeTask) return;

        // Check if dropped in a different column
        const overId = over.id;
        const overColumn = statusColumns.find((col) =>
            col.id.toString() === overId.toString() ||
            tasksByStatus.find((c) => c.id === col.id)?.tasks.some((t) => t.id === overId)
        );

        if (overColumn && activeTask.status !== overColumn.id) {
            await updateTask(activeTask.id, { status: overColumn.id });
            fetchTasks(selectedProject ? { projectId: selectedProject.id } : {});
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kanban Board</h1>
                    <p className="text-gray-600 mt-1">
                        {selectedProject ? selectedProject.name : 'All Projects'}
                    </p>
                </div>
                <button className="btn-primary flex items-center space-x-2">
                    <Plus size={20} />
                    <span>New Task</span>
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tasksByStatus.map((column) => (
                        <div key={column.id} className={`rounded-lg ${column.color} p-4`}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-gray-800">{column.title}</h2>
                                <span className="bg-white px-2 py-1 rounded-full text-sm font-medium">
                                    {column.tasks.length}
                                </span>
                            </div>

                            <SortableContext
                                items={column.tasks.map((t) => t.id)}
                                strategy={verticalListSortingStrategy}
                                id={column.id.toString()}
                            >
                                <div className="space-y-3 min-h-[200px]">
                                    {column.tasks.map((task) => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}
                                </div>
                            </SortableContext>
                        </div>
                    ))}
                </div>

                <DragOverlay>
                    {activeId ? (
                        <TaskCard task={tasks.find((t) => t.id === activeId)!} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};
