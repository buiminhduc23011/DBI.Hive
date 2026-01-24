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
    id: string;
    title: string;
    description?: string;
    status: TaskItemStatus;
    priority: Priority;
    projectId: string;
    projectName: string;
    sprintId?: string;
    sprintName?: string;
    assignedToId?: string;
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
    id: string;
    name: string;
    description?: string;
    color?: string;
    createdAt: string;
    updatedAt?: string;
    isArchived: boolean;
    taskCount: number;
    completedTaskCount: number;
    ownerId: string;
    memberIds: string[];
    memberRoles: Record<string, string>;
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    role: string;
}

interface ProjectState {
    projects: Project[];
    selectedProject: Project | null;
    tasks: Task[];
    users: User[];
    isLoading: boolean;
    error: string | null;

    fetchProjects: (includeArchived?: boolean) => Promise<void>;
    fetchTasks: (filter?: any) => Promise<void>;
    fetchUsers: () => Promise<void>;
    createProject: (project: Partial<Project>) => Promise<void>;
    updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    createTask: (task: Partial<Task>) => Promise<void>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    addProjectMember: (projectId: string, email: string, role?: string) => Promise<void>;
    removeProjectMember: (projectId: string, userId: string) => Promise<void>;
    setSelectedProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [],
    selectedProject: null,
    tasks: [],
    users: [],
    isLoading: false,
    error: null,

    fetchProjects: async (includeArchived = false) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get('/projects', { params: { includeArchived } });
            set({ projects: response.data, isLoading: false });
        } catch (error: any) {
            console.error('Failed to fetch projects:', error);
            set({ error: error.message, isLoading: false, projects: [] });
        }
    },

    fetchTasks: async (filter = {}) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get('/tasks', { params: filter });
            set({ tasks: response.data, isLoading: false });
        } catch (error: any) {
            console.error('Failed to fetch tasks:', error);
            set({ error: error.message, isLoading: false, tasks: [] });
        }
    },

    fetchUsers: async () => {
        try {
            const response = await api.get('/auth/users');
            set({ users: response.data });
        } catch (error: any) {
            console.error('Failed to fetch users:', error);
            set({ users: [] });
        }
    },

    createProject: async (project) => {
        try {
            const response = await api.post('/projects', project);
            set({ projects: [...get().projects, response.data] });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    updateProject: async (id, updates) => {
        try {
            const response = await api.put(`/projects/${id}`, updates);
            set({
                projects: get().projects.map((p) => (p.id === id ? response.data : p)),
            });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    deleteProject: async (id) => {
        try {
            await api.delete(`/projects/${id}`);
            set({ projects: get().projects.filter((p) => p.id !== id) });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
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
        // Optimistic update - update UI immediately
        const previousTasks = get().tasks;
        set({
            tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        });
        
        try {
            const response = await api.put(`/tasks/${id}`, updates);
            // Update with server response
            set({
                tasks: get().tasks.map((t) => (t.id === id ? response.data : t)),
            });
        } catch (error: any) {
            // Rollback on error
            set({ tasks: previousTasks, error: error.message });
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

    addProjectMember: async (projectId, email, role = 'Member') => {
        try {
            const response = await api.post(`/projects/${projectId}/members`, { email, role });
            const projects = get().projects.map(p => 
                p.id === projectId ? response.data : p
            );
            set({ projects });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    removeProjectMember: async (projectId, userId) => {
        try {
            const response = await api.delete(`/projects/${projectId}/members/${userId}`);
            const projects = get().projects.map(p => 
                p.id === projectId ? response.data : p
            );
            set({ projects });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    setSelectedProject: (project) => {
        set({ selectedProject: project });
    },
}));
