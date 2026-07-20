import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client';
import TaskItem from './TaskItem';
import type { Task } from '../types';

interface TaskBoardProps {
  projectId: number;
}

export default function TaskBoard({ projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = () => {
    setLoading(true);
    setError(null);
    getTasks(projectId)
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const handleToggle = (task: Task) => {
    const next = task.status === 'DONE' ? 'TODO' : 'DONE';
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
    updateTaskStatus(task.id, next).catch((err) => {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      loadTasks();
    });
  };

  if (loading) {
    return (
      <div>
        <div className="board-header">
          <h2>Tasks</h2>
        </div>
        <div className="empty-state">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="board-header">
          <h2>Tasks</h2>
        </div>
        <div className="empty-state">
          <p>Error: {error}</p>
          <button className="toggle-btn" onClick={loadTasks}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="board-header">
        <h2>Tasks</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet for this project.</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
