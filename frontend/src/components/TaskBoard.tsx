import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client';
import TaskItem, { Task } from './TaskItem';

interface TaskBoardProps {
  projectId: string;
}

export default function TaskBoard({ projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    let ignore = false;
    getTasks(projectId)
      .then((data) => {
        if (!ignore) setTasks(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!ignore) setTasks([]);
      });
    return () => {
      ignore = true;
    };
  }, [projectId]);

  const handleToggle = async (task: Task) => {
    const next = task.status === 'DONE' ? 'TODO' : 'DONE';
    const prev = tasks;
    // immutable optimistic update
    setTasks((cur) =>
      cur.map((t) => (t.id === task.id ? { ...t, status: next } : t))
    );
    try {
      await updateTaskStatus(task.id, next);
    } catch {
      setTasks(prev); // rollback on failure
    }
  };

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
