const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  return res.json();
}

export function getProjects() {
  return request('/projects');
}

export function getTasks(projectId) {
  return request(`/projects/${projectId}/tasks`);
}

export function getPriorities() {
  return request('/tasks/priorities');
}

export function updateTaskStatus(taskId, status) {
  return request(`/tasks/${taskId}/status?status=${status}`, { method: 'PUT' });
}

export function createTask(projectId, task) {
  return request(`/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
}
