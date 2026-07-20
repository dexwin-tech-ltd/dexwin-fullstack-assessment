import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus, type Task } from '../api/client';
import TaskItem from './TaskItem';

interface TaskBoardProps {
  projectId: number;
}

export default function TaskBoard({ projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks(projectId).then((data) => {
      setTasks(data);
    });
  }, []);

  const handleToggle = (task: Task) => {
    const next = task.status === 'DONE' ? 'TODO' : 'DONE';
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
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
