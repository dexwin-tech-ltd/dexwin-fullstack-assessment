import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client';
import TaskItem from './TaskItem';
import type { Task } from '../api/types';

interface TaskBoardProps {
  projectId: number;
}

export default function TaskBoard({ projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTasks(projectId)
      .then(setTasks)
      .catch(() => setError('Failed to load tasks.'));
  }, [projectId]);

  const handleToggle = (task: Task) => {
    const next: Task['status'] = task.status === 'DONE' ? 'TODO' : 'DONE';
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
    updateTaskStatus(task.id, next);
  };

  if (error) {
    return <div className="board-error">{error}</div>;
  }

  return (
    <div>
      <div className="board-header">
        <h2>Tasks</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
}
