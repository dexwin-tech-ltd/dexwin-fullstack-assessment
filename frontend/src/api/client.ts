import { Task } from "../components/TaskItem";

const BASE_URL = '/api';

async function request(path: string, options?) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  return res.json();
}

export function getProjects() {
  return request('/projects');
}

export function getTasks(projectId: number) {
  return request(`/projects/${projectId}/tasks`);
}

export function updateTaskStatus(taskId: number, status: "DONE"| "TODO") {
  return request(`/tasks/${taskId}/status?status=${status}`, { method: 'PUT' });
}

export function createTask(projectId: number, task: Omit<Task, "id" | "createdAt">) {
  return request(`/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
}
