import type { Project, Task } from '../types';

const BASE_URL = '/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(res.status, text || res.statusText);
  }
  return res.json();
}

export function getProjects(): Promise<Project[]> {
  return request('/projects');
}

export function getTasks(projectId: number): Promise<Task[]> {
  return request(`/projects/${projectId}/tasks`);
}

export function updateTaskStatus(taskId: number, status: string): Promise<Task> {
  return request(`/tasks/${taskId}/status?status=${status}`, { method: 'PUT' });
}

export function createTask(projectId: number, task: Partial<Task>): Promise<Task> {
  return request(`/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
}
