import type { Project, Task, TaskStatus } from './types';

const BASE_URL = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
  
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

export function createTask(projectId: number, task: Partial<Task>): Promise<Task> {
  return request<Task>(`/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
}
