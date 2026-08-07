import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client';
import TaskItem from './TaskItem';

export default function TaskBoard({ projectId, onSelect }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) {
      setTasks([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getTasks(projectId)
      .then((data) => {
        if (!cancelled) {
          setTasks(Array.isArray(data) ? data : []);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Failed to load tasks', error);
          setTasks([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const handleToggle = (task) => {
    const next = task.status === 'DONE' ? 'TODO' : 'DONE';
    task.status = next;
    setTasks(tasks);
    updateTaskStatus(task.id, next);
  };

  return (
    <div>
      <div className="board-header">
        <h2>Tasks</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="task-list">
        {tasks.map((task, index) => (
          <TaskItem key={index} task={task} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
}
