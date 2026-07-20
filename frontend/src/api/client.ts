const BASE_URL = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  return res.json() as Promise<T>;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: number | null;
  assignee: User | null;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  owner: User | null;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: number;
  assigneeId?: number;
}

export function getProjects(): Promise<Project[]> {
  return request<Project[]>('/projects');
}

export function getTasks(projectId: number): Promise<Task[]> {
  return request<Task[]>(`/projects/${projectId}/tasks`);
}

export function updateTaskStatus(taskId: number, status: TaskStatus): Promise<Task> {
  return request<Task>(`/tasks/${taskId}/status?status=${status}`, { method: 'PUT' });
}

export function createTask(projectId: number, task: CreateTaskPayload): Promise<Task> {
  return request<Task>(`/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
}
