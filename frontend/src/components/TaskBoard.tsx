import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client';
import TaskItem from './TaskItem';

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    setError(null);
    getTasks(projectId)
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch tasks:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [projectId]);

  const handleToggle = (task) => {
    const next = task.status === 'DONE' ? 'TODO' : 'DONE';

    // Optimistically update UI
    setTasks(tasks.map(t => 
      t.id === task.id ? { ...t, status: next } : t
    ));

    // Update on server
    updateTaskStatus(task.id, next)
      .catch((err) => {
        console.error('Failed to update task status:', err);
        // Revert on error
        setTasks(tasks.map(t => 
          t.id === task.id ? { ...t, status: task.status } : t
        ));
        alert('Failed to update task status: ' + err.message);
      });
  };

  if (loading) {
    return (
      <div>
        <div className="board-header">
          <h2>Tasks</h2>
        </div>
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="board-header">
          <h2>Tasks</h2>
        </div>
        <div className="error-message">Error: {error}</div>
      </div>
    );
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
