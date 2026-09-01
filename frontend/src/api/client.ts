const BASE_URL = '/api';

async function request(path, options?) {
  try{
  const res = await fetch(`${BASE_URL}${path}`, options);

  if(!res.ok) {
    throw new Error(`Error response: ${res.status}`)
  }

  return res.json();
  } catch(err) {
    throw new Error(err instanceof Error) ? err: new Error('Unknown Error')
  }
}

export function getProjects() {
  return request('/projects');
}

export function getTasks(projectId: string) {
  if(!projectId){
    throw new Error('Project id is required')
  }
  return request(`/projects/${projectId}/tasks`);
}

export function updateTaskStatus(taskId: string, status) {
  if(!taskId || !status){
    throw new Error('Task id and status is required')
  }
  return request(`/tasks/${taskId}/status?status=${status}`, { method: 'PUT' });
}

export function createTask(projectId, task) {
  return request(`/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
}
