const BASE_URL = '/api';


async function request(path, options?) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  return res.json();
}

export async function login(username, password) {
  return request("/auth/login", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({"username": username, "password": password})
  })
}

export function getProjects() {
  return request('/projects');
}

export function getTasks(projectId) {
  return request(`/projects/${projectId}/tasks`);
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
