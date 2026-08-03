const BASE_URL = '/api';

// Simple token storage (in production, use more secure methods)
let authToken: string | null = localStorage.getItem('authToken');

export function setAuthToken(token: string) {
  authToken = token;
  localStorage.setItem('authToken', token);
}

export function getAuthToken(): string | null {
  return authToken;
}

export function clearAuthToken() {
  authToken = null;
  localStorage.removeItem('authToken');
}

async function request(path: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return null;
  }

  return res.json();
}

// Auth API
export async function login(username: string, password: string) {
  const response = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  if (response.token) {
    setAuthToken(response.token);
  }
  return response;
}

export async function register(username: string, email: string, password: string) {
  const response = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
  if (response.token) {
    setAuthToken(response.token);
  }
  return response;
}

export function logout() {
  clearAuthToken();
}

// Project API
export function getProjects() {
  return request('/projects');
}

export function getProject(id: number) {
  return request(`/projects/${id}`);
}

export function createProject(project: { name: string; description?: string }) {
  return request('/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  });
}

export function updateProject(id: number, project: { name: string; description?: string }) {
  return request(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(project),
  });
}

export function deleteProject(id: number) {
  return request(`/projects/${id}`, {
    method: 'DELETE',
  });
}

// Task API
export function getTasks(projectId: number) {
  return request(`/projects/${projectId}/tasks`);
}

export function getTaskSummaries(projectId: number) {
  return request(`/projects/${projectId}/task-summaries`);
}

export function createTask(projectId: number, task: any) {
  return request(`/projects/${projectId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(task),
  });
}

export function updateTask(taskId: number, task: any) {
  return request(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(task),
  });
}

export function updateTaskStatus(taskId: number, status: string) {
  return request(`/tasks/${taskId}/status?status=${status}`, { method: 'PUT' });
}

export function deleteTask(taskId: number) {
  return request(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
}

export function searchTasks(query: string) {
  return request(`/tasks/search?q=${encodeURIComponent(query)}`);
}

// Comment API
export function getComments(taskId: number) {
  return request(`/tasks/${taskId}/comments`);
}

export function createComment(taskId: number, content: string) {
  return request(`/tasks/${taskId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export function updateComment(commentId: number, content: string) {
  return request(`/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
}

export function deleteComment(commentId: number) {
  return request(`/comments/${commentId}`, {
    method: 'DELETE',
  });
}
