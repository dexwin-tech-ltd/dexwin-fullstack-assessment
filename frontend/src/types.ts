export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  owner?: User;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority?: number;
  project?: Project;
  assignee?: User;
  createdAt?: string;
}
