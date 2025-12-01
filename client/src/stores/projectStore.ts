import { create } from 'zustand';
import api from '../services/api';

export enum TaskItemStatus {
    Todo = 0,
    InProgress = 1,
    Review = 2,
    Done = 3,
    Backlog = 4,
}

export enum Priority {
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3,
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskItemStatus;
    priority: Priority;
    projectId: number;
    projectName: string;
    sprintId?: number;
    sprintName?: string;
    assignedToId?: number;
    assignedToName?: string;
    deadline?: string;
    createdAt: string;
    updatedAt?: string;
    completedAt?: string;
    orderIndex: number;
    commentCount: number;
    attachmentCount: number;
}

export interface Project {
    id: number;
    name: string;
    description?: string;
    color?: string;
    createdAt: string;
    updatedAt?: string;
    isArchived: boolean;
    taskCount: number;
    completedTaskCount: number;
}

interface ProjectState {
    projects: Project[];
    selectedProject: Project | null;
    tasks: Task[];
    isLoading: boolean;
    error: string | null;

    fetchProjects: () => Promise<void>;
    fetchTasks: (filter?: any) => Promise<void>;
    createTask: (task: Partial<Task>) => Promise<void>;
    updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: number) => Promise<void>;
    setSelectedProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [],
    selectedProject: null,
    tasks: [],
    isLoading: false,
    error: null,

    fetchProjects: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get('/projects');
            set({ projects: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchTasks: async (filter = {}) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get('/tasks', { params: filter });
            set({ tasks: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    createTask: async (task) => {
        try {
            const response = await api.post('/tasks', task);
            set({ tasks: [...get().tasks, response.data] });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    updateTask: async (id, updates) => {
        try {
            const response = await api.put(`/tasks/${id}`, updates);
            set({
                tasks: get().tasks.map((t) => (t.id === id ? response.data : t)),
            });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    deleteTask: async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            set({ tasks: get().tasks.filter((t) => t.id !== id) });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    setSelectedProject: (project) => {
        set({ selectedProject: project });
    },
}));
